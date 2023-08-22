// 获取文章列表
export const getPostList = async (ctx) => {
  let { page, rowsPerPage, sortBy, sortDirection } = ctx.query;
  page = page || 1;
  rowsPerPage = rowsPerPage || 10;
  sortBy = sortBy || 'id';
  sortDirection = sortDirection || 'DESC';
  if (!['id', 'createTime', 'view', 'comment'].includes(sortBy)) {
    ctx.error(ctx, 'W1001');
    return;
  }
  try {
    const sql1 = `SELECT COUNT(*) as total FROM sm_board_post_list;`;
    const sql2 = `
    WITH RECURSIVE comment_tree AS (
      SELECT
        p.id, p.title, p.poster, p.createTime, p.view, p.srcTopicId, p.postType,
        COUNT(c.postId) AS comment,
        JSON_OBJECT(
          'id', a.id,
          'name', a.name,
          'followCount', a.followCount,
          'type', a.type,
          'status', a.status,
          'avatarUrl', a.avatarUrl,
          'fansCount', a.fansCount,
          'nick', a.nick,
          'score', a.score,
          'createTime', a.createTime,
          'description', a.description,
          'coverUrl', a.coverUrl
        ) AS author,
        JSON_OBJECT(
          'id', ch.id,
          'name', ch.name
        ) AS channel,
        CASE
          WHEN p.categoryId = cd.id THEN JSON_OBJECT(
            'id', cd.id,
            'name', cd.name,
            'subName', cd.subName,
            'type', cd.type,
            'parent_id', cd.parent_id,
            'parent', (
              SELECT JSON_OBJECT(
                'id', pd.id,
                'name', pd.name,
                'subName', pd.subName,
                'type', pd.type,
                'parent_id', pd.parent_id,
                'parent', (
                  SELECT JSON_OBJECT(
                    'id', pdd.id,
                    'name', pdd.name
                  )
                  FROM sm_board_sheet pdd
                  WHERE pdd.id = pd.parent_id
                )
              )
              FROM sm_board_directory pd
              WHERE pd.id = cd.parent_id
            )
          )
          WHEN p.categoryId = d.id THEN JSON_OBJECT(
            'id', d.id,
            'name', d.name,
            'subName', d.subName,
            'type', d.type,
            'parent_id', d.parent_id,
            'parent', (
              SELECT JSON_OBJECT(
                'id', ps.id,
                'name', ps.name
              )
              FROM sm_board_sheet ps
              WHERE ps.id = d.parent_id
            )
          )
          ELSE NULL
        END AS category
      FROM
        sm_board_post_list p
      LEFT JOIN
        sm_board_comment c ON p.srcTopicId = c.postId
      LEFT JOIN
        sm_board_author a ON p.authorId = a.id
      LEFT JOIN
        sm_board_channel ch ON p.channelId = ch.id
      LEFT JOIN
        sm_board_child_directory cd ON p.categoryId = cd.id
      LEFT JOIN
        sm_board_directory d ON p.categoryId = d.id
      WHERE
        p.status = 'PUBLISHED'
      GROUP BY
        p.id, p.title, p.poster, p.createTime, p.view, p.srcTopicId, p.postType, a.id, ch.id, cd.id, d.id
    ), comment_hierarchy AS (
      SELECT
        id, title, poster, createTime, view, srcTopicId, postType, comment, author, channel, category
      FROM
        comment_tree
      WHERE
        category IS NOT NULL
      UNION ALL
      SELECT
        c.id, c.title, c.poster, c.createTime, c.view, c.srcTopicId, c.postType, c.comment, c.author, c.channel, c.category
      FROM
        comment_tree c
      JOIN
        comment_hierarchy ch ON JSON_EXTRACT(ch.category, '$.id') = c.category->'$.parent_id'
    )
    SELECT
      h.id, h.title, h.poster, h.createTime, h.view, h.srcTopicId, h.postType, h.comment, h.author, h.channel, h.category
    FROM
      comment_hierarchy h
    ORDER BY
      '${sortBy}' ${sortDirection}
    LIMIT
      ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};       
    `;
    let results = await ctx.execSql([sql1, sql2]);
    ctx.success(ctx, {
      total: results[0][0].total,
      pageData: results[1],
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 根据文章id获取文章详情
export const getPostDetailById = async (ctx) => {
  let { id } = ctx.query;
  if (!id) {
    ctx.error(ctx, 'W1002');
    return;
  }
  try {
    const sql = `
  WITH RECURSIVE comment_tree AS (
      SELECT 
        p.id,
        p.title,
        p.poster,
        p.createTime,
        p.srcTopicId,
        p.view,
        (SELECT COUNT(*) FROM sm_board_comment WHERE postId = p.srcTopicId) AS totalComment,
        p.categoryId,
        p.postType,
        p.content,
        JSON_OBJECT(
          "id", a.id,
          "name", a.name,
          "followCount", a.followCount,
          "type", a.type,
          "status", a.status,
          "avatarUrl", a.avatarUrl,
          "fansCount", a.fansCount,
          "nick", a.nick,
          "score", a.score,
          "createTime", a.createTime,
          "description", a.description,
          "coverUrl", a.coverUrl
        ) AS author,
        JSON_OBJECT(
          "id", ch.id,
          "name", ch.name
        ) AS channel,
        CASE
          WHEN p.categoryId = cd.id THEN JSON_OBJECT(
            "id", cd.id,
            "name", cd.name,
            "subName", cd.subName,
            "type", cd.type,
            "parent_id", cd.parent_id,
            "parent", (
              SELECT JSON_OBJECT(
                "id", pd.id,
                "name", pd.name,
                "subName", pd.subName,
                "type", pd.type,
                "parent_id", pd.parent_id,
                "parent", (
                  SELECT JSON_OBJECT(
                    "id", pdd.id,
                    "name", pdd.name
                  )
                  FROM sm_board_sheet pdd
                  WHERE pdd.id = pd.parent_id
                )
              )
              FROM sm_board_directory pd
              WHERE pd.id = cd.parent_id
            )
          )
          WHEN p.categoryId = d.id THEN JSON_OBJECT(
            "id", d.id,
            "name", d.name,
            "subName", d.subName,
            "type", d.type,
            "parent_id", d.parent_id,
            "parent", (
              SELECT JSON_OBJECT(
                "id", ps.id,
                "name", ps.name
              )
              FROM sm_board_sheet ps
              WHERE ps.id = d.parent_id
            )
          )
          ELSE NULL
        END AS category
      FROM
        sm_board_post_list p
      LEFT JOIN 
        sm_board_author a ON p.authorId = a.id
      LEFT JOIN 
        sm_board_channel ch ON p.channelId = ch.id
      LEFT JOIN
        sm_board_child_directory cd ON p.categoryId = cd.id
      LEFT JOIN
        sm_board_directory d ON p.categoryId = d.id
      WHERE p.id = '${id}' AND p.status = 'PUBLISHED' 
      GROUP BY
        p.id, p.title, p.poster, p.createTime, p.view, p.srcTopicId, p.postType, a.id, ch.id, cd.id, d.id
    ), comment_hierarchy AS (
      SELECT
        id, title, poster, createTime, view, srcTopicId, postType, content, totalComment, author, channel, category
      FROM
        comment_tree
      WHERE
        category IS NOT NULL
      UNION ALL
      SELECT
        c.id, c.title, c.poster, c.createTime, c.view, c.srcTopicId, c.postType, c.content, c.totalComment, c.author, c.channel, c.category
      FROM
        comment_tree c
      JOIN
        comment_hierarchy ch ON JSON_EXTRACT(ch.category, "$.id") = c.category->"$.parent_id"
    )
    SELECT
      h.id, h.title, h.poster, h.createTime, h.view, h.srcTopicId, h.postType, h.content, h.totalComment, h.author, h.channel, h.category
    FROM
      comment_hierarchy h;
    `;
    let result = await ctx.execSql(sql);
    ctx.success(ctx, result[0] || null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};

// 获取top5新闻
export const getTopFivePost = async (ctx) => {
  try {
    const results = await ctx.execSql(`
      SELECT id,title,poster,createTime,view,comment,authorId,categoryId,channelId,postType
      FROM sm_board_post_list
      WHERE (status = 'PUBLISHED') AND (poster != '')
      ORDER BY view DESC
      LIMIT 5;
    `);
    ctx.success(ctx, {
      pageData: results,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取所有频道
export const getAllChannel = async (ctx) => {
  try {
    const results = await ctx.execSql(`
      SELECT id,name FROM sm_board_channel;
    `);
    ctx.success(ctx, {
      pageData: results,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取所有分类，树形结构
export const getAllDirectory = async (ctx) => {
  function buildTree(results) {
    let [sheets, directorys, childDirectorys] = results;
    // 将数据存入Map，以便快速查找
    let dirMap = new Map([...directorys, ...childDirectorys].map((dir) => [dir.id, { ...dir, children: [] }]));
    // 将子目录插入到其父目录的children数组中
    childDirectorys.forEach((dir) => dirMap.get(dir.parent_id)?.children.push(dir));
    // 将一级目录插入到其父级表格的children数组中，并将表格转化为具有children属性的新对象
    sheets = sheets.map((sheet) => ({ ...sheet, children: directorys.filter((dir) => dir.parent_id === sheet.id) }));
    // 确保表格的children属性中的目录也有children属性
    sheets.forEach((sheet) => sheet.children.forEach((dir) => (dir.children = dirMap.get(dir.id)?.children || [])));
    return sheets;
  }
  let sql1 = `
  SELECT id, name, cover,description FROM sm_board_sheet
  `;
  let sql2 = `
  SELECT id, name, subName, type, parent_id 
  FROM sm_board_directory 
  `;
  let sql3 = `
  SELECT id, name, subName, type, parent_id
  FROM sm_board_child_directory
  `;
  try {
    let results = await ctx.execSql([sql1, sql2, sql3]);
    let sheets = results[0];
    let directorys = results[1];
    let childDirectorys = results[2];
    sheets = buildTree([sheets, directorys, childDirectorys]);
    ctx.success(ctx, sheets);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取文章的评论
export const getPostLevel1CommentsById = async (ctx) => {
  let { id, rowsPerPage, page } = ctx.query;
  rowsPerPage = rowsPerPage || 10;
  page = page || 1;
  if (!id) {
    ctx.error(ctx, 'W1002');
    return;
  }
  try {
    let sql1 = `
    SELECT COUNT(*) as commentCount 
    FROM sm_board_comment 
    WHERE postId = (SELECT srcTopicId FROM sm_board_post_list WHERE id = '${id}');
    `;
    let sql2 = `
      SELECT
        c.id,
        c.id2,
        c.content,
        c.postId,
        c.userId,
        c.replyId,
        c.status,
        c.postTime,
        c.like,
        c.unlike,
        c.topId,
        JSON_OBJECT(
          'id', u.id,
          'friendCount', u.friendCount,
          'gender', u.gender,
          'avatarUrl', u.avatarUrl,
          'articleCount', u.articleCount,
          'fansCount', u.fansCount,
          'type', u.type,
          'nickname', u.nickname,
          'score', u.score,
          'loginTime', u.loginTime,
          'createTime', u.createTime,
          'username', u.username,
          'ip', u.ip,
          'region', u.region,
          'address', u.address,
          'description', u.description,
          'email', u.email
        ) AS account,
        COUNT(sc.postId) AS childCommentCount
      FROM sm_board_post_list p
      LEFT JOIN sm_board_comment c ON p.srcTopicId = c.postId
      LEFT JOIN sm_board_user u ON c.userId = u.id
      LEFT JOIN sm_board_comment sc ON c.id2 = sc.topId
      WHERE p.id = '${id}' AND c.replyId IS NULL
      GROUP BY c.id
      ORDER BY c.postTime DESC
      LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};      
    `;
    let result1 = await ctx.execSql(sql1);
    if (result1[0].commentCount === 0) {
      ctx.success(ctx, {
        total: 0,
        pageData: [],
      });
      return;
    } else {
      let result2 = await ctx.execSql(sql2);
      ctx.success(ctx, {
        total: result1[0].commentCount,
        pageData: result2,
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const getPostLevel2CommentsById = async (ctx) => {
  let { id, rowsPerPage, page } = ctx.query;
  rowsPerPage = rowsPerPage || 10;
  page = page || 1;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let sql = `
    SELECT
      c.id,
      c.id2,
      c.content,
      c.postId,
      c.userId,
      c.replyId,
      c.status,
      c.postTime,
      c.like,
      c.unlike,
      c.topId,
      JSON_OBJECT(
        'id', u.id,
        'friendCount', u.friendCount,
        'gender', u.gender,
        'avatarUrl', u.avatarUrl,
        'articleCount', u.articleCount,
        'fansCount', u.fansCount,
        'type', u.type,
        'nickname', u.nickname,
        'score', u.score,
        'loginTime', u.loginTime,
        'createTime', u.createTime,
        'username', u.username,
        'ip', u.ip,
        'region', u.region,
        'address', u.address,
        'description', u.description,
        'email', u.email
      ) AS account,
      (
        SELECT JSON_OBJECT(
          'id', u2.id,
          'friendCount', u2.friendCount,
          'gender', u2.gender,
          'avatarUrl', u2.avatarUrl,
          'articleCount', u2.articleCount,
          'fansCount', u2.fansCount,
          'type', u2.type,
          'nickname', u2.nickname,
          'score', u2.score,
          'loginTime', u2.loginTime,
          'createTime', u2.createTime,
          'username', u2.username,
          'ip', u2.ip,
          'region', u2.region,
          'address', u2.address,
          'description', u2.description,
          'email', u2.email
        )
        FROM sm_board_comment c2
        LEFT JOIN sm_board_user u2 ON c2.userId = u2.id
        WHERE c2.id2 = c.replyId
      )  AS replyAccount,
      (
        SELECT c3.content 
        FROM sm_board_comment c3
        WHERE c3.id2 = c.replyId
      )  AS replyContent
    FROM sm_board_comment c
    LEFT JOIN sm_board_user u ON c.userId = u.id
    WHERE c.topId = '${id}'
    ORDER BY c.postTime DESC
    LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};
    `;
    const results = await ctx.execSql(sql);
    ctx.success(ctx, {
      pageData: results,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取作者的所有文章
export const getPostListByAuthorId = async (ctx) => {
  let { id, rowsPerPage, page } = ctx.query;
  rowsPerPage = rowsPerPage || 10;
  page = page || 1;
  if (!id) {
    ctx.error(ctx, 'W1002');
    return;
  }
  try {
    let sql1 = `
    SELECT COUNT(*) as total FROM sm_board_post_list WHERE authorId = '${id}';
    `;
    let sql2 = `
      SELECT id,title,poster,createTime,view,comment,authorId,categoryId,channelId,postType
      FROM sm_board_post_list
      WHERE authorId = '${id}'
      ORDER BY createTime DESC
      LIMIT ${rowsPerPage} OFFSET ${rowsPerPage * (page - 1)};
    `;
    let results = await ctx.execSql([sql1, sql2]);
    ctx.success(ctx, {
      total: results[0][0].total,
      pageData: results[1],
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取作者详情
export const getAuthorDetailById = async (ctx) => {
  let id = ctx.query.id;
  if (!id) {
    ctx.error(ctx, 'W1002');
    return;
  }
  try {
    let sql = `
      SELECT id,name,followCount,type,status,avatarUrl,(SELECT COUNT(*) from sm_board_post_list WHERE authorId='${id}') as articleCount ,fansCount,nick,score,createTime,description,coverUrl from sm_board_author WHERE id = '${id}';
      `;
    let results = await ctx.execSql(sql);
    ctx.success(ctx, results[0] || null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
