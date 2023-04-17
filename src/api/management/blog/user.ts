import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
import {
  addUser,
  deleteUser,
  getAllAvatar,
  getAllUser,
  reSendUrl,
  unLockUser,
  updateUser,
  updateUserEmail,
  updateUserMobile,
  updateUserStatus,
} from "src/controllers/management/blog/user.controller";

export class ManagementBlogUserAPIController {
  @Route("/getAllUser", HTTP_METHODS.POST)
  async getAllUser(ctx: Koa.Context, next: Koa.Next) {
    return getAllUser(ctx);
  }
  @Route("/getAllAvatar", HTTP_METHODS.POST)
  async getAllAvatar(ctx: Koa.Context, next: Koa.Next) {
    return getAllAvatar(ctx);
  }
  @Route("/addUser", HTTP_METHODS.POST)
  async addUser(ctx: Koa.Context, next: Koa.Next) {
    return addUser(ctx);
  }
  @Route("/updateUser", HTTP_METHODS.POST)
  async updateUser(ctx: Koa.Context, next: Koa.Next) {
    return updateUser(ctx);
  }
  @Route("/deleteUser", HTTP_METHODS.POST)
  async deleteUser(ctx: Koa.Context, next: Koa.Next) {
    return deleteUser(ctx);
  }
  @Route("/updateUserStatus", HTTP_METHODS.POST)
  async updateUserStatus(ctx: Koa.Context, next: Koa.Next) {
    return updateUserStatus(ctx);
  }
  @Route("/unLockUser", HTTP_METHODS.POST)
  async unLockUser(ctx: Koa.Context, next: Koa.Next) {
    return unLockUser(ctx);
  }
  @Route("/reSendUrl", HTTP_METHODS.POST)
  async reSendUrl(ctx: Koa.Context, next: Koa.Next) {
    return reSendUrl(ctx);
  }
  @Route("/updateUserEmail", HTTP_METHODS.POST)
  async test(ctx: Koa.Context, next: Koa.Next) {
    return updateUserEmail(ctx);
  }
  @Route("/updateUserMobile", HTTP_METHODS.POST)
  async updateUserMobile(ctx: Koa.Context, next: Koa.Next) {
    return updateUserMobile(ctx);
  }
}
