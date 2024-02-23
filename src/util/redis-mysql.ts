import schedule from "node-schedule";
import moment from "moment";
import sqlQuery from "./mysql-async";
import RedisDB from "./redis-db";
import CONFIG from "../config";

const draftPostRedisKey = CONFIG.draftPostRedisKey;

// redis向mysql中写入数据定时任务
export function redisToMysqlTask(): void {
  const redisDB = new RedisDB(CONFIG.db.redis);
  // 每天凌晨3点执行任务
  const rule = new schedule.RecurrenceRule();
  rule.hour = 3;
  rule.minute = 0;
  schedule.scheduleJob(rule, async function () {
    console.log("定时任务开始执行!", moment().format("YYYY-MM-DD HH:mm:ss"));
    const redisPost: any = await redisDB.get(draftPostRedisKey);
    if (redisPost) {
      const redisPostData = JSON.parse(redisPost);
      const sqlPost = {
        postId: redisPostData.id,
        title: redisPostData.title,
        content: redisPostData.content,
        categoryId: redisPostData.categoryId,
        tags: JSON.stringify(redisPostData.tags),
        poster: redisPostData.poster,
        redisKey: "",
      };
      const selectResult = await sqlQuery(
        "SELECT * FROM draft_post_redis WHERE redisKey = ?",
        draftPostRedisKey
      );
      if (selectResult && selectResult.length > 0) {
        console.log("update");
        await sqlQuery("UPDATE draft_post_redis SET ? WHERE id = ?", [
          sqlPost,
          selectResult[0].id,
        ]);
      } else {
        console.log("insert");
        sqlPost.redisKey = draftPostRedisKey;
        await sqlQuery("INSERT INTO draft_post_redis SET ?", sqlPost);
      }
    }
    console.log(
      "redis向mysql中写入数据完成！",
      moment().format("YYYY-MM-DD HH:mm:ss")
    );
  });
}
export async function getDraftPostFromMysql() {
  const selectResult = await sqlQuery(
    "SELECT * FROM draft_post_redis WHERE redisKey = ?",
    draftPostRedisKey
  );
  if (selectResult && selectResult.length > 0) {
    const redisPost = selectResult[0];
    return {
      id: redisPost.postId,
      title: redisPost.title,
      content: redisPost.content,
      categoryId: redisPost.categoryId,
      tags: JSON.parse(redisPost.tags),
      poster: redisPost.poster,
    };
  }
  return {};
}

export async function clearDraftPostOfMysql() {
  await sqlQuery(
    "DELETE FROM draft_post_redis WHERE redisKey = ?",
    draftPostRedisKey
  );
  return true;
}
