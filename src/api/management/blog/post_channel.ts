import { HTTP_METHODS, Route } from 'src/util/route.decorator';
import Koa from 'koa';
import { addChannel, getAllChannel, removeChannel, updateChannelName, updateChannelPos } from 'src/controllers/management/blog/post.channel.controller';
export class ManagementBlogChannelAPIController {
  @Route('/getAllChannel', HTTP_METHODS.POST)
  async getAllChannel(ctx: Koa.Context, next: Koa.Next) {
    return getAllChannel(ctx);
  }
  @Route('/updateChannelPos', HTTP_METHODS.POST)
  async updateChannelPos(ctx: Koa.Context, next: Koa.Next) {
    return updateChannelPos(ctx);
  }
  @Route('/updateChannelName', HTTP_METHODS.POST)
  async updateChannelName(ctx: Koa.Context, next: Koa.Next) {
    return updateChannelName(ctx);
  }
  @Route('/addChannel', HTTP_METHODS.POST)
  async addChannel(ctx: Koa.Context, next: Koa.Next) {
    return addChannel(ctx);
  }
  @Route('/removeChannel', HTTP_METHODS.POST)
  async removeChannel(ctx: Koa.Context, next: Koa.Next) {
    return removeChannel(ctx);
  }
}
