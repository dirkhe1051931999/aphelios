import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import { getAllAvatar, getAllUser, addUser, updateUser, deleteUser, updateUserStatus, unLockUser, reSendUrl, getAllRole, getAllPermission, addRole, updateRole, deleteRole, updateUserEmail, updateUserMobile } from 'src/api/account';

interface IAccount { }
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
  @Action({ rawError: true })
  public async getAllPermission(data: any) {
    const result = await getAllPermission(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getAllRole(data: any) {
    const result = await getAllRole(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async addRole(data: any) {
    const result = await addRole(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async updateRole(data: any) {
    const result = await updateRole(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async deleteRole(data: any) {
    const result = await deleteRole(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async updateUserEmail(data: any) {
    const result = await updateUserEmail(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async updateUserMobile(data: any) {
    const result = await updateUserMobile(data);
    return Promise.resolve(result);
  }
}

export const AccountModule = getModule(Account);
