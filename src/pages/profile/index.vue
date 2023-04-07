<template>
  <div>
    <div class="curved0"></div>
    <div class="card thin-shadow q-pa-md">
      <div class="left row items-center">
        <q-avatar class="m-r-10 fs-68">
          <img :src="avatar" />
        </q-avatar>
        <div class="q-ml-md">
          <p class="fs-20 q-pb-sm f-bold">{{ username }}</p>
          <p class="text-grey">{{ userTypeName }}</p>
        </div>
      </div>
      <!-- <div class="right">
        <div class="tab thin-shadow">
          <q-icon name="lightbulb" size="20px"></q-icon>
          <span class="q-ml-sm">App</span>
        </div>
      </div> -->
    </div>
    <div class="profile q-mt-xl row">
      <div class="setting w-p-30 thin-shadow q-pa-lg q-mr-lg">
        <div class="fs-18 f-bold q-pb-md">平台设置</div>
        <div class="account">
          <div class="fs-14 q-pb-md">账号</div>
          <ul>
            <li>
              <q-toggle label="Email me when someone follows me" v-model="switchModel.model1" dense class="q-mb-md" />
            </li>
            <li>
              <q-toggle label="Email me when someone answers on my post" v-model="switchModel.model2" dense class="q-mb-md" />
            </li>
            <li>
              <q-toggle label="Email me when someone mentions me" v-model="switchModel.model3" dense />
            </li>
          </ul>
        </div>
        <div class="application q-mt-md">
          <div class="fs-14 q-pb-md">应用</div>
          <ul>
            <li>
              <q-toggle label="New launches and projects" v-model="switchModel.model4" dense class="q-mb-md" />
            </li>
            <li>
              <q-toggle label="Monthly product updates" v-model="switchModel.model5" dense class="q-mb-md" />
            </li>
            <li>
              <q-toggle label="Subscribe to newsletter" v-model="switchModel.model6" dense />
            </li>
          </ul>
        </div>
      </div>
      <div class="setting w-p-30 thin-shadow q-pa-lg">
        <div class="fs-18 f-bold q-pb-md">个人信息</div>
        <div class="account">
          <div class="fs-14 q-pb-md">嗨，我是厄斐琉斯与拉露恩，决定： 如果你无法决定，答案是否定的。如果有两条同样困难的道路，选择短期内更痛苦的那条（避免痛苦是在制造平等的假象）。</div>
          <ul>
            <li class="q-mb-md h-40 lh-40">
              <span class="q-pr-md f-bold bold fs-16">邮箱：</span>
              <span v-if="!profileInfomation.showEdit.email">{{ defaultFill(email) }}</span>
              <TextToInput
                class="inline-block"
                v-if="profileInfomation.showEdit.email"
                :value="profileInfomation.params.email"
                :that="profileInfomation.params"
                :loading="profileInfomation.loading.email"
                @confirm="textToInputConfirmForEmail"
                @close="textToInputCloseForEmail"
              >
              </TextToInput>
              <span class="link-type q-ml-md" v-if="!profileInfomation.showEdit.email && canEdit" @click="(profileInfomation.showEdit.email = true), (profileInfomation.params.email = email || '')"
                >修改</span
              >
            </li>
            <li class="q-mb-md h-40 lh-40">
              <span class="q-pr-md f-bold bold fs-16">手机：</span>
              <span v-if="!profileInfomation.showEdit.mobile">{{ defaultFill(mobile) }}</span>
              <TextToInput
                class="inline-block"
                v-if="profileInfomation.showEdit.mobile"
                :value="profileInfomation.params.mobile"
                :that="profileInfomation.params"
                :loading="profileInfomation.loading.mobile"
                @confirm="textToInputConfirmForMobile"
                @close="textToInputCloseForMobile"
              >
              </TextToInput>
              <span class="link-type q-ml-md" v-if="!profileInfomation.showEdit.mobile" @click="(profileInfomation.showEdit.mobile = true), (profileInfomation.params.mobile = mobile || '')">{{
                mobile ? '修改' : '绑定'
              }}</span>
            </li>
            <li class="q-mb-md h-40 lh-40">
              <span class="q-pr-md f-bold bold fs-16">定位：</span>
              <span>{{ defaultFill(location) }}</span>
              <span class="link-type q-ml-md">获取定位</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AccountModule } from 'src/store/modules/account';
import { UserModule } from 'src/store/modules/user';
import { setUserinfo } from 'src/utils/localStorage';
import { isValidEmail, isValidMobilePhone } from 'src/utils/validate';
import { Component, Vue } from 'vue-facing-decorator';

@Component({ name: 'profileComponent' })
export default class profileComponent extends Vue {
  get username() {
    return UserModule.username;
  }
  get avatar() {
    return UserModule.userInfo.avatar;
  }
  get email() {
    return UserModule.userInfo.email;
  }
  get mobile() {
    return UserModule.userInfo.mobile;
  }
  get location() {
    return UserModule.userInfo.location;
  }
  get canEdit() {
    return UserModule.userInfo.userType !== 2;
  }
  get UserType() {
    return UserModule.userInfo.userType;
  }
  get userTypeName() {
    switch (UserModule.userInfo.userType) {
      case 0:
        return '管理员';
      case 1:
        return '普通用户';
      case 2:
        return '第三方登录用户';
      default:
        break;
    }
  }
  public switchModel = {
    model1: false,
    model2: true,
    model3: true,
    model4: false,
    model5: false,
    model6: false,
    model7: false,
  };
  public profileInfomation = {
    params: {
      email: '',
      mobile: '',
      location: '',
    },
    loading: {
      email: false,
      mobile: false,
      location: false,
    },
    showEdit: {
      email: false,
      mobile: false,
      location: false,
    },
  };
  public async textToInputConfirmForEmail({ value, that }: { value: string; that: any }) {
    if (!isValidEmail(value)) {
      this.$globalMessage.show({ type: 'error', content: '邮箱格式不正确' });
      return;
    }
    this.$q.loading.show();
    await AccountModule.updateUserEmail({ email: value, id: UserModule.userInfo.id });
    this.$q.loading.hide();
    this.$globalMessage.show({ type: 'success', content: '修改成功' });
    const userinfo = Object.assign(UserModule.userInfo, { email: value });
    setUserinfo(JSON.stringify(userinfo));
    UserModule.SET_USERINFO(userinfo);
    this.profileInfomation.showEdit.email = false;
  }
  public textToInputCloseForEmail({ value, that }: { value: string; that: any }) {
    this.profileInfomation.showEdit.email = false;
  }
  public async textToInputConfirmForMobile({ value, that }: { value: string; that: any }) {
    if (!isValidMobilePhone(value)) {
      this.$globalMessage.show({ type: 'error', content: '手机号格式不正确' });
      return;
    }
    this.$q.loading.show();
    await AccountModule.updateUserMobile({ mobile: Number(value), id: UserModule.userInfo.id });
    this.$q.loading.hide();
    this.$globalMessage.show({ type: 'success', content: '修改成功' });
    const userinfo = Object.assign(UserModule.userInfo, { mobile: value });
    setUserinfo(JSON.stringify(userinfo));
    UserModule.SET_USERINFO(userinfo);
    this.profileInfomation.showEdit.mobile = false;
  }
  public textToInputCloseForMobile({ value, that }: { value: string; that: any }) {
    this.profileInfomation.showEdit.mobile = false;
  }
}
</script>

<style lang="scss" scoped>
.body--dark {
  .card {
    backdrop-filter: saturate(200%) blur(30px);
    background-color: rgba(0, 0, 0, 0.5) !important;
    .tab {
      background: $dark;
      color: #ffffff;
    }
  }
}
.body--light {
  .card {
    backdrop-filter: saturate(200%) blur(30px);
    background-color: rgba(255, 255, 255, 0.5) !important;
    .tab {
      background: #ffffff;
      color: $dark;
    }
  }
}
.curved0 {
  min-height: 200px;
  width: 100%;
  background-image: url('~assets/curved0.jpg');
  background-position-y: 50%;
  padding: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: 50%;
  border-radius: 20px;
}
.card {
  width: 98%;
  margin: 0 auto;
  margin-top: -50px;
  position: relative;
  z-index: 333;
  display: flex;
  justify-content: space-between;
  .right {
    width: 50%;
    display: flex;
    align-items: center;
    .tab {
      border-radius: 8px;
      display: flex;
      height: 28px;
      align-items: center;
      justify-content: center;
      width: 320px;
    }
  }
}
</style>
