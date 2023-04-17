import { v4 as uuidv4 } from 'uuid';
// 获取所有文章类别
export const getAllChannel = async (ctx) => {
  let sql = `SELECT id, name, pos FROM sm_board_channel ORDER BY pos ASC;`;
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
export const updateChannelPos = async (ctx) => {
  const { diff } = ctx.request.body;
  const sql = [];
  for (let item of diff) {
    sql.push(`UPDATE sm_board_channel SET pos = ${item.pos} WHERE id = '${item.id}';`);
  }
  if (ctx.isFalsy([diff])) {
    ctx.error(ctx, '404#diff');
    return;
  }
  try {
    await ctx.execSql(sql);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const updateChannelName = async (ctx) => {
  const { id, name } = ctx.request.body;
  if (ctx.isFalsy([id, name])) {
    ctx.error(ctx, '404#id, name');
    return;
  }
  try {
    await ctx.execSql([
      `
      UPDATE sm_board_channel 
      SET name = '${name}'
      WHERE id = '${id}';`,
    ]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const addChannel = async (ctx) => {
  const { name } = ctx.request.body;
  if (ctx.isFalsy([name])) {
    ctx.error(ctx, '404#name');
    return;
  }
  try {
    await ctx.execSql('CREATE TEMPORARY TABLE tmp_table (next_pos INT NOT NULL) ENGINE=MEMORY;');
    const [rows] = await ctx.execSql('SELECT IFNULL(MAX(pos), 0) + 1 AS next_pos FROM sm_board_channel FOR UPDATE;');
    await ctx.execSql(`INSERT INTO tmp_table (next_pos) VALUES (${rows.next_pos});`);
    await ctx.execSql(`
      INSERT INTO sm_board_channel (id, name, pos)
      SELECT '${uuidv4().replace(/-/g, '')}', '${name}', next_pos
      FROM tmp_table;
    `);
    await ctx.execSql('DROP TABLE tmp_table;');
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
export const removeChannel = async (ctx) => {
  const { id } = ctx.request.body;
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    await ctx.execSql([`DELETE FROM sm_board_channel WHERE id = '${id}';`]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
