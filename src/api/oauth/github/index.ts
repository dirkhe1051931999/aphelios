import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from "koa";
import { githubOAuth } from '../../../controllers/oauth/github.controller';

export class OauthGithubController {
  @Route("/", HTTP_METHODS.GET)
  async githubOAuth(ctx: Koa.Context, next: Koa.Next) {
    return githubOAuth(ctx);
  }
}
