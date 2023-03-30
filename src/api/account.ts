import { request } from 'src/boot/axios';

const api = {
  getAllUser: '/management/blog/user/getAllUser',
  getAllAvatar: '/management/blog/user/getAllAvatar',
  addUser: '/management/blog/user/addUser',
  updateUser: '/management/blog/user/updateUser',
  deleteUser: '/management/blog/user/deleteUser',
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
