import { getPostList } from 'src/controllers/web/blog/post.controller';
import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';

export class WebBlogAPIController {
  // 获取文章列表
  @Route('/getPostList', HTTP_METHODS.GET)
  async getPostList(ctx: Koa.Context, next: Koa.Next) {
    return getPostList(ctx);
  }
}
