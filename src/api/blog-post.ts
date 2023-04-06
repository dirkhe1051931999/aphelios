import { request } from 'src/boot/axios';

const api = {
  getPostList: '/management/blog/post/getPostList',
};

export const getPostList = (data: any): any =>
  request({
    url: api.getPostList,
    method: 'post',
    data,
  });