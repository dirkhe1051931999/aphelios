import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import { getChannelSheetUserAuthorLimit5, getOverview, getPostTrends } from 'src/api/dashboard';

interface IDashboard {}
@Module({ dynamic: true, namespaced: true, store, name: 'Dashboard' })
class Dashboard extends VuexModule implements IDashboard {
  @Action({ rawError: true })
  public async getOverview(data: any) {
    const result = await getOverview(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getPostTrends(data: any) {
    const result = await getPostTrends(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getChannelSheetUserAuthorLimit5(data: any) {
    const result = await getChannelSheetUserAuthorLimit5(data);
    return Promise.resolve(result);
  }
}
export const DashboardModule = getModule(Dashboard);
