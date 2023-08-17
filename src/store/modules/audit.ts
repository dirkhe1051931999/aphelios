import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import { getCompanyCertificationList, getPostAllCommnet, passCompanyCertification, rejectCompanyCertification, setPostCommentStatus } from 'src/api/audit';

interface IAudit {}
@Module({ dynamic: true, namespaced: true, store, name: 'Audit' })
class Audit extends VuexModule implements IAudit {
  @Action({ rawError: true })
  public async getCompanyCertificationList(data: any) {
    const result = await getCompanyCertificationList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async passCompanyCertification(data: any) {
    const result = await passCompanyCertification(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async rejectCompanyCertification(data: any) {
    const result = await rejectCompanyCertification(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getPostAllCommnet(data: any) {
    const result = await getPostAllCommnet(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async setPostCommentStatus(data: any) {
    const result = await setPostCommentStatus(data);
    return Promise.resolve(result);
  }
}
export const AuditModule = getModule(Audit);
