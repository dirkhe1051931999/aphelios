import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import CONFIG from 'src/config';
import moment from 'moment';
// 获取所有文章类别
export const getAllSheet = async (ctx) => {
  let sql = `SELECT id, name, cover,description FROM sm_board_sheet`;
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
export const getAllDirectory = async (ctx) => {
  let sql = `SELECT id, name, subName,todayPostCount, type, parent_id FROM sm_board_directory`;
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
export const getAllChildDirectory = async (ctx) => {
  let sql = `SELECT id, name, subName, type, parent_id FROM sm_board_child_directory`;
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
export const addSheet = async (ctx) => {
  let { name, cover, description } = ctx.request.body;
  if (ctx.isFalsy([name, cover, description])) {
    ctx.error(ctx, '404#name, cover, description');
    return;
  }
  cover = cover.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(cover, 'base64');
  const match = cover.match(/^data:image\/(\w+);base64,/);
  const imageType = match ? match[1] : 'png';
  const imagePath = `${path.join(CONFIG.root, CONFIG.appPath, 'cdn/sheet_directory_image/')}${moment().format('YYYYMMDD')}/`;
  const imageName = uuidv4().replace(/\-/g, '');
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath, { recursive: true });
  }
  try {
    fs.writeFileSync(imagePath + imageName + '.' + imageType, imageBuffer);
    const coverUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + imagePath.split(CONFIG.appPath).pop() + imageName + '.' + imageType;
    const exist = await ctx.execSql(`SELECT COUNT(*) as count FROM sm_board_sheet WHERE name = '${name}'`);
    if (exist[0].count > 0) {
      ctx.error(ctx, 607);
    } else {
      const id = uuidv4().replace(/\-/g, '');
      let sql = `INSERT INTO sm_board_sheet (id, name, cover, description) VALUES ('${id}', '${name}', '${coverUrl}', '${description}')`;
      await ctx.execSql(sql);
      ctx.success(ctx, {
        id,
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const addDirectory = async (ctx) => {
  let { name, subName, type, parent_id } = ctx.request.body;
  if (ctx.isFalsy([name, subName, type, parent_id])) {
    ctx.error(ctx, '404#name, subName, type, parent_id');
    return;
  }
  try {
    const exist = await ctx.execSql(`SELECT COUNT(*) as count FROM sm_board_directory WHERE name = '${name}'`);
    if (exist[0].count > 0) {
      ctx.error(ctx, 607);
    } else {
      const id = uuidv4().replace(/\-/g, '');
      let sql = `INSERT INTO sm_board_directory (id, name, subName, type, parent_id) VALUES ('${id}', '${name}', '${subName}', ${type}, '${parent_id}')`;
      await ctx.execSql(sql);
      ctx.success(ctx, {
        id,
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const addChildDirectory = async (ctx) => {
  let { name, subName, type, parent_id } = ctx.request.body;
  if (ctx.isFalsy([name, subName, type, parent_id])) {
    ctx.error(ctx, '404#name, subName, type, parent_id');
    return;
  }
  try {
    const exist = await ctx.execSql(`SELECT COUNT(*) as count FROM sm_board_child_directory WHERE name = '${name}'`);
    if (exist[0].count > 0) {
      ctx.error(ctx, 607);
    } else {
      const id = uuidv4().replace(/\-/g, '');
      let sql = `INSERT INTO sm_board_child_directory (id, name, subName, type, parent_id) VALUES ('${id}', '${name}', '${subName}', ${type}, '${parent_id}')`;
      await ctx.execSql(sql);
      ctx.success(ctx, {
        id,
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const removeSheet = async (ctx) => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let sql = `DELETE FROM sm_board_sheet WHERE id = '${id}'`;
    await ctx.execSql(sql);
    ctx.success(ctx);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const removeDirectory = async (ctx) => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let sql = `DELETE FROM sm_board_directory WHERE id = '${id}'`;
    await ctx.execSql(sql);
    ctx.success(ctx);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const removeChildDirectory = async (ctx) => {
  let { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    let sql = `DELETE FROM sm_board_child_directory WHERE id = '${id}'`;
    await ctx.execSql(sql);
    ctx.success(ctx);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const updateSheet = async (ctx) => {
  let { id, name, cover, description } = ctx.request.body;
  if (ctx.isFalsy([id, name, cover, description])) {
    ctx.error(ctx, '404#id, name, cover, description');
    return;
  }
  try {
    let coverUrl = '';
    if (cover.indexOf('data:image') > -1) {
      cover = cover.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(cover, 'base64');
      const match = cover.match(/^data:image\/(\w+);base64,/);
      const imageType = match ? match[1] : 'png';
      const imagePath = `${path.join(CONFIG.root, CONFIG.appPath, 'cdn/sheet_directory_image/')}${moment().format('YYYYMMDD')}/`;
      const imageName = uuidv4().replace(/\-/g, '');
      if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath, { recursive: true });
      }
      fs.writeFileSync(imagePath + imageName + '.' + imageType, imageBuffer);
      coverUrl = CONFIG.defaultCdnUrl.split('/cdn')[0] + imagePath.split(CONFIG.appPath).pop() + imageName + '.' + imageType;
    } else {
      coverUrl = cover;
    }
    let sql = `UPDATE sm_board_sheet SET name = '${name}', cover = '${coverUrl}', description = '${description}' WHERE id = '${id}'`;
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const updateDirectory = async (ctx) => {
  let { id, name, subName } = ctx.request.body;
  if (ctx.isFalsy([id, name, subName])) {
    ctx.error(ctx, '404#id, name, subName');
    return;
  }
  try {
    let sql = `UPDATE sm_board_directory SET name = '${name}', subName = '${subName}' WHERE id = '${id}'`;
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const updateChildDirectory = async (ctx) => {
  let { id, name, subName } = ctx.request.body;
  if (ctx.isFalsy([id, name, subName])) {
    ctx.error(ctx, '404#id, name, subName');
    return;
  }
  try {
    let sql = `UPDATE sm_board_child_directory SET name = '${name}', subName = '${subName}' WHERE id = '${id}'`;
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
