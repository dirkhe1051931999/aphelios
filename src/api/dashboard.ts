import { request } from 'src/boot/axios';

const api = {
  getOverview: '/management/dashboard/overview/getOverview',
  getPostTrends: '/management/dashboard/overview/getPostTrends',
  getChannelSheetUserAuthorLimit5: '/management/dashboard/overview/getChannelSheetUserAuthorLimit5',
};
export const getOverview = (data: any): any =>
  request({
    url: api.getOverview,
    method: 'post',
    data,
  });
export const getPostTrends = (data: any): any =>
  request({
    url: api.getPostTrends,
    method: 'post',
    data,
  });
export const getChannelSheetUserAuthorLimit5 = (data: any): any =>
  request({
    url: api.getChannelSheetUserAuthorLimit5,
    method: 'post',
    data,
  });
