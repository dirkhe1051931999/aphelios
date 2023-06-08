import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { getAllPostUser, addPostUser, deletePostUser, setPostUserStatus } from 'src/controllers/management/blog/post.user.controller';
import { rsaDecrypt } from 'src/util/helper';

export class ManagementBlogPostUserAPIController {
  @Route('/getAllPostUser', HTTP_METHODS.POST)
  async getAllPostUser(ctx: Koa.Context, next: Koa.Next) {
    return getAllPostUser(ctx);
  }
  @Route('/addPostUser', HTTP_METHODS.POST)
  async addPostUser(ctx: Koa.Context, next: Koa.Next) {
    return addPostUser(ctx);
  }
  @Route('/deletePostUser', HTTP_METHODS.POST)
  async deletePostUser(ctx: Koa.Context, next: Koa.Next) {
    return deletePostUser(ctx);
  }
  @Route('/viewUserPassword', HTTP_METHODS.POST)
  async viewUserPassword(ctx: Koa.Context, next: Koa.Next) {
    const { data } = ctx.request.body as any;
    ctx.success(ctx, rsaDecrypt(data));
  }
  @Route('/setPostUserStatus', HTTP_METHODS.POST)
  async setPostUserStatus(ctx: Koa.Context, next: Koa.Next) {
    return setPostUserStatus(ctx);
  }
}
