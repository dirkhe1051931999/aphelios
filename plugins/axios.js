// plugins/axios.js
import Vue from 'vue';
import { Toast } from 'vant';

Vue.use(Toast);

export default function ({ $axios, redirect, app, store }) {
  // 请求拦截器
  $axios.onRequest((config) => {
    config.headers['Client-Type'] = 'h5';
    if (store.getters['modules/user/clientId']) {
      config.headers['Client-Id'] = store.getters['modules/user/clientId'];
    }
    if (store.getters['modules/user/userInfo']) {
      config.headers.Authorization = `Bearer ${store.getters['modules/user/userInfo'].token}`;
    }
    console.log('请求地址', '=>', config.url);
  });

  // 响应拦截器
  $axios.onResponse((response) => {
    if (response.status === 200) {
      // 对响应数据做点什么
      const success = response.data.success;
      const code = response.data.code;
      if (!success) {
        Toast(response.data.message);
        console.error(response.config.url, '=>', response.data.message);
        if (code === 401) {
          // 删除cookie
          store.commit('modules/user/removeUserInfo');
        }
        return Promise.reject(response.data.message);
      } else {
        return Promise.resolve(response.data);
      }
    } else {
      console.error(response.config.url, '=>', response.data.message);
      return Promise.reject(response.data.message);
    }
  });

  // 错误拦截器
  $axios.onError((error) => {
    return Promise.reject(error);
  });
  return $axios;
}
