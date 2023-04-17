<template>
  <div>
    <ul class="row items-start">
      <q-card class="thin-shadow w-340 q-mr-md q-mb-md" v-for="item in postAuthorParams.data" :key="item.id">
        <q-img :src="item.coverUrl" height="200px" fit="contain" class="b-bottom" />
        <q-card-section>
          <div class="q-pa-xs absolute" :class="{ famale: item.gender === 0, male: item.gender === 1 }" style="top: 0; right: 12px; transform: translateY(-50%)" size="68px">
            <q-avatar>
              <img :src="item.avatarUrl" />
            </q-avatar>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1 row items-center">
            <div>
              <span> {{ item.name }} </span>
              <span class="fs-12 text-grey q-pl-sm">{{ item.nick }}</span>
            </div>
            <div class="q-ml-auto">
              <span class="fs-12">Lv.{{ getAuthorLevel(item.score) }}</span>
              <span class="fs-12 q-pl-xs">{{ getAuthorLevelName(item.score) }}</span>
            </div>
          </div>
          <div class="text-caption text-grey">{{ item.description || '--' }}</div>
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
              <span class="fs-16">{{ defaultFill(item.friendCount) }}</span>
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
        <q-card-actions align="right">
          <q-btn flat round color="primary" icon="o_edit" style="width: 42px" @click="handlerClickUpdate" />
          <q-btn flat round color="grey" icon="o_delete_outline" style="width: 42px" @click="handlerClickDelete(item)" />
          <q-btn color="grey" round flat dense :icon="item.expanded ? 'o_expand_circle_down' : 'o_expand_circle_down'" @click="item.expanded = !item.expanded" />
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
                <li>
                  <span class="text-grey">账号状态：</span>
                  <span class="my-status green" v-if="item.type === 0">正常</span>
                  <span class="my-status red" v-if="item.type === 1">停用</span>
                </li>
              </ul>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
      <q-card class="thin-shadow w-340 row items-center justify-center min-h-449">
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
            v-if="item.type === 'text'"
            :option="{
              model: dialogAddUpdateParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
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
            <div class="row">
              <input type="file" class="hide" :ref="dialogAddUpdateParams.upload.avatarID" :accept="dialogAddUpdateParams.upload.accept" :draggable="false" @change="uploadFileSuccess" />
              <q-btn
                color="primary"
                :label="`点击上传头像（${dialogAddUpdateParams.upload.accept}，max size: 5MB）`"
                outline
                :style="this.dialogAddUpdateParams.upload.params.avatar ? 'width: 90%' : 'width:100%'"
                no-caps
                @click="handleClickUploadFile"
              ></q-btn>
              <div v-if="this.dialogAddUpdateParams.upload.params.avatar" class="q-ml-md q-pa-xs b-r-8" style="border: solid 1px var(--q-primary)">
                <q-img :src="this.dialogAddUpdateParams.upload.params.avatar" fit="contain" width="32px"></q-img>
              </div>
            </div>
          </div>
          <div v-if="item.type === 'cover'" class="q-mb-md">
            <p class="f-bold fs-12 p-b-8 row items-center">
              <span class="m-r-6">{{ item.label }}</span>
            </p>
            <div v-if="this.dialogAddUpdateParams.upload.params.cover" class="q-pa-xs b-r-8 q-mb-sm" style="border: solid 1px var(--q-dark)">
              <q-img :src="this.dialogAddUpdateParams.upload.params.cover" fit="contain" width="100%" height="300px"></q-img>
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
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { getCurrentInstance } from 'vue';
import { Component, Vue } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import { isValidPassword } from 'src/utils/validate';
import setting from 'src/setting.json';
import { enCrypty } from 'src/utils/tools';
const CONST_PARAMS: any = {
  dialog_add_update: { name: '', nick: '', gender: '1', id: '', type: '', avatarUrl: '', description: '', coverUrl: '', managementPassword: '', appPassword: '' },
};
function getAuthorLevelName(score: number) {
  if (score < 1000) {
    return '县令';
  } else if (score < 3000) {
    return '知府';
  } else if (score < 5000) {
    return '刺史';
  } else if (score < 20000) {
    return '太尉';
  } else {
    return '丞相';
  }
}
function getAuthorLevel(score: number) {
  if (score < 1000) {
    return '1';
  } else if (score < 3000) {
    return '2';
  } else if (score < 5000) {
    return '3';
  } else if (score < 20000) {
    return '4';
  } else {
    return '5';
  }
}

@Component({ name: 'BlogPostAuthorComponent' })
export default class BlogPostAuthorComponent extends Vue {
  $refs: any;
  mounted() {
    this.getAllPostAuthor();
  }
  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  private postAuthorParams = {
    data: [],
  };
  private getAuthorLevelName = getAuthorLevelName;
  private getAuthorLevel = getAuthorLevel;
  private dialogAddUpdateParams = {
    id: 'dialog_add_update',
    dialogType: '',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    params: cloneDeep(CONST_PARAMS.dialog_add_update),
    passwordRules: setting.passwordRules,
    upload: {
      avatarID: 'dialog_upload_avatar',
      coverID: 'dialog_upload_cover',
      accept: '.jpg,.png,.jpeg',
      params: { avatar: '', avatarName: '', cover: '', coverName: '' },
    },
    input: [
      {
        model: 'name',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '用户名',
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
            return isValidPassword(val) || '无效密码';
          },
        ],
        classes: 'input-password',
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
            return isValidPassword(val) || '无效密码';
          },
        ],
        classes: 'input-password',
        label: '客户端密码',
      },
      {
        model: 'gender',
        type: 'radio',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        inputSelectOption: [
          {
            label: '男',
            value: '1',
          },
          {
            label: '女',
            value: '0',
          },
        ],
        label: '性别',
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
      {
        model: 'avatarUrl',
        type: 'avatar',
        accept: '.jpg,.png,.jpeg',
        rules: [],
        label: '头像',
      },
      {
        model: 'coverUrl',
        type: 'cover',
        accept: '.jpg,.png,.jpeg',
        rules: [],
        label: '背景图',
      },
    ],
  };
  /* event */
  private handleClickAdd() {
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'add';
    this.dialogAddUpdateParams.title = 'Add';
  }
  private handlerClickUpdate(row: any) {
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'update';
    this.dialogAddUpdateParams.title = 'Update';
  }
  private handleClickUploadFile() {
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
  private handleClickUploadFileForCover() {
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
  private uploadFileSuccess() {
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
  private uploadFileSuccessForCover() {
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
  private dialogAddUpdateCloseEvent(data: { type: string }) {
    this.dialogAddUpdateParams.visiable = false;
  }
  private dialogAddUpdateBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogAddUpdateParams.params = data.params;
    }
  }
  /* http */
  private async getAllPostAuthor() {
    try {
      this.$q.loading.show();
      let { pageData } = await BlogPostModule.getAllPostAuthor({});
      pageData = pageData.map((item: any) => {
        return {
          ...item,
          expanded: false,
        };
      });
      console.log(pageData);
      this.postAuthorParams.data = pageData;
    } catch (error) {}
    this.$q.loading.hide();
  }
  private async dialogAddUpdateConfirmEvent() {
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
        await BlogPostModule.addPostAuthor({
          name: this.dialogAddUpdateParams.params.name,
          nick: this.dialogAddUpdateParams.params.nick,
          avatar: this.dialogAddUpdateParams.upload.params.avatar,
          cover: this.dialogAddUpdateParams.upload.params.cover,
          description: this.dialogAddUpdateParams.params.description,
          gender: this.dialogAddUpdateParams.params.gender,
          managementPassword: enCrypty(this.dialogAddUpdateParams.params.managementPassword),
          appPassword: enCrypty(this.dialogAddUpdateParams.params.appPassword),
        });
      } else {
        // await BlogPostModule.updatePostAuthor(this.dialogAddUpdateParams.params);
      }
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.dialogAddUpdateParams.visiable = false;
      this.getAllPostAuthor();
    } catch (error) {}
  }
  private async handlerClickDelete(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
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
}
</script>

<style lang="scss" scoped>
.male {
  box-shadow: 0px 8px 25px $primary;
  transition: all 0.3s ease 0s;
  border-radius: 50%;
}
.famale {
  box-shadow: 0px 8px 25px $negative;
  transition: all 0.3s ease 0s;
  border-radius: 50%;
}
</style>
