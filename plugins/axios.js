// plugins/axios.js
import Toast from 'vant/lib/toast';

export default function ({ $axios, redirect, app }) {
  // 请求拦截器
  $axios.onRequest((config) => {
    console.log('请求地址', '=>', config.url);
  });

  // 响应拦截器
  $axios.onResponse((response) => {
    if (response.status === 200) {
      // 对响应数据做点什么
      const success = response.data.success;
      if (!success) {
        console.error(response.config.url, '=>', response.data.message);
      }
    } else {
      console.error(response.config.url, '=>', response.data.message);
    }
    return response.data;
  });

  // 错误拦截器
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (code !== 200) {
      console.error(error.config.url, '=>', error.response.data.message);
    }
    return Promise.reject(error);
  });
}
