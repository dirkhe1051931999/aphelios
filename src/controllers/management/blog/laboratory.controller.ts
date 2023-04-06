import { uploadFile } from "src/util/helper";
import moment from "moment";
// 获取个人项目
export const getItems = async (ctx) => {
  let sql = `SELECT * FROM laboratory ORDER BY createTime desc`;
  try {
    let results = await ctx.execSql(sql);
    ctx.body = {
      success: 1,
      message: "",
      laboratories: results.length > 0 ? results : [],
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: "查询数据出错",
    };
  }
};
// 添加个人项目
export const createNewItem = async (ctx) => {
  let result;
  try {
    result = await uploadFile(ctx);
    let fields = result.fields;
    let laboratory = {
      name: fields.name,
      link: fields.link,
      github: fields.github,
      description: fields.description,
      poster: result.filePath,
      createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    let insert = await ctx.execSql("INSERT INTO laboratory SET ?", laboratory);
    if (insert.affectedRows > 0) {
      ctx.body = {
        success: 1,
        id: insert.insertId,
        poster: laboratory.poster,
      };
    } else {
      ctx.body = {
        success: 0,
        message: "创建项目出错",
      };
    }
  } catch (error) {
    console.log("error", error);
    ctx.body = {
      success: 0,
      message: "参数错误",
    };
  }
};
// 更新个人项目
export const updateItem = async (ctx) => {
  let result;
  try {
    result = await uploadFile(ctx);
    console.log(result);
    let fields = result.fields;
    let laboratory = {
      name: fields.name,
      link: fields.link,
      github: fields.github,
      description: fields.description,
      poster: result.filePath,
      createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    let update = await ctx.execSql("UPDATE laboratory SET ? WHERE id = ?", [
      laboratory,
      fields.id,
    ]);
    ctx.body = {
      success: 1,
      poster: laboratory.poster,
    };
  } catch (error) {
    console.log("error", error);
    ctx.body = {
      success: 0,
      message: "参数错误",
    };
  }
};
// 删除个人项目
export const deleteItem = async (ctx) => {
  let id = ctx.params.id || 0;
  console.log(id);
  try {
    let result = await ctx.execSql("DELETE FROM laboratory WHERE id = ?", id);
    ctx.body = {
      success: 1,
    };
  } catch (error) {
    console.log("error", error);
    ctx.body = {
      success: 0,
      message: "删除项目出错",
    };
  }
};