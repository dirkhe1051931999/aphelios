import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";

export class TestEnEnController {
  @Route("/", HTTP_METHODS.GET)
  async index(ctx: Koa.Context, next: Koa.Next) {
    ctx.body = "Hello World!";
  }
}
