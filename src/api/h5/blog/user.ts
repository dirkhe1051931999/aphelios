import {
  addPostComment,
  addVote,
  replyUserComment,
  sendChangeEmailCode,
  updateAddress,
  updateAvatar,
  updateDescription,
  updateEmail,
  updateGender,
  updateNickName,
} from '../../../controllers/h5/blog/user.controller';
import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';

export class h5BlogUserAPIController {

  @Route('/sendChangeEmailCode', HTTP_METHODS.POST)
  async sendChangeEmailCode(ctx: Koa.Context, next: Koa.Next) {
    return sendChangeEmailCode(ctx);
  }

  @Route('/updateEmail', HTTP_METHODS.POST)
  async updateEmail(ctx: Koa.Context, next: Koa.Next) {
    return updateEmail(ctx);
  }

  @Route('/updateNickName', HTTP_METHODS.POST)
  async updateNickName(ctx: Koa.Context, next: Koa.Next) {
    return updateNickName(ctx);
  }

  @Route('/updateGender', HTTP_METHODS.POST)
  async updateGender(ctx: Koa.Context, next: Koa.Next) {
    return updateGender(ctx);
  }

  @Route('/updateDescription', HTTP_METHODS.POST)
  async updateDescription(ctx: Koa.Context, next: Koa.Next) {
    return updateDescription(ctx);
  }

  @Route('/updateAddress', HTTP_METHODS.POST)
  async updateAddress(ctx: Koa.Context, next: Koa.Next) {
    return updateAddress(ctx);
  }

  @Route('/updateAvatar', HTTP_METHODS.POST)
  async updateAvatar(ctx: Koa.Context, next: Koa.Next) {
    return updateAvatar(ctx);
  }

  @Route('/addPostComment', HTTP_METHODS.POST)
  async addPostComment(ctx: Koa.Context, next: Koa.Next) {
    return addPostComment(ctx);
  }

  @Route('/replyUserComment', HTTP_METHODS.POST)
  async replyUserComment(ctx: Koa.Context, next: Koa.Next) {
    return replyUserComment(ctx);
  }

  @Route('/addVote', HTTP_METHODS.POST)
  async addVote(ctx: Koa.Context, next: Koa.Next) {
    return addVote(ctx);
  }
}


