<template>
  <div class="login-container">
    <div class="header">
      <img src="~assets/images/app_logo.png" alt="" />
      <span>{{ typeName }}</span>
    </div>
    <!--登录    -->
    <van-form v-if="typeName === '登录'" @submit="onLogin">
      <div class="field">
        <van-field v-model="loginParams.model.username" name="username" label="用户名" placeholder="用户名" :rules="loginParams.rules.username" clearable />
      </div>
      <div class="field">
        <van-field v-model="loginParams.model.password" type="password" name="password" label="密码" placeholder="密码" :rules="loginParams.rules.password" clearable />
      </div>
      <div style="margin: 32px 16px">
        <van-button round block type="info" native-type="submit" :loading="loginParams.loading">提交</van-button>
      </div>
    </van-form>
    <!--    注册-->
    <van-form v-if="typeName === '注册'" @submit="onRegister">
      <div class="field">
        <van-field v-model="registerParams.model.username" name="username" label="用户名" placeholder="用户名" :rules="registerParams.rules.username" />
      </div>
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <p class="rules-desc">
            {{ usernameRulesText }}
          </p>
        </template>
      </van-cell>
      <div class="field">
        <van-field v-model="registerParams.model.password" type="password" name="password" label="密码" placeholder="密码" :rules="registerParams.rules.password" />
      </div>
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <p class="rules-desc">{{ passwordRulesText }}</p>
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
      <div style="margin: 32px 16px">
        <van-button round block type="info" native-type="submit" :loading="registerParams.loading">提交</van-button>
      </div>
    </van-form>
    <!--重置密码-->
    <van-form v-if="typeName === '忘记密码'" @submit="onResetPsw">
      <div class="field">
        <van-field v-model="resetParams.model.username" name="username" label="用户名" placeholder="用户名" :rules="resetParams.rules.username" />
      </div>
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <p class="rules-desc">重置密码，系统将会发送一封邮件到您账号绑定的邮箱，请注意查收</p>
        </template>
      </van-cell>
      <div style="margin: 32px 16px">
        <van-button round block type="info" native-type="submit" :loading="resetParams.loading">提交</van-button>
      </div>
    </van-form>
    <!--    设置新密码-->
    <van-form v-if="typeName === '设置新密码'" @submit="onSetPsw">
      <div class="field">
        <van-field v-model="setParams.model.username" name="username" label="用户名" placeholder="用户名" :rules="setParams.rules.username" readonly />
      </div>
      <div class="field">
        <van-field v-model="setParams.model.password" type="password" name="password" label="密码" placeholder="密码" :rules="setParams.rules.password" />
      </div>
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <p class="rules-desc">{{ passwordRulesText }}</p>
        </template>
      </van-cell>
      <div class="field">
        <van-field v-model="setParams.model.rePassword" type="password" name="rePassword" label="确认密码" placeholder="密码" :rules="setParams.rules.rePassword" />
      </div>
      <div style="margin: 32px 16px">
        <van-button round block type="info" native-type="submit" :loading="setParams.loading">提交</van-button>
      </div>
    </van-form>
    <van-popup v-model="registerParams.showArea" position="bottom">
      <van-area :area-list="registerParams.areaList" @confirm="onConfirmPickAddress" @cancel="registerParams.showArea = false" />
    </van-popup>
    <div class="link">
      <div v-if="typeName === '登录'" class="forgot" @click="forgotPassword">忘记密码</div>
      <span v-if="typeName === '登录'" class="split"></span>
      <div v-if="typeName === '注册' || typeName === '忘记密码'" class="login" @click="login">登录</div>
      <div v-if="typeName === '登录'" class="register" @click="register">注册账号</div>
    </div>
    <div v-if="typeName === '登录'" class="back">
      <div @click="back">
        <van-icon name="arrow-left" />
        <span>回首页</span>
      </div>
    </div>
  </div>
</template>

<script>
import { areaList } from '@vant/area-data';
import { cloneDeep } from 'lodash';
import { rsaEncrypt } from '~/utils/tools';

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
  address: '',
};
const resetModel = {
  username: '',
};
const setModel = {
  username: '',
  password: '',
  rePassword: '',
};
export default {
  middleware: 'no-token',
  data() {
    return {
      passwordRulesText: '密码由6-20位字母、数字、特殊符号组成，不能有空格，不能有中文，必须包含！@#￥%&*等特殊字符至少一个，首字母大写',
      usernameRulesText:
        '用户名由6-20位字母、数字、下划线组成，必须包含字母和数字，不能以数字开头，不能以下划线结尾，不能连续出现两个下划线，不能包含空格，不能包含中文，不能包含特殊字符，不能下划线开头',
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
      resetParams: {
        loading: false,
        model: cloneDeep(resetModel),
        rules: {
          username: [{ required: true, message: '请填写用户名' }],
        },
      },
      setParams: {
        loading: false,
        model: cloneDeep(setModel),
        setParams: {
          token: '',
        },
        rules: {
          username: [{ required: true, message: '请填写用户名' }],
          password: [
            {
              required: true,
              message: '请填写合法密码',
              validator: (value) => {
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
                return value === this.setParams.model.password;
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    async initPage() {
      const { fr, token, username } = this.$route.query;
      if (fr === 'set-pwd') {
        try {
          await this.$store.dispatch('modules/user/checkResetPasswordToken', {
            token,
          });
          this.setParams.model.username = username;
          this.setParams.model.password = '';
          this.setParams.model.rePassword = '';
          this.setParams.setParams.token = token;
          this.typeName = '设置新密码';
        } catch (e) {
          this.$toast('链接失效，请重新获取');
          this.typeName = '登录';
          this.loginParams.model = cloneDeep(loginModel);
          //  删除url多余的参数
          await this.$router.replace({
            path: this.$route.path,
            query: {},
          });
        }
      }
    },
    async onLogin() {
      try {
        this.loginParams.loading = true;
        await this.$store.dispatch('modules/user/login', {
          username: this.loginParams.model.username,
          password: this.loginParams.model.password,
        });
        this.loginParams.loading = false;
        this.$router.push('/');
      } catch (e) {
        this.loginParams.loading = false;
      }
    },
    async onRegister() {
      try {
        this.registerParams.loading = true;
        await this.$store.dispatch('modules/user/register', {
          gender: this.registerParams.model.gender,
          nickname: `${this.registerParams.model.username} 的昵称`,
          username: this.registerParams.model.username,
          email: this.registerParams.model.email,
          password: rsaEncrypt(this.registerParams.model.password),
          address: this.registerParams.model.address,
        });
        this.registerParams.loading = false;
        this.registerParams.model = cloneDeep(registerModel);
        this.loginParams.model = cloneDeep(loginModel);
        this.$toast('注册成功，请重新登录');
        this.typeName = '登录';
      } catch (e) {
        this.registerParams.loading = false;
      }
    },
    async onResetPsw() {
      try {
        this.resetParams.loading = true;
        await this.$store.dispatch('modules/user/resetPassword', {
          username: this.resetParams.model.username,
        });
        this.resetParams.loading = false;
        this.resetParams.model = cloneDeep(resetModel);
        this.loginParams.model = cloneDeep(loginModel);
        this.$toast('重置成功，请检查邮箱');
        this.typeName = '登录';
      } catch (e) {
        this.resetParams.loading = false;
      }
    },
    async onSetPsw() {
      try {
        this.setParams.loading = true;
        await this.$store.dispatch('modules/user/updateUserPassword', {
          username: this.setParams.model.username,
          password: rsaEncrypt(this.setParams.model.password),
          token: this.setParams.setParams.token,
        });
        await this.$router.replace({
          path: this.$route.path,
          query: {},
        });
        this.setParams.loading = false;
        this.setParams.model = cloneDeep(setModel);
        this.loginParams.model = cloneDeep(loginModel);
        this.$toast('设置成功，请重新登录');
        this.typeName = '登录';
      } catch (e) {
        this.setParams.loading = false;
      }
    },
    register() {
      this.registerParams.model = cloneDeep(registerModel);
      this.typeName = '注册';
    },
    login() {
      this.loginParams.model = cloneDeep(loginModel);
      this.typeName = '登录';
    },
    forgotPassword() {
      this.resetParams.model = cloneDeep(resetModel);
      this.typeName = '忘记密码';
    },
    onConfirmPickAddress(values) {
      const zhixiashi = ['北京市', '天津市', '上海市', '重庆市'];
      if (zhixiashi.includes(values[0].name)) {
        values.splice(0, 1);
      }
      this.registerParams.model.address = values.map((item) => item.name).join(';');
      this.registerParams.showArea = false;
    },
    openPickAddress() {
      this.registerParams.showArea = true;
    },
    back() {
      if (this.loginParams.loading) return;
      this.$router.push('/');
    },
  },
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
