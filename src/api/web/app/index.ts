import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { getIP } from 'src/controllers/web/app/app.controller';

export class WebBlogAPIController {
  // 获取文章列表
  @Route('/getIP', HTTP_METHODS.GET)
  async getIP(ctx: Koa.Context, next: Koa.Next) {
    const result = await getIP(ctx);
    ctx.success(ctx, result);
  }
}
