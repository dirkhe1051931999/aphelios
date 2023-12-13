import Config from '~/utils/config';

export default async function ({ store, req, app, res }) {
  const key = `${Config.title} client_id`;

  // 服务器端操作
  if (process.server) {
    if (!app.$cookies.get(key)) {
      const result = await store.dispatch('modules/user/getClientId');
      store.commit('modules/user/setClientId', result);
      app.$cookies.set(key, result, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
      });
    } else {
      store.commit('modules/user/setClientId', app.$cookies.get(key));
    }
  }
}
