import { cloneDeep } from 'lodash';

const state = () => ({
  postList: {
    '383622c55f1643ab977aef886a7bc53e': {
      pageData: [],
    },
  },
  postChannels: [],
  carouselData: [],
  politicalData: [],
  activeChannelId: '383622c55f1643ab977aef886a7bc53e',
  currentChannel: {},
  hotTop: {
    newsData: [],
    authorData: [],
    commentData: [],
  },
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
  SET_CAROUSEL_DATA(state, carouselData) {
    state.carouselData = carouselData;
  },
  SET_POLITICAL_DATA(state, politicalData) {
    state.politicalData = politicalData;
  },
  UPDATE_POST_LIST_LOADING_BY_CHANNEL_ID(state, { channelId, loading }) {
    const postList = state.postList;
    const currentPostList = postList[channelId];
    if (currentPostList) {
      currentPostList.loading = loading;
    }
  },
  SET_HOT_TOP(state, hotTop) {
    state.hotTop = hotTop;
  },
};

const actions = {
  async fetchPostList({ commit, state }) {
    try {
      const activeChannelId = state.activeChannelId;
      const postList = cloneDeep(state.postList);
      const currentPostList = postList[activeChannelId];
      if (currentPostList.lock) {
        return;
      }
      currentPostList.lock = true;
      currentPostList.loading = true;
      const { total, pageData } = await this.$axios.$get('/h5/blog/post/getPostList', {
        params: {
          channelId: state.activeChannelId,
        },
      });
      currentPostList.lock = false;
      currentPostList.loading = false;
      const canSetPostList = currentPostList && !currentPostList.finished;
      if (canSetPostList) {
        const newPostList = Object.assign(postList, {
          [activeChannelId]: {
            total,
            pageData,
            loading: false,
            finished: pageData.length === 0,
            page: currentPostList.page + 1,
            lock: false,
          },
        });
        commit('SET_POST_LIST', newPostList);
      }
    } catch (e) {
      console.log(e);
    }
    return Promise.resolve();
  },
  async fetchPostChannels({ commit, state }) {
    const { pageData } = await this.$axios.$get('/h5/blog/post/getAllChannel');
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
  async fetchHomeHeadPost({ commit }) {
    const { carouselData, politicalData } = await this.$axios.$get('/h5/blog/post/getHomeHeadPost');
    commit('SET_CAROUSEL_DATA', carouselData);
    commit('SET_POLITICAL_DATA', politicalData);
  },
  async fetchHotTop({ commit }) {
    try {
      const result = await this.$axios.$get('/h5/blog/post/getHotTop');
      commit('SET_HOT_TOP', result);
    } catch (e) {
      console.log(e);
    }
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
  carouselData: (state) => {
    return state.carouselData;
  },
  politicalData: (state) => {
    return state.politicalData;
  },
  hotTop: (state) => {
    return state.hotTop;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
