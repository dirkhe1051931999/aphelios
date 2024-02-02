import Vue from 'vue';

function auth(el, binding, vnode) {
  const vm = vnode.context;
  const { value } = binding;
  const { $store } = vm;
  const userInfo = $store.getters['modules/user/userInfo'];
  const isFixedFwPage = $store.getters['modules/fixed_fw_page/pageVisible'];

  if (!userInfo) {
    if (isFixedFwPage) {
      $store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', false);
    }
    vm.$router.push({
      path: '/login',
      query: {
        redirect: vm.$route.fullPath,
      },
    });
  }
}

Vue.directive('authenticate', {
  bind(el, binding, vnode) {},
  inserted(el, binding, vnode) {
    // 监听点击事件
    el.addEventListener(
      'click',
      () => {
        auth(el, binding, vnode);
      },
      true,
    );
  },
  update(el, binding, vnode, oldVnode) {
    // 组件更新时调用
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    // 组件更新完成后调用
  },
  unbind(el, binding, vnode) {
    // 移除事件监听
    el.removeEventListener(
      'click',
      () => {
        auth(el, binding, vnode);
      },
      true,
    );
  },
});
