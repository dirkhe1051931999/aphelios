import { rsaDecrypt } from '../../../util/helper';
import jwt from 'jsonwebtoken';
import CONFIG from 'src/config';

export const login = async (ctx) => {
  let username = ctx.request.body.username;
  // 明文密码
  let password = ctx.request.body.password;
  if (!username || !password) {
    ctx.error(ctx, 'W1004');
    return;
  }
  try {
    const sql = `
        SELECT
        id,
        friendCount,
        gender,
        avatarUrl,
        fansCount,
        type,
        nickname,
        score,
        createTime,
        username,
        ip,
        region,
        address,
        description,
        password
      FROM sm_board_user
      WHERE username = '${username}';
      `;
    let result = await ctx.execSql(sql);
    if (result.length === 0) {
      ctx.error(ctx, 'W1005');
      return;
    }
    let passwordFromDB = rsaDecrypt(result[0].password);
    if (passwordFromDB === password) {
      delete result[0].password;
      result[0].avatarUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + result[0].avatarUrl;
      let userToken = {
        id: result[0].id,
        username: result[0].username,
        type: result[0].type,
        nickname: result[0].nickname,
        avatarUrl: result[0].avatarUrl,
        ip: result[0].ip,
        region: result[0].region,
        address: result[0].address,
        description: result[0].description,
      };
      ctx.redisDB.set(`${username}-${result[0].id}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`, userToken, 1000 * 60 * 60 * 24);
      result[0].token = jwt.sign(userToken, CONFIG.tokenSecret, {
        expiresIn: '24h',
      });
      ctx.success(ctx, result[0]);
    } else {
      ctx.error(ctx, 'W1006');
    }
  } catch (e) {
    console.log(e);
    ctx.error(ctx, 'W1000');
  }
};
export const logout = async (ctx) => {
  try {
    const token = ctx.request.headers.authorization;
    if (!token) {
      ctx.error(ctx, 401);
      return;
    }
    const decoded = jwt.verify(token, CONFIG.tokenSecret);
    const tokenKey = `${decoded.username}-${decoded.id}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`;
    await ctx.redisDB.destroy(tokenKey);
    ctx.success(ctx, null);
  } catch (e) {
    console.log(e);
    ctx.error(ctx, 'W1000');
  }
};