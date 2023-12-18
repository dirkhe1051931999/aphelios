const state = () => ({
  postDetail: {},
});

const mutations = {
  SET_POST_DETAIL(state, postDetail) {
    state.postDetail = postDetail;
  },
};

const actions = {
  async getPostLevel1CommentsById({ commit }, data) {
    try {
      console.log();
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
};

const getters = {
  postDetail: (state) => {
    return state.postDetail;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
