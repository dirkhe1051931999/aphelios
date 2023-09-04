import {request} from 'src/boot/axios';

const api = {
  addPostSurvey: '/management/blog/post_survey/addPostSurvey',
  updatePostSurvey: '/management/blog/post_survey/updatePostSurvey',
  deletePostSurvey: '/management/blog/post_survey/deletePostSurvey',
};
export const addPostSurvey = (data: any): any =>
  request ({
    url: api.addPostSurvey,
    method: 'post',
    data,
  });
export const updatePostSurvey = (data: any): any =>
  request ({
    url: api.updatePostSurvey,
    method: 'post',
    data,
  });
export const deletePostSurvey = (data: any): any =>
  request ({
    url: api.deletePostSurvey,
    method: 'post',
    data,
  });
