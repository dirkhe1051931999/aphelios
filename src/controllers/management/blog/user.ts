import { Context } from "koa";
import jwt from "jsonwebtoken";
import CONFIG from "src/config";
import { sendMail } from "src/util/send-email";
import fs from "fs";
import path from "path";
/* 查询所有用户 */
export const getAllUser = async (ctx: Context): Promise<void> => {
  const userName = (ctx.request.body as { userName?: "string" }).userName || "";
  const page = (ctx.request.body as { page?: number }).page || 1;
  const rowsPerPage =
    (ctx.request.body as { rowsPerPage?: number }).rowsPerPage || 20;
  const token = ctx.request.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, CONFIG.tokenSecret);
  /* 默认page 1， rowsNumber 20 */
  try {
    const results = await ctx.execSql([
      `SELECT COUNT(*) as total FROM user;`,
      `
        SELECT id,userName,avatar,role,createTime,email,updateTime,province,city,ip,description,userType,userStatus
        FROM user 
        WHERE CASE WHEN ${decoded.userType} = 0 THEN 1 ELSE id = ${decoded.id} END AND (userName LIKE CONCAT('%', '${userName}', '%') OR NULLIF('${userName}', '') IS NULL )
        ORDER BY 
          CASE WHEN id = ${decoded.id} THEN 0 ELSE 1 END, 
          id
        LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}
      ;`,
    ]);
    if (results.length) {
      results[1] = results[1].map((item) => {
        return Object.assign(item, {
          avatarPath: item.avatar,
          avatar:
            item.userType !== 2
              ? CONFIG.defaultCdnUrl + item.avatar
              : item.avatar,
        });
      });
      return ctx.success(ctx, {
        pageData: results[1],
        total: results[0][0].total,
      });
    } else {
      return ctx.success(ctx, {
        pageData: [],
        total: 0,
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
/* 新增用户 */
export const addUser = async (ctx: Context): Promise<void> => {
  const {
    userName,
    avatar,
    role,
    email,
    province,
    city,
    ip,
    description,
    userType,
  } = ctx.request.body as {
    userName: string;
    avatar: string;
    role: string;
    email: string;
    province: string;
    city: string;
    ip: string;
    description: string;
    userType: number;
  };
  if (
    ctx.isFalsy([userName, avatar, role, email, province, city, ip, userType])
  ) {
    ctx.error(
      ctx,
      "404#userName, avatar, role, email, province, city, ip, userType"
    );
    return;
  }
  let createTime = new Date().getTime();
  let updateTime = createTime;
  let salt = "LGGKqbCrRKRnywHv3uqFZw==";
  try {
    const results = await ctx.execSql([
      `INSERT INTO user (userName, avatar, role, createTime, email, updateTime, province, city, ip, description,userType,oldUserStatus,userStatus,salt) 
      SELECT '${userName}', '${avatar}', '${role}', ${createTime}, '${email}', ${updateTime}, '${province}', '${city}', '${ip}', '${description}',${userType},0,0,'${salt}' FROM DUAL WHERE NOT EXISTS (
        SELECT 1 FROM user WHERE userName = '${userName}' OR email = '${email}'
      );`,
    ]);
    if (results[0].affectedRows === 0) {
      ctx.error(ctx, 303);
    } else {
      let redis = ctx.redisDB.redis.duplicate();
      const currentUser = await ctx.execSql([
        `SELECT id FROM user WHERE email = '${email}' AND userName = '${userName}';`,
      ]);
      redis.subscribe("my-channel-1", async (err, count) => {
        if (err) {
          console.error("Failed to subscribe: %s", err.message);
          return;
        }
        try {
          const url = CONFIG.resetPasswordUrl;
          const userToken = {
            name: userName,
            id: currentUser[0][0].id,
          };
          // 签发token
          const token = jwt.sign(userToken, CONFIG.tokenSecret, {
            expiresIn: "600s",
          });
          const subject = "【koa实战】- 设置密码";
          ctx.redisDB.set(
            token,
            {
              email,
              username: userName,
            },
            10 * 60 * 1000
          );
          const content =
            "点击该链接设置密码：" +
            "<a href=" +
            url +
            token +
            " style=color: white>" +
            url +
            token +
            "</a>" +
            "，账号有效时间<b>10分钟</b>。过期需让管理员重制链接";
          const html = fs
            .readFileSync(
              path.resolve(__dirname, "../../../templates/email.template.html"),
              "utf-8"
            )
            .replace("{{username}}", email)
            .replace("{{content}}", content);
          await sendMail({ to: email, subject, html });
        } catch (error) {
          console.log(error);
          ctx.error(ctx, 405);
        }
      });
      const channel = `__keyevent@${CONFIG.db.redis.db}__:expired`;
      // 监听keyspace事件
      const listener = redis.psubscribe(channel);
      redis.on("pmessage", async (pattern, channel, message) => {
        // 设置密码链接过期，把该用户状态变成异常
        let updateTime = new Date().getTime();
        try {
          await ctx.execSql([
            `UPDATE user 
            SET userStatus = 4, oldUserStatus = 0, updateTime = ${updateTime}
            WHERE id = ${currentUser[0][0].id};`,
          ]);
        } catch (error) {
          console.log(error);
          ctx.error(ctx, 405);
        }
        // redis.punsubscribe(channel);  //移除监听
      });
      ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 更新用户 */
export const updateUser = async (ctx: Context): Promise<void> => {
  const { id, avatar, province, city, ip, description } = ctx.request.body as {
    id: number;
    avatar: string;
    province: string;
    city: string;
    ip: string;
    description: string;
  };
  if (ctx.isFalsy([id, avatar, province, city, ip])) {
    ctx.error(ctx, "404#id, avatar, email, province, city, ip");
    return;
  }
  let updateTime = new Date().getTime();
  try {
    const results = await ctx.execSql([
      `SELECT COUNT(*) as count FROM user WHERE id = ${id};`,
    ]);
    if (results.length) {
      if (results[0][0].count === 0) {
        ctx.error(ctx, 108);
      } else {
        ctx.execSql([
          `UPDATE user 
        SET avatar = '${avatar}', 
            updateTime = ${updateTime}, 
            province = '${province}', 
            city = '${city}', 
            ip = '${ip}', 
            description = '${description}'
        WHERE id = ${id};`,
        ]);
        return ctx.success(ctx, null);
      }
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 更新用户邮箱 */
export const updateUserEmail = async (ctx: Context): Promise<void> => {
  const { id, email, } = ctx.request.body as {
    id: number;
    email: string;
  };
  if (ctx.isFalsy([id, email])) {
    ctx.error(ctx, "404#id, email");
    return;
  }
  let updateTime = new Date().getTime();
  try {
    const result = await ctx.execSql([
      `SELECT COUNT(*) AS count FROM user WHERE email = '${email}';`,
    ]);
    if (result[0][0].count === 1) {
      return ctx.error(ctx, 302);
    } else {
      await ctx.execSql([
        `UPDATE user 
              SET email = '${email}', 
              updateTime = ${updateTime}
              WHERE id = ${id};`,
      ]);
      return ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 更新用户手机号 */
export const updateUserMobile = async (ctx: Context): Promise<void> => {
  const { id, mobile, } = ctx.request.body as {
    id: number;
    mobile: string;
  };
  if (ctx.isFalsy([id, mobile])) {
    ctx.error(ctx, "404#id, mobile");
    return;
  }
  let updateTime = new Date().getTime();
  try {
    const result = await ctx.execSql([
      `SELECT COUNT(*) AS count FROM user WHERE mobile = ${mobile};`,
    ]);
    if (result[0][0].count === 1) {
      return ctx.error(ctx, 305);
    } else {
      await ctx.execSql([
        `UPDATE user 
            SET mobile = ${mobile}, 
            updateTime = ${updateTime}
            WHERE id = ${id};`,
      ]);
      return ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 删除用户 */
export const deleteUser = async (ctx: Context): Promise<void> => {
  const { id } = ctx.request.body as {
    id: number;
  };
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, "404#id");
    return;
  }
  try {
    const results = await ctx.execSql([
      `SELECT COUNT(*) as count FROM user WHERE id = ${id};`,
    ]);
    if (results.length) {
      if (results[0][0].count === 0) {
        ctx.error(ctx, 108);
      } else {
        ctx.execSql([`DELETE FROM user WHERE id = ${id};`]);
        return ctx.success(ctx, null);
      }
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 更新用户状态 */
export const updateUserStatus = async (ctx: Context): Promise<void> => {
  let { id, userStatus } = ctx.request.body as {
    id: number;
    userStatus: number;
  };
  if (ctx.isFalsy([id, userStatus])) {
    ctx.error(ctx, "404#id,userStatus");
    return;
  }
  let updateTime = new Date().getTime();
  try {
    const results = await ctx.execSql([
      `SELECT 1 as count FROM user WHERE id = ${id};`,
      `SELECT userStatus FROM user WHERE id = ${id};`,
      `SELECT oldUserStatus FROM user WHERE id = ${id};`,
    ]);
    if (results.length && results[0][0].count === 0) {
      ctx.error(ctx, 108);
    } else if (results.length && results[0][0].count === 1) {
      let status;
      if (userStatus === 1) {
        status = results[2][0].oldUserStatus;
      } else if (userStatus === 2) {
        status = userStatus;
      }
      await ctx.execSql([
        `UPDATE user 
          SET userStatus = ${status}, 
              oldUserStatus = ${results[1][0].userStatus}, 
              updateTime = ${updateTime}
          WHERE id = ${id};`,
      ]);
      return ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 解锁用户登录错误次数 */
export const unLockUser = async (ctx: Context): Promise<void> => {
  let { id } = ctx.request.body as {
    id: number;
  };
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, "404#id");
    return;
  }
  let updateTime = new Date().getTime();
  try {
    const results = await ctx.execSql([
      `SELECT 1 as count FROM user WHERE id = ${id};`,
    ]);
    if (results.length && results[0][0].count === 0) {
      ctx.error(ctx, 108);
    } else if (results.length && results[0][0].count === 1) {
      await ctx.execSql([
        `UPDATE user 
          SET userStatus = 1, 
              updateTime = ${updateTime}
          WHERE id = ${id};`,
        `DELETE FROM user_login WHERE id = ${id};`,
      ]);
      return ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const reSendUrl = async (ctx: Context): Promise<void> => {
  let { id } = ctx.request.body as {
    id: number;
  };
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, "404#id");
    return;
  }
  try {
    const results = await ctx.execSql([
      `SELECT userName,email FROM user WHERE id = ${id};`,
    ]);
    if (!results.length) {
      ctx.error(ctx, 108);
    } else {
      await ctx.execSql([
        `UPDATE user
          SET userStatus = 0
          WHERE id = ${id};`,
      ]);
      const url = CONFIG.resetPasswordUrl;
      const userName = results[0][0].userName;
      const email = results[0][0].email;
      const userToken = {
        name: userName,
        id: id,
      };
      // 签发token
      const token = jwt.sign(userToken, CONFIG.tokenSecret, {
        expiresIn: "600s",
      });
      const subject = "【koa实战】- 设置密码";
      ctx.redisDB.set(
        token,
        {
          email: email,
          username: userName,
        },
        10 * 60 * 1000
      );
      const content =
        "点击该链接设置密码：" +
        "<a href=" +
        url +
        token +
        " style=color: white>" +
        url +
        token +
        "</a>" +
        "，账号有效时间<b>10分钟</b>。过期需让管理员重制链接";
      const html = fs
        .readFileSync(
          path.resolve(__dirname, "../../../templates/email.template.html"),
          "utf-8"
        )
        .replace("{{username}}", email)
        .replace("{{content}}", content);
      await sendMail({ to: email, subject, html });
      return ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 获取所有头像 */
export const getAllAvatar = async (ctx: Context): Promise<void> => {
  try {
    const results = await ctx.execSql([`SELECT name,path FROM avatar;`]);
    const avatarList = results[0].map((item: any) => {
      return {
        name: item.name,
        url: CONFIG.defaultCdnUrl + item.path,
        path: item.path,
      };
    });
    return ctx.success(ctx, {
      pageData: avatarList,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
