<template>
  <div>
    <ul class="row items-start">
      <q-card class="thin-shadow w-340 q-mr-md q-mb-md" v-for="item in postAuthorParams.data" :key="item.id">
        <q-img :src="item.coverUrl" height="200px" fit="contain" spinner-size="12px" spinner-color="primary" />
        <div class="q-px-md text-right" style="margin-top: -24px">
          <q-avatar size="48px">
            <img :src="item.avatarUrl" />
          </q-avatar>
        </div>
        <q-card-section>
          <div class="row items-center">
            <div>
              <img
                src="~assets/icon/verified.png"
                alt=""
                srcset=""
                style="width: 18px"
                v-if="item.type === 0 && (item.status === 3 || item.status === 2 || item.status === 4)"
                class="q-mr-xs"
                :class="{ 'process-verify': item.status === 3, 'not-verify': item.status === 2 }"
              />
              <span class="f-bold"> {{ item.name }} </span>
              <span class="fs-12 text-grey q-pl-sm">{{ item.nick }}</span>
            </div>
            <div class="q-ml-auto">
              <span class="fs-12">Lv.{{ getAuthorLevel(item.score) }}</span>
              <span class="fs-12 q-pl-xs">{{ getAuthorLevelName(item.score) }}</span>
            </div>
          </div>
          <div class="text-caption text-grey q-pt-xs">{{ item.description || '--' }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-px-none">
          <ul class="row">
            <li class="row column text-center w-p-25">
              <span class="q-mb-sm">文章数</span>
              <span class="fs-16">{{ defaultFill(item.articleCount) }}</span>
            </li>
            <li class="row column text-center w-p-25">
              <span class="q-mb-sm">关注</span>
              <span class="fs-16">{{ defaultFill(item.followCount) }}</span>
            </li>
            <li class="row column text-center w-p-25">
              <span class="q-mb-sm">粉丝</span>
              <span class="fs-16">{{ defaultFill(item.fansCount) }}</span>
            </li>
            <li class="row column text-center w-p-25">
              <span class="q-mb-sm">积分</span>
              <span class="fs-16">{{ defaultFill(item.score) }}</span>
            </li>
          </ul>
        </q-card-section>
        <q-separator />
        <q-card-actions class="q-px-md row justify-between">
          <div class="q-mr-auto">
            <span class="my-status green fs-12" v-if="item.status === 0">正常</span>
            <span class="my-status red fs-12" v-if="item.status === 1">停用</span>
            <span class="my-status yellow fs-12" v-if="item.status === 2">待认证</span>
            <span class="my-status grey fs-12" v-if="item.status === 3">认证审核中</span>
            <span class="my-status green fs-12" v-if="item.status === 4">已认证</span>
            <span class="my-status red fs-12" v-if="item.status === 5">认证失败</span>
          </div>
          <div class="row items-center">
            <q-btn color="primary" flat label="企业认证" outline v-if="(item.status === 2 || item.status === 3 || item.status === 4 || item.status === 5) && item.type === 0" class="fs-12" dense>
              <q-menu class="fs-12" style="box-shadow: none">
                <q-list dense bordered>
                  <q-item clickable v-close-popup v-if="item.status === 2" @click="handlerClickVerify(item)" dense>
                    <q-item-section>认证</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup v-if="item.status === 4 || item.status === 3 || item.status === 5" dense @click="handlerClickViewVerify(item)">
                    <q-item-section>查看认证</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup v-if="item.status === 3 || item.status === 4 || item.status === 5" dense @click="handlerClickRemoveVerify(item)">
                    <q-item-section class="text-negative">删除认证/申请</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn color="primary" flat label="操作" outline class="fs-12" dense>
              <q-menu class="fs-12" style="box-shadow: none">
                <q-list dense bordered>
                  <q-item clickable v-close-popup @click="handlerClickUpdate(item)" dense>
                    <q-item-section>编辑</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup dense @click="handlerClickDelete(item)" v-if="!item.defaultUser">
                    <q-item-section class="text-negative">删除</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn color="primary" flat label="详情" outline class="fs-12" dense @click="item.expanded = !item.expanded"></q-btn>
          </div>
        </q-card-actions>
        <q-slide-transition>
          <div v-show="item.expanded">
            <q-separator />
            <q-card-section>
              <ul>
                <li class="q-mb-sm">
                  <span class="text-grey">创建时间：</span>
                  <span class="q-ml-sm">{{ parseTime(item.createTime) }}</span>
                </li>
                <li class="q-mb-sm">
                  <span class="text-grey">更新时间：</span>
                  <span class="q-ml-sm">{{ parseTime(item.updateTime) }}</span>
                </li>
                <li class="q-mb-sm">
                  <span class="text-grey">最近一次登录时间：</span>
                  <span class="q-ml-sm">{{ parseTime(item.loginTime) }}</span>
                </li>
              </ul>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
      <q-card class="thin-shadow w-340 row items-center justify-center min-h-415">
        <q-card-section class="row justify-center">
          <q-btn color="primary" round icon="o_add" style="height: 56px" @click="handleClickAdd" />
        </q-card-section>
      </q-card>
    </ul>
    <MyDialog
      :option="{
        id: dialogAddUpdateParams.id,
        dialogType: dialogAddUpdateParams.dialogType,
        clickLoading: dialogAddUpdateParams.clickLoading,
        getDataLoading: dialogAddUpdateParams.getDataLoading,
        visiable: dialogAddUpdateParams.visiable,
        title: dialogAddUpdateParams.title,
        params: dialogAddUpdateParams.params,
        customComfirm: true,
      }"
      ref="dialogAddUpdate"
      width="30vw"
      @close="dialogAddUpdateCloseEvent"
      @confirm="dialogAddUpdateConfirmEvent"
      @before-hide="dialogAddUpdateBeforeHideEvent"
    >
      <div class="row q-col-gutter-x-md">
        <div v-for="(item, index) in dialogAddUpdateParams.input" :key="index" class="col-12">
          <MyFormSelect
            v-if="item.type === 'select'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              userInput: false,
              showClose: false,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormInput
            v-if="item.type === 'text' && !item.hidden"
            :option="{
              model: dialogAddUpdateParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
              readonly: item.readonly,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          >
            <template #subTitle v-if="item.model === 'managementPassword' || item.model === 'appPassword'">
              <el-popover placement="top" title="密码规则" :width="320" popper-style="z-index:9999" trigger="hover">
                <p class="bold q-mb-md">
                  {{ item.model === 'managementPassword' ? '管理后台密码' : '应用层客户端密码' }}
                </p>
                <p v-for="(item, index) in dialogAddUpdateParams.passwordRules" :key="index">{{ index + 1 }}. {{ item }}</p>
                <template #reference>
                  <q-icon name="o_info" class="text-grey cursor-pointer" />
                </template>
              </el-popover>
            </template>
          </MyFormInput>
          <MyFormRadio
            v-if="item.type === 'radio'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              disable: item.disable,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <div v-if="item.type === 'avatar'" class="q-mb-md">
            <p class="f-bold fs-12 p-b-8 row items-center">
              <span class="m-r-6">* {{ item.label }}</span>
            </p>
            <div class="row justify-between">
              <input type="file" class="hide" :ref="dialogAddUpdateParams.upload.avatarID" :accept="dialogAddUpdateParams.upload.accept" :draggable="false" @change="uploadFileSuccess" />
              <q-btn
                color="primary"
                :label="`点击上传头像（${dialogAddUpdateParams.upload.accept}，max size: 5MB）`"
                outline
                :style="this.dialogAddUpdateParams.upload.params.avatar ? 'width: 92%' : 'width:100%'"
                no-caps
                @click="handleClickUploadFile"
              ></q-btn>
              <div v-if="this.dialogAddUpdateParams.upload.params.avatar" class="q-pa-xs b-r-8 thin-shadow">
                <q-img :src="this.dialogAddUpdateParams.upload.params.avatar" fit="contain" width="32px" spinner-size="12px" spinner-color="primary" />
              </div>
            </div>
          </div>
          <div v-if="item.type === 'cover'" class="q-mb-md">
            <p class="f-bold fs-12 p-b-8 row items-center">
              <span class="m-r-6">{{ item.label }}</span>
            </p>
            <div v-if="this.dialogAddUpdateParams.upload.params.cover" class="q-pa-xs b-r-8 q-mb-md thin-shadow">
              <q-img :src="this.dialogAddUpdateParams.upload.params.cover" fit="contain" width="100%" height="300px" spinner-size="12px" spinner-color="primary" />
            </div>
            <div class="row">
              <input type="file" class="hide" :ref="dialogAddUpdateParams.upload.coverID" :accept="dialogAddUpdateParams.upload.accept" :draggable="false" @change="uploadFileSuccessForCover" />
              <q-btn
                color="primary"
                :label="`点击上传背景图（${dialogAddUpdateParams.upload.accept}，max size: 10MB）`"
                outline
                style="width: 100%"
                no-caps
                @click="handleClickUploadFileForCover"
              ></q-btn>
            </div>
          </div>
        </div>
      </div>
    </MyDialog>
    <q-dialog v-model="dialogVerifyParams.visiable" position="top" @before-hide="dialogVerifyParamsHide" transition-show="jump-up" transition-hide="jump-down">
      <q-card style="min-width: 50vw">
        <q-stepper v-model="dialogVerifyParams.step" ref="stepper" color="primary" animated keep-alive>
          <q-step :name="1" title="提交认证申请" icon="feed" :done="dialogVerifyParams.step > 1" style="min-height: 300px">
            <q-form class="row q-col-gutter-x-md" :ref="dialogVerifyParams.id">
              <div v-for="(item, index) in dialogVerifyParams.input" :key="index" class="col-12">
                <MyFormSelect
                  v-if="item.type === 'select'"
                  :option="{
                    inputId: `${dialogVerifyParams.id}-select-${item.model}`,
                    rules: item.rules,
                    classes: item.classes,
                    model: dialogVerifyParams.params[item.model],
                    label: item.label,
                    inputSelectOption: item.inputSelectOption,
                    userInput: false,
                    showClose: true,
                  }"
                  @input="(data) => (dialogVerifyParams.params[item.model] = data)"
                />
                <MyFormInput
                  v-if="item.type === 'text'"
                  :option="{
                    model: dialogVerifyParams.params[item.model],
                    rules: item.rules,
                    classes: item.classes,
                    label: item.label,
                    readonly: item.readonly,
                  }"
                  @input="(data) => (dialogVerifyParams.params[item.model] = data)"
                >
                </MyFormInput>
                <div v-if="item.type === 'pdf'" class="q-mb-md">
                  <p class="f-bold fs-12 p-b-8 row items-center">
                    <span class="m-r-6">* {{ item.label }}</span>
                  </p>
                  <div class="q-pa-xs b-r-8 q-mb-md thin-shadow" ref="pdfContainer"></div>
                  <div class="row">
                    <input type="file" class="hide" :ref="dialogVerifyParams.upload.id" :accept="dialogVerifyParams.upload.accept" :draggable="false" @change="uploadFileSuccessForPDF" />
                    <q-btn color="primary" :label="`点击上传文件（${dialogVerifyParams.upload.accept}）`" outline style="width: 100%" no-caps @click="handleClickUploadFileForPDF"></q-btn>
                  </div>
                </div>
              </div>
            </q-form>
          </q-step>
          <q-step :name="2" title="企业信息预览" icon="preview" :done="dialogVerifyParams.step > 2" style="min-height: 300px">
            <q-list class="thin-shadow q-pa-md">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-item-label class="text-grey">企业名称：</q-item-label>
                </q-item-section>
                <q-item-section>{{ dialogVerifyParams.params.companyName }}</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-item-label class="text-grey">企业类型：</q-item-label>
                </q-item-section>
                <q-item-section>{{ dialogVerifyParams.params.companyType }}</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-item-label class="text-grey">统一社会信用代码 ：</q-item-label>
                </q-item-section>
                <q-item-section>{{ dialogVerifyParams.params.companyCode }}</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label class="text-grey">营业执照：</q-item-label>
                </q-item-section>
                <embed :src="dialogVerifyParams.upload.params.pdfName" style="width: 100%; height: 400px" />
              </q-item>
            </q-list>
          </q-step>
          <q-step :name="3" title="企业认证结果" icon="assignment" style="min-height: 300px">
            <div class="q-pa-lg row items-center text-center justify-center" v-if="dialogVerifyParams.result === 1">
              <div class="text-center">
                <img src="~assets/icon/checked.png" alt="" srcset="" class="w-100" />
                <p class="text-h6 q-mt-md">认证成功</p>
              </div>
            </div>
            <div class="q-pa-lg row items-center text-center justify-center" v-if="dialogVerifyParams.result === 2">
              <div class="text-center">
                <img src="~assets/icon/cancel.png" alt="" srcset="" class="w-100" />
                <p class="text-h6 q-mt-md">认证失败</p>
                <p class="q-mt-sm text-grey">{{ dialogVerifyParams.failMessage }}</p>
              </div>
            </div>
            <div class="q-pa-lg row items-center text-center justify-center" v-if="dialogVerifyParams.result === 3">
              <div class="text-center">
                <img src="~assets/icon/working-time.png" alt="" srcset="" class="w-100" />
                <p class="text-h6 q-mt-md">认证审核中...</p>
              </div>
            </div>
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                @click="handleClickStepNextButton"
                color="primary"
                :label="dialogVerifyParams.step === 2 ? (dialogVerifyParams.type === 'add' ? '提交' : '查看认证结果') : '下一步'"
                v-if="dialogVerifyParams.step < 3"
              />
              <q-btn v-if="canStepBack" flat color="primary" @click="handleClickStepPrevious" :label="dialogVerifyParams.step === 3 ? '查看认证详情' : '返回'" class="q-ml-sm" />
            </q-stepper-navigation>
          </template>
          <template v-slot:message>
            <q-banner v-if="dialogVerifyParams.step === 1" class="bg-primary text-white q-px-lg"> 填写下面信息完成认证</q-banner>
          </template>
        </q-stepper>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { getCurrentInstance } from 'vue';
import { Component, Vue } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import { isValidSimplePassword } from 'src/utils/validate';
import setting from 'src/setting.json';
import { enCrypty } from 'src/utils/tools';
import { companyType, getAuthorLevel, getAuthorLevelName } from './utils';

const CONST_PARAMS: any = {
  dialog_add_update: { name: '', nick: '', id: '', type: '1', avatarUrl: '', description: '', coverUrl: '', managementPassword: '', appPassword: '' },
  verify: { companyName: '', companyType: '', companyCode: '', companyLicense: '', id: '' },
};
@Component({
  name: 'BlogPostAuthorComponent',
  components: {},
})
export default class BlogPostAuthorComponent extends Vue {
  $refs: any;

  get canStepBack() {
    // 如果是新增，第一步可以返回，第二步不可以返回
    if (this.dialogVerifyParams.type === 'add' && this.dialogVerifyParams.step === 2) {
      return true;
    }
    // 如果是查看，第三步可以返回，其他不可以返回
    if (this.dialogVerifyParams.type === 'view' && this.dialogVerifyParams.step === 3) {
      return true;
    }
    return false;
  }

  mounted() {
    this.getAllPostAuthor();
  }

  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public postAuthorParams = {
    data: [],
  };
  public getAuthorLevelName = getAuthorLevelName;
  public getAuthorLevel = getAuthorLevel;
  public dialogAddUpdateParams = {
    id: 'dialog_add_update',
    dialogType: '',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    params: cloneDeep(CONST_PARAMS.dialog_add_update),
    passwordRules: setting.simplePasswordRules,
    upload: {
      avatarID: 'dialog_upload_avatar',
      coverID: 'dialog_upload_cover',
      accept: '.jpg,.png,.jpeg',
      params: { avatar: '', avatarName: '', cover: '', coverName: '', avatarRawFile: null, coverRawFile: null },
    },
    input: [
      {
        model: 'coverUrl',
        type: 'cover',
        accept: '.jpg,.png,.jpeg',
        rules: [],
        label: '背景图',
      },
      {
        model: 'avatarUrl',
        type: 'avatar',
        accept: '.jpg,.png,.jpeg',
        rules: [],
        label: '头像',
      },
      {
        model: 'name',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '用户名',
        readonly: false,
      },
      {
        model: 'nick',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '昵称',
      },
      {
        model: 'managementPassword',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
          (val: string) => {
            return isValidSimplePassword(val) || '无效密码';
          },
        ],
        classes: 'input-password',
        hidden: false,
        label: '后台密码',
      },
      {
        model: 'appPassword',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
          (val: string) => {
            return isValidSimplePassword(val) || '无效密码';
          },
        ],
        classes: 'input-password',
        hidden: false,
        label: '客户端密码',
      },
      {
        model: 'type',
        type: 'radio',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        inputSelectOption: [
          {
            label: '个人账号',
            value: '1',
          },
          {
            label: '企业账号',
            value: '0',
          },
        ],
        disable: false,
        label: '账号类型',
      },
      {
        model: 'description',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '描述',
      },
    ],
  };
  public dialogVerifyParams = {
    title: '账号认证',
    visiable: false,
    // step 1, result 0 , type add--->去认证
    // step 3, result (1成功,2失败,3进行中) , type view--->查看认证
    step: 1,
    result: 0,
    type: 'add',
    failMessage: '',
    id: 'dialog_verify',
    params: cloneDeep(CONST_PARAMS.verify),
    upload: {
      id: 'dialog_upload_verify_pdf',
      accept: '.pdf',
      params: { pdf: '', pdfName: '' },
    },
    input: [
      {
        model: 'companyName',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '企业名称',
      },
      {
        model: 'companyType',
        type: 'select',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        inputSelectOption: companyType,
        label: '企业类型',
      },
      {
        model: 'companyCode',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '统一社会信用代码',
      },
      {
        model: 'companyLicense',
        type: 'pdf',
        accept: '.pdf',
        rules: [],
        label: '企业营业执照',
      },
    ],
  };

  /* event */
  public handleClickAdd() {
    const nameIndex = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'name');
    this.dialogAddUpdateParams.input[nameIndex].readonly = false;
    const managementPasswordIndex = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'managementPassword');
    this.dialogAddUpdateParams.input[managementPasswordIndex].hidden = false;
    const appPasswordIndex = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'appPassword');
    this.dialogAddUpdateParams.input[appPasswordIndex].hidden = false;
    const typeIndex = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'type');
    this.dialogAddUpdateParams.input[typeIndex].disable = false;
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'add';
    this.dialogAddUpdateParams.title = 'Add';
  }

  public handlerClickUpdate(row: any) {
    this.dialogAddUpdateParams.params.nick = row.nick;
    this.dialogAddUpdateParams.params.name = row.name;
    this.dialogAddUpdateParams.params.type = String(row.type);
    this.dialogAddUpdateParams.params.id = row.id;
    this.dialogAddUpdateParams.params.description = row.description;
    this.dialogAddUpdateParams.upload.params.avatar = row.avatarUrl;
    this.dialogAddUpdateParams.upload.params.cover = row.coverUrl;
    const nameIndex = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'name');
    this.dialogAddUpdateParams.input[nameIndex].readonly = true;
    const managementPasswordIndex = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'managementPassword');
    this.dialogAddUpdateParams.input[managementPasswordIndex].hidden = true;
    const appPasswordIndex = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'appPassword');
    this.dialogAddUpdateParams.input[appPasswordIndex].hidden = true;
    const typeIndex = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'type');
    this.dialogAddUpdateParams.input[typeIndex].disable = true;
    this.dialogAddUpdateParams.dialogType = 'update';
    this.dialogAddUpdateParams.title = 'Update';
    this.dialogAddUpdateParams.visiable = true;
  }

  public handlerClickVerify(item: any) {
    this.dialogVerifyParams.step = 1;
    this.dialogVerifyParams.result = 0;
    this.dialogVerifyParams.type = 'add';
    this.dialogVerifyParams.failMessage = '';
    this.dialogVerifyParams.visiable = true;
    this.dialogVerifyParams.params.id = item.id;
  }

  public handleClickStepPrevious() {
    if (this.dialogVerifyParams.step === 2) {
      this.dialogVerifyParams.step = 1;
    }
    if (this.dialogVerifyParams.step === 3) {
      this.dialogVerifyParams.step = 2;
    }
  }

  public handleClickUploadFile() {
    this.$nextTick(() => {
      this.$refs[this.dialogAddUpdateParams.upload.avatarID][0].type = 'text';
      this.dialogAddUpdateParams.upload.params.avatarName = '';
      this.dialogAddUpdateParams.upload.params.avatar = '';
      setTimeout(() => {
        this.$refs[this.dialogAddUpdateParams.upload.avatarID][0].type = 'file';
        this.$refs[this.dialogAddUpdateParams.upload.avatarID][0].value = '';
        this.$refs[this.dialogAddUpdateParams.upload.avatarID][0].click();
      }, 100);
    });
  }

  public handleClickUploadFileForCover() {
    this.$nextTick(() => {
      this.$refs[this.dialogAddUpdateParams.upload.coverID][0].type = 'text';
      this.dialogAddUpdateParams.upload.params.coverName = '';
      this.dialogAddUpdateParams.upload.params.cover = '';
      setTimeout(() => {
        this.$refs[this.dialogAddUpdateParams.upload.coverID][0].type = 'file';
        this.$refs[this.dialogAddUpdateParams.upload.coverID][0].value = '';
        this.$refs[this.dialogAddUpdateParams.upload.coverID][0].click();
      }, 100);
    });
  }

  public handleClickUploadFileForPDF() {
    this.$nextTick(() => {
      this.$refs[this.dialogVerifyParams.upload.id][0].type = 'text';
      this.dialogVerifyParams.upload.params.pdfName = '';
      this.dialogVerifyParams.upload.params.pdf = '';
      this.$refs['pdfContainer'][0].innerHTML = '';
      setTimeout(() => {
        this.$refs[this.dialogVerifyParams.upload.id][0].type = 'file';
        this.$refs[this.dialogVerifyParams.upload.id][0].value = '';
        this.$refs[this.dialogVerifyParams.upload.id][0].click();
      }, 100);
    });
  }

  public uploadFileSuccess() {
    const files = this.$refs[this.dialogAddUpdateParams.upload.avatarID][0].files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach((rawFile: any) => {
      this.dialogAddUpdateParams.upload.params.avatarName = rawFile.name;
      const fileType = rawFile.type.toLowerCase();
      const allowedExtensions = this.dialogAddUpdateParams.upload.accept.split(',').map((item) => item.replace('.', ''));
      if (!allowedExtensions.some((ext) => fileType.endsWith(ext))) {
        this.$globalMessage.show({
          type: 'error',
          content: '文件格式不正确',
        });
        return;
      }
      if (rawFile.size <= 1024 * 1024 * 5) {
        this.dialogAddUpdateParams.upload.params.avatarRawFile = rawFile;
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const base64String = event.target.result;
          this.dialogAddUpdateParams.upload.params.avatar = base64String;
        };
        reader.readAsDataURL(rawFile);
      } else {
        // Handle file that exceeds size limit
        this.$globalMessage.show({
          type: 'error',
          content: '文件大小不能超过5MB',
        });
      }
    });
  }

  public uploadFileSuccessForCover() {
    const files = this.$refs[this.dialogAddUpdateParams.upload.coverID][0].files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach((rawFile: any) => {
      this.dialogAddUpdateParams.upload.params.coverName = rawFile.name;
      const fileType = rawFile.type.toLowerCase();
      const allowedExtensions = this.dialogAddUpdateParams.upload.accept.split(',').map((item) => item.replace('.', ''));
      if (!allowedExtensions.some((ext) => fileType.endsWith(ext))) {
        this.$globalMessage.show({
          type: 'error',
          content: '文件格式不正确',
        });
        return;
      }
      if (rawFile.size <= 1024 * 1024 * 10) {
        this.dialogAddUpdateParams.upload.params.coverRawFile = rawFile;
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const base64String = event.target.result;
          this.dialogAddUpdateParams.upload.params.cover = base64String;
        };
        reader.readAsDataURL(rawFile);
      } else {
        // Handle file that exceeds size limit
        this.$globalMessage.show({
          type: 'error',
          content: '文件大小不能超过10MB',
        });
      }
    });
  }

  public async uploadFileSuccessForPDF() {
    const files = this.$refs[this.dialogVerifyParams.upload.id][0].files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach((rawFile: any) => {
      const fileType = rawFile.type.toLowerCase();
      const allowedExtensions = this.dialogVerifyParams.upload.accept.split(',').map((item) => item.replace('.', ''));
      if (!allowedExtensions.some((ext) => fileType.endsWith(ext))) {
        this.$globalMessage.show({
          type: 'error',
          content: '文件格式不正确',
        });
        return;
      }
      if (rawFile.size <= 1024 * 1024 * 10) {
        const src = window.URL.createObjectURL(rawFile);
        let embedNode = document.createElement('embed');
        embedNode.src = src;
        embedNode.setAttribute('height', '300px');
        embedNode.setAttribute('width', '100%');
        this.$refs['pdfContainer'][0].append(src);
        this.dialogVerifyParams.upload.params.pdf = rawFile;
        this.dialogVerifyParams.upload.params.pdfName = src;
      } else {
        // Handle file that exceeds size limit
        this.$globalMessage.show({
          type: 'error',
          content: '文件大小不能超过10MB',
        });
      }
    });
  }

  /* 关闭dialog */
  public dialogAddUpdateCloseEvent(data: { type: string }) {
    this.dialogAddUpdateParams.visiable = false;
  }

  /* 新增或编辑dialog隐藏时 */
  public dialogAddUpdateBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogAddUpdateParams.params = data.params;
      this.dialogAddUpdateParams.upload.params.avatar = '';
      this.dialogAddUpdateParams.upload.params.avatarRawFile = null;
      this.dialogAddUpdateParams.upload.params.avatarName = '';
      this.dialogAddUpdateParams.upload.params.cover = '';
      this.dialogAddUpdateParams.upload.params.coverRawFile = null;
      this.dialogAddUpdateParams.upload.params.coverName = '';
    }
  }

  /* 认证dialog隐藏时 */
  public dialogVerifyParamsHide() {
    this.dialogVerifyParams.step = 1;
    this.dialogVerifyParams.result = 0;
    this.dialogVerifyParams.type = 'add';
    this.dialogVerifyParams.failMessage = '';
    this.dialogVerifyParams.upload.params.pdf = '';
    this.dialogVerifyParams.upload.params.pdfName = '';
    this.dialogVerifyParams.params = cloneDeep(CONST_PARAMS.verify);
  }

  /* http */

  /* 获取所有用户 */
  public async getAllPostAuthor() {
    try {
      this.$q.loading.show();
      let { pageData } = await BlogPostModule.getAllPostAuthor({});
      pageData = pageData.map((item: any) => {
        return {
          ...item,
          expanded: false,
        };
      });
      this.postAuthorParams.data = pageData;
    } catch (error) {}
    this.$q.loading.hide();
  }

  /* 确定新增或更新用户 */
  public async dialogAddUpdateConfirmEvent() {
    if (!this.dialogAddUpdateParams.upload.params.avatar) {
      this.$globalMessage.show({
        type: 'error',
        content: '请上传头像',
      });
      return;
    }
    const result = await this.$refs['dialogAddUpdate'].validForm();
    if (!result) {
      return;
    }
    try {
      this.$q.loading.show();
      if (this.dialogAddUpdateParams.dialogType === 'add') {
        const params: any = {
          avatar: this.dialogAddUpdateParams.upload.params.avatarRawFile,
          cover: this.dialogAddUpdateParams.upload.params.coverRawFile,
        };
        const form = new FormData();
        Object.keys(params).forEach((key) => {
          form.append(key, params[key]);
        });
        await BlogPostModule.addPostAuthor({
          form,
          params: {
            name: this.dialogAddUpdateParams.params.name,
            nick: this.dialogAddUpdateParams.params.nick,
            description: this.dialogAddUpdateParams.params.description,
            type: Number(this.dialogAddUpdateParams.params.type),
            managementPassword: enCrypty(this.dialogAddUpdateParams.params.managementPassword),
            appPassword: enCrypty(this.dialogAddUpdateParams.params.appPassword),
          },
        });
      } else {
        const params: any = {
          avatar: this.dialogAddUpdateParams.upload.params.avatarRawFile || this.dialogAddUpdateParams.upload.params.avatar,
          cover: this.dialogAddUpdateParams.upload.params.coverRawFile || this.dialogAddUpdateParams.upload.params.cover,
        };
        const form = new FormData();
        Object.keys(params).forEach((key) => {
          form.append(key, params[key]);
        });
        await BlogPostModule.updatePostAuthor({
          form: form,
          params: {
            id: this.dialogAddUpdateParams.params.id,
            nick: this.dialogAddUpdateParams.params.nick,
            description: this.dialogAddUpdateParams.params.description,
          },
        });
      }
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.dialogAddUpdateParams.visiable = false;
      this.getAllPostAuthor();
    } catch (error) {}
  }

  /* 删除用户 */
  public async handlerClickDelete(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
      });
      if (result) {
        await BlogPostModule.removePostAuthor({
          id: row.id,
        });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getAllPostAuthor();
      }
    } catch (error) {}
  }

  /* 提交认证信息或执行下一步 */
  public async handleClickStepNextButton() {
    if (this.dialogVerifyParams.step === 1) {
      if (!this.dialogVerifyParams.upload.params.pdf) {
        this.$globalMessage.show({
          type: 'error',
          content: '请上传pdf文件',
        });
        return;
      }
      this.$refs[this.dialogVerifyParams.id].validate().then((result: any) => {
        if (result) {
          this.$refs.stepper.next();
        }
      });
    }
    if (this.dialogVerifyParams.step === 2 && this.dialogVerifyParams.type === 'add') {
      //
      const formdata = new FormData();
      formdata.append('file', this.dialogVerifyParams.upload.params.pdf);
      formdata.append('companyName', this.dialogVerifyParams.params.companyName);
      formdata.append('companyCode', this.dialogVerifyParams.params.companyCode);
      formdata.append('companyType', this.dialogVerifyParams.params.companyType);
      formdata.append('authorId', this.dialogVerifyParams.params.id);
      try {
        this.$q.loading.show();
        await BlogPostModule.verifyCompanyAuthor(formdata);
        this.$refs.stepper.next();
        this.dialogVerifyParams.result = 3;
        this.getAllPostAuthor();
        this.$q.loading.hide();
      } catch (error) {}
    }
    if (this.dialogVerifyParams.step === 2 && this.dialogVerifyParams.type === 'view') {
      this.$refs.stepper.next();
    }
  }

  /* 查看认证详情 */
  public async handlerClickViewVerify(item: any) {
    this.$q.loading.show();
    this.dialogVerifyParams.visiable = true;
    this.dialogVerifyParams.params.id = item.id;
    this.dialogVerifyParams.type = 'view';
    this.dialogVerifyParams.step = 3;
    const { companyCode, companyLicense, companyName, companyType, failMessage, status } = await BlogPostModule.getCompanyAuthorVerifyInfo({
      authorId: item.id,
    });
    this.dialogVerifyParams.params.companyCode = companyCode;
    this.dialogVerifyParams.params.companyName = companyName;
    this.dialogVerifyParams.params.companyType = companyType;
    this.dialogVerifyParams.upload.params.pdfName = companyLicense;
    // 进行中
    if (item.status === 3) {
      this.dialogVerifyParams.result = 3;
    }
    // 失败
    if (item.status === 5) {
      this.dialogVerifyParams.result = 2;
      this.dialogVerifyParams.failMessage = failMessage;
    }
    // 成功
    if (item.status === 4) {
      this.dialogVerifyParams.result = 1;
    }
    this.$q.loading.hide();
  }

  /* 移除认证 */
  public async handlerClickRemoveVerify(item: any) {
    const result = await this.$globalConfirm.show({
      title: '友情提示',
      color: 'primary',
      content: '确定吗？老铁！？',
      confirmButtonText: '非常确定',
    });
    if (result) {
      this.$q.loading.show();
      await BlogPostModule.removeCompanyAuthorVerify({
        authorId: item.id,
      });
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getAllPostAuthor();
      this.$q.loading.hide();
    }
  }
}
</script>

<style lang="scss" scoped>
.process-verify {
  filter: grayscale(100%);
}

.not-verify {
  filter: grayscale(100%);
}
</style>
