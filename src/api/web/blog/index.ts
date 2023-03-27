import {
  getArchive,
  getPostById,
  getPostList,
  getPostsByCategoryId,
  getPostsByKeyword,
  getPostsByTagId,
  getSelfItems,
} from "src/controllers/web/blog/post.controller";
import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
import {
  addComment,
  getCommentsByPostId,
} from "src/controllers/web/blog/comment.controller";
export class WebBlogAPIController {
  // 获取文章列表
  @Route("/getPostList", HTTP_METHODS.GET)
  async getPostList(ctx: Koa.Context, next: Koa.Next) {
    return getPostList(ctx);
  }
  // 获取文章内容
  @Route("/getPostById/:id", HTTP_METHODS.GET)
  async getPostById(ctx: Koa.Context, next: Koa.Next) {
    return getPostById(ctx);
  }
  // 获取归档
  @Route("/getArchive", HTTP_METHODS.GET)
  async getArchive(ctx: Koa.Context, next: Koa.Next) {
    return getArchive(ctx);
  }
  // 根据类型搜索
  @Route("/category/:id", HTTP_METHODS.GET)
  async getPostsByCategoryId(ctx: Koa.Context, next: Koa.Next) {
    return getPostsByCategoryId(ctx);
  }
  // 根据标签搜索
  @Route("/tag/:id", HTTP_METHODS.GET)
  async getPostsByTagId(ctx: Koa.Context, next: Koa.Next) {
    return getPostsByTagId(ctx);
  }
  // 根据关键字搜索
  @Route("/keyword/:keyword", HTTP_METHODS.GET)
  async getPostsByKeyword(ctx: Koa.Context, next: Koa.Next) {
    return getPostsByKeyword(ctx);
  }
  // 获取个人项目内容
  @Route("/getSelfItems", HTTP_METHODS.GET)
  async getSelfItems(ctx: Koa.Context, next: Koa.Next) {
    return getSelfItems(ctx);
  }
  // 新增评论
  @Route("/addComment", HTTP_METHODS.POST)
  async addComment(ctx: Koa.Context, next: Koa.Next) {
    return addComment(ctx);
  }
  // 获取文章评论
  @Route("/getCommentsByPostId", HTTP_METHODS.GET)
  async getCommentsByPostId(ctx: Koa.Context, next: Koa.Next) {
    return getCommentsByPostId(ctx);
  }
}
