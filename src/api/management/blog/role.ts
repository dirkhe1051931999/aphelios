import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
import {
  addRole,
  deleteRole,
  getAllPermission,
  getAllRole,
  updateRole,
} from "src/controllers/management/blog/role";
export class ManagementBlogRoleAPIController {
  @Route("/getAllRole", HTTP_METHODS.POST)
  async getAllRole(ctx: Koa.Context, next: Koa.Next) {
    return getAllRole(ctx);
  }
  @Route("/getAllPermission", HTTP_METHODS.POST)
  async getAllPermission(ctx: Koa.Context, next: Koa.Next) {
    return getAllPermission(ctx);
  }
  @Route("/addRole", HTTP_METHODS.POST)
  async addRole(ctx: Koa.Context, next: Koa.Next) {
    return addRole(ctx);
  }
  @Route("/updateRole", HTTP_METHODS.POST)
  async updateRole(ctx: Koa.Context, next: Koa.Next) {
    return updateRole(ctx);
  }
  @Route("/deleteRole", HTTP_METHODS.POST)
  async deleteRole(ctx: Koa.Context, next: Koa.Next) {
    return deleteRole(ctx);
  }
}
