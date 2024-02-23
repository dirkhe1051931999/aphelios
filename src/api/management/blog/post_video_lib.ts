import { HTTP_METHODS, Route, Upload } from '../../../util/route.decorator';
import Koa from 'koa';
import {
  addCategory,
  addVideo,
  batchAddVideo,
  batchDelteVideo,
  deleteCategory,
  deleteVideo,
  getAllVideo,
  queryCategory,
  updateVideo,
} from '../../../controllers/management/blog/post.video_lib.controller';

export class ManagemenVideoLibAPIController {
  @Route('/getAllVideo', HTTP_METHODS.POST)
  async getAllVideo(ctx: Koa.Context, next: Koa.Next) {
    return getAllVideo(ctx);
  }

  @Route('/addVideo', HTTP_METHODS.POST)
  async addVideo(ctx: Koa.Context, next: Koa.Next) {
    return addVideo(ctx);
  }

  @Route('/batchAddVideo', HTTP_METHODS.POST)
  @Upload('file', 'uploads/')
  async batchAddVideo(ctx: Koa.Context, next: Koa.Next) {
    return batchAddVideo(ctx);
  }

  @Route('/updateVideo', HTTP_METHODS.POST)
  async updateVideo(ctx: Koa.Context, next: Koa.Next) {
    return updateVideo(ctx);
  }

  @Route('/deleteVideo', HTTP_METHODS.POST)
  async deleteVideo(ctx: Koa.Context, next: Koa.Next) {
    return deleteVideo(ctx);
  }

  @Route('/batchDelteVideo', HTTP_METHODS.POST)
  async batchDelteVideo(ctx: Koa.Context, next: Koa.Next) {
    return batchDelteVideo(ctx);
  }

  @Route('/addCategory', HTTP_METHODS.POST)
  async addCategory(ctx: Koa.Context, next: Koa.Next) {
    return addCategory(ctx);
  }

  @Route('/deleteCategory', HTTP_METHODS.POST)
  async deleteCategory(ctx: Koa.Context, next: Koa.Next) {
    return deleteCategory(ctx);
  }

  @Route('/queryCategory', HTTP_METHODS.POST)
  async queryCategory(ctx: Koa.Context, next: Koa.Next) {
    return queryCategory(ctx);
  }
}
