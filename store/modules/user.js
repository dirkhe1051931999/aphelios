const state = () => ({
  info: null,
});

const mutations = {
  setUserInfo(state, info) {
    state.info = info;
  },
};

const actions = {
  async fetchUserInfo({ commit }) {
    // 你的 API 请求逻辑
    const info = await fetch('/api/user').then((res) => res.json());
    commit('setUserInfo', info);
  },
  async login({ commit, state }, data) {
    try {
      const result = await this.$axios.$post('/blog/login', data);
      console.log(result);
    } catch (e) {
      consoel.log(e);
    }
  },
};

const getters = {
  userInfo: (state) => {
    return state.info;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
