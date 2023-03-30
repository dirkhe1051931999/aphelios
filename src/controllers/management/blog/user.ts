import { Context } from "koa";
import CONFIG from "src/config";
/* 查询所有用户 */
export const getAllUser = async (ctx: Context): Promise<void> => {
  const userName = (ctx.request.body as { userName?: "string" }).userName || "";
  const page = (ctx.request.body as { page?: number }).page || 1;
  const rowsPerPage =
    (ctx.request.body as { rowsPerPage?: number }).rowsPerPage || 20;
  /* 默认page 1， rowsNumber 20 */
  try {
    const results = await ctx.execSql([
      `SELECT COUNT(*) as total FROM user;`,
      `
        SELECT id,userName,avatar,role,createTime,email,updateTime,province,city,ip,description,userType
        FROM user 
        WHERE userName LIKE CONCAT('%', '${userName}', '%') OR NULLIF('${userName}', '') IS NULL 
        ORDER BY id 
        LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}
      ;`,
    ]);
    if (results.length) {
      results[1] = results[1].map((item) => {
        return Object.assign(item, {
          avatarPath: item.avatar,
          avatar:
            item.userType !== 2
              ? CONFIG.defaultCdnUrl + item.avatar
              : item.avatar,
        });
      });
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
/* 新增用户 */
export const addUser = async (ctx: Context): Promise<void> => {
  const {
    userName,
    avatar,
    role,
    email,
    province,
    city,
    ip,
    description,
    userType,
  } = ctx.request.body as {
    userName: string;
    avatar: string;
    role: string;
    email: string;
    province: string;
    city: string;
    ip: string;
    description: string;
    userType: number;
  };
  if (
    ctx.isFalsy([userName, avatar, role, email, province, city, ip, userType])
  ) {
    ctx.error(
      ctx,
      "404#userName, avatar, role, email, province, city, ip, userType"
    );
    return;
  }
  let createTime = new Date().getTime();
  let updateTime = createTime;
  try {
    const results = await ctx.execSql([
      `INSERT INTO user (userName, avatar, role, createTime, email, updateTime, province, city, ip, description,userType) 
      SELECT '${userName}', '${avatar}', '${role}', ${createTime}, '${email}', ${updateTime}, '${province}', '${city}', '${ip}', '${description}',${userType} FROM DUAL WHERE NOT EXISTS (
        SELECT 1 FROM user WHERE userName = '${userName}' OR email = '${email}'
      );`,
    ]);
    if (results[0].affectedRows === 0) {
      ctx.error(ctx, 303);
    } else {
      ctx.success(ctx, null);
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 更新用户 */
export const updateUser = async (ctx: Context): Promise<void> => {
  const { id, avatar, province, city, ip, description } = ctx.request.body as {
    id: number;
    avatar: string;
    province: string;
    city: string;
    ip: string;
    description: string;
  };
  if (ctx.isFalsy([id, avatar, province, city, ip])) {
    ctx.error(ctx, "404#id, avatar, email, province, city, ip");
    return;
  }
  let updateTime = new Date().getTime();
  try {
    const results = await ctx.execSql([
      `SELECT COUNT(*) as count FROM user WHERE id = ${id};`,
      `UPDATE user 
      SET avatar = '${avatar}', 
          updateTime = ${updateTime}, 
          province = '${province}', 
          city = '${city}', 
          ip = '${ip}', 
          description = '${description}'
      WHERE id = ${id};`,
    ]);
    if (results.length) {
      if (results[0][0].count === 0) {
        ctx.error(ctx, 108);
      } else {
        return ctx.success(ctx, null);
      }
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 删除用户 */
export const deleteUser = async (ctx: Context): Promise<void> => {
  const { id } = ctx.request.body as {
    id: number;
  };
  if (ctx.isFalsy([id])) {
    ctx.error(ctx, "404#id");
    return;
  }
  try {
    const results = await ctx.execSql([
      `SELECT COUNT(*) as count FROM user WHERE id = ${id};`,
      `DELETE FROM user WHERE id = ${id};`,
    ]);
    if (results.length) {
      if (results[0][0].count === 0) {
        ctx.error(ctx, 108);
      } else {
        return ctx.success(ctx, null);
      }
    }
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 405);
  }
};
/* 获取所有头像 */
export const getAllAvatar = async (ctx: Context): Promise<void> => {
  try {
    const results = await ctx.execSql([`SELECT name,path FROM avatar;`]);
    const avatarList = results[0].map((item: any) => {
      return {
        name: item.name,
        url: CONFIG.defaultCdnUrl + item.path,
        path: item.path,
      };
    });
    return ctx.success(ctx, {
      pageData: avatarList,
    });
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
