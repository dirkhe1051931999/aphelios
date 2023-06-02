import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import globalMessage from 'src/utils/notify';
import setting from 'src/setting.json';
import { UserModule } from 'src/store/modules/user';
import router from 'src/router';
import { Loading } from 'quasar';
import { v4 as uuidv4 } from 'uuid';
import SHA256 from 'sha256';
import { AppModule } from 'src/store/modules/app';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const isPro = process.env.NODE_ENV === 'production';
axios.defaults.timeout = 1500 * 1000;
axios.defaults.baseURL = isPro ? setting.pro : setting.ip;
// Request interceptors
axios.interceptors.request.use(
  (config: any) => {
    config.data = config.data || {};
    config.params = config.params || {};
    // // 获取header头内容
    if (config.method === 'post' && config.data.getResHeader) {
      delete config.data.getResHeader;
      config.getResHeader = true;
    }
    if (config.method === 'get' && config.params.getResHeader) {
      delete config.params.getResHeader;
      config.getResHeader = true;
    }
    config.headers['Language'] = 'zh_CN';
    if (['/management/blog/auth/checkToken', '/management/blog/auth/changePasswordWithOutOld'].includes(config.url)) {
      config.headers['Authorization'] = `Bearer ${config.data.token}`;
    } else if (UserModule.token) {
      config.headers['Authorization'] = `Bearer ${UserModule.token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    globalMessage.show({ type: 'error', content: error });
    Promise.reject(error);
  }
);

// Response interceptors
axios.interceptors.response.use(
  (response: any) => {
    const errorFuc = (response: any) => {
      const { code, message } = response.data;
      if (['401'].includes(String(code))) {
        /* token无效 */
        UserModule.ResetToken();
        router.push(`/login?redirect=${router.currentRoute.value.path}`);
        globalMessage.show({
          type: 'error',
          content: message || setting.defaultErrorMsg,
        });
        Loading.hide();
        return Promise.reject(code);
      } else {
        /* 错误提示 */
        globalMessage.show({
          type: 'error',
          content: message || setting.defaultErrorMsg,
        });
        Loading.hide();
        return Promise.reject('error');
      }
    };
    const successFuc = (response: any) => {
      if (response.config.getResHeader) {
        if (response.data instanceof Blob) {
          // 如果是blob获取header头内容
          return Promise.resolve(
            Object.assign(
              { blob: response.data },
              {
                ...response.headers,
                'content-disposition': window.decodeURIComponent(response.headers['content-disposition'] || ''),
              }
            )
            // Object.assign({ blob: response.data }, response.headers)
          );
        } else {
          return Promise.resolve(Object.assign(response.data.data, response.headers));
        }
      } else {
        return Promise.resolve(response.data.data || {});
      }
    };
    if (response.data instanceof Blob) {
      let responseBak = response;
      /* 如果是blob */
      return new Promise((resolve) => {
        var reader: any = new FileReader();
        reader.readAsBinaryString(response.data);
        reader.addEventListener('loadend', () => {
          if (reader.result.indexOf('code') !== -1 && reader.result.indexOf('message') !== -1 && reader.result.indexOf('pdf') === -1) {
            response.data = JSON.parse(reader.result);
            resolve(errorFuc(response));
          } else {
            resolve(successFuc(responseBak));
          }
        });
      });
    } else {
      /* 不是blob */
      const { code, success } = response.data;
      const isMinio = response.config.url.includes(setting.minio);
      const pass = [isMinio];
      if (['/management/blog/auth/checkToken', '/management/blog/auth/changePasswordWithOutOld'].includes(response.config.url) || !pass.includes(false)) {
        return Promise.resolve(response.data);
      } else if (!code || !success || !setting.succCode.includes(String(code))) {
        return errorFuc(response);
      } else if (code && !success && ['119'].includes(String(code))) {
        return Promise.resolve({ errorCode: code });
      } else {
        return successFuc(response);
      }
    }
  },
  (error: any) => {
    if (error.config && error.config.url.includes('/login')) {
      console.info(error);
      globalMessage.show({ type: 'error', content: setting.defaultErrorMsg });
    }
    Loading.hide();
    return Promise.reject('error');
  }
);

const api = axios.create({
  baseURL: isPro ? setting.pro : setting.ip,
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, axios as request };
