import { v4 as uuidv4 } from 'uuid';
// 查询所有用户
export const getAllPostUser = async (ctx): Promise<void> => {
  let { username, type, page, rowsPerPage } = ctx.request.body;
  if (ctx.isFalsy([page, rowsPerPage])) {
    ctx.error(ctx, '404#pgae,rowsPerPage');
    return;
  }
  username = username || '';
  type = type || '';
  try {
    let results = await ctx.execSql([
      `SELECT COUNT(*) as count from sm_board_user`,
      `
      SELECT *
      FROM sm_board_user
      WHERE (username LIKE CONCAT('%', COALESCE('${username}', ''), '%'))
      AND (type='${type}' OR '${type}' = '')
      LIMIT ${(page - 1) * rowsPerPage}, ${rowsPerPage};
    `,
    ]);
    ctx.success(ctx, {
      pageData: results[1],
      total: results[0][0].count,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const addPostUser = async (ctx): Promise<void> => {
  let { gender, nickname, username, email, password, avatarUrl, address, ip, region, description, address_detail } = ctx.request.body;
  if (ctx.isFalsy([gender, nickname, username, email, password, avatarUrl, address, ip, region, description, address_detail])) {
    ctx.error(ctx, '404#gender,nickname,username,email,password,avatarUrl,address,ip,region,description');
    return;
  }
  try {
    let id = uuidv4().replace(/-/g, '');
    let createTime = new Date().getTime();
    const results = await ctx.execSql([
      `INSERT INTO sm_board_user (id,gender,createTime,type,nickname,username,email,password,avatarUrl,address,ip,region,description) 
        SELECT '${id}',${gender},${createTime},1,'${nickname}','${username}','${email}','${password}','${avatarUrl}','${address}&${address_detail}','${ip}','${region}','${description}' FROM DUAL WHERE NOT EXISTS (
        SELECT 1 FROM sm_board_user WHERE username = '${username}'
      );`,
    ]);
    if (results.affectedRows === 0) {
      ctx.error(ctx, 701);
    }
    ctx.success(ctx, {
      id,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const deletePostUser = async (ctx): Promise<void> => {
  const { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    await ctx.execSql([`DELETE FROM sm_board_user WHERE id = '${id}';`]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const setPostUserStatus = async (ctx): Promise<void> => {
  const { id, status } = ctx.request.body;
  if (ctx.isFalsy([id, status])) {
    ctx.error(ctx, '404#id,status');
    return;
  }
  try {
    await ctx.execSql([`UPDATE sm_board_user SET type = ${status} WHERE id = '${id}';`]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
