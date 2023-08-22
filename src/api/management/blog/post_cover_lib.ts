import { HTTP_METHODS, Route, Upload } from 'src/util/route.decorator';
import Koa from 'koa';
import { addCategory, addCover, batchAddCover, batchDelteCover, deleteCategory, deleteCover, getAllCover, queryCategory, updateCover } from 'src/controllers/management/blog/post.cover_lib.controller';

export class ManagementCoverLibAPIController {
  @Route('/getAllCover', HTTP_METHODS.POST)
  async getAllCover(ctx: Koa.Context, next: Koa.Next) {
    return getAllCover(ctx);
  }
  @Route('/addCover', HTTP_METHODS.POST)
  async addCover(ctx: Koa.Context, next: Koa.Next) {
    return addCover(ctx);
  }
  @Route('/batchAddCover', HTTP_METHODS.POST)
  @Upload('file', 'uploads/')
  async batchAddCover(ctx: Koa.Context, next: Koa.Next) {
    return batchAddCover(ctx);
  }
  @Route('/updateCover', HTTP_METHODS.POST)
  async updateCover(ctx: Koa.Context, next: Koa.Next) {
    return updateCover(ctx);
  }
  @Route('/deleteCover', HTTP_METHODS.POST)
  async deleteCover(ctx: Koa.Context, next: Koa.Next) {
    return deleteCover(ctx);
  }
  @Route('/batchDelteCover', HTTP_METHODS.POST)
  async batchDelteCover(ctx: Koa.Context, next: Koa.Next) {
    return batchDelteCover(ctx);
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
