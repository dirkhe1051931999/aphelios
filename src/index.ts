import Koa from "koa";
import Router from "koa-router";
import path from "path";
import bodyParser from "koa-bodyparser";
import CONFIG from "src/config";
import query from "./util/mysql-async";
import { registerRoutes } from "./routes/index";
const router = new Router();
const app = new Koa();

/* Koa 应用程序中间件，用于解析 HTTP 请求正文并将其放入 ctx.request.body 中 */
app.use(bodyParser());
/* ctx.execSql 来执行SQL操作 */
app.use(async (ctx, next) => {
  ctx.execSql = query;
  ctx.set("Access-Control-Allow-Origin", CONFIG.accessControlAllowOrigin);
  await next();
});
app.use(router.routes());
registerRoutes(app, path.join(__dirname, "./api"));
/* 一个中间件函数，用于处理未匹配到的请求，通常情况下，应该将 router.allowedMethods() 放在所有的路由定义之后，以便处理所有未匹配到的请求。 */
app.use(router.allowedMethods());
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
