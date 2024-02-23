import {
  addPrefixToFields,
  isFieldFile,
  removePrefixFromFields,
  uploadBase64FileToMinio,
  uploadFileToMinio,
} from '../../../util/helper';
import { v4 as uuidv4 } from 'uuid';
import { fileToBase64 } from '../../../util/helper';
import fs from 'fs';
// 查询所有作者
export const getAllPostAuthor = async (ctx): Promise<void> => {
  let sql = `SELECT id, name, coverUrl, followCount, status, avatarUrl, articleCount, fansCount, type, nick, score, createTime,updateTime,loginTime,companyVerifyInfoId, defaultUser,description 
  FROM sm_board_author 
  ORDER BY createTime DESC;`;
  try {
    let results = await ctx.execSql(sql);
    ctx.success(ctx, {
      pageData: addPrefixToFields(results),
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 添加作者
export const addPostAuthor = async (ctx): Promise<void> => {
  let avatarUrl, coverUrl;
  const { avatar, cover } = await isFieldFile(ctx, ['avatar', 'cover']);
  const { name, nick, description, type, managementPassword, appPassword } = ctx.request.query;
  const avatarResult = await fileToBase64(avatar.value);
  const coverResult = await fileToBase64(cover.value);
  const { url: avatarUrlResult } = await uploadBase64FileToMinio(avatarResult, 'assets/post-author');
  const { url: coverUrlResult } = await uploadBase64FileToMinio(coverResult, 'assets/post-author');
  avatarUrl = avatarUrlResult;
  coverUrl = coverUrlResult;
  fs.unlinkSync(avatar.value);
  fs.unlinkSync(cover.value);
  try {
    const exist = await ctx.execSql(`SELECT COUNT(*) as count FROM sm_board_author WHERE name = '${name}'`);
    if (exist[0].count > 0) {
      ctx.error(ctx, 607);
    } else {
      const id = uuidv4().replace(/\-/g, '');
      let sql = `INSERT INTO sm_board_author (id, name, nick, avatarUrl, coverUrl, description, type, managementPassword, appPassword,status,followCount,articleCount,fansCount,score,createTime)
                VALUES ('${id}', '${name}', '${nick}', '${avatarUrl}' ,'${coverUrl}' ,'${description}' ,${type}, '${managementPassword}', '${appPassword}', ${
        type === 1 ? 0 : 2
      },0,0,0,0,${new Date().getTime()})`;
      await ctx.execSql(sql);
      ctx.success(ctx, { id });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
// 更新作者
export const updatePostAuthor = async (ctx): Promise<void> => {
  let avatarUrl, coverUrl;
  const { avatar, cover } = await isFieldFile(ctx, ['avatar', 'cover']);
  const { id, nick, description } = ctx.request.query;
  if (avatar.type === 'file') {
    const result = await fileToBase64(avatar.value);
    const { url } = await uploadBase64FileToMinio(result, 'assets/post-author');
    avatarUrl = url;
    fs.unlinkSync(avatar.value);
  } else {
    avatarUrl = avatar.value;
  }
  if (cover.type === 'file') {
    const result = await fileToBase64(cover.value);
    const { url } = await uploadBase64FileToMinio(result, 'assets/post-author');
    coverUrl = url;
    fs.unlinkSync(cover.value);
  } else {
    coverUrl = cover.value;
  }
  try {
    avatarUrl = removePrefixFromFields(avatarUrl);
    coverUrl = removePrefixFromFields(coverUrl);
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
            DELETE FROM sm_board_audit_author_approval WHERE authorId = author_id;
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
    const { url, data } = await uploadFileToMinio(ctx, true, null);
    const { companyName, companyCode, companyType, authorId } = data;
    const haveAuthor = await ctx.execSql(`SELECT COUNT(*) as count FROM sm_board_audit_author_approval WHERE authorId = '${authorId}'`);
    if (haveAuthor[0].count > 0) {
      ctx.error(ctx, 608);
      return;
    }
    const id = uuidv4().replace(/\-/g, '');
    await ctx.execSql(`
      INSERT INTO sm_board_audit_author_approval (id, authorId, companyName, companyCode, companyType, companyLicense, status, createTime)
      VALUES ('${id}', '${authorId}', '${companyName}', '${companyCode}', '${companyType}', '${url}', 0, ${new Date().getTime()});
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
    let result = await ctx.execSql(`SELECT * FROM sm_board_audit_author_approval WHERE authorId = '${authorId}'`);
    result = addPrefixToFields(result);
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
    const result = await ctx.execSql(`SELECT * FROM sm_board_audit_author_approval WHERE authorId = '${authorId}'`);
    if (result[0]) {
      await ctx.execSql(`DELETE FROM sm_board_audit_author_approval WHERE authorId = '${authorId}'`);
      await ctx.execSql(`UPDATE sm_board_author SET companyVerifyInfoId = NULL, status = 2 WHERE id = '${authorId}';`);
    }
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
