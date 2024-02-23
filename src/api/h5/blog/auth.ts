import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';
import {
  login,
  logout,
  register,
  resetPassword,
  checkResetPasswordToken,
  updateUserPassword,
} from '../../../controllers/h5/blog/auth.controller';

export class h5BlogAuthAPIController {

  @Route('/login', HTTP_METHODS.POST)
  async login(ctx: Koa.Context, next: Koa.Next) {
    return login(ctx);
  }

  @Route('/logout', HTTP_METHODS.POST)
  async logout(ctx: Koa.Context, next: Koa.Next) {
    return logout(ctx);
  }

  @Route('/register', HTTP_METHODS.POST)
  async register(ctx: Koa.Context, next: Koa.Next) {
    return register(ctx);
  }

  @Route('/resetPassword', HTTP_METHODS.POST)
  async resetPassword(ctx: Koa.Context, next: Koa.Next) {
    return resetPassword(ctx);
  }

  @Route('/checkResetPasswordToken', HTTP_METHODS.POST)
  async checkResetPasswordToken(ctx: Koa.Context, next: Koa.Next) {
    return checkResetPasswordToken(ctx);
  }

  @Route('/updateUserPassword', HTTP_METHODS.POST)
  async updateUserPassword(ctx: Koa.Context, next: Koa.Next) {
    return updateUserPassword(ctx);
  }
}