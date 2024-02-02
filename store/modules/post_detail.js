const state = () => ({
  postDetail: {},
  pageToBottom: false,
  lockPageToBottom: false,
});

const mutations = {
  SET_POST_DETAIL(state, postDetail) {
    state.postDetail = postDetail;
  },
  SET_PAGE_TO_BOTTOM(state, pageToBottom) {
    state.pageToBottom = pageToBottom;
  },
  SET_LOCK_PAGE_TO_BOTTOM(state, lockPageToBottom) {
    state.lockPageToBottom = lockPageToBottom;
  },
};

const actions = {
  async getPostLevel1CommentsById({ commit }, data) {
    try {
      const result = await this.$axios.get(`/h5/blog/post/getPostLevel1CommentsById`, {
        params: data,
      });
      return Promise.resolve(result.data);
    } catch (e) {}
  },
  async getPostLevel2CommentsById({ commit }, data) {
    try {
      const result = await this.$axios.get(`/h5/blog/post/getPostLevel2CommentsById`, {
        params: data,
      });
      return Promise.resolve(result.data);
    } catch (e) {}
  },
  async addPostComment({ commit }, data) {
    try {
      const result = await this.$axios.post(`/h5/blog/user/addPostComment`, data);
      return Promise.resolve(result.data);
    } catch (e) {}
  },
  async replyUserComment({ commit }, data) {
    try {
      const result = await this.$axios.post(`/h5/blog/user/replyUserComment`, data);
      return Promise.resolve(result.data);
    } catch (e) {}
  },
  async addVote({ commit }, data) {
    try {
      const result = await this.$axios.post(`/h5/blog/user/addVote`, data);
      return Promise.resolve(result.data);
    } catch (e) {}
  },
};

const getters = {
  postDetail: (state) => {
    return state.postDetail;
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
