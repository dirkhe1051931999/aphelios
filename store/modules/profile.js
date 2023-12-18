const state = () => ({
  currentComponent: null,
  editorInfo: {
    label: '',
    text: '',
    message: '',
    type: '',
    updateKey: '',
  },
});

const mutations = {
  SET_CURRENT_COMPONENT(state, component) {
    state.currentComponent = component;
  },
  SET_EDITOR_INFO(state, info) {
    state.editorInfo = info;
  },
};

const actions = {};

const getters = {
  currentComponent: (state) => {
    return state.currentComponent;
  },
  editorInfo: (state) => {
    return state.editorInfo;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
