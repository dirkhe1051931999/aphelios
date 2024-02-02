import Config from '~/utils/config';
import { isCdnUrl } from '~/utils/tools';

const userInfoCookieKey = `${Config.title} userInfo`;

const state = () => ({
  info: null,
  clientId: '',
  ipAddress: null,
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
  setIpAddress(state, ipAddress) {
    state.ipAddress = ipAddress;
  },
};

const actions = {
  async updateUserInfo({ commit, state }, { type, data }) {
    // data 的 key 首字母小写
    const result = await this.$axios.$post(`/h5/blog/user/update${type}`, data);
    const userInfo = this.$cookies.get(userInfoCookieKey);
    if (!userInfo) return Promise.resolve(true);
    if (type === 'Avatar') {
      userInfo.avatarUrl = Config.defaultCdnUrl + result;
      commit('setUserInfo', userInfo);
    } else {
      const key = type.charAt(0).toLowerCase() + type.slice(1);
      userInfo[key] = data[key];
      commit('setUserInfo', userInfo);
    }
    return Promise.resolve(true);
  },
  async login({ commit, state }, data) {
    try {
      const result = await this.$axios.$post('/h5/blog/auth/login', data);
      if (isCdnUrl(result.avatarUrl)) {
        result.avatarUrl = Config.oldCdnUrl + result.avatarUrl;
      } else {
        result.avatarUrl = Config.defaultCdnUrl + result.avatarUrl;
      }
      commit('setUserInfo', result);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async register({ commit, state }, data) {
    try {
      await this.$axios.$post('/h5/blog/auth/register', data);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async resetPassword({ commit, state }, data) {
    try {
      await this.$axios.$post('/h5/blog/auth/resetPassword', data);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async checkResetPasswordToken({ commit, state }, data) {
    try {
      await this.$axios.$post('/h5/blog/auth/checkResetPasswordToken', data);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async updateUserPassword({ commit, state }, data) {
    try {
      await this.$axios.$post('/h5/blog/auth/updateUserPassword', data);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async sendChangeEmailCode({ commit, state }, data) {
    try {
      await this.$axios.$post('/h5/blog/user/sendChangeEmailCode', data);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  async updateEmail(context, data) {
    await context.dispatch('updateUserInfo', {
      type: 'Email',
      data,
    });
    return Promise.resolve(true);
  },
  async updateNickname(context, data) {
    await context.dispatch('updateUserInfo', {
      type: 'Nickname',
      data,
    });
    return Promise.resolve(true);
  },
  async updateGender(context, data) {
    await context.dispatch('updateUserInfo', {
      type: 'Gender',
      data,
    });
    return Promise.resolve(true);
  },
  async updateDescription(context, data) {
    await context.dispatch('updateUserInfo', {
      type: 'Description',
      data,
    });
    return Promise.resolve(true);
  },
  async updateAddress(context, data) {
    await context.dispatch('updateUserInfo', {
      type: 'Address',
      data,
    });
    return Promise.resolve(true);
  },
  async updateAvatar(context, data) {
    await context.dispatch('updateUserInfo', {
      type: 'Avatar',
      data,
    });
    return Promise.resolve(true);
  },
  async logout({ commit, state }, data) {
    try {
      await this.$axios.$post('/h5/blog/auth/logout', data);
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
  async getIP({ commit, state }, data) {
    try {
      const result = await this.$axios.$get('/common/getIP');
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
  ipAddress: (state) => {
    return state.ipAddress;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
