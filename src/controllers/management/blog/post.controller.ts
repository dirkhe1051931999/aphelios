import {
  addPrefixToFields,
  isCdnAvatar,
  replacePrefix,
  replacePrefixForText,
  uploadFileToMinio,
} from '../../../util/helper';
import CONFIG from '../../../config';
import { v4 as uuidv4 } from 'uuid';
import { COMMON_QUERY_OTHER_COLUMN, commonAddPost, commonUpdatePost } from '../utils';
// 获取文章列表
export const getPostList = async (ctx) => {
  let {
    title,
    channelId,
    authorId,
    status,
    page,
    rowsPerPage,
    haveComment,
    orderProperty,
    orderDir,
    post_radio_option,
    postType,
  } = ctx.request.body;
  title = title || '';
  channelId = channelId || '';
  status = status || '';
  authorId = authorId || '';
  haveComment = haveComment || '';
  page = page || 1;
  rowsPerPage = rowsPerPage || 20;
  post_radio_option = post_radio_option || [];
  postType = postType || [];
  let columnSqlString = COMMON_QUERY_OTHER_COLUMN.map((field) => `p.${field}`).join(',');
  // 文章选项，私密还是公开，精选还是置顶
  let postRadioOptionConditions = post_radio_option.map((field) => `(p.${field} = '1')`).join(' AND ');
  if (postRadioOptionConditions) {
    postRadioOptionConditions = 'AND ' + postRadioOptionConditions;
  }
  postRadioOptionConditions = post_radio_option.length > 0 ? postRadioOptionConditions : '';
  // 文章类型
  let postTypeConditions = postType.map((field) => `(p.postType = '${field}')`).join(' OR ');
  if (postTypeConditions) {
    postTypeConditions = 'AND (' + postTypeConditions + ')';
  }
  postTypeConditions = postType.length > 0 ? postTypeConditions : '';
  try {
    let totalSql = `
        SELECT COUNT(*) as total 
        FROM (
            SELECT p.id
            FROM sm_board_post_list AS p
            LEFT JOIN (
                SELECT postId, COUNT(*) as commentCount
                FROM sm_board_comment
                GROUP BY postId
            ) AS c ON p.srcTopicId = c.postId
            WHERE
            (p.title LIKE '%${title}%' OR '${title}' = '')
            AND (p.channelId = '${channelId}' OR '${channelId}' = '') 
            AND (p.status = '${status}' OR '${status}'  = '') 
            AND (p.authorId = '${authorId}' OR '${authorId}'  = '')
            AND (
                ('${haveComment}' = '1' AND c.commentCount > 0)
                OR ('${haveComment}' = '0' AND (c.commentCount = 0 OR c.commentCount IS NULL))
                OR '${haveComment}' = ''
            )
            ${postRadioOptionConditions}
            ${postTypeConditions}
        ) as totals;    
    `;
    let pageDataSql = `
        SELECT COUNT(c.postId) AS comment, ${columnSqlString}
        FROM sm_board_post_list AS p
        LEFT JOIN sm_board_comment AS c ON p.srcTopicId = c.postId
        WHERE
            (p.title LIKE '%${title}%' OR '${title}' = '') 
            AND (p.channelId = '${channelId}' OR '${channelId}' = '') 
            AND (p.status = '${status}' OR '${status}' = '') 
            AND (p.authorId = '${authorId}' OR '${authorId}' = '')
            ${postRadioOptionConditions}
            ${postTypeConditions}
        GROUP BY p.id
        HAVING 
            (
                ('${haveComment}' = '1' AND COUNT(c.postId) > 0) 
                OR ('${haveComment}' = '0' AND COUNT(c.postId) = 0) 
                OR '${haveComment}' = ''
            )
        ${
          orderProperty
            ? `ORDER BY ${orderProperty} ${orderDir} LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}`
            : `ORDER BY p.createTime DESC LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}`
        };
    `;
    let pageDataResult = await ctx.execSql([totalSql, pageDataSql]);
    const postIdList = pageDataResult[1].map((item) => item.id);
    const surveySql = `
        SELECT * FROM sm_board_survey WHERE postId IN ('${postIdList.join('\',\'')}')
    `;
    const surveyList = await ctx.execSql(surveySql);

    // 使用 Map 对象对 survey 数据进行分组
    const surveyMap = surveyList.reduce((acc, item) => {
      acc[item.postId] = acc[item.postId] || [];
      acc[item.postId].push(item);
      return acc;
    }, {});
    for (let key in surveyMap) {
      surveyMap[key] = surveyMap[key].map((item) => {
        item.selectOption.forEach((option) => {
          option.voteUserList = addPrefixToFields(option.voteUserList);
        });
        return item;
      });
    }
    // 将 survey 数据合并到主查询结果中
    let pageData = pageDataResult[1].map((item) => ({
      ...item,
      survey: surveyMap[item.id] || [],
    }));
    pageData = addPrefixToFields(pageData);
    // 返回合并后的数据
    ctx.success(ctx, {
      pageData,
      total: pageDataResult[0][0].total,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const getPostListByCategoryId = async (ctx) => {
  let { directoryId, page, rowsPerPage } = ctx.request.body;
  if (ctx.isFalsy([directoryId, page, rowsPerPage])) {
    ctx.error(ctx, '404#directoryId, page, rowsPerPage');
    return;
  }
  let columnSqlString = COMMON_QUERY_OTHER_COLUMN.join(',');
  try {
    let totalSql = `SELECT COUNT(*) as total FROM sm_board_post_list WHERE (directoryId = '${directoryId}');`;
    let pageDataSql = `
        SELECT ${columnSqlString},
        (SELECT COUNT(*) FROM sm_board_comment WHERE postId = srcTopicId) AS comment
        FROM sm_board_post_list 
        WHERE (directoryId = '${directoryId}') 
        ORDER BY createTime DESC
        LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};
    `;
    let results = await ctx.execSql([totalSql, pageDataSql]);
    ctx.success(ctx, {
      pageData: addPrefixToFields(results[1]),
      total: results[0][0].total,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const getPostRowById = async (ctx) => {
  let { id } = ctx.request.body;
  if (!id) {
    ctx.error(ctx, '404#id');
  }
  let columnSqlString = COMMON_QUERY_OTHER_COLUMN.join(',');
  try {
    let rowSql = `SELECT ${columnSqlString} FROM sm_board_post_list WHERE id = '${id}'`;
    let result = await ctx.execSql(rowSql);
    ctx.success(ctx, addPrefixToFields(result)[0]);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取具体文章
export const getPostContentById = async (ctx) => {
  let { id } = ctx.request.body;
  if (!id) {
    ctx.error(ctx, '404#id');
  }
  try {
    let result = await ctx.execSql(`SELECT content FROM sm_board_post_list WHERE id = '${id}'`);
    ctx.success(ctx, replacePrefix(result[0].content));
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const uploadPostImgs = async (ctx) => {
  try {
    const { url } = await uploadFileToMinio(ctx, false, null);
    ctx.success(ctx, url);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 添加文章
export const addPost = async (ctx) => {
  return commonAddPost(ctx, '1');
};
// 添加视频文章
export const addVideoPost = async (ctx) => {
  return commonAddPost(ctx, '2');
};
// 添加图集文章
export const addGalleryPost = async (ctx) => {
  return commonAddPost(ctx, '3');
};
// 添加内嵌视频文章
export const addVideoEmbedPost = async (ctx) => {
  return commonAddPost(ctx, '5');
};
// 添加普通文章
export const addNormalPost = async (ctx) => {
  return commonAddPost(ctx, '1');
};
// 更新文章
export const updatePost = async (ctx) => {
  return commonUpdatePost(ctx, '1');
};
// 更新视频文章
export const updateVideoPost = async (ctx) => {
  return commonUpdatePost(ctx, '2');
};
// 更新图集文章
export const updateGalleryPost = async (ctx) => {
  return commonUpdatePost(ctx, '3');
};
// 更新内嵌视频文章
export const updateVideoEmbedPost = async (ctx) => {
  return commonUpdatePost(ctx, '5');
};
// 更新普通文章
export const updateNormalPost = async (ctx) => {
  return commonUpdatePost(ctx, '1');
};
// 删除文章
export const deletePost = async (ctx) => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let results = await ctx.execSql(`DELETE FROM sm_board_post_list WHERE id = '${id}'`);
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
    await ctx.execSql(`UPDATE sm_board_post_list SET status = 'OFFLINE' WHERE id = '${id}'`);
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
    await ctx.execSql(`UPDATE sm_board_post_list SET status = 'PUBLISHED' WHERE id = '${id}'`);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 获取文章一级评论
export const getLevel1CommentsByPostId = async (ctx) => {
  let { id, rowsPerPage, page } = ctx.request.body;
  rowsPerPage = rowsPerPage || 10;
  page = page || 1;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    const results = await ctx.execSql(`
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
  `);
    for (let item of results) {
      if (isCdnAvatar(item.account.avatarUrl)) {
        item.account.avatarUrl = `${CONFIG.defaultCdnUrl.split('/cdn')[0]}${item.account.avatarUrl}`;
      } else {
        item.account.avatarUrl = replacePrefixForText(item.account.avatarUrl);
      }
    }
    ctx.success(ctx, {
      pageData: results,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 获取文章二级评论
export const getLevel2CommentsByTopId = async (ctx) => {
  let { id, rowsPerPage, page } = ctx.request.body;
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
    for (let item of results) {
      if (isCdnAvatar(item.account.avatarUrl)) {
        item.account.avatarUrl = `${CONFIG.defaultCdnUrl.split('/cdn')[0]}${item.account.avatarUrl}`;
      } else {
        item.account.avatarUrl = replacePrefixForText(item.account.avatarUrl);
      }
    }
    ctx.success(ctx, {
      pageData: results,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 修改评论状态
1 正常
2 拉黑
3 删除
*/
export const setCommentStatus = async (ctx) => {
  let { id, status } = ctx.request.body;
  if (ctx.isFalsy([id, status])) {
    ctx.error(ctx, '404#id,status');
    return;
  }
  try {
    await ctx.execSql(`UPDATE sm_board_comment SET status = ${status} WHERE id = ?`, id);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const setMood = async (ctx) => {
  let { id, mood } = ctx.request.body;
  if (ctx.isFalsy([id, mood])) {
    ctx.error(ctx, '404#id,mood');
    return;
  }
  try {
    const results = await ctx.execSql(`SELECT * FROM sm_board_comment WHERE id = '${id}'`);
    let like = results[0].like;
    let unlike = results[0].unlike;
    if (mood === 'like') {
      like++;
    }
    if (mood === 'cancel-like') {
      like--;
    }
    if (mood === 'unlike') {
      unlike++;
    }
    if (mood === 'cancel-unlike') {
      unlike--;
    }
    await ctx.execSql([
      'START TRANSACTION;',
      'SELECT * FROM sm_board_comment WHERE id = ' + `'${id}'`,
      'UPDATE sm_board_comment SET ' + '`like`' + ' = ' + like + ', ' + 'unlike = ' + unlike + ' WHERE id =' + `'${id}'`,
      'COMMIT;',
    ]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const replyComment = async (ctx) => {
  let { topId, content, postId, userId, replyId } = ctx.request.body;
  if (ctx.isFalsy([topId, content, postId, userId, replyId])) {
    ctx.error(ctx, '404#id2,topId,content,postId,userId,replyId');
    return;
  }
  try {
    let id = uuidv4().replace(/-/g, '');
    let id2 = uuidv4().replace(/-/g, '');
    let postTime = new Date().getTime();
    let status = 1;
    let like = 0;
    let unlike = 0;
    let sql = `
    INSERT INTO sm_board_comment (id, id2, topId, content, postId, userId, replyId, postTime, status, \`like\`, unlike)
    VALUES ('${id}', '${id2}', '${topId}', '${content}', '${postId}', '${userId}', '${replyId}', ${postTime}, ${status}, ${like}, ${unlike});
    `;
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

export const addComment = async (ctx) => {
  let { content, postId, userId } = ctx.request.body;
  if (ctx.isFalsy([content, postId, userId])) {
    ctx.error(ctx, '404#content,postId,userId');
    return;
  }
  try {
    let id = uuidv4().replace(/-/g, '');
    let id2 = uuidv4().replace(/-/g, '');
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
    ctx.error(ctx, 405);
  }
};
