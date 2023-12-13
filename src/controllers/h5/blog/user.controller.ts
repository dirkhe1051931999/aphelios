import CONFIG from 'src/config';
import { v4 as uuidv4 } from 'uuid';
//  评论
export const addComment = async (ctx) => {
  let { content, postId, userId } = ctx.request.body;
  if (ctx.isFalsy([content, postId, userId])) {
    ctx.error(ctx, '404#content,postId,userId');
    return;
  }
  try {
    let id = uuidv4().replace(/\-/g, '');
    let id2 = uuidv4().replace(/\-/g, '');
    let postTime = new Date().getTime();
    let status = 1;
    let like = 0;
    let unlike = 0;
    let sql = `
    INSERT INTO sm_board_comment (id, id2, content, postId, userId, postTime, status, \`like\`, unlike)
    VALUES ('${id}', '${id2}', '${content}', '${postId}', '${userId}', ${postTime}, ${status}, ${like}, ${unlike});
    `;
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 'W2000');
  }
};