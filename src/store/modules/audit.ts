import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import { getAuthorCompanyDetail, getAuthorCompanyList, getAuthorNormalList, getPostAllCommnet, passAuthorCompany, passAuthorNormal, rejectAuthorCompany, rejectAuthorNormal, setPostCommentStatus } from 'src/api/audit';

interface IAudit {}
@Module({ dynamic: true, namespaced: true, store, name: 'Audit' })
class Audit extends VuexModule implements IAudit {
  @Action({ rawError: true })
  public async getAuthorCompanyList(data: any) {
    const result = await getAuthorCompanyList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getAuthorCompanyDetail(data: any) {
    const result = await getAuthorCompanyDetail(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async passAuthorCompany(data: any) {
    const result = await passAuthorCompany(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async rejectAuthorCompany(data: any) {
    const result = await rejectAuthorCompany(data);
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
  @Action({ rawError: true })
  public async getAuthorNormalList(data: any) {
    const result = await getAuthorNormalList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async passAuthorNormal(data: any) {
    const result = await passAuthorNormal(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async rejectAuthorNormal(data: any) {
    const result = await rejectAuthorNormal(data);
    return Promise.resolve(result);
  }
}
export const AuditModule = getModule(Audit);
