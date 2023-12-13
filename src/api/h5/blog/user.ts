import { addComment } from 'src/controllers/h5/blog/user.controller';
import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';

export class h5BlogUserAPIController {
  @Route('/addComment', HTTP_METHODS.POST)
  async addComment(ctx: Koa.Context, next: Koa.Next) {
    return addComment(ctx);
  }
}