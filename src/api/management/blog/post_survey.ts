import { HTTP_METHODS, Route } from '../../../util/route.decorator';
import Koa from 'koa';
import { addPostSurvey, deletePostSurvey, updatePostSurvey } from '../../../controllers/management/blog/post.survey.controller';

export class ManagementBlogPostSurveyAPIController {
  @Route('/addPostSurvey', HTTP_METHODS.POST)
  async addPostSurvey(ctx: Koa.Context, next: Koa.Next) {
    return addPostSurvey(ctx);
  }
  @Route('/updatePostSurvey', HTTP_METHODS.POST)
  async updatePostSurvey(ctx: Koa.Context, next: Koa.Next) {
    return updatePostSurvey(ctx);
  }
  @Route('/deletePostSurvey', HTTP_METHODS.POST)
  async deletePostSurvey(ctx: Koa.Context, next: Koa.Next) {
    return deletePostSurvey(ctx);
  }
}
