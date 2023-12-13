<template>
  <div class="login-container">
    <div class="header">
      <img src="~assets/images/app_logo.png" alt="" />
      <span>{{ typeName }}</span>
    </div>
    <van-form @submit="onSubmit" v-if="typeName === '登录'">
      <div class="field">
        <van-field v-model="loginParams.model.username" name="username" label="用户名" placeholder="用户名" :rules="loginParams.rules.username" clearable />
      </div>
      <div class="field">
        <van-field v-model="loginParams.model.password" type="password" name="password" label="密码" placeholder="密码" :rules="loginParams.rules.password" clearable />
      </div>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit" :loading="loginParams.loading">提交</van-button>
      </div>
    </van-form>
    <van-form @submit="onSubmit" v-if="typeName === '注册'">
      <div class="field">
        <van-field v-model="registerParams.model.username" name="username" label="用户名" placeholder="用户名" :rules="registerParams.rules.username" />
      </div>
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <p class="rules-desc">
            用户名由6-20位字母、数字、下划线组成，必须包含字母和数字，不能以数字开头，不能以下划线结尾，不能连续出现两个下划线，不能包含空格，不能包含中文，不能包含特殊字符，不能下划线开头
          </p>
        </template>
      </van-cell>
      <div class="field">
        <van-field v-model="registerParams.model.password" type="password" name="password" label="密码" placeholder="密码" :rules="registerParams.rules.password" />
      </div>
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <p class="rules-desc">密码由6-20位字母、数字、特殊符号组成，不能有空格，不能有中文，必须包含！@#￥%&*等特殊字符至少一个，首字母大写</p>
        </template>
      </van-cell>
      <div class="field">
        <van-field v-model="registerParams.model.rePassword" type="password" name="rePassword" label="确认密码" placeholder="密码" :rules="registerParams.rules.rePassword" />
      </div>
      <div class="field">
        <van-field v-model="registerParams.model.email" name="email" label="邮箱" placeholder="邮箱" :rules="registerParams.rules.email" />
      </div>
      <div class="field no-bg">
        <van-field name="gender" label="性别">
          <template #input>
            <van-radio-group v-model="registerParams.model.gender" direction="horizontal">
              <van-radio name="1">男</van-radio>
              <van-radio name="0">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
      <div class="field">
        <van-field readonly clickable name="area" :value="registerParams.model.address" label="地区选择" placeholder="点击选择省市区" @click="openPickAddress" />
      </div>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <van-popup v-model="registerParams.showArea" position="bottom">
      <van-area :area-list="registerParams.areaList" @confirm="onConfirmPickAddress" @cancel="registerParams.showArea = false" />
    </van-popup>
    <div class="link">
      <div class="forgot" v-if="typeName === '登录'" @click="forgotPassword">忘记密码</div>
      <span class="split" v-if="typeName === '登录'"></span>
      <div class="login" @click="login" v-if="typeName === '注册'">登录</div>
      <div class="register" @click="register" v-if="typeName === '登录'">注册账号</div>
    </div>
    <div class="back" v-if="typeName === '登录'">
      <div @click="back">
        <van-icon name="arrow-left" />
        <span>返回</span>
      </div>
    </div>
  </div>
</template>

<script>
import { areaList } from '@vant/area-data';
import { cloneDeep } from 'lodash';

const loginModel = {
  username: '',
  password: '',
};
const registerModel = {
  username: '',
  password: '',
  rePassword: '',
  email: '',
  gender: '1',
  description: '',
  area: '',
  address: '',
};
export default {
  middleware: 'no-token',
  data() {
    return {
      typeName: '登录',
      loginParams: {
        loading: false,
        model: cloneDeep(loginModel),
        rules: {
          username: [{ required: true, message: '请填写用户名' }],
          password: [{ required: true, message: '请填写密码' }],
        },
      },
      registerParams: {
        loading: false,
        showArea: false,
        areaList,
        model: cloneDeep(registerModel),
        rules: {
          username: [
            {
              required: true,
              message: '请填写合法用户名',
              validator: (value) => {
                // 用户名由6-20位字母、数字、下划线组成，必须包含字母和数字，不能以数字开头，不能以下划线结尾，不能连续出现两个下划线，不能包含空格，不能包含中文，不能包含特殊字符，不能下划线开头
                const reg = /^(?![0-9])(?!.*?_$)[a-zA-Z0-9_\u4E00-\u9FA5]{6,20}$/;
                return reg.test(value);
              },
            },
          ],
          password: [
            {
              required: true,
              message: '请填写合法密码',
              validator: (value) => {
                //   密码由6-20位字母、数字、特殊符号组成，不能有空格，不能有中文，必须包含！@#￥%&*等特殊字符至少一个，首字母大写
                const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{6,20}$/;
                return reg.test(value);
              },
            },
          ],
          rePassword: [
            {
              required: true,
              message: '两次密码不一致',
              validator: (value) => {
                return value === this.registerParams.model.password;
              },
            },
          ],
          email: [
            {
              required: true,
              message: '请填写合法邮箱',
              validator: (value) => {
                const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                return reg.test(value);
              },
            },
          ],
        },
      },
    };
  },
  methods: {
    async onSubmit() {
      this.loginParams.loading = true;
      await this.$store.dispatch('modules/user/login', {
        username: this.loginParams.model.username,
        password: this.loginParams.model.password,
      });
      this.loginParams.loading = false;
      this.$router.back();
    },
    register() {
      this.registerParams.model = cloneDeep(registerModel);
      this.typeName = '注册';
    },
    login() {
      this.loginParams.model = cloneDeep(loginModel);
      this.typeName = '登录';
    },
    forgotPassword() {},
    onConfirmPickAddress(values) {
      const zhixiashi = ['北京市', '天津市', '上海市', '重庆市'];
      if (zhixiashi.includes(values[0].name)) {
        values.splice(0, 1);
      }
      const address = values.map((item) => item.name).join(';');
      this.registerParams.model.address = address;
      this.registerParams.showArea = false;
    },
    openPickAddress() {
      this.registerParams.showArea = true;
    },
    back() {
      if (this.loginParams.loading) return;
      this.$router.back();
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.header {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }

  span {
    margin-top: 16px;
    font-size: 24px;
    font-weight: bold;
  }
}

.link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 48px 16px;

  .split {
    width: 1px;
    height: 12px;
    background: $subtle-text-color;
    margin: 0 12px;
  }

  .forgot,
  .register,
  .login {
    font-size: 14px;
    color: $primary-color;
  }
}

.rules-desc {
  font-size: 12px;
  color: $subtle-text-color;
  line-height: 1.5;
}

.field {
  margin: 16px;
  border: solid 1px #adadad;
  border-radius: 2px;

  :deep(.van-field__control) {
    background: #f5f5f5;
    padding: 4px 8px;
  }

  &.no-bg {
    :deep(.van-field__control) {
      background: #ffffff;
    }
  }
}

.back {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: $subtle-text-color;
  margin-bottom: 16px;

  span {
    margin-left: 4px;
  }
}
</style>
