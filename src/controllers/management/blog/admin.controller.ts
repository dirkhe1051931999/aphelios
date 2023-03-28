import { Context } from "koa";
import jwt from "jsonwebtoken";
import { encryptInputPassword } from "src/util/helper";
import CONFIG from "src/config";

// 登录
export const login = async (ctx: Context): Promise<void> => {
  const userName = (ctx.request.body as { userName?: string }).userName || "";
  const password = (ctx.request.body as { password?: string }).password || "";
  if (!userName || !password) {
    ctx.error(ctx, 100);
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
        ctx.success(ctx, {
          token,
          id: results[0].id,
          pagePermissionId: [
            "dashboard",
            "account",
          ],
        });
      } else {
        ctx.error(ctx, 101);
      }
    } else {
      ctx.error(ctx, 101);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 102);
  }
};

// 登出
export const signOut = async (ctx: Context): Promise<void> => {
  ctx.session.user = null;
  ctx.success(ctx, null);
};
