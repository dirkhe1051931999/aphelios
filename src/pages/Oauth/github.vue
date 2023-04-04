<template>
  <div>
    <section class="text-center q-my-lg">
      <div class="fs-16">GitHub正在授权登录中，请稍后...</div>
    </section>
  </div>
</template>

<script lang="ts">
import { UserModule } from 'src/store/modules/user';
import { Component, Vue } from 'vue-facing-decorator';

@Component({ name: 'myComponent' })
export default class myComponent extends Vue {
  mounted() {
    this.getGithubLoginInfomation();
  }
  private async getGithubLoginInfomation() {
    console.log(this.$route.query.code);
    // const result = await UserModule.oauthGithub(this.$route.query.code as any);
    // console.log(result);
    // axios.get(`/oauth/github/github_oauth?code=${this.$route.query.code}`).then(res => {
    //   if (res.data.success === 1) {
    //     let guest = {
    //       userName: res.data.userName,
    //       avatar: res.data.avatar,
    //       id:res.data.id
    //     };
    //     window.localStorage.setItem('GITHUB_LOGIN_TOKEN', res.data.token);
    //     window.localStorage.setItem('GITHUB_LOGIN_GUEST', JSON.stringify(guest));
    //     let redirectUrl = window.localStorage.getItem('GITHUB_LOGIN_REDIRECT_URL');
    //     this.$router.push({ path: redirectUrl });
    //   }
    // })
  }
}
</script>

<style lang="scss" scoped></style>
