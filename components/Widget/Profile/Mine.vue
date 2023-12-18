<template>
  <div class="mine-container">
    <van-nav-bar title="编辑资料" @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="black" size="20px" />
      </template>
    </van-nav-bar>
    <van-notice-bar color="#a1a1a1" background="#f5f5f5" left-icon="info-o" mode="closeable"> 您填写的内容将用于个人页展示和内容推荐。 </van-notice-bar>
    <van-cell value="" is-link center @click="updateInfo('avatar', userInfo.avatarUrl)">
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <div class="pick-avatar-result">
          <van-image round width="68px" height="68px" :src="avatarParams.base64Avatar || userInfo.avatarUrl" />
          <van-icon v-if="avatarParams.base64Avatar" name="passed" @click.stop.prevent="confirmUploadAvatar" size="20px" />
          <van-icon v-if="avatarParams.base64Avatar" name="close" color="grey" @click.stop.prevent="cancelUploadAvatar" size="20px" />
        </div>
      </template>
    </van-cell>
    <van-cell title="昵称" is-link :value="userInfo.nickname" @click="updateInfo('nickname', userInfo.nickname)" />
    <van-cell title="性别" is-link :value="userInfo.gender === 1 ? '男' : '女'" @click="updateInfo('gender', userInfo.gender)" />
    <van-cell title="邮箱" is-link :value="userInfo.email" @click="updateInfo('email', userInfo.email)" />
    <van-cell title="所在地" is-link :label="userInfo.address" center @click="updateInfo('address', userInfo.address)" />
    <van-cell title="描述" is-link :label="userInfo.description" center @click="updateInfo('description', userInfo.description)" />
    <van-action-sheet v-model="genderParams.show" :actions="genderParams.actions" description="性别" @select="onGenderSelect" />
    <van-action-sheet v-model="avatarParams.show" :actions="avatarParams.actions" description="头像" @select="onAvatarSelect" />
    <input ref="uploadAvatar" type="file" accept=".jpg,.png" @change="uploadAvatarChange" class="hide" />
  </div>
</template>

<script>
import Editor from '~/components/Widget/Profile/Editor.vue';

export default {
  data() {
    return {
      genderParams: {
        show: false,
        actions: [
          { name: '男', subname: '', type: 1 },
          { name: '女', subname: '', type: 0 },
        ],
      },
      avatarParams: {
        show: false,
        actions: [
          { name: '拍照', subname: '', type: 1 },
          { name: '从相册选择', subname: '', type: 0 },
        ],
        base64Avatar: '',
        avatarFile: null,
      },
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['modules/user/userInfo'];
    },
  },
  methods: {
    onClickLeft() {
      this.$store.commit('modules/profile/SET_CURRENT_COMPONENT', null);
    },
    async onGenderSelect({ name, type }) {
      await this.$store.dispatch(`modules/user/updateGender`, {
        gender: type,
        username: this.userInfo.username,
      });
      this.genderParams.show = false;
    },
    onAvatarSelect({ name, type }) {
      this.avatarParams.show = false;
      if (type === 0) {
        this.$refs.uploadAvatar.click();
      }
    },
    uploadAvatarChange() {
      const file = this.$refs.uploadAvatar.files[0];
      this.avatarParams.avatarFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.avatarParams.base64Avatar = reader.result;
        this.$refs.uploadAvatar.value = '';
      };
    },
    confirmUploadAvatar() {
      // 最大10MB
      if (this.avatarParams.base64Avatar.length > 1024 * 1024 * 10) {
        this.$toast('图片大小不能超过10MB');
        return;
      }
      const formData = new FormData();
      formData.append('file', this.avatarParams.avatarFile);
      formData.append('username', this.userInfo.username);
      this.$store.dispatch(`modules/user/updateAvatar`, formData);
      this.avatarParams.base64Avatar = '';
    },
    cancelUploadAvatar() {
      this.avatarParams.base64Avatar = '';
    },
    updateInfo(key, value) {
      if (key === 'gender') {
        this.genderParams.show = true;
        if (value === 1) {
          this.genderParams.actions[0].subname = '已选';
          this.genderParams.actions[1].subname = '';
        } else {
          this.genderParams.actions[0].subname = '';
          this.genderParams.actions[1].subname = '已选';
        }
        return;
      }
      if (key === 'avatar') {
        this.avatarParams.show = true;
        return;
      }
      if (key === 'nickname') {
        this.$store.commit('modules/profile/SET_EDITOR_INFO', {
          label: '昵称',
          text: value,
          message: '',
          type: 'text',
          updateKey: 'Nickname',
        });
      } else if (key === 'description') {
        this.$store.commit('modules/profile/SET_EDITOR_INFO', {
          label: '描述',
          text: '',
          message: value,
          type: 'textarea',
          updateKey: 'Description',
        });
      } else if (key === 'address') {
        this.$store.commit('modules/profile/SET_EDITOR_INFO', {
          label: '所在地',
          text: '',
          message: `${this.userInfo.address}`,
          type: 'address',
          updateKey: 'Address',
        });
      } else if (key === 'email') {
        this.$store.commit('modules/profile/SET_EDITOR_INFO', {
          label: '邮箱',
          text: value,
          message: '',
          type: 'email',
        });
      }
      this.$store.commit('modules/profile/SET_CURRENT_COMPONENT', Editor);
    },
  },
};
</script>

<style lang="scss" scoped>
.mine-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $white-color;
  z-index: 99999;

  .pick-avatar-result {
    display: flex;
    align-items: center;

    & > .van-image {
      margin-right: 10px;
      border: 1px solid #eeeeee;
    }

    & > .van-icon {
      margin-left: 10px;
    }
  }
}
</style>
