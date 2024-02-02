const state = () => ({
  userDetail: {},
  pageToBottom: false,
  lockPageToBottom: false,
});

const mutations = {
  SET_USER_DETAIL(state, userDetail) {
    state.userDetail = userDetail;
  },
  SET_PAGE_TO_BOTTOM(state, pageToBottom) {
    state.pageToBottom = pageToBottom;
  },
  SET_LOCK_PAGE_TO_BOTTOM(state, lockPageToBottom) {
    state.lockPageToBottom = lockPageToBottom;
  },
};

const actions = {
  async getUserComments({ commit }, data) {
    try {
      const result = await this.$axios.post(`/h5/blog/post/getUserComments`, data);
      return Promise.resolve(result.data);
    } catch (e) {}
  },
};

const getters = {
  userDetail: (state) => {
    return state.userDetail;
  },
  pageToBottom: (state) => {
    return state.pageToBottom;
  },
  lockPageToBottom: (state) => {
    return state.lockPageToBottom;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
