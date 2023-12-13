import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';
import { login, logout } from 'src/controllers/h5/blog/auth.controller';

export class h5BlogAuthAPIController {

  @Route('/login', HTTP_METHODS.POST)
  async login(ctx: Koa.Context, next: Koa.Next) {
    return login(ctx);
  }

  @Route('/logout', HTTP_METHODS.POST)
  async logout(ctx: Koa.Context, next: Koa.Next) {
    return logout(ctx);
  }
}