const state = () => ({
  authorDetail: {},
  pageToBottom: false,
  lockPageToBottom: false,
});

const mutations = {
  SET_AUTHOR_DETAIL(state, authorDetail) {
    state.authorDetail = authorDetail;
  },
  SET_PAGE_TO_BOTTOM(state, pageToBottom) {
    state.pageToBottom = pageToBottom;
  },
  SET_LOCK_PAGE_TO_BOTTOM(state, lockPageToBottom) {
    state.lockPageToBottom = lockPageToBottom;
  },
};

const actions = {
  async getAuthorPost({ commit }, data) {
    try {
      const result = await this.$axios.get(`/h5/blog/post/getAuthorPost`, {
        params: data,
      });
      return Promise.resolve(result.data);
    } catch (e) {}
  },
};

const getters = {
  authorDetail: (state) => {
    return state.authorDetail;
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
