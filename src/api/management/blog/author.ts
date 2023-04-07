import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { getAuthor } from 'src/controllers/management/blog/author.controller';
export class ManagementBlogAuthorAPIController {
  @Route('/getAuthor', HTTP_METHODS.POST)
  async getAuthor(ctx: Koa.Context, next: Koa.Next) {
    return getAuthor(ctx);
  }
}
