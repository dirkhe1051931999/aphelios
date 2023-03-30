import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
import {
  addUser,
  deleteUser,
  getAllAvatar,
  getAllUser,
  updateUser,
} from "src/controllers/management/blog/user";

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
}
