import { request } from 'src/boot/axios';

const api = {
  getPostList: '/management/blog/post/getPostList',
  getPostListByCategoryId: 'management/blog/post/getPostListByCategoryId',
  getPostById: 'management/blog/post/getPostById',
  uploadPostImgs: '/management/blog/post/uploadPostImgs',
  addPost: '/management/blog/post/addPost',
  deletePost: 'management/blog/post/deletePost',
  updatePost: 'management/blog/post/updatePost',
  offlinePost: 'management/blog/post/offlinePost',
  publishPost: 'management/blog/post/publishPost',
  getAllChannel: 'management/blog/post_channel/getAllChannel',
  updateChannelPos: 'management/blog/post_channel/updateChannelPos',
  updateChannelName: 'management/blog/post_channel/updateChannelName',
  addChannel: 'management/blog/post_channel/addChannel',
  removeChannel: 'management/blog/post_channel/removeChannel',
  getAllSheet: 'management/blog/post_sheet_directory/getAllSheet',
  getAllDirectory: 'management/blog/post_sheet_directory/getAllDirectory',
  getAllChildDirectory: 'management/blog/post_sheet_directory/getAllChildDirectory',
  addSheet: 'management/blog/post_sheet_directory/addSheet',
  addDirectory: 'management/blog/post_sheet_directory/addDirectory',
  addChildDirectory: 'management/blog/post_sheet_directory/addChildDirectory',
  removeSheet: 'management/blog/post_sheet_directory/removeSheet',
  removeDirectory: 'management/blog/post_sheet_directory/removeDirectory',
  removeChildDirectory: 'management/blog/post_sheet_directory/removeChildDirectory',
  updateSheet: 'management/blog/post_sheet_directory/updateSheet',
  updateDirectory: 'management/blog/post_sheet_directory/updateDirectory',
  updateChildDirectory: 'management/blog/post_sheet_directory/updateChildDirectory',
  getAllPostAuthor: 'management/blog/post_author/getAllPostAuthor',
  addPostAuthor: 'management/blog/post_author/addPostAuthor',
  removePostAuthor: 'management/blog/post_author/removePostAuthor',
  updatePostAuthor: 'management/blog/post_author/updatePostAuthor',
  verifyCompanyAuthor: 'management/blog/post_author/verifyCompanyAuthor',
  getCompanyAuthorVerifyInfo: 'management/blog/post_author/getCompanyAuthorVerifyInfo',
  removeCompanyAuthorVerify: 'management/blog/post_author/removeCompanyAuthorVerify',
};

export const getPostList = (data: any): any =>
  request({
    url: api.getPostList,
    method: 'post',
    data,
  });
export const getPostListByCategoryId = (data: any): any =>
  request({
    url: api.getPostListByCategoryId,
    method: 'post',
    data,
  });
export const getPostById = (data: any): any =>
  request({
    url: api.getPostById,
    method: 'post',
    data,
  });

export const uploadPostImgs = (data: any): any =>
  request({
    url: api.uploadPostImgs,
    method: 'post',
    data,
  });
export const addPost = (data: any): any =>
  request({
    url: api.addPost,
    method: 'post',
    data,
  });
export const deletePost = (data: any): any =>
  request({
    url: api.deletePost,
    method: 'post',
    data,
  });
export const updatePost = (data: any): any =>
  request({
    url: api.updatePost,
    method: 'post',
    data,
  });
export const offlinePost = (data: any): any =>
  request({
    url: api.offlinePost,
    method: 'post',
    data,
  });
export const publishPost = (data: any): any =>
  request({
    url: api.publishPost,
    method: 'post',
    data,
  });
export const getAllChannel = (data: any): any =>
  request({
    url: api.getAllChannel,
    method: 'post',
    data,
  });
export const updateChannelPos = (data: any): any =>
  request({
    url: api.updateChannelPos,
    method: 'post',
    data,
  });
export const updateChannelName = (data: any): any =>
  request({
    url: api.updateChannelName,
    method: 'post',
    data,
  });
export const addChannel = (data: any): any =>
  request({
    url: api.addChannel,
    method: 'post',
    data,
  });
export const removeChannel = (data: any): any =>
  request({
    url: api.removeChannel,
    method: 'post',
    data,
  });
export const getAllSheet = (data: any): any =>
  request({
    url: api.getAllSheet,
    method: 'post',
    data,
  });
export const getAllDirectory = (data: any): any =>
  request({
    url: api.getAllDirectory,
    method: 'post',
    data,
  });
export const getAllChildDirectory = (data: any): any =>
  request({
    url: api.getAllChildDirectory,
    method: 'post',
    data,
  });
export const addSheet = (data: any): any =>
  request({
    url: api.addSheet,
    method: 'post',
    data,
  });
export const addDirectory = (data: any): any =>
  request({
    url: api.addDirectory,
    method: 'post',
    data,
  });
export const addChildDirectory = (data: any): any =>
  request({
    url: api.addChildDirectory,
    method: 'post',
    data,
  });
export const removeSheet = (data: any): any =>
  request({
    url: api.removeSheet,
    method: 'post',
    data,
  });
export const removeDirectory = (data: any): any =>
  request({
    url: api.removeDirectory,
    method: 'post',
    data,
  });
export const removeChildDirectory = (data: any): any =>
  request({
    url: api.removeChildDirectory,
    method: 'post',
    data,
  });
export const updateSheet = (data: any): any =>
  request({
    url: api.updateSheet,
    method: 'post',
    data,
  });
export const updateDirectory = (data: any): any =>
  request({
    url: api.updateDirectory,
    method: 'post',
    data,
  });
export const updateChildDirectory = (data: any): any =>
  request({
    url: api.updateChildDirectory,
    method: 'post',
    data,
  });
export const getAllPostAuthor = (data: any): any =>
  request({
    url: api.getAllPostAuthor,
    method: 'post',
    data,
  });
export const addPostAuthor = (data: any): any =>
  request({
    url: api.addPostAuthor,
    method: 'post',
    data,
  });
export const removePostAuthor = (data: any): any =>
  request({
    url: api.removePostAuthor,
    method: 'post',
    data,
  });
export const updatePostAuthor = (data: any): any =>
  request({
    url: api.updatePostAuthor,
    method: 'post',
    data,
  });
export const verifyCompanyAuthor = (data: any): any =>
  request({
    url: api.verifyCompanyAuthor,
    method: 'post',
    data,
  });
export const getCompanyAuthorVerifyInfo = (data: any): any =>
  request({
    url: api.getCompanyAuthorVerifyInfo,
    method: 'post',
    data,
  });
export const removeCompanyAuthorVerify = (data: any): any =>
  request({
    url: api.removeCompanyAuthorVerify,
    method: 'post',
    data,
  });
