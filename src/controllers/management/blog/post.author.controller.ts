import fs from 'fs';
import path from 'path';
import CONFIG from 'src/config';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import * as formidable from 'formidable';
import { mkdirsSync, uploadPDF } from 'src/util/helper';
// 查询所有作者
export const getAllPostAuthor = async (ctx): Promise<void> => {
  let sql = `SELECT id, name, coverUrl, followCount, status, avatarUrl, articleCount, fansCount, type, nick, score, createTime,updateTime,loginTime,companyVerifyInfoId, defaultUser,description 
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
// 添加作者
export const addPostAuthor = async (ctx): Promise<void> => {
  let { name, nick, avatar, cover, description, type, managementPassword, appPassword } = ctx.request.body;
  if (ctx.isFalsy([name, nick, avatar, description, type, managementPassword, appPassword])) {
    ctx.error(ctx, '404#name, nick, avatar, description, type, managementPassword, appPassword');
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
      let sql = `INSERT INTO sm_board_author (id, name, nick, avatarUrl, coverUrl, description, type, managementPassword, appPassword,status,followCount,articleCount,fansCount,score,createTime) 
                VALUES ('${id}', '${name}', '${nick}', '${avatarUrl}' ,'${coverUrl}' ,'${description}' ,${type},'${managementPassword}','${appPassword}',${
        type === 1 ? 0 : 2
      },0,0,0,0,${new Date().getTime()})`;
      await ctx.execSql(sql);
      ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 更新作者
export const updatePostAuthor = async (ctx): Promise<void> => {
  let { id, nick, avatar, cover, description } = ctx.request.body;
  if (ctx.isFalsy([id, nick, avatar, description])) {
    ctx.error(ctx, '404#id, name, nick, avatar, description, type');
    return;
  }
  let imageBuffer, imageBuffer2, match, match2, imageType, imageType2, imagePath, imagePath2, imageName, imageName2;
  const reg = /^data:image\/(\w+);base64,/;
  if (reg.test(cover)) {
    // 封面
    cover = cover.replace(/^data:image\/\w+;base64,/, '');
    imageBuffer2 = Buffer.from(cover, 'base64');
    match2 = cover.match(reg);
    imageType2 = match2 ? match2[1] : 'png';
    imagePath2 = `${path.join(CONFIG.root, CONFIG.appPath, 'cdn/post_author_cover/')}${moment().format('YYYYMMDD')}/`;
    imageName2 = uuidv4().replace(/\-/g, '');
    if (!fs.existsSync(imagePath2)) {
      fs.mkdirSync(imagePath2, { recursive: true });
    }
  }
  if (reg.test(avatar)) {
    // 头像
    avatar = avatar.replace(/^data:image\/\w+;base64,/, '');
    imageBuffer = Buffer.from(avatar, 'base64');
    match = avatar.match(reg);
    imageType = match ? match[1] : 'png';
    imagePath = `${path.join(CONFIG.root, CONFIG.appPath, 'cdn/post_author_avatar/')}${moment().format('YYYYMMDD')}/`;
    imageName = uuidv4().replace(/\-/g, '');
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }
  }
  try {
    let coverUrl, avatarUrl;
    if (!cover) {
      coverUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + '/cdn/post_author_cover/default.png';
    } else if (cover.indexOf('http://') === -1) {
      // 封面
      fs.writeFileSync(imagePath2 + imageName2 + '.' + imageType2, imageBuffer2);
      coverUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + imagePath2.split(CONFIG.appPath).pop() + imageName2 + '.' + imageType2;
    } else {
      coverUrl = cover;
    }
    if (avatar.indexOf('http://') === -1) {
      // 头像
      fs.writeFileSync(imagePath + imageName + '.' + imageType, imageBuffer);
      avatarUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + imagePath.split(CONFIG.appPath).pop() + imageName + '.' + imageType;
    } else {
      avatarUrl = avatar;
    }
    const sql = `
    UPDATE sm_board_author
    SET nick = '${nick}', 
        avatarUrl = '${avatarUrl}', 
        coverUrl = '${coverUrl}', 
        description = '${description}', 
        updateTime = ${new Date().getTime()}
    WHERE id = '${id}';        
    `;
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 删除作者
export const removePostAuthor = async (ctx): Promise<void> => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let sql = `
    
    CREATE PROCEDURE delete_author(IN author_id CHAR(36))
    BEGIN
        DECLARE author_type INT;
        SELECT type INTO author_type FROM sm_board_author WHERE id = author_id;
        IF author_type = 1 THEN
            DELETE FROM sm_board_author WHERE id = author_id;
        ELSE
            DELETE FROM sm_board_company_verify_info WHERE authorId = author_id;
            DELETE FROM sm_board_author WHERE id = author_id;
        END IF;
    END
    `;
    await ctx.execSql('DROP PROCEDURE IF EXISTS delete_author;');
    await ctx.execSql(sql);
    await ctx.execSql(`CALL delete_author('${id}')`);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 进行企业认证
export const verifyCompanyAuthor = async (ctx): Promise<void> => {
  try {
    const result = await uploadPDF(ctx);
    const pdfUrl = result[0];
    const { companyName, companyCode, companyType, authorId } = result[1];
    const haveAuthor = await ctx.execSql(`SELECT COUNT(*) as count FROM sm_board_company_verify_info WHERE authorId = '${authorId}'`);
    if (haveAuthor[0].count > 0) {
      ctx.error(ctx, 608);
      return;
    }
    const id = uuidv4().replace(/\-/g, '');
    await ctx.execSql(`
      INSERT INTO sm_board_company_verify_info (id, authorId, companyName, companyCode, companyType, companyLicense, status, createTime)
      VALUES ('${id}', '${authorId}', '${companyName}', '${companyCode}', '${companyType}', '${pdfUrl}', 0, ${new Date().getTime()});
      `);
    await ctx.execSql(`UPDATE sm_board_author SET companyVerifyInfoId = '${id}', status = 3 WHERE id = '${authorId}';`);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 获取企业认证信息
export const getCompanyAuthorVerifyInfo = async (ctx): Promise<void> => {
  try {
    const { authorId } = ctx.request.body;
    if (ctx.isFalsy([authorId])) {
      ctx.error(ctx, '404#authorId');
      return;
    }
    const result = await ctx.execSql(`SELECT * FROM sm_board_company_verify_info WHERE authorId = '${authorId}'`);
    ctx.success(ctx, result[0]);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 删除企业认证申请
export const removeCompanyAuthorVerify = async (ctx): Promise<void> => {
  try {
    const { authorId } = ctx.request.body;
    if (ctx.isFalsy([authorId])) {
      ctx.error(ctx, '404#authorId');
      return;
    }
    const result = await ctx.execSql(`SELECT * FROM sm_board_company_verify_info WHERE authorId = '${authorId}'`);
    if (result[0]) {
      await ctx.execSql(`DELETE FROM sm_board_company_verify_info WHERE authorId = '${authorId}'`);
      await ctx.execSql(`UPDATE sm_board_author SET companyVerifyInfoId = NULL, status = 2 WHERE id = '${authorId}';`);
    }
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
