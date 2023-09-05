const state = () => ({
  postList: {},
  postChannels: [],
  activeChannelId: '383622c55f1643ab977aef886a7bc53e',
  currentChannel: {},
});

const mutations = {
  SET_POST_LIST(state, postList) {
    state.postList = postList;
  },
  SET_POST_CHANNELS(state, postChannels) {
    state.postChannels = postChannels;
  },
  SET_ACTIVE_CHANNEL_ID(state, activeChannelId) {
    state.activeChannelId = activeChannelId;
    state.currentChannel = state.postChannels.find((channel) => channel.id === activeChannelId);
  },
  SET_CURRENT_CHANNEL(state, currentChannel) {
    state.currentChannel = currentChannel;
  },
};

const actions = {
  async fetchPostList({ commit, state }) {
    const activeChannelId = state.activeChannelId;
    const postList = state.postList;
    const currentPostList = postList[activeChannelId];
    if (currentPostList.lock) {
      return;
    }
    currentPostList.lock = true;
    currentPostList.loading = true;
    const { total, pageData } = await this.$axios.$get('/blog/getPostList', {
      params: {
        channelId: state.activeChannelId,
      },
    });
    currentPostList.lock = false;
    currentPostList.loading = false;
    const canSetPostList = currentPostList && !currentPostList.finished;
    if (canSetPostList) {
      const newPostList = Object.assign(state.postList, {
        [activeChannelId]: {
          total,
          pageData: currentPostList.pageData.concat(pageData),
          loading: false,
          finished: pageData.length === 0,
          page: currentPostList.page + 1,
          lock: false,
        },
      });
      commit('SET_POST_LIST', newPostList);
    }
    return Promise.resolve();
  },
  async fetchPostChannels({ commit, state }) {
    const { pageData } = await this.$axios.$get('/blog/getAllChannel');
    const currentChannel = pageData.find((channel) => channel.id === state.activeChannelId);
    const postList = {};
    pageData.forEach((channel) => {
      postList[channel.id] = {
        total: 0,
        pageData: [],
        loading: false,
        finished: false,
        page: 0,
        lock: false,
      };
    });
    commit('SET_POST_LIST', postList);
    commit('SET_CURRENT_CHANNEL', currentChannel);
    commit('SET_POST_CHANNELS', pageData);
  },
};

const getters = {
  postList: (state) => {
    return state.postList;
  },
  postChannels: (state) => {
    return state.postChannels;
  },
  activeChannelId: (state) => {
    return state.activeChannelId;
  },
  currentChannel: (state) => {
    return state.currentChannel;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
