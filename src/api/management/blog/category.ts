import {
  addNewCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "src/controllers/management/blog/category.controller";
import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
export class ManagementBlogCategoryAPIController {
  @Route("/getCategories", HTTP_METHODS.POST)
  async getCategories(ctx: Koa.Context, next: Koa.Next) {
    return getCategories(ctx);
  }
  @Route("/addNewCategory/:name", HTTP_METHODS.PUT)
  async addNewCategory(ctx: Koa.Context, next: Koa.Next) {
    return addNewCategory(ctx);
  }
  @Route("/updateCategory", HTTP_METHODS.PUT)
  async updateCategory(ctx: Koa.Context, next: Koa.Next) {
    return updateCategory(ctx);
  }
  @Route("/deleteItem/:id", HTTP_METHODS.DELETE)
  async deleteItem(ctx: Koa.Context, next: Koa.Next) {
    return deleteCategory(ctx);
  }
}
