// middleware/load-client-id.js
import Config from '~/utils/config';

const userInfoCookieKey = `${Config.title} userInfo`;

export default function ({ store, app }) {
  // 检查是否已经加载了 clientId，如果没有，则加载它
  if (store.getters['modules/user/userInfo'] === null) {
    const userinfo = app.$cookies.get(userInfoCookieKey);
    if (userinfo) {
      store.commit('modules/user/setUserInfo', userinfo);
    }
  }
}
