import Config from '~/utils/config';

export default async function ({ store, req, app, res }) {
  const key = `${Config.title} ip_address`;

  // 服务器端操作
  if (process.server) {
    if (!app.$cookies.get(key)) {
      const result = await store.dispatch('modules/user/getIP');
      store.commit('modules/user/setIpAddress', result);
      app.$cookies.set(key, result, {
        path: '/',
        maxAge: 60 * 60,
        httpOnly: true,
      });
    } else {
      store.commit('modules/user/setIpAddress', app.$cookies.get(key));
    }
  }
}
