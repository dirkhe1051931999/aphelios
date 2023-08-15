import { Context } from 'koa';
export const getOverview = async (ctx: Context): Promise<void> => {
  try {
    const results = await ctx.execSql([
      `SELECT COUNT(*) as postCount FROM sm_board_post_list;`,
      `SELECT COUNT(*) as channelCount FROM sm_board_channel;`,
      `SELECT COUNT(*) as sheetCount FROM sm_board_sheet;`,
      `SELECT COUNT(*) as userCount FROM sm_board_user;`,
      `SELECT COUNT(*) as authorCount FROM sm_board_author;`,
      `SELECT COUNT(*) as onlinePostCount FROM sm_board_post_list WHERE status = 'PUBLISHED';`,
    ]);
    if (results.length) {
      return ctx.success(ctx, {
        postCount: results[0][0].postCount,
        channelCount: results[1][0].channelCount,
        sheetCount: results[2][0].sheetCount,
        userCount: results[3][0].userCount,
        authorCount: results[4][0].authorCount,
        onlinePostCount: results[5][0].onlinePostCount,
      });
    } else {
      return ctx.success(ctx, {
        postCount: 0,
        channelCount: 0,
        sheetCount: 0,
        userCount: 0,
        authorCount: 0,
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};

export const getPostTrends = async (ctx): Promise<void> => {
  try {
    let { days } = ctx.request.body;
    days = days || 365;
    /* 
      DELIMITER //
      CREATE PROCEDURE CreateNumbersTable(IN maxNumber INT)
      BEGIN
        DROP TEMPORARY TABLE IF EXISTS numbers;
        CREATE TEMPORARY TABLE numbers (n INT);

        SET @i = 0;
        WHILE @i <= maxNumber DO
          INSERT INTO numbers (n) VALUES (@i);
          SET @i = @i + 1;
        END WHILE;
      END //
      DELIMITER ;
    */
    await ctx.execSql(`CALL CreateNumbersTable(364);`);
    const postsQuery = `
    SELECT
    FROM_UNIXTIME(UNIX_TIMESTAMP(NOW()) - n * 86400, '%Y-%m-%d') AS timestamp,
    IFNULL(COUNT(sm_board_post_list.createTime), 0) AS count
    FROM numbers
    LEFT JOIN sm_board_post_list
    ON DATE(FROM_UNIXTIME(sm_board_post_list.createTime/1000)) = DATE(NOW()) - INTERVAL numbers.n DAY
    AND sm_board_post_list.createTime >= (UNIX_TIMESTAMP(NOW()) - ${days} * 86400) * 1000
    WHERE numbers.n < ${days}
    GROUP BY numbers.n
    ORDER BY timestamp;
    `;

    const results = await ctx.execSql([postsQuery]);

    const postTrends = results[0].map((row) => ({
      date: new Date(row.timestamp).toLocaleDateString(),
      count: row.count,
    }));

    return ctx.success(ctx, {
      postTrends,
      // 其他结果
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};

export const getChannelSheetUserAuthorLimit5 = async (ctx): Promise<void> => {
  try {
    const results = await ctx.execSql([
      `SELECT * FROM sm_board_channel ORDER BY pos DESC LIMIT 5;`,
      `SELECT * FROM sm_board_sheet  LIMIT 5;`,
      `SELECT 
        id,
        friendCount,
        gender,
        avatarUrl,
        articleCount,
        fansCount,
        type,
        nickname,
        score,
        loginTime,
        createTime,
        username,
        region,
        address,
        description,
        email FROM sm_board_user ORDER BY createTime DESC LIMIT 5;`,
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
        companyVerifyInfoId,
        defaultUser FROM sm_board_author ORDER BY createTime DESC LIMIT 5;`,
      `
        SELECT authorId,status,categoryId,channelId,id,view,title,poster FROM sm_board_post_list
        ORDER BY view DESC
        LIMIT 5;
        `,
      `
        SELECT 
            p.id, p.title, p.createTime, p.updateTime, p.status, 
            p.poster, p.view, p.authorId, p.commentId, p.categoryId, 
            p.channelId, p.codeCount, p.postType, p.srcTopicId, p.poster,
            COUNT(c.postId) AS comment
        FROM 
            sm_board_post_list AS p
        LEFT JOIN 
            sm_board_comment AS c ON p.srcTopicId = c.postId
        GROUP BY 
            p.id
        ORDER BY 
          comment DESC 
        LIMIT 5;
        `,
    ]);
    if (results.length) {
      return ctx.success(ctx, {
        channelLimit5: results[0],
        sheetLimit5: results[1],
        userLimit5: results[2],
        authorLimit5: results[3],
        postViewTop5: results[4],
        postCommentTop5: results[5],
      });
    } else {
      return ctx.success(ctx, {
        channelLimit5: [],
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
