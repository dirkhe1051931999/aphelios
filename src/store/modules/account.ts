import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import { getAllAvatar, getAllUser, addUser, updateUser, deleteUser, updateUserStatus, unLockUser, reSendUrl } from 'src/api/account';

interface IAccount {}
@Module({ dynamic: true, namespaced: true, store, name: 'Account' })
class Account extends VuexModule implements IAccount {
  @Action({ rawError: true })
  public async getAllUser(data: any) {
    const result = await getAllUser(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getAllAvatar(data: any) {
    const result = await getAllAvatar(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async addUser(data: any) {
    const result = await addUser(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async updateUser(data: any) {
    const result = await updateUser(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async deleteUser(data: any) {
    const result = await deleteUser(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async updateUserStatus(data: any) {
    const result = await updateUserStatus(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async unLockUser(data: any) {
    const result = await unLockUser(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async reSendUrl(data: any) {
    const result = await reSendUrl(data);
    return Promise.resolve(result);
  }
}

export const AccountModule = getModule(Account);
