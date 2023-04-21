import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { addPost, deletePost, getPostById, getPostList, getPostListByCategoryId, offlinePost, publishPost, updatePost, uploadPostImgs } from 'src/controllers/management/blog/post.controller';
export class ManagementBlogPostAPIController {
  @Route('/getPostById', HTTP_METHODS.POST)
  async getPostById(ctx: Koa.Context, next: Koa.Next) {
    return getPostById(ctx);
  }
  @Route('/getPostListByCategoryId', HTTP_METHODS.POST)
  async getPostListByCategoryId(ctx: Koa.Context, next: Koa.Next) {
    return getPostListByCategoryId(ctx);
  }
  @Route('/uploadPostImgs', HTTP_METHODS.POST)
  async uploadPostImgs(ctx: Koa.Context, next: Koa.Next) {
    return uploadPostImgs(ctx);
  }
  @Route('/addPost', HTTP_METHODS.POST)
  async addPost(ctx: Koa.Context, next: Koa.Next) {
    return addPost(ctx);
  }
  @Route('/deletePost', HTTP_METHODS.POST)
  async deletePost(ctx: Koa.Context, next: Koa.Next) {
    return deletePost(ctx);
  }
  @Route('/updatePost', HTTP_METHODS.POST)
  async updatePost(ctx: Koa.Context, next: Koa.Next) {
    return updatePost(ctx);
  }
  @Route('/getPostList', HTTP_METHODS.POST)
  async getPostList(ctx: Koa.Context, next: Koa.Next) {
    return getPostList(ctx);
  }
  @Route('/offlinePost', HTTP_METHODS.POST)
  async offlinePost(ctx: Koa.Context, next: Koa.Next) {
    return offlinePost(ctx);
  }
  @Route('/publishPost', HTTP_METHODS.POST)
  async publishPost(ctx: Koa.Context, next: Koa.Next) {
    return publishPost(ctx);
  }
}
