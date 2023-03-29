import {
  changePassword,
  getVerifyCode,
  getUserInfo,
  login,
  signOut,
  forgotPassword,
  checkToken,
  changePasswordWithOutOld,
} from "src/controllers/management/blog/admin.controller";
import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
export class ManagementBlogAuthAPIController {
  /* 以下是登录 */
  @Route("/login", HTTP_METHODS.POST)
  async login(ctx: Koa.Context, next: Koa.Next) {
    return login(ctx);
  }
  @Route("/changePassword", HTTP_METHODS.POST)
  async changePassword(ctx: Koa.Context, next: Koa.Next) {
    return changePassword(ctx);
  }
  @Route("/getVerifyCode", HTTP_METHODS.POST)
  async getVerifyCode(ctx: Koa.Context, next: Koa.Next) {
    return getVerifyCode(ctx);
  }
  @Route("/forgotPassword", HTTP_METHODS.POST)
  async forgotPassword(ctx: Koa.Context, next: Koa.Next) {
    return forgotPassword(ctx);
  }
  @Route("/checkToken", HTTP_METHODS.POST)
  async checkToken(ctx: Koa.Context, next: Koa.Next) {
    return checkToken(ctx);
  }
  @Route("/changePasswordWithOutOld", HTTP_METHODS.POST)
  async changePasswordWithOutOld(ctx: Koa.Context, next: Koa.Next) {
    return changePasswordWithOutOld(ctx);
  }
  @Route("/getUserInfo", HTTP_METHODS.GET)
  async getUserInfo(ctx: Koa.Context, next: Koa.Next) {
    return getUserInfo(ctx);
  }
  @Route("/signOut", HTTP_METHODS.POST)
  async signOut(ctx: Koa.Context, next: Koa.Next) {
    return signOut(ctx);
  }
}
