import Config from '~/utils/config';

const userInfoCookieKey = `${Config.title} userInfo`;
const state = () => ({
  info: null,
  clientId: '',
});

const mutations = {
  setUserInfo(state, info) {
    state.info = info;
    this.$cookies.set(userInfoCookieKey, JSON.stringify(info), {
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  },
  removeUserInfo(state) {
    state.info = null;
    if (this.$cookies.get(userInfoCookieKey)) {
      this.$cookies.remove(userInfoCookieKey);
    }
  },
  setClientId(state, clientId) {
    state.clientId = clientId;
  },
};

const actions = {
  async login({ commit, state }, data) {
    try {
      const result = await this.$axios.$post('/h5/blog/auth/login', data);
      commit('setUserInfo', result);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async logout({ commit, state }, data) {
    try {
      const result = await this.$axios.$post('/h5/blog/auth/logout', data);
      commit('removeUserInfo');
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async getClientId({ commit, state }, data) {
    try {
      const result = await this.$axios.$post('/common/generateClientId');
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async addComment({ commit, state }, data) {
    try {
      const result = await this.$axios.$post('/h5/blog/user/addComment', data);
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

const getters = {
  userInfo: (state) => {
    return state.info;
  },
  clientId: (state) => {
    return state.clientId;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
