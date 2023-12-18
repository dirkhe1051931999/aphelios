<template>
  <div class="editor-container">
    <van-nav-bar title="编辑" @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="black" size="20px" />
      </template>
    </van-nav-bar>
    <div v-if="type !== 'email'">
      <van-field v-if="type === 'address'" v-model="address" label="点击选择地址" placeholder="请输入" readonly @click="showArea = true" />
      <van-field
        v-if="type === 'textarea' || type === 'address'"
        v-model="message"
        rows="2"
        autosize
        :label="editorInfo.label"
        type="textarea"
        maxlength="50"
        placeholder="请输入"
        show-word-limit
        border
        clearable
      />
      <van-field v-if="type === 'text'" v-model="text" :label="editorInfo.label" placeholder="请输入" clearable border />
      <van-popup v-model="showArea" position="bottom">
        <van-area :area-list="areaList" @confirm="onConfirmPickAddress" @cancel="showArea = false" />
      </van-popup>
      <div class="submit">
        <van-button round block type="info" @click="onUpdateInfo">确认</van-button>
      </div>
    </div>
    <div v-if="type === 'email'" class="update-email">
      <van-form @submit="onUpdateEmail">
        <van-field v-model="updateEmail.params.email" name="邮箱" label="邮箱" placeholder="邮箱" :rules="updateEmail.rules.email" clearable />
        <van-field v-model="updateEmail.params.code" center clearable label="验证码" placeholder="请输入验证码" :rules="updateEmail.rules.code">
          <template #button>
            <van-button size="small" type="info" @click="sendChangeEmailCode" native-type="button" :disabled="updateEmail.lockCount">
              {{ updateEmail.lockCount ? `${updateEmail.count} 秒后重发` : '发送验证码' }}
            </van-button>
          </template>
        </van-field>
        <div style="margin: 20px 16px">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { areaList } from '@vant/area-data';
import Mine from '~/components/Widget/Profile/Mine.vue';

export default {
  data() {
    return {
      label: '',
      message: '',
      text: '',
      type: '',
      address: '',
      updateKey: '',
      showArea: false,
      areaList,
      updateEmail: {
        count: 5,
        lockCount: false,
        params: {
          email: '',
          code: '',
        },
        rules: {
          email: [
            { required: true, message: '请填写邮箱' },
            {
              pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/,
              message: '邮箱格式不正确',
            },
          ],
          code: [{ required: true, message: '请填写验证码' }],
        },
      },
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['modules/user/userInfo'];
    },
    editorInfo() {
      return this.$store.getters['modules/profile/editorInfo'];
    },
  },
  watch: {
    editorInfo: {
      handler(val) {
        this.type = val.type;
        if (val.type === 'email') {
          this.updateEmail.params.email = val.text;
          return;
        }
        this.label = val.label;
        this.text = val.text;
        this.updateKey = val.updateKey;
        if (val.type === 'address') {
          this.address = val.message.split('&')[0];
          this.message = val.message.split('&')[1];
        } else {
          this.message = val.message;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async onUpdateEmail() {
      await this.$store.dispatch('modules/user/updateEmail', {
        email: this.updateEmail.params.email,
        code: this.updateEmail.params.code,
        username: this.userInfo.username,
      });
      this.$store.commit('modules/profile/SET_CURRENT_COMPONENT', Mine);
    },
    async onUpdateInfo() {
      if (this.type === 'address' && !this.address) {
        this.$toast('请选择地址');
        return;
      }
      if (this.type === 'textarea' && !this.message) {
        this.$toast('请输入内容');
        return;
      }
      if (this.type === 'text' && !this.text) {
        this.$toast('请输入内容');
        return;
      } else if (this.type === 'text' && this.text.length > 10) {
        this.$toast('昵称长度不能超过10个字符');
        return;
      }
      if (this.type === 'address') {
        await this.$store.dispatch(`modules/user/update${this.updateKey}`, {
          address: `${this.address}&${this.message}`,
          username: this.userInfo.username,
        });
      } else {
        await this.$store.dispatch(`modules/user/update${this.updateKey}`, {
          [this.updateKey.charAt(0).toLowerCase() + this.updateKey.slice(1)]: this.type === 'text' ? this.text : this.message,
          username: this.userInfo.username,
        });
      }
      this.$store.commit('modules/profile/SET_CURRENT_COMPONENT', Mine);
    },
    sendChangeEmailCode() {
      try {
        this.$store.dispatch('modules/user/sendChangeEmailCode', {
          email: this.updateEmail.params.email,
          username: this.userInfo.username,
        });
        this.$toast('发送成功，请在邮箱中查看');
        this.updateEmail.lockCount = true;
        const timer = setInterval(() => {
          this.updateEmail.count -= 1;
          if (this.updateEmail.count === 0) {
            clearInterval(timer);
            this.updateEmail.lockCount = false;
            this.updateEmail.count = 5;
          }
        }, 1000);
      } catch (e) {}
    },
    onClickLeft() {
      this.$store.commit('modules/profile/SET_CURRENT_COMPONENT', Mine);
    },
    onConfirmPickAddress(values) {
      const zhixiashi = ['北京市', '天津市', '上海市', '重庆市'];
      if (zhixiashi.includes(values[0].name)) {
        values.splice(0, 1);
      }
      this.address = values.map((item) => item.name).join(';');
      this.showArea = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $white-color;
  z-index: 999;

  .submit {
    padding: 20px 16px;
  }
}
</style>
