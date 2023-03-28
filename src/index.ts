import Koa from "koa";
import Router from "koa-router";
import views from "koa-views";
import path from "path";
import bodyParser from "koa-bodyparser";
import resource from "koa-static";
import koaJson from "koa-json";
import jwt from "koa-jwt";
import cors from "koa2-cors";
import session from "koa-session2";
import Store from "koa-session2/libs/store";
import CONFIG from "src/config";
import query from "./util/mysql-async";
import { registerRoutes } from "./routes/index";
import { success, error } from "src/util/ctx-response";
import tokenError from "./middlreware/tokenError";
const router = new Router();
const app = new Koa();
// 扩展 Context 接口
declare module "koa" {
  interface Context {
    success(ctx: Context, data: any): void;
    error(ctx: Context, code: number): void;
  }
}
// session
app.use(
  session({
    store: new Store(),
    key: "HJ_SERVICE_SESSION_ID", // cookie 中存储会话 ID 的键名
    maxAge: 7 * 24 * 60 * 60 * 1000, // 会话过期时间，单位为毫秒
  })
);
/* 配置模板引擎 */
app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);
/* jwt */
app.use(
  jwt({
    secret: CONFIG.tokenSecret,
    passthrough: true,
  }).unless({
    path: [
      /^\/management\/blog\/auth*/,
      /^\/web\/blog*/,
      /favicon.ico/,
      /^\/Oauth*/,
    ],
  })
);
/* Koa 应用程序中间件，用于解析 HTTP 请求正文并将其放入 ctx.request.body 中 */
app.use(bodyParser());
/* 将 JavaScript 对象转换为 JSON 格式的响应。它的作用是简化 Koa 应用程序中的 JSON 响应的处理过程 */
app.use(koaJson());
/* 静态资源文件 */
app.use(resource(path.join(CONFIG.root, CONFIG.appPath)));
/* ctx.execSql 来执行SQL操作 */
app.use(async (ctx, next) => {
  ctx.execSql = query;
  ctx.set("Access-Control-Allow-Origin", CONFIG.accessControlAllowOrigin);
  await next();
});
/* response 封装 */
app.use(async (ctx, next) => {
  ctx.success = success.bind(null, ctx);
  ctx.error = error.bind(null, ctx);
  await next();
});
/* 跨域配置 */
app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept", "Language"],
  })
);
// app.use(async (ctx, next) => {
//   ctx.set("Access-Control-Allow-Origin", "*");
//   ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   ctx.set(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   await next();
// });
app.use(router.routes());
registerRoutes(app, path.join(__dirname, "./api"));
/* token 拦截 */
app.use(tokenError("type1"));
app.use(tokenError("type2"));
/* 一个中间件函数，用于处理未匹配到的请求，通常情况下，应该将 router.allowedMethods() 放在所有的路由定义之后，以便处理所有未匹配到的请求。 */
app.use(router.allowedMethods());
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
