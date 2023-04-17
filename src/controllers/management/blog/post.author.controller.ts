import fs from 'fs';
import path from 'path';
import CONFIG from 'src/config';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
export const getAllPostAuthor = async (ctx): Promise<void> => {
  let sql = `SELECT id, name, coverUrl, friendCount, gender, avatarUrl, articleCount, fansCount, type, nick, score, createTime, description 
  FROM sm_board_author 
  ORDER BY createTime DESC;`;
  try {
    let results = await ctx.execSql(sql);
    ctx.success(ctx, {
      pageData: results,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const addPostAuthor = async (ctx): Promise<void> => {
  let { name, nick, avatar, cover, description, gender, managementPassword, appPassword } = ctx.request.body;
  if (ctx.isFalsy([name, nick, avatar, description, gender, managementPassword, appPassword])) {
    ctx.error(ctx, '404#name, nick, avatar, description, gender, managementPassword, appPassword');
    return;
  }
  let imageBuffer, imageBuffer2, match, match2, imageType, imageType2, imagePath, imagePath2, imageName, imageName2;
  if (cover) {
    // 封面
    cover = cover.replace(/^data:image\/\w+;base64,/, '');
    imageBuffer2 = Buffer.from(cover, 'base64');
    match2 = cover.match(/^data:image\/(\w+);base64,/);
    imageType2 = match2 ? match2[1] : 'png';
    imagePath2 = `${path.join(CONFIG.root, CONFIG.appPath, 'cdn/post_author_cover/')}${moment().format('YYYYMMDD')}/`;
    imageName2 = uuidv4().replace(/\-/g, '');
    if (!fs.existsSync(imagePath2)) {
      fs.mkdirSync(imagePath2, { recursive: true });
    }
  }
  // 头像
  avatar = avatar.replace(/^data:image\/\w+;base64,/, '');
  imageBuffer = Buffer.from(avatar, 'base64');
  match = avatar.match(/^data:image\/(\w+);base64,/);
  imageType = match ? match[1] : 'png';
  imagePath = `${path.join(CONFIG.root, CONFIG.appPath, 'cdn/post_author_avatar/')}${moment().format('YYYYMMDD')}/`;
  imageName = uuidv4().replace(/\-/g, '');
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath, { recursive: true });
  }
  try {
    let coverUrl, avatarUrl;
    if (cover) {
      // 封面
      fs.writeFileSync(imagePath2 + imageName2 + '.' + imageType2, imageBuffer2);
      coverUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + imagePath2.split(CONFIG.appPath).pop() + imageName2 + '.' + imageType2;
    } else {
      coverUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + '/cdn/post_author_cover/default.png';
    }
    // 头像
    fs.writeFileSync(imagePath + imageName + '.' + imageType, imageBuffer);
    avatarUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + imagePath.split(CONFIG.appPath).pop() + imageName + '.' + imageType;
    const exist = await ctx.execSql(`SELECT COUNT(*) as count FROM sm_board_author WHERE name = '${name}'`);
    if (exist[0].count > 0) {
      ctx.error(ctx, 607);
    } else {
      const id = uuidv4().replace(/\-/g, '');
      let sql = `INSERT INTO sm_board_author (id, name, nick, avatarUrl, coverUrl, description, gender, managementPassword, appPassword,type,friendCount,articleCount,fansCount,score,createTime) 
                VALUES ('${id}', '${name}', '${nick}', '${avatarUrl}' ,'${coverUrl}' ,'${description}' ,${gender},'${managementPassword}','${appPassword}',0,0,0,0,0,${new Date().getTime()})`;
      await ctx.execSql(sql);
      ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const removePostAuthor = async (ctx): Promise<void> => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let sql = `DELETE FROM sm_board_author WHERE id = '${id}'`;
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
