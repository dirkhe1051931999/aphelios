import { uploadBase64FileToMinio, uploadFileToMinio } from 'src/util/helper';
import { v4 as uuidv4 } from 'uuid';
import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';
const CATEGORYOPTIONS = [];
export const getAllCover = async (ctx): Promise<void> => {
  try {
    let { categoryIds, page, rowsPerPage } = ctx.request.body;
    categoryIds = categoryIds || [];
    page = page || 1;
    rowsPerPage = rowsPerPage || 20;
    let whereClause = '';
    if (categoryIds.length > 0) {
      const categoryConditions = categoryIds.map((id) => `JSON_CONTAINS(category, '${id}')`).join(' OR ');
      whereClause = `WHERE ${categoryConditions}`;
    }
    const offset = (page - 1) * rowsPerPage;
    const countQuery = `SELECT COUNT(*) as total FROM sm_board_cover_lib ${whereClause}`;
    const dataQuery = `SELECT * FROM sm_board_cover_lib ${whereClause} LIMIT ${rowsPerPage} OFFSET ${offset};`;
    const results = await ctx.execSql([countQuery, dataQuery]);
    return ctx.success(ctx, {
      pageData: results[1],
      total: results[0][0].total,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};

export const addCover = async (ctx): Promise<void> => {
  try {
    const { title, description, categoryIds, file } = ctx.request.body;
    const fileData = await uploadBase64FileToMinio(file, 'assets/cover_lib');
    const id = uuidv4().replace(/\-/g, '');
    const sql = `INSERT INTO sm_board_cover_lib (id, title, description, category, source, createTime) VALUES ('${id}', '${title}', '${description}', '${JSON.stringify(categoryIds)}', '${
      fileData.url
    }', ${new Date().getTime()})`;
    await ctx.execSql(sql);
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

export const updateCover = async (ctx): Promise<void> => {
  try {
    const { id, title, description, categoryIds, file } = ctx.request.body;
    const sql = `UPDATE sm_board_cover_lib SET title='${title}', description='${description}', category='${JSON.stringify(
      categoryIds
    )}', source='${file}', updateTime=${new Date().getTime()} WHERE id='${id}'`;
    await ctx.execSql(sql);
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

export const deleteCover = async (ctx): Promise<void> => {
  try {
    const { id } = ctx.request.body;
    const sql = `DELETE FROM sm_board_cover_lib WHERE id='${id}'`;
    await ctx.execSql(sql);
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

const parseFileInfo = (fileName) => {
  const [_fileName, title, description = uuidv4().replace(/\-/g, '')] = fileName.split('.')[0].split('&');
  const _categoryList = _fileName.split('-');
  const _categoryItem = _categoryList.map((item) => CATEGORYOPTIONS.find((option) => String(option.id) === item) || null);

  return {
    category: _categoryItem[0] ? _categoryItem.map((item) => item.id) : [5],
    title: title || uuidv4().replace(/\-/g, ''),
    description,
  };
};
const processFileEntry = async (entry, ctx) => {
  const fileName = path.basename(entry.path);
  const [baseName, fileExtension] = fileName.split('.');
  if (fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
    entry.autodrain();
    return;
  }
  const { category, title, description } = parseFileInfo(baseName);
  let chunks = [];
  entry.on('data', (chunk) => chunks.push(chunk));
  entry.on('end', async () => {
    const buffer = Buffer.concat(chunks);
    const base64Image = buffer.toString('base64');
    const fileData = await uploadBase64FileToMinio(base64Image, 'assets/cover_lib');
    const url = fileData.url;
    const sql = `INSERT INTO sm_board_cover_lib (id, title, description, category, source, createTime) VALUES ('${uuidv4().replace(/\-/g, '')}', '${title}', '${description}', '${JSON.stringify(
      category
    )}', '${url}', ${new Date().getTime()})`;
    await ctx.execSql(sql);
  });
};
export const batchAddCover = async (ctx) => {
  try {
    const file = ctx.req.file;
    const sql = `SELECT * FROM sm_board_cover_lib_category`;
    const results = await ctx.execSql(sql);
    CATEGORYOPTIONS.length = 0;
    CATEGORYOPTIONS.push(...results);
    fs.createReadStream(file.path)
      .pipe(unzipper.Parse())
      .on('entry', function (entry) {
        const type = entry.type;
        if (type === 'File') {
          processFileEntry(entry, ctx).catch((error) => {
            console.error(`Error processing file ${entry.path}: ${error}`);
            entry.autodrain(); // 在错误情况下确保资源被清理
          });
        } else {
          entry.autodrain();
        }
      })
      .on('finish', () => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Error deleting temporary file ${file.path}: ${err}`);
            console.error('File path:', file.path);
          }
        });
        return ctx.success(ctx, {});
      });

    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

export const batchDelteCover = async (ctx): Promise<void> => {
  try {
    const { idList } = ctx.request.body;
    const sql = `DELETE FROM sm_board_cover_lib WHERE id IN (${idList.map((id) => `'${id}'`).join(',')})`;
    await ctx.execSql(sql);
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

export const addCategory = async (ctx): Promise<void> => {
  try {
    const { label, id } = ctx.request.body;
    // 如果id对应的category不存在，则新增
    const sql1 = `SELECT * FROM sm_board_cover_lib_category WHERE id=${id}`;
    const results = await ctx.execSql(sql1);
    if (results.length === 0) {
      const sql2 = `INSERT INTO sm_board_cover_lib_category (label, \`default\`) VALUES ('${label}', 0)`;
      await ctx.execSql(sql2);
    } else {
      const sql = `UPDATE sm_board_cover_lib_category SET label='${label}' WHERE id=${id}`;
      await ctx.execSql(sql);
    }
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

export const queryCategory = async (ctx): Promise<void> => {
  try {
    const sql = `SELECT * FROM sm_board_cover_lib_category`;
    const results = await ctx.execSql(sql);
    return ctx.success(ctx, results);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};

export const deleteCategory = async (ctx): Promise<void> => {
  try {
    const { id } = ctx.request.body;
    const sql = `DELETE FROM sm_board_cover_lib_category WHERE id=${id}`;
    await ctx.execSql(sql);
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
