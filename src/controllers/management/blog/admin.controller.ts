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
      `SELECT id, hashedPassword, salt,email FROM user WHERE role='ADMIN' and userName = ?`,
      userName
    );
    if (results.length > 0) {
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
          ctx.success(ctx, {
            token,
            email: email,
            id: results[0].id,
            pagePermissionId: ["dashboard", "account"],
          });
        } else {
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
      `SELECT id, hashedPassword, salt FROM user WHERE role='ADMIN' and userName = ?`,
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
          path.resolve(__dirname, "../../../util/email.template.html"),
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
          path.resolve(__dirname, "../../../util/email.template.html"),
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
  try {
    const result = await ctx.redisDB.get(token);
    if (result) {
      ctx.success(ctx, null);
    } else {
      ctx.error(ctx, 112);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 112);
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
        `SELECT id, hashedPassword, salt FROM user WHERE role='ADMIN' and userName = '${username}' and email = '${email}'`
      );
      if (results.length > 0) {
        const salt = results[0].salt;
        console.log(password);
        const hashNewPassword = encryptInputPassword(password, salt);
        await ctx.execSql(
          `UPDATE user SET hashedPassword = ? WHERE id = ${results[0].id}`,
          hashNewPassword
        );
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
  if (!email || !userName || !userId) {
    ctx.error(ctx, 116);
    return;
  }
  await ctx.redisDB.destroy(`${email}-${userName}-${userId}`);
  ctx.success(ctx, null);
};
