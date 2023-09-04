import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import { addPostSurvey, deletePostSurvey, updatePostSurvey } from 'src/api/survey';

interface ISurvey {}
@Module({ dynamic: true, namespaced: true, store, name: 'Survey' })
class Survey extends VuexModule implements ISurvey {
  @Action({ rawError: true })
  public async addPostSurvey(data: any) {
    const result = await addPostSurvey(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async updatePostSurvey(data: any) {
    const result = await updatePostSurvey(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async deletePostSurvey(data: any) {
    const result = await deletePostSurvey(data);
    return Promise.resolve(result);
  }
}
export const SurveyModule = getModule(Survey);
