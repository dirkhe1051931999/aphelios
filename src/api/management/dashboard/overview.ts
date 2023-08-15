import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { getChannelSheetUserAuthorLimit5, getOverview, getPostTrends } from 'src/controllers/management/dashboard/index.controller';

export class ManagementDashboardAPIController {
  @Route('/getOverview', HTTP_METHODS.POST)
  async getOverview(ctx: Koa.Context, next: Koa.Next) {
    return getOverview(ctx);
  }
  @Route('/getPostTrends', HTTP_METHODS.POST)
  async getPostTrends(ctx: Koa.Context, next: Koa.Next) {
    return getPostTrends(ctx);
  }
  @Route('/getChannelSheetUserAuthorLimit5', HTTP_METHODS.POST)
  async getChannelSheetUserAuthorLimit5(ctx: Koa.Context, next: Koa.Next) {
    return getChannelSheetUserAuthorLimit5(ctx);
  }
}
