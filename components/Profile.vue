<template>
  <div class="profile-container">
    <div class="header no-login">
      <div @click="toLogin">登录</div>
    </div>
    <div class="header login"></div>
    <van-cell title="消息" is-link />
    <van-cell title="收藏" is-link />
    <van-cell title="历史" is-link />
    <van-cell title="缓存" is-link />
    <van-cell title="设置" is-link />
    <van-cell title="深色模式" is-link />
    <van-cell title="反馈建议" is-link />
    <van-cell title="更多" is-link url="https://www.baidu.com" />
    <van-cell title="退出登录" is-link title-style="color:#e93030" />
  </div>
</template>

<script>
export default {
  name: 'Profile-Component',
  data() {
    return {};
  },
  methods: {
    toLogin() {
      this.$router.push('/login');
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.profile-container {
  .header.no-login {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: $primary-color;
      color: $white-color;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
