import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { rejectCompanyCertification, getCompanyCertificationList, passCompanyCertification } from 'src/controllers/management/blog/audit.company.certification.controller';
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
}
