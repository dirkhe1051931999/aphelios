let chips = ['pinned', 'recommended', 'hot', 'original', 'paid', 'free', 'carousel', 'political', 'privated', 'publiced'];
let commonColumn = ['id', 'title', 'poster', 'content', 'createTime', 'updateTime', 'view', 'postType', 'postTags', 'videoPoster', 'videoUrl', 'galleries', 'srcTopicId', 'shelveTimeStart', 'shelveTimeEnd', 'authorId', 'directoryId', 'channelId'].concat(chips);
let defaultAvatarName = ['/cdn/avatar/Malphite.png', '/cdn/avatar/LOL.png', '/cdn/avatar/Aphelios.png', '/cdn/avatar/Milio.png'];
import setting from 'src/config';

function findDirectory(directory, id) {
  let result = null;
  if (!directory) return null;
  for (let i = 0; i < directory.length; i++) {
    if (directory[i].id === id) {
      result = directory[i];
      break;
    } else {
      result = findDirectory(directory[i].children, id);
      if (result) {
        break;
      }
    }
  }
  return result ? {
    id: result.id,
    name: result.name,
    subName: result.subName,
    type: result.type,
    parent_id: result.parent_id,
  } : null;
}

async function getDirectory(ctx: any) {
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
  SELECT id, name, cover,description FROM sm_board_sheet WHERE visible = '1'
  `;
  let sql2 = `
  SELECT id, name, subName, type, parent_id 
  FROM sm_board_directory 
  `;
  let sql3 = `
  SELECT id, name, subName, type, parent_id
  FROM sm_board_child_directory
  `;
  return new Promise(async (resolve, reject) => {
    try {
      let results = await ctx.execSql([sql1, sql2, sql3]);
      let sheets = results[0];
      let directorys = results[1];
      let childDirectorys = results[2];
      sheets = buildTree([sheets, directorys, childDirectorys]);
      resolve(sheets);
    } catch (error) {
      console.log(error);
      ctx.error(ctx, 402);
    }
  });
}

async function getColletList(ctx: any, list: any[]) {
  // 在directory 的children中查找，有多级children，递归查找
  let channelSql = `SELECT id,name FROM sm_board_channel;`;
  let authorSql = `SELECT id,name,followCount,type,avatarUrl,fansCount,nick,score,description,coverUrl FROM sm_board_author;`;
  let channelResult = await ctx.execSql(channelSql);
  let authorResult = await ctx.execSql(authorSql);
  let directory = await getDirectory(ctx);
  list.forEach((item) => {
    item.channel = channelResult.find((channel) => channel.id === item.channelId);
    item.author = authorResult.find((author) => author.id === item.authorId);
    item.directory = findDirectory(directory, item.directoryId);
  });
  return Promise.resolve(list);
}

// 获取文章列表
export const getPostList = async (ctx) => {
  let { page, rowsPerPage, sortBy, sortDirection, channelId } = ctx.query;
  page = page || 1;
  rowsPerPage = rowsPerPage || 10;
  sortBy = sortBy || 'updateTime';
  sortDirection = sortDirection || 'DESC';
  if (!['id', 'createTime', 'view', 'comment', 'updateTime'].includes(sortBy)) {
    ctx.error(ctx, 'W1001');
    return;
  }
  try {
    let whereSql = `WHERE status = "PUBLISHED" AND carousel = '0' AND political = '0' ${channelId ? `AND channelId = '${channelId}'` : ''}`;
    const sqlTotal = `SELECT COUNT(*) as total FROM sm_board_post_list ${whereSql};`;
    let postSql = `SELECT ${commonColumn.join(',')}, (SELECT COUNT(*)  FROM sm_board_comment WHERE postId = srcTopicId ) as comment  from sm_board_post_list ${whereSql} ORDER BY ${sortBy} ${sortDirection} LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`;
    let postResult = await ctx.execSql([sqlTotal, postSql]);
    const result = await getColletList(ctx, postResult[1]);

    ctx.success(ctx, {
      total: postResult[0][0].total,
      pageData: result,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const getHomeHeadPost = async (ctx) => {
  let carouselSql = `SELECT ${commonColumn.join(',')} from sm_board_post_list  WHERE status = "PUBLISHED" AND carousel = '1';`;
  let politicalSql = `SELECT ${commonColumn.join(',')} from sm_board_post_list  WHERE status = "PUBLISHED" AND political = '1';`;
  try {
    const postResult = await ctx.execSql([carouselSql, politicalSql]);
    const carouselResult = await getColletList(ctx, postResult[0]);
    const politicalResult = await getColletList(ctx, postResult[1]);
    ctx.success(ctx, {
      carouselData: carouselResult,
      politicalData: politicalResult,
    });
  } catch (e) {
    console.log(e);
    ctx.error(ctx, 402);
  }
};
// 获取top5新闻
export const getHotTop = async (ctx) => {
  try {
    let authorColumns = ['id', 'name', 'followCount', 'type', 'status', 'avatarUrl', 'articleCount', 'fansCount', 'nick', 'score', 'createTime', 'updateTime', 'loginTime', 'description', 'coverUrl'];
    let commentColumns = ['id', 'id2', 'topId', 'content', 'postId', 'userId', 'replyId', 'postTime', 'status', `like`, `unlike`];
    let userColumns = ['id', 'gender', 'avatarUrl', 'nickname', 'username'];
    let userSql = `SELECT ${userColumns.join(',')} FROM sm_board_user WHERE type = '1'`;
    const newsSql = `SELECT ${commonColumn.join(',')} from sm_board_post_list WHERE status = "PUBLISHED" AND political = '0' AND poster!='' ORDER BY view DESC LIMIT 5;`;
    const authorSql = `SELECT ${authorColumns.join(',')}, (SELECT COUNT(*) from sm_board_post_list WHERE authorId = a.id) as posts FROM sm_board_author a WHERE status = '0' OR status = '4' ORDER BY posts DESC LIMIT 5;`;
    const commentSql = `SELECT ${commentColumns.map((column)=> `c.${column}`).join(',') } FROM sm_board_comment c WHERE c.status = '1' ORDER BY unlike DESC LIMIT 5;`;
    const topFiveResult = await ctx.execSql([newsSql, authorSql, commentSql]);
    let commentPostIds = topFiveResult[2].map((comment) => `'${comment.postId}'`);
    const commentPosts = await ctx.execSql(`SELECT ${commonColumn.join(',')} FROM sm_board_post_list WHERE srcTopicId in (${commentPostIds.join(',')})`);
    const allUser = await ctx.execSql(userSql);
    allUser.map((user) => {
      if (defaultAvatarName.includes(user.avatarUrl)) {
        user.avatarUrl = setting.defaultCdnUrl.replace('/cdn', '') + user.avatarUrl;
      }
    });
    const commentPost = await getColletList(ctx, commentPosts);
    const newsResult = await getColletList(ctx, topFiveResult[0]);
    topFiveResult[2].map((comment) => {
      comment.user = allUser.find((user) => user.id === comment.userId);
      comment.post = commentPost.find((post) => post.srcTopicId === comment.postId);
      return comment;
    });
    ctx.success(ctx, {
      newsData: newsResult,
      authorData: topFiveResult[1],
      commentData: topFiveResult[2],
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
      SELECT id,name FROM sm_board_channel WHERE visible = '1'
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
  const sheets = await getDirectory(ctx);
  ctx.success(ctx, sheets);
};
// 搜索文章，作者或者用户
export const search = async (ctx) => {
  let { keyword, page, type, rowsPerPage } = ctx.query;
  page = page || 1;
  rowsPerPage = rowsPerPage || 10;
  // post,author,user
  type = type || 'post';
  if (!keyword) {
    ctx.error(ctx, 'W1003');
    return;
  }
  try {
    // 分3次查询，分别是文章，作者，用户
    let postSql = `SELECT ${commonColumn.join(',')} FROM sm_board_post_list WHERE status = "PUBLISHED" AND title LIKE '%${keyword}%' ORDER BY updateTime DESC LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`;
    let authorSql = `SELECT id,name,followCount,type,avatarUrl,fansCount,nick,score,description,coverUrl FROM sm_board_author WHERE name LIKE '%${keyword}%' OR nick LIKE '%${keyword}%' ORDER BY createTime DESC LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`;
    let userSql = `SELECT id,friendCount,gender,avatarUrl,articleCount,fansCount,type,nickname,score,loginTime,createTime,username,region,address,description,email FROM sm_board_user WHERE nickname LIKE '%${keyword}%' OR username LIKE '%${keyword}%' ORDER BY createTime DESC LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};`;
    if (type === 'post') {
      let postResult = await ctx.execSql(postSql);
      const postList = await getColletList(ctx, postResult);
      ctx.success(ctx, {
        list: postList,
      });
    } else if (type === 'author') {
      let authorResult = await ctx.execSql(authorSql);
      ctx.success(ctx, {
        list: authorResult,
      });
    } else if (type === 'user') {
      let userResult = await ctx.execSql(userSql);
      userResult.map((user) => {
        if (defaultAvatarName.includes(user.avatarUrl)) {
          user.avatarUrl = setting.defaultCdnUrl.replace('/cdn', '') + user.avatarUrl;
        }
      });
      ctx.success(ctx, {
        list: userResult,
      });
    } else {
      ctx.error(ctx, 'W1003');
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取没有poster的文章
export const getAuthorEssay = async (ctx) => {
  let { page, rowsPerPage } = ctx.query;
  page = page || 1;
  rowsPerPage = rowsPerPage || 10;
  try {
    let sql = `
    SELECT ${commonColumn.join(',')}, (SELECT COUNT(*)  FROM sm_board_comment WHERE postId = srcTopicId ) as comment FROM sm_board_post_list WHERE status = "PUBLISHED" AND poster = '' ORDER BY updateTime DESC LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};
    `;
    let results = await ctx.execSql(sql);
    const postList = await getColletList(ctx, results);
    ctx.success(ctx, {
      list: postList,
    });
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
      SELECT id,title,poster,createTime,view,comment,authorId,directoryId,channelId,postType
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
// 获取轮播图新闻
export const getCarouselPost = async (ctx) => {
  try {
    let whereSql = 'WHERE status = "PUBLISHED" AND carousel = "1"';
    let postSql = `SELECT ${commonColumn.join(',')} from sm_board_post_list ${whereSql};`;
    let postResult = await ctx.execSql(postSql);
    const result = await getColletList(ctx, postResult);
    ctx.success(ctx, {
      pageData: result,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};