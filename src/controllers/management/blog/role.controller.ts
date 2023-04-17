import { Context } from 'koa';
/* 查询所有角色 */
export const getAllRole = async (ctx: Context): Promise<void> => {
  try {
    const results = await ctx.execSql([
      `SELECT COUNT(*) as total FROM role;`,
      `
        SELECT id,name,description,permissionList,createTime,updateTime
        FROM role 
      ;`,
    ]);
    if (results.length) {
      return ctx.success(ctx, {
        pageData: results[1],
        total: results[0][0].total,
      });
    } else {
      return ctx.success(ctx, {
        pageData: [],
        total: 0,
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
/* 查询所有权限 */
export const getAllPermission = async (ctx: Context): Promise<void> => {
  try {
    const results = await ctx.execSql([
      `
        SELECT id,label,value,parent,description
        FROM permission_list
      ;`,
    ]);
    if (results.length) {
      return ctx.success(ctx, {
        pageData: results[0],
      });
    } else {
      return ctx.success(ctx, {
        pageData: [],
      });
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
/* 新增角色 */
export const addRole = async (ctx: Context): Promise<void> => {
  let { name, description, permissionList } = ctx.request.body as {
    name: string;
    permissionList: string[];
    description: string;
  };
  description = description || '';
  permissionList = permissionList || [];
  if (ctx.isFalsy([name, permissionList])) {
    ctx.error(ctx, '404#name, permissionList');
    return;
  }
  let createTime = new Date().getTime();
  let updateTime = createTime;
  try {
    const results = await ctx.execSql([
      `INSERT INTO role (name, permissionList, description, createTime,updateTime) 
      SELECT '${name}', '${JSON.stringify(permissionList)}', '${description}', ${createTime}, ${updateTime} FROM DUAL WHERE NOT EXISTS (
        SELECT 1 FROM role WHERE name = '${name}'
      );`,
    ]);
    if (results[0].affectedRows === 0) {
      ctx.error(ctx, 304);
    } else {
      ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 更新角色 */
export const updateRole = async (ctx: Context): Promise<void> => {
  let { id, description, permissionList } = ctx.request.body as {
    id: number;
    permissionList: string[];
    description: string;
  };
  description = description || '';
  permissionList = permissionList || [];
  if (ctx.isFalsy([id, permissionList])) {
    ctx.error(ctx, '404#id, permissionList');
    return;
  }
  let updateTime = new Date().getTime();
  try {
    await ctx.execSql([
      `
      UPDATE role 
      SET permissionList = '${JSON.stringify(permissionList)}', 
          updateTime = ${updateTime},
          description = '${description}'
      WHERE id = ${id};`,
    ]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/*  删除角色 */
export const deleteRole = async (ctx: Context): Promise<void> => {
  let { id } = ctx.request.body as {
    id: number;
  };
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, '404#id');
    return;
  }
  try {
    await ctx.execSql([
      `
      DELETE FROM role
      WHERE id = ${id};`,
    ]);
    ctx.success(ctx, null);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
