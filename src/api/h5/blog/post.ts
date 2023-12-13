import {
  getAllChannel,
  getAllDirectory,
  getAuthorDetailById,
  getPostLevel1CommentsById,
  getPostList,
  getPostListByAuthorId,
  getHotTop,
  getPostLevel2CommentsById, getHomeHeadPost, getCarouselPost, search,
  getAuthorEssay,
} from 'src/controllers/h5/blog/post.controller';
import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';

export class h5BlogPostAPIController {
  // 获取文章列表
  @Route('/getPostList', HTTP_METHODS.GET)
  async getPostList(ctx: Koa.Context, next: Koa.Next) {
    return getPostList(ctx);
  }

  // 获取home头部的post
  @Route('/getHomeHeadPost', HTTP_METHODS.GET)
  async getHomeHeadPost(ctx: Koa.Context, next: Koa.Next) {
    return getHomeHeadPost(ctx);
  }

  @Route('/getHotTop', HTTP_METHODS.GET)
  async getHotTop(ctx: Koa.Context, next: Koa.Next) {
    return getHotTop(ctx);
  }

  @Route('/getCarouselPost', HTTP_METHODS.GET)
  async getCarouselPost(ctx: Koa.Context, next: Koa.Next) {
    return getCarouselPost(ctx);
  }

  @Route('/getAllChannel', HTTP_METHODS.GET)
  async getAllChannel(ctx: Koa.Context, next: Koa.Next) {
    return getAllChannel(ctx);
  }

  @Route('/getAllDirectory', HTTP_METHODS.GET)
  async getAllDirectory(ctx: Koa.Context, next: Koa.Next) {
    return getAllDirectory(ctx);
  }

  @Route('/search', HTTP_METHODS.GET)
  async search(ctx: Koa.Context, next: Koa.Next) {
    return search(ctx);
  }

  @Route('/getAuthorEssay', HTTP_METHODS.GET)
  async getAuthorEssay(ctx: Koa.Context, next: Koa.Next) {
    return getAuthorEssay(ctx);
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
}
