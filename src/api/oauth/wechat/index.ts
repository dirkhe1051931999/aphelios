import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
import { getAccessToken, getAuthorizeURL } from "src/controllers/oauth/wechat.controller";

export class OauthGithubController {
  @Route("/login", HTTP_METHODS.GET)
  async getAuthorizeURL(ctx: Koa.Context, next: Koa.Next) {
    return getAuthorizeURL(ctx);
  }
  @Route("/callback", HTTP_METHODS.GET)
  async getAccessToken(ctx: Koa.Context, next: Koa.Next) {
    return getAccessToken(ctx);
  }
}