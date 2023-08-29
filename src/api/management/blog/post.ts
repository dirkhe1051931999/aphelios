import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import {
  addComment,
  addGalleryPost,
  addPost,
  addVideoPost,
  deletePost,
  getLevel1CommentsByPostId,
  getLevel2CommentsByTopId,
  getPostContentById,
  getPostList,
  getPostListByCategoryId,
  getPostRowById,
  offlinePost,
  publishPost,
  replyComment,
  setCommentStatus,
  setMood,
  updateGalleryPost,
  updatePost,
  updateVideoPost,
  uploadPostImgs,
} from 'src/controllers/management/blog/post.controller';

export class ManagementBlogPostAPIController {
  @Route('/getPostContentById', HTTP_METHODS.POST)
  async getPostContentById(ctx: Koa.Context, next: Koa.Next) {
    return getPostContentById(ctx);
  }
  @Route('/getPostListByCategoryId', HTTP_METHODS.POST)
  async getPostListByCategoryId(ctx: Koa.Context, next: Koa.Next) {
    return getPostListByCategoryId(ctx);
  }
  @Route('/getPostRowById', HTTP_METHODS.POST)
  async getPostRowById(ctx: Koa.Context, next: Koa.Next) {
    return getPostRowById(ctx);
  }
  @Route('/uploadPostImgs', HTTP_METHODS.POST)
  async uploadPostImgs(ctx: Koa.Context, next: Koa.Next) {
    return uploadPostImgs(ctx);
  }
  @Route('/addPost', HTTP_METHODS.POST)
  async addPost(ctx: Koa.Context, next: Koa.Next) {
    return addPost(ctx);
  }
  @Route('/addVideoPost', HTTP_METHODS.POST)
  async addVideoPost(ctx: Koa.Context, next: Koa.Next) {
    return addVideoPost(ctx);
  }
  @Route('/addGalleryPost', HTTP_METHODS.POST)
  async addGalleryPost(ctx: Koa.Context, next: Koa.Next) {
    return addGalleryPost(ctx);
  }
  @Route('/deletePost', HTTP_METHODS.POST)
  async deletePost(ctx: Koa.Context, next: Koa.Next) {
    return deletePost(ctx);
  }
  @Route('/updatePost', HTTP_METHODS.POST)
  async updatePost(ctx: Koa.Context, next: Koa.Next) {
    return updatePost(ctx);
  }
  @Route('/updateVideoPost', HTTP_METHODS.POST)
  async updateVideoPost(ctx: Koa.Context, next: Koa.Next) {
    return updateVideoPost(ctx);
  }
  @Route('/updateGalleryPost', HTTP_METHODS.POST)
  async updateGalleryPost(ctx: Koa.Context, next: Koa.Next) {
    return updateGalleryPost(ctx);
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
  @Route('/getLevel1CommentsByPostId', HTTP_METHODS.POST)
  async getLevel1CommentsByPostId(ctx: Koa.Context, next: Koa.Next) {
    return getLevel1CommentsByPostId(ctx);
  }
  @Route('/getLevel2CommentsByTopId', HTTP_METHODS.POST)
  async getLevel2CommentsByTopId(ctx: Koa.Context, next: Koa.Next) {
    return getLevel2CommentsByTopId(ctx);
  }
  @Route('/setCommentStatus', HTTP_METHODS.POST)
  async setCommentStatus(ctx: Koa.Context, next: Koa.Next) {
    return setCommentStatus(ctx);
  }
  @Route('/setMood', HTTP_METHODS.POST)
  async setMood(ctx: Koa.Context, next: Koa.Next) {
    return setMood(ctx);
  }
  @Route('/replyComment', HTTP_METHODS.POST)
  async replyComment(ctx: Koa.Context, next: Koa.Next) {
    return replyComment(ctx);
  }
  @Route('/addComment', HTTP_METHODS.POST)
  async addComment(ctx: Koa.Context, next: Koa.Next) {
    return addComment(ctx);
  }
}
