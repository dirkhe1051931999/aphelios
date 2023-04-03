import { Context } from "koa";
import jwt from "jsonwebtoken";
import { encryptInputPassword } from "src/util/helper";
import CONFIG from "src/config";
import { sendMail } from "src/util/send-email";
import fs from "fs";
import path from "path";

/* 登录 */
export const login = async (ctx: Context): Promise<void> => {
  const userName = (ctx.request.body as { userName?: string }).userName || "";
  const code = (ctx.request.body as { code?: string }).code || "";
  const password = (ctx.request.body as { password?: string }).password || "";
  if (!userName || !password || !code) {
    ctx.error(ctx, 100);
    return;
  }
  try {
    const results = await ctx.execSql(
      `SELECT id, hashedPassword,salt,email,userStatus,role FROM user WHERE userName = ?`,
      userName
    );
    if (results.length > 0) {
      if (results[0].userStatus === 0) {
        ctx.error(ctx, 119);
      }
      const hashedPassword = results[0].hashedPassword;
      const salt = results[0].salt;
      const email = results[0].email;
      const userId = results[0].id;
      const session_code = await ctx.redisDB.get(
        userName + "-" + email + "-code"
      );
      if (
        !session_code ||
        (session_code && String(session_code) !== String(code))
      ) {
        ctx.error(ctx, 115);
      } else {
        if (results[0].userStatus === 4) {
          ctx.error(ctx, 118);
          return;
        }
        if (results[0].userStatus === 2) {
          ctx.error(ctx, 117);
          return;
        }
        if (results[0].userStatus === 3) {
          ctx.error(ctx, 116);
          return;
        }
        const hashPassword = encryptInputPassword(password, salt);
        if (hashedPassword === hashPassword) {
          // 用户token
          const userToken = {
            name: userName,
            email,
            id: userId,
          };
          ctx.redisDB.set(
            `${email}-${userName}-${userId}`,
            userToken,
            1000 * 60 * 60 * 24
          );
          await ctx.redisDB.destroy(userName + "-" + email + "-code");
          // 签发token
          const token = jwt.sign(userToken, CONFIG.tokenSecret, {
            expiresIn: "24h",
          });
          // 删除错误次数
          await ctx.execSql(
            `DELETE FROM user_login WHERE id = ${results[0].id};`
          );
          const roleResult = await ctx.execSql(
            `SELECT permissionList FROM role WHERE name = '${results[0].role}'`
          );
          ctx.success(ctx, {
            token,
            email: email,
            id: results[0].id,
            pagePermissionId: roleResult[0].permissionList,
          });
        } else {
          // 记录错误次数
          await ctx.execSql([
            `
            INSERT INTO user_login (userName, errorLoginCount, id)
            VALUES ('${userName}', 1, ${results[0].id})
            ON DUPLICATE KEY UPDATE
            errorLoginCount = CASE
              WHEN errorLoginCount >= 4 THEN 5
              ELSE errorLoginCount + 1
            END;
            `,
            `
            UPDATE user
            SET userStatus = 3
            WHERE id = (
              SELECT id FROM user_login WHERE userName = '${userName}' AND errorLoginCount = 5
            );
            `,
          ]);
          ctx.error(ctx, 101);
        }
      }
    } else {
      ctx.error(ctx, 102);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 106);
  }
};
/* 修改密码 */
export const changePassword = async (ctx: Context): Promise<void> => {
  const userName = (ctx.request.body as { userName?: string }).userName || "";
  const oldPassword =
    (ctx.request.body as { oldPassword?: string }).oldPassword || "";
  const newPassword =
    (ctx.request.body as { newPassword?: string }).newPassword || "";
  if (!userName || !oldPassword || !newPassword) {
    ctx.error(ctx, 104);
    return;
  }
  try {
    const results = await ctx.execSql(
      `SELECT id, hashedPassword, email, salt FROM user WHERE userName = ?`,
      userName
    );
    if (results.length > 0) {
      const hashedPassword = results[0].hashedPassword;
      const salt = results[0].salt;
      const hashOldPassword = encryptInputPassword(oldPassword, salt);
      if (hashedPassword === hashOldPassword) {
        const hashNewPassword = encryptInputPassword(newPassword, salt);
        await ctx.execSql(
          `UPDATE user SET hashedPassword = ? WHERE id = ${results[0].id}`,
          hashNewPassword
        );
        if (ctx.request.headers.authorization) {
          // 修改已经登录的用户密码，删除redis中的token
          if (
            ctx.redisDB.get(`${results[0].email}-${userName}-${results[0].id}`)
          ) {
            ctx.redisDB.destroy(
              `${results[0].email}-${userName}-${results[0].id}`
            );
          }
        }
        ctx.success(ctx, null);
      } else {
        ctx.error(ctx, 105);
      }
    } else {
      ctx.error(ctx, 102);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 106);
  }
};
/* 获取用户信息 */
export const getUserInfo = async (ctx: Context): Promise<void> => {
  const id = (ctx.query as { id?: number }).id || 0;
  if (!id) {
    ctx.error(ctx, 107);
    return;
  }
  try {
    const results = await ctx.execSql(
      `SELECT id, userName, email, avatar FROM user WHERE id = ?`,
      id
    );
    if (results.length > 0) {
      ctx.success(ctx, {
        id: results[0].id,
        userName: results[0].userName,
        email: results[0].email,
        avatar: results[0].avatar,
      });
    } else {
      ctx.error(ctx, 102);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 106);
  }
};
/* 发送验证码 */
export const getVerifyCode = async (ctx: Context): Promise<void> => {
  const userName = (ctx.request.body as { userName?: string }).userName || "";
  if (!userName) {
    ctx.error(ctx, 108);
    return;
  }
  try {
    const results = await ctx.execSql(
      `SELECT email FROM user WHERE userName = '${userName}'`
    );
    if (results.length > 0) {
      const subject = "【koa实战】- 获取验证码";
      const email = results[0].email;
      const code = (Math.floor(Math.random() * 90000) + 10000).toString();
      ctx.redisDB.set(userName + "-" + email + "-code", code, 5 * 60 * 1000);
      const content =
        "您的验证码是：" + "<b>" + code + "</b>" + "，有效时间5分钟。";
      const html = fs
        .readFileSync(
          path.resolve(__dirname, "../../../templates/email.template.html"),
          "utf-8"
        )
        .replace("{{username}}", email)
        .replace("{{content}}", content);
      await sendMail({ to: email, subject, html });
      ctx.success(ctx, {
        email,
        mobile: null,
      });
    } else {
      ctx.error(ctx, 102);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 109);
  }
};
/* 忘记密码 */
export const forgotPassword = async (ctx: Context): Promise<void> => {
  const email = (ctx.request.body as { email?: string }).email || "";
  const username = (ctx.request.body as { username?: string }).username || "";
  if (!email || !username) {
    ctx.error(ctx, 108);
    return;
  }
  try {
    const results = await ctx.execSql(
      `SELECT userName, id, avatar FROM user WHERE email = '${email}' and userName = '${username}'`
    );
    const url = CONFIG.resetPasswordUrl;
    if (results.length > 0) {
      const userToken = {
        name: results[0].userName,
        id: results[0].id,
      };
      // 签发token
      const token = jwt.sign(userToken, CONFIG.tokenSecret, {
        expiresIn: "600s",
      });
      const subject = "【koa实战】- 重置密码";
      ctx.redisDB.set(
        token,
        {
          email,
          username,
        },
        10 * 60 * 1000
      );
      const content =
        "点击该链接重置密码：" +
        "<a href=" +
        url +
        token +
        " style=color: white>" +
        url +
        token +
        "</a>" +
        "，有效时间10分钟。";
      const html = fs
        .readFileSync(
          path.resolve(__dirname, "../../../templates/email.template.html"),
          "utf-8"
        )
        .replace("{{username}}", email)
        .replace("{{content}}", content);
      await sendMail({ to: email, subject, html });
      ctx.success(ctx, null);
    } else {
      ctx.error(ctx, 102);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 110);
  }
};
/* 检查token是否有效 */
export const checkToken = async (ctx: Context): Promise<void> => {
  const token = (ctx.request.body as { token?: string }).token || "";
  if (!token) {
    ctx.error(ctx, 111);
    return;
  }
  const decoded = jwt.verify(token, CONFIG.tokenSecret, {
    ignoreExpiration: true,
  });
  const updateTime = new Date().getTime();
  if (updateTime > decoded.exp * 1000) {
    // 过期了
    // 如果是初始化用户，修改状态是4，需要重新发送链接
    await ctx.execSql([
      `UPDATE user 
        SET userStatus = 4, oldUserStatus = 0, updateTime = ${updateTime}
        WHERE id = ${decoded.id} AND userStatus = 0;`,
    ]);
    ctx.error(ctx, 112);
  } else {
    ctx.success(ctx, null);
  }
};
/* 重置密码，不需要老密码 */
export const changePasswordWithOutOld = async (ctx: Context): Promise<void> => {
  const password = (ctx.request.body as { password?: string }).password || "";
  const token = (ctx.request.body as { token?: string }).token || "";
  if (!password || !token) {
    ctx.error(ctx, 113);
    return;
  }
  try {
    if (!ctx.redisDB.get(token)) {
      ctx.error(ctx, 112);
    } else {
      const { username, email } = await ctx.redisDB.get(token);
      const results = await ctx.execSql(
        `SELECT id, hashedPassword, salt FROM user WHERE userName = '${username}' and email = '${email}'`
      );
      if (results.length > 0) {
        const salt = results[0].salt;
        const hashNewPassword = encryptInputPassword(password, salt);
        await ctx.execSql(
          `UPDATE user SET hashedPassword = ? , userStatus = 1  WHERE id = ${results[0].id}`,
          hashNewPassword
        );
        // 删除重置密码链接
        await ctx.redisDB.destroy(token);
        ctx.success(ctx, null);
      } else {
        ctx.error(ctx, 102);
      }
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 114);
  }
};
/* 退出登录 */
export const signOut = async (ctx: Context): Promise<void> => {
  const email = (ctx.request.body as { email?: string }).email || "";
  const userName = (ctx.request.body as { userName?: string }).userName || "";
  const userId = (ctx.request.body as { userId?: string }).userId || "";
  if (ctx.isFalsy([email, userName, userId])) {
    ctx.error(ctx, "404#email, userName, userId");
    return;
  }
  await ctx.redisDB.destroy(`${email}-${userName}-${userId}`);
  ctx.success(ctx, null);
};
