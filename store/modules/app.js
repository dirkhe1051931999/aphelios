const state = () => ({
  bottomTabBar: [
    {
      name: 'home',
      icon: 'wap-home-o',
      activeIcon: 'wap-home',
      label: '首页',
    },
    {
      name: 'directory',
      icon: 'apps-o',
      activeIcon: 'apps-o',
      label: '目录',
    },
    {
      name: 'explore',
      icon: 'fire-o',
      activeIcon: 'fire',
      label: '发现',
    },
    {
      name: 'profile',
      icon: 'friends-o',
      activeIcon: 'friends',
      label: '我的',
    },
  ],
  activeTab: 'home',
  layoutHeadOptions: {
    title: '标题',
    showSearch: false,
    showShare: false,
    showMore: false,
  },
});

const mutations = {
  SET_ACTIVE_TAB(state, activeTab) {
    state.activeTab = activeTab;
  },
  SET_LAYOUT_HEAD_OPTIONS(state, options) {
    state.layoutHeadOptions = options;
  },
};

const actions = {};

const getters = {
  bottomTabBar: (state) => {
    return state.bottomTabBar;
  },
  activeTab: (state) => {
    return state.activeTab;
  },
  layoutHeadOptions: (state) => {
    return state.layoutHeadOptions;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
