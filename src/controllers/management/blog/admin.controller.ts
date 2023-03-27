import { Context } from "koa";
import jwt from "jsonwebtoken";
import { encryptInputPassword } from "src/util/helper";
import CONFIG from "src/config";

// 登录
export const login = async (ctx: Context): Promise<void> => {
  const userName = (ctx.request.body as { userName?: string }).userName || "";
  const password = (ctx.request.body as { password?: string }).password || "";
  if (!userName || !password) {
    ctx.body = {
      success: 0,
      message: "用户名或密码不能为空",
    };
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
      const hashPassword = encryptInputPassword(password, salt);
      if (hashedPassword === hashPassword) {
        ctx.session.user = userName;
        // 用户token
        const userToken = {
          name: userName,
          id: results[0].id,
        };
        // 签发token
        const token = jwt.sign(userToken, CONFIG.tokenSecret, {
          expiresIn: "24h",
        });
        ctx.body = {
          success: 1,
          token: token,
          message: "",
        };
      } else {
        ctx.body = {
          success: 0,
          message: "用户名或密码错误",
        };
      }
    } else {
      ctx.body = {
        success: 0,
        message: "用户名或密码错误",
      };
    }
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: "查询数据出错",
    };
  }
};

// 登出
export const signOut = async (ctx: Context): Promise<void> => {
  ctx.session.user = null;
  ctx.body = {
    success: 1,
    message: "",
  };
};
