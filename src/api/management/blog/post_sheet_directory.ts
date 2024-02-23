import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';
import {
  addChildDirectory,
  addDirectory,
  addSheet,
  getAllChildDirectory,
  getAllDirectory,
  getAllSheet,
  removeChildDirectory,
  removeDirectory,
  removeSheet,
  updateChildDirectory,
  updateDirectory,
  updateSheet,
} from '../../../controllers/management/blog/post.sheet.directory.controller';
export class ManagementBlogSheetDirectoryAPIController {
  @Route('/getAllSheet', HTTP_METHODS.POST)
  async getAllSheet(ctx: Koa.Context, next: Koa.Next) {
    return getAllSheet(ctx);
  }
  @Route('/getAllDirectory', HTTP_METHODS.POST)
  async getAllDirectory(ctx: Koa.Context, next: Koa.Next) {
    return getAllDirectory(ctx);
  }
  @Route('/getAllChildDirectory', HTTP_METHODS.POST)
  async getAllChildDirectory(ctx: Koa.Context, next: Koa.Next) {
    return getAllChildDirectory(ctx);
  }
  @Route('/addSheet', HTTP_METHODS.POST)
  async addSheet(ctx: Koa.Context, next: Koa.Next) {
    return addSheet(ctx);
  }
  @Route('/addDirectory', HTTP_METHODS.POST)
  async addDirectory(ctx: Koa.Context, next: Koa.Next) {
    return addDirectory(ctx);
  }
  @Route('/addChildDirectory', HTTP_METHODS.POST)
  async addChildDirectory(ctx: Koa.Context, next: Koa.Next) {
    return addChildDirectory(ctx);
  }
  @Route('/removeSheet', HTTP_METHODS.POST)
  async removeSheet(ctx: Koa.Context, next: Koa.Next) {
    return removeSheet(ctx);
  }
  @Route('/removeDirectory', HTTP_METHODS.POST)
  async removeDirectory(ctx: Koa.Context, next: Koa.Next) {
    return removeDirectory(ctx);
  }
  @Route('/removeChildDirectory', HTTP_METHODS.POST)
  async removeChildDirectory(ctx: Koa.Context, next: Koa.Next) {
    return removeChildDirectory(ctx);
  }
  @Route('/updateSheet', HTTP_METHODS.POST)
  async updateSheet(ctx: Koa.Context, next: Koa.Next) {
    return updateSheet(ctx);
  }
  @Route('/updateDirectory', HTTP_METHODS.POST)
  async updateDirectory(ctx: Koa.Context, next: Koa.Next) {
    return updateDirectory(ctx);
  }
  @Route('/updateChildDirectory', HTTP_METHODS.POST)
  async updateChildDirectory(ctx: Koa.Context, next: Koa.Next) {
    return updateChildDirectory(ctx);
  }
}
