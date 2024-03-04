import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';
import {
  addChannel,
  getAllChannel,
  removeChannel,
  updateChannelName,
  updateChannelPos,
  updateChannelVisible,
} from '../../../controllers/management/blog/post.channel.controller';

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

  @Route('/updateChannelVisible', HTTP_METHODS.POST)
  async updateChannelVisible(ctx: Koa.Context, next: Koa.Next) {
    return updateChannelVisible(ctx);
  }
}