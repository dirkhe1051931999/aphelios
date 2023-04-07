import { request } from 'src/boot/axios';

const api = {
  getPostList: '/management/blog/post/getPostList',
  getAuthor: 'management/blog/author/getAuthor',
  getCategories: '/management/blog/category/getCategories',
  getPostById: 'management/blog/post/getPostById',
};

export const getPostList = (data: any): any =>
  request({
    url: api.getPostList,
    method: 'post',
    data,
  });
export const getAuthor = (data: any): any =>
  request({
    url: api.getAuthor,
    method: 'post',
    data,
  });
export const getCategories = (data: any): any =>
  request({
    url: api.getCategories,
    method: 'post',
    data,
  });
export const getPostById = (data: any): any =>
  request({
    url: api.getPostById,
    method: 'post',
    data,
  });
