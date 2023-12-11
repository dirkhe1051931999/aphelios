import CONFIG from 'src/config';
import { rsaDecrypt, rsaEncrypt } from '../../../util/helper';
// 获取用户信息
export const getUserDetailById = async (ctx) => {
  let id = ctx.query.id;
  if (!id) {
    ctx.error(ctx, 'W1002');
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
        description
      FROM sm_board_user
      WHERE id = '${id}';     
      `;
    let result = await ctx.execSql(sql);
    if (result.length !== 0) {
      result[0].avatarUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + result[0].avatarUrl;
    }
    ctx.success(ctx, result[0]);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};

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
      // result[0] 删除password字段
      delete result[0].password;

    } else {
      ctx.error(ctx, 'W1006');
    }
  } catch (e) {
    console.log(e);
    ctx.error(ctx, 402);
  }
};
