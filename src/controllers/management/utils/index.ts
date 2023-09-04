/*
 * 用于post相关的管理端接口的工具函数
 */
import { v4 as uuidv4 } from 'uuid';

export const COMMON_QUERY_CHECKED_COLUMN = ['pinned', 'recommended', 'featured', 'hot', 'original', 'paid', 'free', 'political', 'carousel', 'privated', 'publiced'];
export const COMMON_QUERY_OTHER_COLUMN = [
  'id',
  'title',
  'createTime',
  'updateTime',
  'shelveTimeEnd',
  'shelveTimeStart',
  'status',
  'poster',
  'view',
  'authorId',
  'directoryId',
  'channelId',
  'postType',
  'srcTopicId',
  'videoPoster',
  'videoUrl',
  'postTags',
  'galleries',
].concat(COMMON_QUERY_CHECKED_COLUMN);
// 封装的post新增
export const commonAddPost = async (ctx, postType) => {
  // 1普通文章，2视频，3图集，5内嵌视频
  let extraParams = [];
  switch (postType) {
    case '1':
      extraParams = ['poster'];
      break;
    case '2':
      extraParams = ['videoUrl'];
      break;
    case '5':
      extraParams = ['poster'];
      break;
    default:
      break;
  }
  const commonParams = ['authorId', 'channelId', 'content', 'directoryId', 'title', 'shelveTimeEnd', 'shelveTimeStart'].concat(extraParams);
  const allParams = [...commonParams, ...COMMON_QUERY_CHECKED_COLUMN];
  // 检查是否缺少必要的参数
  const missingParams = allParams.filter((param) => !ctx.request.body[param]);
  if (missingParams.length > 0) {
    ctx.error(ctx, `404#Missing parameters: ${missingParams.join(', ')}`);
    return;
  }
  let { postTags, videoPoster, galleries } = ctx.request.body;
  if (postTags.length === 0) {
    ctx.error(ctx, `404#postTags cannot be empty`);
    return;
  }
  if (postType === '2') {
    videoPoster = videoPoster || '';
  } else if (postType === '3') {
    if (galleries.length === 0) {
      ctx.error(ctx, `404#galleries cannot be empty`);
      return;
    }
  }
  try {
    let sqlParams = allParams.map((param) => `'${ctx.request.body[param]}'`).join(',');
    let id = uuidv4().replace(/-/g, '');
    let status = 'OFFLINE';
    let createTime = new Date().getTime();
    let updateTime = createTime;
    let view = 0;
    let comment = 0;
    // 定义额外字段的默认值
    const extraFields = {
      videoPoster: '', // 默认值
      galleries: '', // 默认值
    };
    // 根据 postType 设置额外字段的实际值
    if (postType === '2') {
      extraFields['videoPoster'] = `'${videoPoster}'`;
    } else if (postType === '3') {
      extraFields['galleries'] = `'${JSON.stringify(galleries)}'`;
    }
    // 获取需要插入的额外字段的名称和值
    const extraFieldNames = Object.keys(extraFields).filter((key) => extraFields[key]);
    const extraFieldValues = extraFieldNames.map((key) => extraFields[key]);
    // 构建 SQL 查询
    let sql = `
    INSERT INTO sm_board_post_list
    (id, srcTopicId, postType, createTime, updateTime,shelveTimeEnd,shelveTimeStart,status, view, comment, ${[...allParams, ...extraFieldNames].join(',')}, postTags)
    VALUES
    ('${id}', '${id}', '${postType}', ${createTime}, ${updateTime}, '${status}', ${view}, ${comment}, ${[sqlParams, ...extraFieldValues].join(',')}, '${JSON.stringify(postTags)}');
  `;
    let results = await ctx.execSql([sql]);
    if (results[0].affectedRows > 0) {
      ctx.success(ctx, { id: id });
    } else {
      ctx.error(ctx, 405);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 封装的post编辑
export const commonUpdatePost = async (ctx, postType) => {
  // 1普通文章，2视频，3图集，5内嵌视频
  let extraParams = [];
  switch (postType) {
    case '1':
      extraParams = ['poster'];
      break;
    case '2':
      extraParams = ['videoUrl'];
      break;
    case '5':
      extraParams = ['poster'];
      break;
    default:
      break;
  }
  const commonParams = ['id', 'authorId', 'channelId', 'content', 'directoryId', 'title', 'shelveTimeEnd', 'shelveTimeStart'].concat(extraParams);
  const allParams = [...commonParams, ...COMMON_QUERY_CHECKED_COLUMN];
  // 检查是否缺少必要的参数
  const missingParams = allParams.filter((param) => !ctx.request.body[param]);
  if (missingParams.length > 0) {
    ctx.error(ctx, `404#Missing parameters: ${missingParams.join(', ')}`);
    return;
  }
  let { postTags, videoPoster, galleries } = ctx.request.body;
  if (postTags.length === 0) {
    ctx.error(ctx, `404#postTags cannot be empty`);
    return;
  }
  if (postType === '2') {
    videoPoster = videoPoster || '';
  } else if (postType === '3') {
    if (galleries.length === 0) {
      ctx.error(ctx, `404#galleries cannot be empty`);
      return;
    }
  }
  try {
    const sqlParams = allParams.map((param) => `${param} = '${ctx.request.body[param]}'`).join(',');
    const updateTime = new Date().getTime();
    // 定义额外字段的默认值
    const extraFields = {
      videoPoster: '', // 默认值
      galleries: '', // 默认值
    };
    // 根据 postType 设置额外字段的实际值
    if (postType === '2') {
      extraFields['videoPoster'] = videoPoster ? `videoPoster = '${videoPoster}'` : '';
    }
    if (postType === '3') {
      extraFields['galleries'] = `galleries = '${JSON.stringify(galleries)}'`;
    }
    // 获取需要插入的额外字段的名称和值
    const extraFieldNames = Object.keys(extraFields).filter((key) => extraFields[key]);
    const extraSqlParams = extraFieldNames.map((key) => extraFields[key]).join(',');
    // 构建 SQL 查询
    let sql = `
    UPDATE sm_board_post_list SET
    postTags = '${JSON.stringify(postTags)}',
    ${sqlParams},
    updateTime = ${updateTime}
    ${extraFieldNames.length ? ',' + extraSqlParams : ''}
    WHERE id = '${ctx.request.body.id}';
  `;
    let results = await ctx.execSql([sql]);
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

