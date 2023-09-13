import { uploadBase64FileToMinio } from 'src/util/helper';
import { v4 as uuidv4 } from 'uuid';
// 获取所有文章类别
export const getAllSheet = async (ctx) => {
  let sql = `SELECT id, name, cover,description,visible FROM sm_board_sheet`;
  try {
    let results = await ctx.execSql(sql);
    results = results.map((item) => {
      return {
        ...item,
        post_count: 0,
      };
    });
    ctx.success(ctx, {
      pageData: results,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
export const getAllDirectory = async (ctx) => {
  let sql = `
  SELECT d.id, d.name, d.subName, d.todayPostCount, d.type, d.parent_id, COUNT(p.id) as post_count 
  FROM sm_board_directory d
  LEFT JOIN sm_board_post_list p ON d.id = p.directoryId
  GROUP BY d.id, d.name, d.subName, d.todayPostCount, d.type, d.parent_id
  `;
  // let sql2 = `
  // SELECT p.title, p.directoryId, p.view,p.channelId,p.comment,p.createTime,p.status,p.id
  // FROM sm_board_directory d
  // LEFT JOIN sm_board_post_list p ON d.id = p.directoryId
  // `;
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
  let sql = `
  SELECT cd.id, cd.name, cd.subName, cd.type, cd.parent_id, COUNT(p.id) as post_count
  FROM sm_board_child_directory cd
  LEFT JOIN sm_board_post_list p ON cd.id = p.directoryId
  GROUP BY cd.id, cd.name, cd.subName, cd.type, cd.parent_id
  `;
  // let sql2 = `
  // SELECT p.title, p.directoryId, p.view,p.channelId,p.comment,p.createTime,p.status,p.id
  // FROM sm_board_child_directory cd
  // LEFT JOIN sm_board_post_list p ON cd.id = p.directoryId
  // `;
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
  let { name, cover, description, visible } = ctx.request.body;
  if (ctx.isFalsy([name, cover, description, visible])) {
    ctx.error(ctx, '404#name, cover, description,visible');
    return;
  }
  try {
    const { url } = await uploadBase64FileToMinio(cover, 'assets');
    const coverUrl = url;
    const exist = await ctx.execSql(`SELECT COUNT(*) as count FROM sm_board_sheet WHERE name = '${name}'`);
    if (exist[0].count > 0) {
      ctx.error(ctx, 607);
    } else {
      const id = uuidv4().replace(/\-/g, '');
      let sql = `INSERT INTO sm_board_sheet (id, name, cover, description,visible) VALUES ('${id}', '${name}', '${coverUrl}', '${description}' , '${visible}')`;
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
  let { id, name, cover, description, visible } = ctx.request.body;
  if (ctx.isFalsy([id, name, cover, description, visible])) {
    ctx.error(ctx, '404#id, name, cover, description,visible');
    return;
  }
  try {
    let coverUrl = '';
    if (cover.indexOf('data:image') > -1) {
      const { url } = await uploadBase64FileToMinio(cover, 'assets');
      coverUrl = url;
    } else {
      coverUrl = cover;
    }
    let sql = `UPDATE sm_board_sheet SET name = '${name}', cover = '${coverUrl}', description = '${description}', visible = '${visible}' WHERE id = '${id}'`;
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
