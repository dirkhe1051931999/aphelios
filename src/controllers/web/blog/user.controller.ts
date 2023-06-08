import CONFIG from 'src/config';
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
