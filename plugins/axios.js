// plugins/axios.js
import Toast from 'vant/lib/toast';

export default function ({ $axios, redirect, app }) {
  // 请求拦截器
  $axios.onRequest((config) => {
    console.log('请求地址：' + config.url);
  });

  // 响应拦截器
  $axios.onResponse((response) => {
    if (response.status === 200) {
      // 对响应数据做点什么
    }
    return response.data;
  });

  // 错误拦截器
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (code !== 200) {
      Toast.fail('网络异常，请稍后重试');
    }
    return Promise.reject(error);
  });
}
