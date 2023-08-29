import { request } from 'src/boot/axios';

const api = {
  getAuthorCompanyList: '/management/blog/audit/getAuthorCompanyList',
  getAuthorCompanyDetail: '/management/blog/audit/getAuthorCompanyDetail',
  passAuthorCompany: '/management/blog/audit/passAuthorCompany',
  rejectAuthorCompany: '/management/blog/audit/rejectAuthorCompany',
  getPostAllCommnet: '/management/blog/audit/getPostAllCommnet',
  setPostCommentStatus: '/management/blog/audit/setPostCommentStatus',
  getAuthorNormalList: '/management/blog/audit/getAuthorNormalList',
  passAuthorNormal: '/management/blog/audit/passAuthorNormal',
  rejectAuthorNormal: '/management/blog/audit/rejectAuthorNormal',
};
export const getAuthorCompanyList = (data: any): any =>
  request({
    url: api.getAuthorCompanyList,
    method: 'post',
    data,
  });
export const getAuthorCompanyDetail = (data: any): any =>
  request({
    url: api.getAuthorCompanyDetail,
    method: 'post',
    data,
  });
export const passAuthorCompany = (data: any): any =>
  request({
    url: api.passAuthorCompany,
    method: 'post',
    data,
  });
export const rejectAuthorCompany = (data: any): any =>
  request({
    url: api.rejectAuthorCompany,
    method: 'post',
    data,
  });
export const getPostAllCommnet = (data: any): any =>
  request({
    url: api.getPostAllCommnet,
    method: 'post',
    data,
  });
export const setPostCommentStatus = (data: any): any =>
  request({
    url: api.setPostCommentStatus,
    method: 'post',
    data,
  });
export const getAuthorNormalList = (data: any): any =>
  request({
    url: api.getAuthorNormalList,
    method: 'post',
    data,
  });
export const passAuthorNormal = (data: any): any =>
  request({
    url: api.passAuthorNormal,
    method: 'post',
    data,
  });
export const rejectAuthorNormal = (data: any): any =>
  request({
    url: api.rejectAuthorNormal,
    method: 'post',
    data,
  });
