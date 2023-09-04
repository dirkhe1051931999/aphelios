import { v4 as uuidv4 } from 'uuid';
export const addPostSurvey = async (ctx): Promise<void> => {
  let { postId, title, startTime, endTime, status, type, selectOption } = ctx.request.body;
  if (ctx.isFalsy([postId, title, startTime, endTime, status, type, selectOption])) {
    ctx.error(ctx, '404#postId, title, startTime, endTime, status, type, selectOption');
    return;
  }
  try {
    const id = uuidv4().replace(/\-/g, '');
    startTime = new Date(startTime).getTime();
    endTime = new Date(endTime).getTime();
    await ctx.execSql(`
      INSERT INTO sm_board_survey (id, postId, title, startTime, endTime, status, type, selectOption, createTime, updateTime)
      VALUES ('${id}', '${postId}', '${title}', ${startTime}, ${endTime}, '${status}', '${type}', '${JSON.stringify(selectOption)}', ${new Date().getTime()}, ${new Date().getTime()});
    `);
    ctx.success(ctx, { id });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const updatePostSurvey = async (ctx): Promise<void> => {
  let { id, postId, title, startTime, endTime, status, type, selectOption } = ctx.request.body;
  if (ctx.isFalsy([id, postId, title, startTime, endTime, status, type, selectOption])) {
    ctx.error(ctx, '404#id, postId, title, startTime, endTime, status, type, selectOption');
    return;
  }
  try {
    startTime = new Date(startTime).getTime();
    endTime = new Date(endTime).getTime();
    await ctx.execSql(`
      UPDATE sm_board_survey
      SET postId='${postId}', title='${title}', startTime=${startTime}, endTime=${endTime}, status='${status}', type='${type}', selectOption='${JSON.stringify(
      selectOption
    )}', updateTime=${new Date().getTime()}
      WHERE id='${id}';
    `);
    ctx.success(ctx);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const deletePostSurvey = async (ctx): Promise<void> => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    await ctx.execSql(`
      DELETE FROM sm_board_survey WHERE id='${id}';
    `);
    ctx.success(ctx);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
