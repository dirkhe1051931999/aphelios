import {
  createNewItem,
  deleteItem,
  getItems,
  updateItem,
} from "src/controllers/management/blog/laboratory.controller";
import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
export class ManagementBlogItemAPIController {
  @Route("/getItems", HTTP_METHODS.GET)
  async login(ctx: Koa.Context, next: Koa.Next) {
    return getItems(ctx);
  }
  @Route("/createNewItem", HTTP_METHODS.POST)
  async createNewItem(ctx: Koa.Context, next: Koa.Next) {
    return createNewItem(ctx);
  }
  @Route("/updateItem", HTTP_METHODS.POST)
  async updateItem(ctx: Koa.Context, next: Koa.Next) {
    return updateItem(ctx);
  }
  @Route("/deleteItem/:id", HTTP_METHODS.DELETE)
  async deleteItem(ctx: Koa.Context, next: Koa.Next) {
    return deleteItem(ctx);
  }
}
