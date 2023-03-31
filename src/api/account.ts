import { request } from 'src/boot/axios';

const api = {
  getAllUser: '/management/blog/user/getAllUser',
  getAllAvatar: '/management/blog/user/getAllAvatar',
  addUser: '/management/blog/user/addUser',
  updateUser: '/management/blog/user/updateUser',
  deleteUser: '/management/blog/user/deleteUser',
  updateUserStatus: '/management/blog/user/updateUserStatus',
  unLockUser: '/management/blog/user/unLockUser',
  reSendUrl: '/management/blog/user/reSendUrl',
};

export const getAllUser = (data: any): any =>
  request({
    url: api.getAllUser,
    method: 'post',
    data,
  });
export const getAllAvatar = (data: any): any =>
  request({
    url: api.getAllAvatar,
    method: 'post',
    data,
  });
export const addUser = (data: any): any =>
  request({
    url: api.addUser,
    method: 'post',
    data,
  });
export const updateUser = (data: any): any =>
  request({
    url: api.updateUser,
    method: 'post',
    data,
  });
export const deleteUser = (data: any): any =>
  request({
    url: api.deleteUser,
    method: 'post',
    data,
  });
export const updateUserStatus = (data: any): any =>
  request({
    url: api.updateUserStatus,
    method: 'post',
    data,
  });
export const unLockUser = (data: any): any =>
  request({
    url: api.unLockUser,
    method: 'post',
    data,
  });
export const reSendUrl = (data: any): any =>
  request({
    url: api.reSendUrl,
    method: 'post',
    data,
  });
