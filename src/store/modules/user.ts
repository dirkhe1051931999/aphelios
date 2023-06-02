import axios from 'src/boot/axios';
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { getToken, setToken, removeToken, setUsername, removeUsername, getUsername, setPagePermissionID, getPagePermissionID, removePagePermissionID, removeDynamicRoutes } from 'src/utils/cookie';
import { resetRouter } from 'src/router';
import store from 'src/store';
import { changePassword, getVerifyCode, getUserInfo, login, signOut, forgotPassword, checkToken, changePasswordWithOutOld, oauthGithub } from 'src/api/user';
import { uid } from 'quasar';
import { TagsViewModule } from './tags';
import { enCrypty, sleep } from 'src/utils/tools';
import setting from 'src/setting.json';
import { getUserinfo, removeUserinfo, setUserinfo } from 'src/utils/localStorage';
import { PermissionModule } from './permission';

export interface IUserState {}

@Module({ dynamic: true, store, name: 'User', namespaced: true })
class User extends VuexModule implements IUserState {
  public token = getToken() || '';
  public username = getUsername() ? getUsername().split(',')[0] : '';
  public userInfo = getUserinfo() ? JSON.parse(getUserinfo()!) : {};
  public introduction = '';
  public pagePermissionId: any[] = getPagePermissionID() ? getPagePermissionID() : [];

  @Mutation
  public SET_PAGE_PERMISION_ID(arr: any) {
    this.pagePermissionId = arr;
  }
  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token;
  }
  @Mutation
  public SET_USERNAME(username: string) {
    this.username = username;
  }
  @Mutation
  public SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction;
  }
  @Mutation
  public SET_USERINFO(userinfo: any) {
    this.userInfo = userinfo;
  }
  // 登录
  @Action({ rawError: true })
  public async Login(data: any) {
    const { username, password, code } = data;
    let { token, pagePermissionId, email, id, errorCode, mobile, userType, avatar } = await login({ userName: username, password: enCrypty(password), code });
    if (errorCode && errorCode === '119') {
      return Promise.resolve(errorCode);
    }
    const userinfo = {
      token,
      username,
      mobile,
      email,
      userType,
      avatar,
      pagePermissionId,
      id,
    };
    setToken(token);
    setUsername(username);
    setUserinfo(JSON.stringify(userinfo));
    setPagePermissionID(pagePermissionId);
    this.SET_TOKEN(token);
    this.SET_USERNAME(username);
    this.SET_USERINFO(userinfo);
    this.SET_PAGE_PERMISION_ID(pagePermissionId);
    return Promise.resolve();
  }
  @Action({ rawError: true })
  public async oauthGithub(code: any) {
    let { token, pagePermissionId, email, id, mobile, username, userType, avatar } = await oauthGithub(code || '');
    pagePermissionId = JSON.parse(pagePermissionId);
    const userinfo = {
      token,
      username,
      mobile,
      email,
      userType,
      avatar,
      pagePermissionId,
      id,
    };
    setToken(token);
    setUsername(username);
    setUserinfo(JSON.stringify(userinfo));
    setPagePermissionID(pagePermissionId);
    this.SET_TOKEN(token);
    this.SET_USERNAME(username);
    this.SET_USERINFO(userinfo);
    this.SET_PAGE_PERMISION_ID(pagePermissionId);
    return Promise.resolve();
  }
  // 获取用户信息
  @Action({ rawError: true })
  public async getUserIntroduction() {
    sleep(2000);
    this.SET_INTRODUCTION('introduction');
    return Promise.resolve();
  }
  @Action({ rawError: true })
  public async getUserInfo(data: any) {
    const { id } = data;
    const result = await getUserInfo({ id });
    this.SET_INTRODUCTION('introduction');
    return Promise.resolve();
  }
  // 退出
  @Action({ rawError: true })
  public async LogOut() {
    await signOut({
      email: UserModule.userInfo.email,
      userName: UserModule.username,
      userId: UserModule.userInfo.id,
    });
    this.ResetToken();
    return Promise.resolve();
  }
  @Action({ rawError: true })
  public async changePassword(data: any) {
    const { username, oldPassword, newPassword } = data;
    await changePassword({ userName: username, oldPassword: enCrypty(oldPassword), newPassword: enCrypty(newPassword) });
    return Promise.resolve();
  }
  @Action({ rawError: true })
  public async getVerifyCode(data: any) {
    const { mobile, email } = await getVerifyCode(data);
    return Promise.resolve({ email, mobile });
  }
  @Action({ rawError: true })
  public async forgotPassword(data: any) {
    const { email, username } = data;
    await forgotPassword({ email, username });
    return Promise.resolve();
  }
  @Action({ rawError: true })
  public async checkToken(data: any) {
    const { token } = data;
    const { code } = await checkToken({ token });
    return Promise.resolve(code);
  }
  @Action({ rawError: true })
  public async changePasswordWithOutOld(data: any) {
    const result = await changePasswordWithOutOld({ token: data.token, password: enCrypty(data.password) });
    return Promise.resolve(result);
  }
  // 重置cookie
  @Action({ rawError: true })
  public ResetToken() {
    removeUsername();
    removeToken();
    resetRouter();
    removeUserinfo();
    removeDynamicRoutes();
    removePagePermissionID();
    TagsViewModule.delAllViews();
    this.SET_USERNAME('');
    this.SET_USERINFO({});
    this.SET_TOKEN('');
    this.SET_PAGE_PERMISION_ID([]);
    this.SET_INTRODUCTION('');
    PermissionModule.REMOVE_ROUTES([]);
  }
}

export const UserModule = getModule(User);
