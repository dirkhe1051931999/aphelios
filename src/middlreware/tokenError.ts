import jwt from 'jsonwebtoken';
import CONFIG from 'src/config';

/**
 * 判断token是否可用
 */
export default function () {
  return async (ctx, next) => {
    let token = ctx.request.headers.authorization;
    let no_verify_token = false;
    /* 这些接口不校验token */
    var unless_reg = [/^\/management\/blog\/auth*/, /^\/web\/blog*/, /^\/web\/app*/, /^\/oauth*/];
    unless_reg.forEach((reg) => {
      if (reg.test(ctx.request.url)) {
        no_verify_token = true;
      }
    });
    if (no_verify_token) {
      // url不需要校验token的，直接放行
      await next();
    } else {
      if (!token) {
        // 如果没有token，直接返回401
        ctx.error(ctx, 401);
        return;
      }
      try {
        // 如果有token，进行校验
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, CONFIG.tokenSecret);
        const redis_db_token = await ctx.redisDB.get(`${decoded.email}-${decoded.name}-${decoded.id}`);
        if (!redis_db_token) {
          throw new Error('Token expired');
        }
        // 检查 token 是否过期了
        const now = Math.floor(Date.now() / 1000);
        const exp = decoded.exp;
        if (exp < now) {
          await ctx.redisDB.destroy(`${decoded.email}-${decoded.name}-${decoded.id}`);
          throw new Error('Token expired');
        } else {
          await next();
        }
      } catch (err) {
        console.log(err);
        ctx.error(ctx, 401);
      }
    }
  };
}
