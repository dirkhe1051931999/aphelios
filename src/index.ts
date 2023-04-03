import Koa from "koa";
import views from "koa-views";
import path from "path";
import bodyParser from "koa-bodyparser";
import resource from "koa-static";
import koaJson from "koa-json";
import cors from "koa2-cors";
import session from "koa-session2";
import staticCache from "koa-static-cache";
import CONFIG from "src/config";
import query from "./util/mysql-async";
import { registerRoutes } from "./routes/index";
import { success, error } from "src/util/ctx-response";
import tokenError from "./middlreware/tokenError";
import RedisStore from "./util/redis-store";
import RedisDB from "./util/redis-db";
import { hasEmptyValue } from "./util/helper";
const app = new Koa();

// 扩展 Context 接口
declare module "koa" {
  interface Context {
    success(ctx: Context, data: any): void;
    error(ctx: Context, code: number | string): void;
    isFalsy(data: any[]): boolean;
    serializeObject(data: any): any;
  }
}
/* 跨域配置 */
app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept", "Language"],
  })
);
/* Koa 应用程序中间件，用于解析 HTTP 请求正文并将其放入 ctx.request.body 中 */
app.use(bodyParser());
/* 将 JavaScript 对象转换为 JSON 格式的响应。它的作用是简化 Koa 应用程序中的 JSON 响应的处理过程 */
app.use(koaJson());
/* 静态资源文件 */
app.use(resource(path.join(CONFIG.root, CONFIG.appPath)));
/* 缓存邮件模板 */
app.use(
  staticCache(path.join(__dirname, "templates"), {
    maxAge: 365 * 24 * 60 * 60,
  })
);
// session token
app.use(
  session({
    store: new RedisStore(CONFIG.db.redis),
    maxAge: 24 * 60 * 60 * 1000, // 默认会话过期时间，单位为毫秒
  })
);
/* 配置模板引擎 */
app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);
/* response 封装 */
app.use(async (ctx, next) => {
  ctx.success = success.bind(null, ctx);
  ctx.error = error.bind(null, ctx);
  await next();
});
/* 注册一下全局函数 */
app.use(async (ctx, next) => {
  /* redis缓存初始化 */
  ctx.redisDB = new RedisDB(CONFIG.db.redis);
  /* ctx.execSql 来执行SQL操作 */
  ctx.execSql = query;
  /* 是否是假值 */
  ctx.isFalsy = hasEmptyValue;
  await next();
});
/* token 拦截 */
app.use(tokenError());
/* 注册路由 */
registerRoutes(app, path.join(__dirname, "./api"));
/* 一个中间件函数，用于处理未匹配到的请求，通常情况下，应该将 router.allowedMethods() 放在所有的路由定义之后，以便处理所有未匹配到的请求。 */
// app.use(router.allowedMethods());
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
