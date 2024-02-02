import { isCdnAvatar, rsaDecrypt } from '../../../util/helper';
import jwt from 'jsonwebtoken';
import CONFIG from 'src/config';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { sendMail } from '../../../util/send-email';


export const login = async (ctx) => {
  let username = ctx.request.body.username;
  // 明文密码
  let password = ctx.request.body.password;
  if (!username || !password) {
    ctx.error(ctx, 'W1004');
    return;
  }
  try {
    const sql = `
        SELECT
        id,
        email,
        friendCount,
        gender,
        avatarUrl,
        fansCount,
        type,
        nickname,
        score,
        createTime,
        username,
        ip,
        region,
        address,
        description,
        password
      FROM sm_board_user
      WHERE username = '${username}';
      `;
    let result = await ctx.execSql(sql);
    if (result.length === 0) {
      ctx.error(ctx, 'W1005');
      return;
    }
    let passwordFromDB = rsaDecrypt(result[0].password);
    if (passwordFromDB === password) {
      delete result[0].password;
      let userToken = {
        id: result[0].id,
        username: result[0].username,
        type: result[0].type,
        nickname: result[0].nickname,
        avatarUrl: result[0].avatarUrl,
        ip: result[0].ip,
        region: result[0].region,
        address: result[0].address,
        description: result[0].description,
        email: result[0].email,
      };
      ctx.redisDB.set(`${username}-${result[0].id}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`, userToken, 1000 * 60 * 60 * 24);
      result[0].token = jwt.sign(userToken, CONFIG.tokenSecret, {
        expiresIn: '24h',
      });
      ctx.success(ctx, result[0]);
    } else {
      ctx.error(ctx, 'W1006');
    }
  } catch (e) {
    console.log(e);
    ctx.error(ctx, 'W1000');
  }
};
export const logout = async (ctx) => {
  try {
    const token = ctx.request.headers.authorization;
    if (!token) {
      ctx.error(ctx, 401);
      return;
    }
    const decoded = jwt.verify(token.split(' ')[1], CONFIG.tokenSecret);
    const tokenKey = `${decoded.username}-${decoded.id}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`;
    await ctx.redisDB.destroy(tokenKey);
    ctx.success(ctx, null);
  } catch (e) {
    console.log(e);
    ctx.error(ctx, 'W2000');
  }
};
export const register = async (ctx) => {
  let { gender, nickname, username, email, password, address } = ctx.request.body;
  if (ctx.isFalsy([gender, nickname, username, email, password, address])) {
    ctx.error(ctx, '404#gender,nickname,username,email,password,address');
    return;
  }
  let id = uuidv4().replace(/-/g, '');
  let createTime = new Date().getTime();
  let avatarUrl = '/cdn/avatar/LOL.png';
  let type = 1;
  let description = '这个人很懒，什么都没有留下';
  let ip = '';
  let region = '';
  let address_detail = '';
  try {
    const results = await ctx.execSql([`
    INSERT INTO sm_board_user (id,gender,createTime,type,nickname,username,email,password,avatarUrl,address,ip,region,description) 
    SELECT '${id}',${gender},${createTime},${type},'${nickname}','${username}','${email}','${password}','${avatarUrl}','${address}&${address_detail}','${ip}','${region}','${description}' FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM sm_board_user WHERE username = '${username}'
  );`]);
    if (results[0].affectedRows === 0) {
      ctx.error(ctx, 'W1007');
      return;
    }
    ctx.success(ctx, {
      id,
    });
  } catch (e) {
    console.log(e);
    ctx.error(ctx, 'W1000');
  }
};

export const resetPassword = async (ctx) => {
  let { username } = ctx.request.body;
  if (ctx.isFalsy([username])) {
    ctx.error(ctx, '404#username');
    return;
  }
  try {
    // 查询用户名对应的邮箱
    let result = await ctx.execSql(`
        SELECT email FROM sm_board_user WHERE username = '${username}';
    `);
    if (result.length === 0) {
      ctx.error(ctx, 'W1005');
      return;
    }
    let email = result[0].email;
    // 制作邮箱模板
    const userToken = {
      username,
      email,
    };
    const token = jwt.sign(userToken, CONFIG.tokenSecret, {
      expiresIn: '600s',
    });
    const subject = '【koa实战】- 【H5】 - 重置密码';
    ctx.redisDB.set(
      `${token}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`,
      {
        email,
        username,
      },
      10 * 60 * 1000,
    );
    let url = `${CONFIG.h5ResetPasswordUrl}${token}&username=${username}&email=${email}&fr=set-pwd`;
    const content = `点击该链接重置密码：<a href='${url}'>${url}</a>，有效时间10分钟`;
    const html = fs.readFileSync(path.resolve(__dirname, '../../../templates/email.template.html'), 'utf-8').replace('{{username}}', username).replace('{{content}}', content);
    await sendMail({ to: email, subject, html });
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 'W1000');
  }
};
export const checkResetPasswordToken = async (ctx) => {
  let { token } = ctx.request.body;
  if (ctx.isFalsy([token])) {
    ctx.error(ctx, '404#token');
    return;
  }
  try {
    const tokenKey = `${token}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`;
    const tokenValue = await ctx.redisDB.get(tokenKey);
    if (tokenValue) {
      ctx.success(ctx, null);
    } else {
      ctx.error(ctx, 'W1008');
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 'W1000');
  }
};
export const updateUserPassword = async (ctx) => {
  let { username, password, token } = ctx.request.body;
  if (ctx.isFalsy([username, password, token])) {
    ctx.error(ctx, '404#username,password,token');
    return;
  }
  try {
    let sql = `
        UPDATE sm_board_user SET password = '${password}' WHERE username = '${username}';
    `;
    await ctx.execSql(sql);
    const tokenKey = `${token}-${ctx.request.headers['client-id']}-${ctx.request.headers['client-type']}`;
    await ctx.redisDB.destroy(tokenKey);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 'W1000');
  }
};