import jwt from "jsonwebtoken";
import CONFIG from "src/config";
import util from "util";

/**
 * 判断token是否可用
 */
export default function (tokenType: string) {
  return async (ctx, next) => {
    let token = ctx.headers.authorization;
    if (!token) {
      ctx.status = 401;
      ctx.body = { message: "Authorization token is missing" };
      return;
    }
    token = token.split(" ")[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env[`JWT_SECRET_${tokenType.toUpperCase()}`]
      );
      ctx.state.user = decoded;
      // 检查 token 是否快过期了
      const now = Math.floor(Date.now() / 1000);
      const exp = decoded.exp;
      const timeToExpire = exp - now;
      const refreshTokenThreshold = 60 * 60; // 1 小时
      if (timeToExpire < refreshTokenThreshold) {
        // 如果 token 快过期了，则刷新 token
        const newToken = jwt.sign(
          { userId: decoded.userId },
          process.env[`JWT_SECRET_${tokenType.toUpperCase()}`],
          { expiresIn: "1h" }
        );
        ctx.set("Authorization", newToken);
      }
      await next();
    } catch (err) {
      ctx.status = 401;
      ctx.body = { message: `Invalid ${tokenType} authorization token` };
    }
  };
}
