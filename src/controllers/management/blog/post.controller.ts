import moment from 'moment';
import { uploadImage } from 'src/util/helper';

// 获取文章列表
export const getPostList = async (ctx) => {
  let { channelId, status, page, rowsPerPage } = ctx.request.body;
  channelId = channelId || '';
  status = status || '';
  page = page || 1;
  rowsPerPage = rowsPerPage || 20;
  try {
    let results = await ctx.execSql([
      `SELECT COUNT(*) as total FROM sm_board_post_list WHERE (channelId = '${channelId}' OR '${channelId}' = '') AND (status = '${status}' OR '${status}'  = '');`,
      `
          SELECT id, title, createTime, updateTime, status, poster, view, comment, authorId, commentId, categoryId,channelId, codeCount, postType
          FROM sm_board_post_list 
          WHERE (channelId = '${channelId}' OR '${channelId}' = '') 
          AND (status = '${status}' OR '${status}'  = '')
          ORDER BY createTime DESC 
          LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`,
    ]);
    ctx.success(ctx, {
      pageData: results[1],
      total: results[0][0].total,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const getPostListByCategoryId = async (ctx) => {
  let { categoryId, page, rowsPerPage } = ctx.request.body;
  if (ctx.isFalsy([categoryId, page, rowsPerPage])) {
    ctx.error(ctx, '404#categoryId, page, rowsPerPage');
    return;
  }
  try {
    let results = await ctx.execSql([
      `SELECT COUNT(*) as total FROM sm_board_post_list WHERE (categoryId = '${categoryId}');`,
      `
          SELECT id, title, createTime, updateTime, status, poster, view, comment, authorId, commentId, categoryId,channelId, codeCount, postType
          FROM sm_board_post_list 
          WHERE (categoryId = '${categoryId}') 
          LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`,
    ]);
    ctx.success(ctx, {
      pageData: results[1],
      total: results[0][0].total,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取具体文章
export const getPostById = async (ctx) => {
  let { id } = ctx.request.body;
  if (!id) {
    ctx.error(ctx, '404#id');
  }
  try {
    let result = await ctx.execSql(`SELECT content FROM sm_board_post_list WHERE id = ${id}`);
    ctx.success(ctx, result[0].content);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const uploadPostImgs = async (ctx) => {
  try {
    const result = await uploadImage(ctx);
    ctx.success(ctx, result);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 添加文章
export const addPost = async (ctx) => {
  let { title, content, poster, authorId, categoryId, channelId, codeCount, postType } = ctx.request.body;
  let status = 'OFFLINE';
  let createTime = new Date().getTime();
  let updateTime = createTime;
  let view = 0;
  let comment = 0;
  if (ctx.isFalsy([title, content, poster, authorId, categoryId, channelId, codeCount, postType])) {
    ctx.error(ctx, '404#title, content,poster, authorId, categoryId,channelId, codeCount, postType');
    return;
  }
  try {
    let results = await ctx.execSql([
      `INSERT INTO sm_board_post_list (title, content,poster, authorId, categoryId,channelId, codeCount, postType, status, createTime, updateTime, view, comment) 
      VALUES ('${title}', '${content}','${poster}', '${authorId}', '${categoryId}','${channelId}',${codeCount}, ${postType}, '${status}', ${createTime}, ${updateTime}, ${view}, ${comment});`,
    ]);
    if (results[0].affectedRows > 0) {
      ctx.success(ctx, null);
    } else {
      ctx.error(ctx, 405);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 删除文章
export const deletePost = async (ctx) => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let results = await ctx.execSql(`DELETE FROM sm_board_post_list WHERE id = ?`, id);
    ge: ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 更新文章
export const updatePost = async (ctx) => {
  let { title, content, poster, authorId, categoryId, channelId, codeCount, id } = ctx.request.body;
  let updateTime = new Date().getTime();
  if (ctx.isFalsy([title, content, poster, authorId, categoryId, channelId, codeCount, id])) {
    ctx.error(ctx, '404#title, content,poster, authorId, categoryId, channelId,codeCount, postType,id');
    return;
  }
  try {
    ctx.execSql([
      `UPDATE sm_board_post_list SET
      title = '${title}',
      content = '${content}',
      poster = '${poster}',
      authorId = '${authorId}',
      categoryId = '${categoryId}',
      channelId = '${channelId}',
      codeCount = ${codeCount},
      updateTime = ${updateTime}
      WHERE id = ${id};`,
    ]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 下架文章
export const offlinePost = async (ctx) => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    await ctx.execSql(`UPDATE sm_board_post_list SET status = 'OFFLINE' WHERE id = ?`, id);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 发布文章
export const publishPost = async (ctx) => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    await ctx.execSql(`UPDATE sm_board_post_list SET status = 'PUBLISHED' WHERE id = ?`, id);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
