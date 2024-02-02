import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { sendMail } from '../../../util/send-email';
import { formatDate, removePrefixFromFields, uploadFileToMinio } from '../../../util/helper';

export const sendChangeEmailCode = async (ctx) => {
  let { email, username } = ctx.request.body;
  if (ctx.isFalsy([email, username])) {
    ctx.error(ctx, '404#email,username');
    return;
  }
  try {
    const subject = '【koa实战】-【H5】- 获取验证码';
    const code = (Math.floor(Math.random() * 90000) + 10000).toString();
    ctx.redisDB.set(`${username}-${email}-code-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`, code, 5 * 60 * 1000);
    const content = '您的验证码是：' + '<b>' + code + '</b>' + '，有效时间5分钟。';
    const html = fs.readFileSync(path.resolve(__dirname, '../../../templates/email.template.html'), 'utf-8').replace('{{username}}', username).replace('{{content}}', content);
    await sendMail({ to: email, subject, html });
    ctx.success(ctx, {
      email,
      mobile: null,
    });
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 'W2000');
  }
};
export const updateEmail = async (ctx) => {
  let { email, username, code } = ctx.request.body;
  if (ctx.isFalsy([email, username, code])) {
    ctx.error(ctx, '404#email,username,code');
    return;
  }
  const redisCode = await ctx.redisDB.get(`${username}-${email}-code-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`);
  if (!redisCode) {
    ctx.error(ctx, 'W1009');
    return;
  }
  if (redisCode === code) {
    await updateUserAttribute(ctx, 'email', ctx.request.body.email);
    await ctx.redisDB.destroy(`${username}-${email}-code-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`);
  } else {
    ctx.error(ctx, 'W1010');
  }
};

export const updateNickName = async (ctx) => {
  await updateUserAttribute(ctx, 'nickName', ctx.request.body.nickname);
};

export const updateGender = async (ctx) => {
  await updateUserAttribute(ctx, 'gender', ctx.request.body.gender);
};

export const updateDescription = async (ctx) => {
  await updateUserAttribute(ctx, 'description', ctx.request.body.description);
};

export const updateAddress = async (ctx) => {
  await updateUserAttribute(ctx, 'address', ctx.request.body.address);
};

export const updateAvatar = async (ctx) => {
  try {
    //   获取 formdata
    let {
      data,
      url,
    } = await uploadFileToMinio(ctx, true, `assets/h5/user/avatar/${formatDate(new Date(), 'yyyyMMdd')}`);
    await updateUserAttribute(ctx, 'avatarUrl', url, data.username);
  } catch (e) {
    console.log(e);
    ctx.error(ctx, 'W2000');
  }
};

export async function addPostComment(ctx) {
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
}

export const replyUserComment = async (ctx) => {
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

export const addVote = async (ctx) => {
  let { id, selectOption } = ctx.request.body;
  if (ctx.isFalsy([id, selectOption])) {
    ctx.error(ctx, '404#id,selectOption');
    return;
  }
  try {
    // selectOption 是json对象
    let sql = `
        UPDATE sm_board_survey SET selectOption = '${JSON.stringify(selectOption)}' WHERE id = '${id}';
    `;
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

// 封装更新用户信息的方法
const updateRedisUserInfo = async (ctx, username, key, value) => {
  try {
    // 先查username的id
    const result = await ctx.execSql(`SELECT id FROM sm_board_user WHERE username = '${username}'`);
    // 再更新redis中的用户信息
    let id = result[0].id;
    let userinfo = await ctx.redisDB.get(`${username}-${id}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`);
    userinfo[key] = value;
    // 更新redis中的用户信息，只更新value，不更新时间
    await ctx.redisDB.update(`${username}-${id}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`, userinfo);
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 'W2000');
  }
};

async function updateUserAttribute(ctx, attribute, value, username?: string) {
  if (attribute !== 'avatarUrl') {
    let result = ctx.request.body;
    username = result.username;
  }
  if (ctx.isFalsy([username, value])) {
    ctx.error(ctx, `404#username,${attribute}`);
    return;
  }
  let sql: string;
  if (attribute === 'gender') {
    sql = `UPDATE sm_board_user SET ${attribute} = ${value} WHERE username = '${username}';`;
  } else {
    sql = `UPDATE sm_board_user SET ${attribute} = '${value}' WHERE username = '${username}';`;
  }
  try {
    await ctx.execSql(sql);
    if (attribute !== 'gender') {
      await updateRedisUserInfo(ctx, username, attribute, value);
    }
    if (attribute === 'avatarUrl') {
      ctx.success(ctx, value);
    } else {
      ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 'W2000');
  }
}

