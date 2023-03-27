import {
  login,
  signOut,
} from "src/controllers/management/blog/admin.controller";
import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
class Post {}
export class ManagementBlogAuthAPIController {
  /* 以下是登录 */
  @Route("/", HTTP_METHODS.POST)
  async login(ctx: Koa.Context, next: Koa.Next) {
    return login(ctx);
  }
  @Route("/", HTTP_METHODS.GET)
  async signOut(ctx: Koa.Context, next: Koa.Next) {
    return signOut(ctx);
  }
}
