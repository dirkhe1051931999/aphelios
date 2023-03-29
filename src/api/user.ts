import { request } from 'src/boot/axios';

const api = {
  login: '/management/blog/auth/login',
  signOut: '/management/blog/auth/signOut',
  changePassword: '/management/blog/auth/changePassword',
  getUserInfo: '/management/blog/auth/getUserInfo',
  getVerifyCode: '/management/blog/auth/getVerifyCode',
  forgotPassword: '/management/blog/auth/forgotPassword',
  checkToken: '/management/blog/auth/checkToken',
  changePasswordWithOutOld: '/management/blog/auth/changePasswordWithOutOld',
};
export const login = (data: any): any =>
  request({
    url: api.login,
    method: 'post',
    data,
  });
export const changePassword = (data: any): any =>
  request({
    url: api.changePassword,
    method: 'post',
    data,
  });
export const signOut = (data: any): any =>
  request({
    url: api.signOut,
    method: 'post',
    data,
  });
export const getUserInfo = (data: any): any =>
  request({
    url: api.getUserInfo,
    method: 'get',
    params: data,
  });
export const getVerifyCode = (data: any): any =>
  request({
    url: api.getVerifyCode,
    method: 'post',
    data,
  });
export const forgotPassword = (data: any): any =>
  request({
    url: api.forgotPassword,
    method: 'post',
    data,
  });
export const changePasswordWithOutOld = (data: any): any =>
  request({
    url: api.changePasswordWithOutOld,
    method: 'post',
    data,
  });
export const checkToken = (data: any): any =>
  request({
    url: api.checkToken,
    method: 'post',
    data,
  });
