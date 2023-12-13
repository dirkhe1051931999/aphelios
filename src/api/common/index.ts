import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { getIP, generateClientId } from 'src/controllers/common/index.controller';

export class CommonAPIController {
  @Route('/getIP', HTTP_METHODS.GET)
  async getIP(ctx: Koa.Context, next: Koa.Next) {
    const result = await getIP(ctx);
    ctx.success(ctx, result);
  }

  @Route('/generateClientId', HTTP_METHODS.POST)
  async generateClientId(ctx: Koa.Context, next: Koa.Next) {
    return generateClientId(ctx);
  }
}
