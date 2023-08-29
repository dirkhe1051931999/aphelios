export const getAuthorCompanyList = async (ctx) => {
  const { page, rowsPerPage } = ctx.request.body;
  if (ctx.isFalsy([page, rowsPerPage])) {
    ctx.error(ctx, '404#page,rowsPerPage');
    return;
  }
  try {
    let results = await ctx.execSql([`SELECT *  FROM sm_board_audit_author_approval ORDER BY createTime DESC LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`]);
    ctx.success(ctx, {
      pageData: results[0],
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const getAuthorCompanyDetail = async (ctx) => {
  const { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let results = await ctx.execSql([
      `SELECT 
    id,
    name,
    followCount,
    type,
    status,
    avatarUrl,
    articleCount,
    fansCount,
    nick,
    score,
    createTime,
    updateTime,
    loginTime,
    description,
    coverUrl,
    appPassword,
    rejectReason
    FROM sm_board_author WHERE id = '${id}';`,
    ]);
    ctx.success(ctx, results[0][0]);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};

export const passAuthorCompany = async (ctx) => {
  const { id, authorId } = ctx.request.body;
  if (ctx.isFalsy([id, authorId])) {
    ctx.error(ctx, '404#id,authorId');
    return;
  }
  try {
    await ctx.execSql([`UPDATE sm_board_audit_author_approval SET status = 1 WHERE id = '${id}';`, `UPDATE sm_board_author SET status = 4 WHERE id = '${authorId}';`]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const rejectAuthorCompany = async (ctx) => {
  const { id, authorId, failMessage } = ctx.request.body;
  if (ctx.isFalsy([id, authorId, failMessage])) {
    ctx.error(ctx, '404#id,authorId,failMessage');
    return;
  }
  try {
    await ctx.execSql([`UPDATE sm_board_audit_author_approval SET status = 2 ,failMessage = '${failMessage}' WHERE id = '${id}';`, `UPDATE sm_board_author SET status = 5 WHERE id = '${authorId}';`]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const getPostAllCommnet = async (ctx) => {
  let { page, rowsPerPage, status, orderProperty, orderDir } = ctx.request.body;
  if (ctx.isFalsy([page, rowsPerPage])) {
    ctx.error(ctx, '404#page,rowsPerPage');
    return;
  }
  try {
    const whereClause = status ? `WHERE status = ${status} AND content IS NOT NULL` : 'WHERE content IS NOT NULL';
    const query = `SELECT * FROM sm_board_comment ${whereClause}  ${
      orderProperty
        ? `ORDER BY ${orderProperty} ${orderDir} LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}`
        : `ORDER BY postTime DESC LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`
    };`;
    let results = await ctx.execSql([
      `SELECT COUNT(*) AS total FROM sm_board_comment ${whereClause}`,
      // status 传空 默认全部
      query,
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
export const setPostCommentStatus = async (ctx) => {
  const { id, status } = ctx.request.body;
  if (ctx.isFalsy([id, status])) {
    ctx.error(ctx, '404#id,status');
    return;
  }
  try {
    if (typeof id === 'object') {
      await ctx.execSql([`UPDATE sm_board_comment SET status = ${status} WHERE id IN (${id.map((item) => `'${item}'`).join(',')});`]);
    } else {
      await ctx.execSql([`UPDATE sm_board_comment SET status = ${status} WHERE id = '${id}';`]);
    }
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const getAuthorNormalList = async (ctx) => {
  const { page, rowsPerPage } = ctx.request.body;
  if (ctx.isFalsy([page, rowsPerPage])) {
    ctx.error(ctx, '404#page,rowsPerPage');
    return;
  }
  try {
    let results = await ctx.execSql([
      `SELECT
    id,
    name,
    followCount,
    type,
    status,
    avatarUrl,
    articleCount,
    fansCount,
    nick,
    score,
    createTime,
    updateTime,
    loginTime,
    description,
    coverUrl,
    appPassword,
    rejectReason
     FROM sm_board_author WHERE status = 2 AND defaultUser = 0 ORDER BY createTime DESC LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`,
    ]);
    ctx.success(ctx, {
      pageData: results[0],
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const passAuthorNormal = async (ctx) => {
  const { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    await ctx.execSql([`UPDATE sm_board_author SET status = 0 WHERE id = '${id}';`]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const rejectAuthorNormal = async (ctx) => {
  const { id, rejectReason } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    await ctx.execSql([`UPDATE sm_board_author SET status = 1 ,rejectReason = '${rejectReason}' WHERE id = '${id}';`]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
