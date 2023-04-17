import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { addPostAuthor, getAllPostAuthor, removePostAuthor } from 'src/controllers/management/blog/post.author.controller';
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
}
