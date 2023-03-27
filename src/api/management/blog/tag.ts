import {
  addNewTag,
  addNewTagWhenPost,
  deleteTag,
  getTags,
  searchTagByName,
  updateTag,
} from "src/controllers/management/blog/tag.controller";
import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
export class ManagementBlogTagAPIController {
  @Route("/getTags", HTTP_METHODS.GET)
  async getTags(ctx: Koa.Context, next: Koa.Next) {
    return getTags(ctx);
  }
  @Route("/addNewTagWhenPost/:name", HTTP_METHODS.PUT)
  async addNewTagWhenPost(ctx: Koa.Context, next: Koa.Next) {
    return addNewTagWhenPost(ctx);
  }
  @Route("/addNewTag/:name", HTTP_METHODS.PUT)
  async addNewTag(ctx: Koa.Context, next: Koa.Next) {
    return addNewTag(ctx);
  }
  @Route("/updateTag/:id", HTTP_METHODS.PUT)
  async updateTag(ctx: Koa.Context, next: Koa.Next) {
    return updateTag(ctx);
  }
  @Route("/deleteTag/:id", HTTP_METHODS.DELETE)
  async deleteTag(ctx: Koa.Context, next: Koa.Next) {
    return deleteTag(ctx);
  }
  @Route("/searchTagByName/:name", HTTP_METHODS.DELETE)
  async searchTagByName(ctx: Koa.Context, next: Koa.Next) {
    return searchTagByName(ctx);
  }
}
