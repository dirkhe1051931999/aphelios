import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';
import {
  addPostAuthor,
  getAllPostAuthor,
  getCompanyAuthorVerifyInfo,
  removeCompanyAuthorVerify,
  removePostAuthor,
  updatePostAuthor,
  verifyCompanyAuthor,
} from '../../../controllers/management/blog/post.author.controller';
export class ManagementBlogPostAuthorAPIController {
  @Route('/getAllPostAuthor', HTTP_METHODS.POST)
  async getAllPostAuthor(ctx: Koa.Context, next: Koa.Next) {
    return getAllPostAuthor(ctx);
  }
  @Route('/addPostAuthor', HTTP_METHODS.POST)
  async addPostAuthor(ctx: Koa.Context, next: Koa.Next) {
    return addPostAuthor(ctx);
  }
  @Route('/removePostAuthor', HTTP_METHODS.POST)
  async removePostAuthor(ctx: Koa.Context, next: Koa.Next) {
    return removePostAuthor(ctx);
  }
  @Route('/updatePostAuthor', HTTP_METHODS.POST)
  async updatePostAuthor(ctx: Koa.Context, next: Koa.Next) {
    return updatePostAuthor(ctx);
  }
  @Route('/verifyCompanyAuthor', HTTP_METHODS.POST)
  async verifyCompanyAuthor(ctx: Koa.Context, next: Koa.Next) {
    return verifyCompanyAuthor(ctx);
  }
  @Route('/getCompanyAuthorVerifyInfo', HTTP_METHODS.POST)
  async getCompanyAuthorVerifyInfo(ctx: Koa.Context, next: Koa.Next) {
    return getCompanyAuthorVerifyInfo(ctx);
  }
  @Route('/removeCompanyAuthorVerify', HTTP_METHODS.POST)
  async removeCompanyAuthorVerify(ctx: Koa.Context, next: Koa.Next) {
    return removeCompanyAuthorVerify(ctx);
  }
}
