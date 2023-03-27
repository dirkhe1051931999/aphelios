import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
import {
  addPost,
  deletePost,
  getPostById,
  getPostList,
  getPostTotal,
  offlinePost,
  publishPost,
  updatePost,
} from "src/controllers/management/blog/post.controller";
import { getPostsByTagId } from "src/controllers/management/blog/tag.controller";
import { getPostsByCategoryId } from "src/controllers/management/blog/category.controller";
export class ManagementBlogPostAPIController {
  @Route("/getPostById/:id", HTTP_METHODS.POST)
  async getPostById(ctx: Koa.Context, next: Koa.Next) {
    return getPostById(ctx);
  }
  @Route("/addPost", HTTP_METHODS.POST)
  async addPost(ctx: Koa.Context, next: Koa.Next) {
    return addPost(ctx);
  }
  @Route("/updatePost/:id", HTTP_METHODS.POST)
  async updatePost(ctx: Koa.Context, next: Koa.Next) {
    return updatePost(ctx);
  }
  @Route("/getPostList", HTTP_METHODS.GET)
  async getPostList(ctx: Koa.Context, next: Koa.Next) {
    return getPostList(ctx);
  }
  @Route("/getPostTotal", HTTP_METHODS.GET)
  async getPostTotal(ctx: Koa.Context, next: Koa.Next) {
    return getPostTotal(ctx);
  }
  @Route("/offlinePost/:id", HTTP_METHODS.PUT)
  async offlinePost(ctx: Koa.Context, next: Koa.Next) {
    return offlinePost(ctx);
  }
  @Route("/publishPost/:id", HTTP_METHODS.PUT)
  async publishPost(ctx: Koa.Context, next: Koa.Next) {
    return publishPost(ctx);
  }
  @Route("/deletePost/:id", HTTP_METHODS.DELETE)
  async deletePost(ctx: Koa.Context, next: Koa.Next) {
    return deletePost(ctx);
  }
  @Route("/getPostsByCategoryId/:id", HTTP_METHODS.GET)
  async getPostsByCategoryId(ctx: Koa.Context, next: Koa.Next) {
    return getPostsByCategoryId(ctx);
  }
  @Route("/getPostsByTagId/:id", HTTP_METHODS.GET)
  async getPostsByTagId(ctx: Koa.Context, next: Koa.Next) {
    return getPostsByTagId(ctx);
  }
}
