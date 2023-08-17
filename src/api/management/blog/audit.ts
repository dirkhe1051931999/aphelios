import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { rejectCompanyCertification, getCompanyCertificationList, passCompanyCertification, getPostAllCommnet, setPostCommentStatus } from 'src/controllers/management/blog/audit.controller';
export class ManagementBlogAuditAPIController {
  @Route('/getCompanyCertificationList', HTTP_METHODS.POST)
  async getCompanyCertificationList(ctx: Koa.Context, next: Koa.Next) {
    return getCompanyCertificationList(ctx);
  }
  @Route('/passCompanyCertification', HTTP_METHODS.POST)
  async passCompanyCertification(ctx: Koa.Context, next: Koa.Next) {
    return passCompanyCertification(ctx);
  }
  @Route('/rejectCompanyCertification', HTTP_METHODS.POST)
  async rejectCompanyCertification(ctx: Koa.Context, next: Koa.Next) {
    return rejectCompanyCertification(ctx);
  }
  @Route('/getPostAllCommnet', HTTP_METHODS.POST)
  async getPostAllCommnet(ctx: Koa.Context, next: Koa.Next) {
    return getPostAllCommnet(ctx);
  }
  @Route('/setPostCommentStatus', HTTP_METHODS.POST)
  async setPostCommentStatus(ctx: Koa.Context, next: Koa.Next) {
    return setPostCommentStatus(ctx);
  }
}
