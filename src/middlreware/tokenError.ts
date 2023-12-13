import jwt from 'jsonwebtoken';
import CONFIG from 'src/config';
import { getPathsToTry } from 'tsconfig-paths/lib/try-path';

export default function() {
  return async (ctx, next) => {
    const { url, headers } = ctx.request;
    const token = headers.authorization;
    const clientType = headers['client-type'];

    // 不需要 token 校验的 URL 列表
    const noVerifyTokenUrls = [/^\/management\/blog\/auth*/, /^\/oauth*/, /^\/common*/, /^\/track*/, /^\/h5\/blog\/post*/, /^\/h5\/blog\/auth*/];

    // 检查 URL 是否在无需验证列表中
    const requiresToken = !noVerifyTokenUrls.some(reg => reg.test(url));

    if (!requiresToken) {
      await next();
      return;
    }

    if (!token) {
      ctx.error(ctx, 401);
      return;
    }

    try {
      const decoded = jwt.verify(token.split(' ')[1], CONFIG.tokenSecret);
      const tokenKey = getTokenKey(decoded, clientType, headers);
      const redisToken = await ctx.redisDB.get(tokenKey);
      if (!redisToken || isTokenExpired(decoded)) {
        await ctx.redisDB.destroy(tokenKey);
        throw new Error('Token expired');
      }
      await next();
    } catch (err) {
      console.log(err);
      ctx.error(ctx, 401);
    }
  };
}

function getTokenKey(decoded, clientType, headers) {
  const clientId = headers['client-id'];
  if (clientType === 'h5') {
    return `${decoded.username}-${decoded.id}-${clientId}-${clientType}`;
  } else if (clientType === 'management') {
    return `${decoded.email}-${decoded.name}-${decoded.id}-${clientId}-${clientType}`;
  }
}

function isTokenExpired(decoded) {
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}
