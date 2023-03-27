import { HTTP_METHODS, Route } from "src/util/route.decorator";
import Koa from "koa";
import { addEventTrack } from "src/controllers/track/track.controller";

export class TrackController {
  @Route("/addEventTrack", HTTP_METHODS.GET)
  async addEventTrack(ctx: Koa.Context, next: Koa.Next) {
    return addEventTrack(ctx);
  }
}
