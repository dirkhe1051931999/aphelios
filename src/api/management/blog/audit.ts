import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';
import {
  rejectAuthorCompany,
  getAuthorCompanyList,
  passAuthorCompany,
  getPostAllCommnet,
  setPostCommentStatus,
  getAuthorNormalList,
  passAuthorNormal,
  rejectAuthorNormal,
  getAuthorCompanyDetail,
} from '../../../controllers/management/blog/audit.controller';
export class ManagementBlogAuditAPIController {
  @Route('/getAuthorCompanyList', HTTP_METHODS.POST)
  async getAuthorCompanyList(ctx: Koa.Context, next: Koa.Next) {
    return getAuthorCompanyList(ctx);
  }
  @Route('/getAuthorCompanyDetail', HTTP_METHODS.POST)
  async getAuthorCompanyDetail(ctx: Koa.Context, next: Koa.Next) {
    return getAuthorCompanyDetail(ctx);
  }
  @Route('/passAuthorCompany', HTTP_METHODS.POST)
  async passAuthorCompany(ctx: Koa.Context, next: Koa.Next) {
    return passAuthorCompany(ctx);
  }
  @Route('/rejectAuthorCompany', HTTP_METHODS.POST)
  async rejectAuthorCompany(ctx: Koa.Context, next: Koa.Next) {
    return rejectAuthorCompany(ctx);
  }
  @Route('/getPostAllCommnet', HTTP_METHODS.POST)
  async getPostAllCommnet(ctx: Koa.Context, next: Koa.Next) {
    return getPostAllCommnet(ctx);
  }
  @Route('/setPostCommentStatus', HTTP_METHODS.POST)
  async setPostCommentStatus(ctx: Koa.Context, next: Koa.Next) {
    return setPostCommentStatus(ctx);
  }
  @Route('/getAuthorNormalList', HTTP_METHODS.POST)
  async getAuthorNormalList(ctx: Koa.Context, next: Koa.Next) {
    return getAuthorNormalList(ctx);
  }
  @Route('/passAuthorNormal', HTTP_METHODS.POST)
  async passAuthorNormal(ctx: Koa.Context, next: Koa.Next) {
    return passAuthorNormal(ctx);
  }
  @Route('/rejectAuthorNormal', HTTP_METHODS.POST)
  async rejectAuthorNormal(ctx: Koa.Context, next: Koa.Next) {
    return rejectAuthorNormal(ctx);
  }
}
