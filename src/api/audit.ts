import { request } from 'src/boot/axios';

const api = {
  getCompanyCertificationList: '/management/blog/audit/getCompanyCertificationList',
  passCompanyCertification: '/management/blog/audit/passCompanyCertification',
  rejectCompanyCertification: '/management/blog/audit/rejectCompanyCertification',
  getPostAllCommnet: '/management/blog/audit/getPostAllCommnet',
  setPostCommentStatus: '/management/blog/audit/setPostCommentStatus',
};
export const getCompanyCertificationList = (data: any): any =>
  request({
    url: api.getCompanyCertificationList,
    method: 'post',
    data,
  });
export const passCompanyCertification = (data: any): any =>
  request({
    url: api.passCompanyCertification,
    method: 'post',
    data,
  });
export const rejectCompanyCertification = (data: any): any =>
  request({
    url: api.rejectCompanyCertification,
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
