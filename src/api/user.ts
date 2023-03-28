import { request } from 'src/boot/axios';

const api = {
  login: '/management/blog/auth/login',
  signOut: '/management/blog/auth/signOut',
};
export const login = (data: any): any =>
  request({
    url: api.login,
    method: 'post',
    data,
  });
export const signOut = (data: any): any =>
  request({
    url: api.signOut,
    method: 'get',
    params: data,
  });
