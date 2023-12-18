const state = () => ({
  currentComponent: null,
  pageVisible: false,
});

const mutations = {
  SET_CURRENT_COMPONENT(state, component) {
    state.currentComponent = component;
  },
  SET_PAGE_VISIBLE(state, visible) {
    state.pageVisible = visible;
  },
};

const actions = {};

const getters = {
  currentComponent: (state) => {
    return state.currentComponent;
  },
  pageVisible: (state) => {
    return state.pageVisible;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
