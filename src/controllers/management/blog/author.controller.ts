// 获取所有作者
export const getAuthor = async (ctx) => {
  try {
    let results = await ctx.execSql([`SELECT id, postId, name FROM post_author `]);
    ctx.success(ctx, {
      pageData: results[0],
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
