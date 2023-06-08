import {
  getAllChannel,
  getAllDirectory,
  getAuthorDetailById,
  getPostLevel1CommentsById,
  getPostDetailById,
  getPostList,
  getPostListByAuthorId,
  getTopFivePost,
  getPostLevel2CommentsById,
} from 'src/controllers/web/blog/post.controller';
import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { getUserDetailById } from 'src/controllers/web/blog/user.controller';

export class WebBlogAPIController {
  // 获取文章列表
  @Route('/getPostList', HTTP_METHODS.GET)
  async getPostList(ctx: Koa.Context, next: Koa.Next) {
    return getPostList(ctx);
  }
  @Route('/getPostDetailById', HTTP_METHODS.GET)
  async getPostDetailById(ctx: Koa.Context, next: Koa.Next) {
    return getPostDetailById(ctx);
  }
  @Route('/getTopFivePost', HTTP_METHODS.GET)
  async getTopFivePost(ctx: Koa.Context, next: Koa.Next) {
    return getTopFivePost(ctx);
  }
  @Route('/getAllChannel', HTTP_METHODS.GET)
  async getAllChannel(ctx: Koa.Context, next: Koa.Next) {
    return getAllChannel(ctx);
  }
  @Route('/getAllDirectory', HTTP_METHODS.GET)
  async getAllDirectory(ctx: Koa.Context, next: Koa.Next) {
    return getAllDirectory(ctx);
  }
  @Route('/getPostLevel1CommentsById', HTTP_METHODS.GET)
  async getPostLevel1CommentsById(ctx: Koa.Context, next: Koa.Next) {
    return getPostLevel1CommentsById(ctx);
  }
  @Route('/getPostLevel2CommentsById', HTTP_METHODS.GET)
  async getPostLevel2CommentsById(ctx: Koa.Context, next: Koa.Next) {
    return getPostLevel2CommentsById(ctx);
  }
  @Route('/getPostListByAuthorId', HTTP_METHODS.GET)
  async getPostListByAuthorId(ctx: Koa.Context, next: Koa.Next) {
    return getPostListByAuthorId(ctx);
  }
  @Route('/getAuthorDetailById', HTTP_METHODS.GET)
  async getAuthorDetailById(ctx: Koa.Context, next: Koa.Next) {
    return getAuthorDetailById(ctx);
  }
  @Route('/getUserDetailById', HTTP_METHODS.GET)
  async getUserDetailById(ctx: Koa.Context, next: Koa.Next) {
    return getUserDetailById(ctx);
  }
}
