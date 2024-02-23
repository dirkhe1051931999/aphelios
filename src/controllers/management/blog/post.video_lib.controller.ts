import {
  addPrefixToFields,
  formatDate,
  removePrefixFromFields,
  uploadBase64FileToMinio,
  uploadFileToMinio,
} from '../../../util/helper';
import { v4 as uuidv4 } from 'uuid';
import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';
const CATEGORYOPTIONS = [];
export const getAllVideo = async (ctx): Promise<void> => {
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
    const countQuery = `SELECT COUNT(*) as total FROM sm_board_video_lib ${whereClause}`;
    const dataQuery = `SELECT * FROM sm_board_video_lib ${whereClause}  ORDER BY createTime DESC LIMIT ${rowsPerPage} OFFSET ${offset};`;
    const results = await ctx.execSql([countQuery, dataQuery]);
    return ctx.success(ctx, {
      pageData: addPrefixToFields(results[1]),
      total: results[0][0].total,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};

export const addVideo = async (ctx): Promise<void> => {
  try {
    const { url, data } = await uploadFileToMinio(ctx, true, 'assets/video_lib/' + formatDate(+new Date(), 'yyyyMMdd'));
    let { title, description, categoryIds, poster } = data;
    const id = uuidv4().replace(/\-/g, '');
    const sql = `INSERT INTO sm_board_video_lib (id, title, description, category, source, createTime, poster) VALUES ('${id}', '${title}', '${description}', '${categoryIds}', '${url}', ${new Date().getTime()}, '${poster}')`;
    await ctx.execSql(sql);
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

export const updateVideo = async (ctx): Promise<void> => {
  try {
    let { id, title, description, categoryIds, file, poster } = ctx.request.body;
    if (ctx.isFalsy([id, title, description, categoryIds, file, poster])) {
      ctx.error(ctx, '404#id,title,description,categoryIds,file,poster');
      return;
    }
    poster = removePrefixFromFields(poster)
    const sql = `UPDATE sm_board_video_lib SET title='${title}', description='${description}', category='${JSON.stringify(
      categoryIds
    )}', source='${file}', updateTime=${new Date().getTime()}, poster='${poster}' WHERE id='${id}'`;
    await ctx.execSql(sql);
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};

export const deleteVideo = async (ctx): Promise<void> => {
  try {
    const { id } = ctx.request.body;
    const sql = `DELETE FROM sm_board_video_lib WHERE id='${id}'`;
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
  if (fileExtension !== 'mp4') {
    entry.autodrain();
    return;
  }
  const { category, title, description } = parseFileInfo(baseName);
  let chunks = [];
  entry.on('data', (chunk) => chunks.push(chunk));
  entry.on('end', async () => {
    const buffer = Buffer.concat(chunks);
    let base64Video = buffer.toString('base64');
    base64Video = `data:video/mp4;base64,${base64Video}`;
    const { url } = await uploadBase64FileToMinio(base64Video, 'assets/video_lib/' + formatDate(+new Date(), 'yyyyMMdd'));
    const sql = `INSERT INTO sm_board_video_lib (id, title, description, category, source, createTime) VALUES ('${uuidv4().replace(/\-/g, '')}', '${title}', '${description}', '${JSON.stringify(
      category,
    )}', '${url}', ${new Date().getTime()})`;
    await ctx.execSql(sql);
  });
};
export const batchAddVideo = async (ctx) => {
  try {
    const file = ctx.req.file;
    const sql = `SELECT * FROM sm_board_video_lib_category`;
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

export const batchDelteVideo = async (ctx): Promise<void> => {
  try {
    const { idList } = ctx.request.body;
    const sql = `DELETE FROM sm_board_video_lib WHERE id IN (${idList.map((id) => `'${id}'`).join(',')})`;
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
    const sql1 = `SELECT * FROM sm_board_video_lib_category WHERE id=${id}`;
    const results = await ctx.execSql(sql1);
    if (results.length === 0) {
      const sql2 = `INSERT INTO sm_board_video_lib_category (label, \`default\`) VALUES ('${label}', 0)`;
      await ctx.execSql(sql2);
    } else {
      const sql = `UPDATE sm_board_video_lib_category SET label='${label}' WHERE id=${id}`;
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
    const sql = `SELECT * FROM sm_board_video_lib_category`;
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
    // 如果id 对应的sm_board_video_lib中有数据，则不允许删除
    const sql1 = `SELECT * FROM sm_board_video_lib WHERE JSON_CONTAINS(category, '${id}')`;
    const sql2 = `DELETE FROM sm_board_video_lib_category WHERE id=${id}`;
    const results = await ctx.execSql(sql1);
    if (results.length > 0) {
      return ctx.error(ctx, 801);
    }
    await ctx.execSql(sql2);
    return ctx.success(ctx, {});
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
