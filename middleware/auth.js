// middleware/auth.js

export default function ({ store, redirect }) {
  // 检查 token 是否存在
  const userInfo = store.getters['modules/user/userInfo']; // 假设 token 存储在 Vuex 的 auth 模块的 state 中

  // 如果 token 不存在，重定向到首页
  if (!userInfo) {
    return redirect('/');
  }
}
