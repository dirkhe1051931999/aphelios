<template>
  <div>
    <div class="query-form-and-action">
      <q-form ref="queryFrom">
        <div class="row">
          <div class="row items-start">
            <div v-for="(item, index) in queryParams.input" :key="index">
              <q-input
                v-model.trim="queryParams.params[item.id]"
                :type="item.inputType"
                :class="['', item.class]"
                :label="item.placeholder"
                v-if="item.type === 'text'"
                autocapitalize="off"
                autocomplete="new-password"
                autocorrect="off"
                clearable
                dense
                outlined
                dropdown-icon="app:topbar-arrow-bottom"
                clear-icon="app:clear"
                :spellcheck="false"
              />
              <q-select
                v-if="item.type === 'select'"
                :class="['', item.class]"
                v-model="queryParams.params[item.id]"
                :options="item.selectOption"
                :label="item.placeholder"
                :spellcheck="false"
                autocapitalize="off"
                autocomplete="new-password"
                autocorrect="off"
                clearable
                dense
                options-dense
                outlined
                emit-value
                dropdown-icon="app:topbar-arrow-bottom"
                clear-icon="app:clear"
                map-options
              />
            </div>
          </div>
          <div>
            <q-btn color="primary" icon="search" :label="$t('action.search')" no-caps class="m-r-15" :loading="queryParams.queryLoading" @click="handleQuery" />
            <q-btn icon="restart_alt" :label="$t('action.reset')" outline color="primary" no-caps :loading="queryParams.resetLoading" @click="handleResetQuery" />
          </div>
        </div>
      </q-form>
    </div>
    <div class="thin-shadow q-pa-md">
      <q-table
        flat
        bordered
        :columns="tableParams.column"
        :rows="tableParams.data"
        :loading="tableParams.loading"
        :pagination="tableParams.pagination"
        hide-pagination
        :no-data-label="$t(`tip.noData`)"
        class="my-table"
      >
        <template #top>
          <div class="full-width justify-end row">
            <q-btn color="primary" icon="o_add" label="Add" no-caps class="m-r-15" @click="handleClickAdd" />
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <!-- other -->
            <q-th v-for="col in props.cols" :key="col.name" :props="props" style="text-align: left">
              {{ col.label.indexOf('$') !== -1 ? $t(`table.${col.label.replace('$', '')}`) : col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:header-cell-action="props">
          <q-th :props="props"> </q-th>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- other -->
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-left">
              <span v-if="!col.inSlot">{{ col.value }}</span>
              <div class="text-left" v-else>
                <!-- userName -->
                <div v-if="col.name === 'userName'">
                  <span class="link-type" @click="handlerClickDetail(props.row)" v-if="props.row.userName">{{ props.row.userName }}</span>
                  <span v-else>--</span>
                </div>
                <!-- userStatus -->
                <div v-if="col.name === 'userStatus'">
                  <span v-if="props.row.userStatus === 0" class="my-status blue">初始化</span>
                  <span v-else-if="props.row.userStatus === 1" class="my-status green">正常</span>
                  <span v-else-if="props.row.userStatus === 2" class="my-status grey">停用</span>
                  <span v-else-if="props.row.userStatus === 3" class="my-status red">已锁</span>
                  <span v-else-if="props.row.userStatus === 4" class="my-status yellow">设置密码链接过期</span>
                  <span v-else>--</span>
                </div>
                <!-- avatar -->
                <div v-if="col.name === 'avatar'">
                  <q-img :src="props.row.avatar" style="height: 32px; width: 32px; border-radius: 50%" v-if="props.row.avatar">
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-grey text-white w-32 h-32 b-r-16">Cannot load image</div>
                    </template>
                  </q-img>
                  <span v-else>--</span>
                </div>
                <!-- action -->
                <div v-if="col.name === 'action'">
                  <div>
                    <span class="in-table-link-button" @click="handlerClickUpdate(props.row)" v-if="canUpdate(props.row)" :class="{ 'm-r-8': canUpdate(props.row) }">{{ $t(`action.update`) }} </span>
                    <span class="in-table-delete-button" @click="handlerClickDelete(props.row)" v-if="canDelete(props.row)" :class="{ 'm-r-8': canDelete(props.row) }">{{ $t(`action.delete`) }} </span>
                    <span
                      class="in-table-link-button"
                      style="min-width: 100px"
                      v-if="canUnlock(props.row) || canChangePassword(props.row) || canEnable(props.row) || canDisable(props.row) || canReSendUrl(props.row)"
                    >
                      {{ $t(`action.more`) }}
                      <q-icon name="o_expand_more"></q-icon>
                      <q-popup-proxy style="min-width: 100px">
                        <q-list>
                          <q-item clickable dense v-close-popup v-if="canUnlock(props.row)">
                            <q-item-section class="text-center"> 解锁 </q-item-section>
                          </q-item>
                          <q-item clickable dense v-close-popup v-if="canChangePassword(props.row)">
                            <q-item-section class="text-center" @click="handlerClickChangePassword(props.row)"> 修改密码 </q-item-section>
                          </q-item>
                          <q-item clickable dense v-close-popup v-if="canEnable(props.row)" @click="updateUserStatus(props.row, 1)">
                            <q-item-section class="text-center"> 启用 </q-item-section>
                          </q-item>
                          <q-item clickable dense v-close-popup v-if="canDisable(props.row)" @click="updateUserStatus(props.row, 2)">
                            <q-item-section class="text-center"> 禁用 </q-item-section>
                          </q-item>
                          <q-item clickable dense v-close-popup v-if="canReSendUrl(props.row)" @click="reSendUrl(props.row)">
                            <q-item-section class="text-center"> 重发设置密码链接（仅限于初始化用户） </q-item-section>
                          </q-item>
                        </q-list>
                      </q-popup-proxy>
                    </span>
                  </div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
        <!--      loading-->
        <template v-slot:loading>
          <q-inner-loading color="primary" showing />
        </template>
      </q-table>
      <MyPagination :paginationParams="tableParams.pagination" v-if="tableParams.pagination.rowsNumber > 0" @pagination="paginationInput"></MyPagination>
    </div>
    <MyDialog
      :option="{
        id: dialogAddUpdateParams.id,
        dialogType: dialogAddUpdateParams.dialogType,
        clickLoading: dialogAddUpdateParams.clickLoading,
        getDataLoading: dialogAddUpdateParams.getDataLoading,
        visiable: dialogAddUpdateParams.visiable,
        title: dialogAddUpdateParams.title,
        params: dialogAddUpdateParams.params,
      }"
      @close="dialogAddUpdateCloseEvent"
      @confirm="dialogAddUpdateConfirmEvent"
      @before-hide="dialogAddUpdateBeforeHideEvent"
    >
      <div class="row q-col-gutter-x-md">
        <div v-for="(item, index) in dialogAddUpdateParams.input" :key="index" class="col-6">
          <div v-if="item.type === 'avatar'">
            <p class="f-bold fs-12 p-b-8 row items-center">
              <span class="m-r-6">* {{ item.label }}</span>
            </p>
            <ul class="avatar-list">
              <li
                v-for="(item, index) in avatarParams.data"
                :key="index"
                @click="dialogAddUpdateParams.params.avatar = item.path"
                :class="{ active: item.path === dialogAddUpdateParams.params.avatar }"
                class="avatar-item"
              >
                <img :src="item.url" alt="" srcset="" />
              </li>
            </ul>
          </div>
          <MyFormSelect
            v-if="item.type === 'select'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              userInput: true,
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
              readonly: item.readonly || false,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          >
          </MyFormInput>
        </div>
      </div>
    </MyDialog>
    <MyDialog
      :option="{
        id: dialogChangePasswordParams.id,
        dialogType: dialogChangePasswordParams.dialogType,
        clickLoading: dialogChangePasswordParams.clickLoading,
        getDataLoading: dialogChangePasswordParams.getDataLoading,
        visiable: dialogChangePasswordParams.visiable,
        title: dialogChangePasswordParams.title,
        params: dialogChangePasswordParams.params,
      }"
      width="20vw"
      @close="dialogChangePasswordCloseEvent"
      @confirm="dialogChangePasswordConfirmEvent"
      @before-hide="dialogChangePasswordBeforeHideEvent"
    >
      <div class="row q-col-gutter-x-md">
        <div v-for="(item, index) in dialogChangePasswordParams.input" :key="index" class="col-12">
          <MyFormInput
            :option="{
              model: dialogChangePasswordParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
              readonly: item.readonly || false,
            }"
            @input="(data) => (dialogChangePasswordParams.params[item.model] = data)"
            :ref="`${dialogChangePasswordParams.id}-input-${item.model}`"
          >
            <template #subTitle v-if="item.model === 'password'">
              <el-popover placement="top" title="Password rules" :width="320" popper-style="z-index:9999" trigger="hover">
                <p v-for="(item, index) in dialogChangePasswordParams.passwordRules" :key="index">{{ index + 1 }}. {{ item }}</p>
                <template #reference>
                  <q-icon name="o_info" class="text-grey-4 cursor-pointer" />
                </template>
              </el-popover>
            </template>
          </MyFormInput>
        </div>
      </div>
    </MyDialog>
    <MyDialog
      :option="{
        id: dialogDetailParams.id,
        dialogType: 'detail',
        clickLoading: dialogDetailParams.clickLoading,
        getDataLoading: dialogDetailParams.getDataLoading,
        visiable: dialogDetailParams.visiable,
        title: dialogDetailParams.title,
        params: dialogDetailParams.params,
        showAction: false,
      }"
      width="20vw"
      @close="dialogDetailCloseEvent"
      @before-hide="dialogDetailBeforeHideEvent"
    >
      <q-list class="row q-col-gutter-x-md">
        <q-item v-for="(item, index) in dialogDetailParams.params" :key="index" :clickable="false" class="col-12">
          <q-item-section>
            <q-item-label caption>{{ item.label }}：</q-item-label>
            <q-item-label :class="item.class">{{ item.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </MyDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { UserModule } from 'src/store/modules/user';
import setting from 'src/setting.json';
import { cloneDeep } from 'lodash';
import { defaultFill } from 'src/utils/tools';
import { AccountModule } from 'src/store/modules/account';
import { getCurrentInstance } from 'vue';
import { isValidEmail, isValidPassword } from 'src/utils/validate';
const CONST_PARAMS: any = {
  query: { userName: '' },
  dialog_add_update: { id: '', userName: '', avatar: '', role: '', email: '', province: '', city: '', description: '' },
  change_password: { userName: '', oldPassword: '', password: '', rePassword: '' },
};
@Component({
  name: 'AccountUserComponent',
})
export default class AccountUserComponent extends Vue {
  /**instance */
  declare $refs: any;
  get canDelete() {
    return (row: any) => {
      return row.userType === 1;
    };
  }
  get canUpdate() {
    return (row: any) => {
      return row.userType === 1;
    };
  }
  get canDisable() {
    return (row: any) => {
      return (row.userStatus === 1 || row.userStatus === 0) && row.userType !== 0;
    };
  }
  get canEnable() {
    return (row: any) => {
      return row.userStatus === 2;
    };
  }
  get canChangePassword() {
    return (row: any) => {
      return (row.userType === 1 || row.userType === 0) && row.userName !== UserModule.username;
    };
  }
  get canUnlock() {
    return (row: any) => {
      return row.userStatus === 3;
    };
  }
  get canReSendUrl() {
    return (row: any) => {
      return row.userStatus === 4 && row.userType === 1;
    };
  }
  @Watch('dialogChangePasswordParams.params.password', { deep: true })
  onChangePasswordChange() {
    this.$refs[`${this.dialogChangePasswordParams.id}-input-rePassword`][0].validForm();
  }
  @Watch('dialogChangePasswordParams.params.rePassword', { deep: true })
  onChangeRePasswordChange() {
    this.$refs[`${this.dialogChangePasswordParams.id}-input-password`][0].validForm();
  }
  /**params */
  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  private avatarParams = {
    data: [],
  };
  private queryParams: any = {
    id: 'query',
    queryLoading: false,
    resetLoading: false,
    params: cloneDeep(CONST_PARAMS.query),
    input: [
      {
        placeholder: '用户名',
        type: 'text',
        class: 'w-250 m-r-15 m-b-15',
        id: 'userName',
        inputType: 'text',
      },
    ],
  };
  async created() {
    this.getData();
    this.getAllAvatar();
  }
  private tableParams = {
    loading: false,
    data: [],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    column: [
      {
        name: 'userName',
        label: '用户名',
        inSlot: true,
      },
      {
        name: 'avatar',
        label: '头像',
        inSlot: true,
      },
      {
        name: 'userStatus',
        label: '用户状态',
        inSlot: true,
      },
      {
        name: 'role',
        label: '角色',
        align: 'left',
        field: (row: any) => row.role,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'email',
        label: '邮箱',
        align: 'left',
        field: (row: any) => row.email,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'userType',
        label: '用户类型',
        align: 'left',
        field: (row: any) => row.userType,
        format: (val: any) => {
          if (val === 0) {
            return '内置用户';
          } else if (val === 1) {
            return '普通用户';
          } else if (val === 2) {
            return '第三方用户';
          }
        },
      },
      {
        name: 'createTime',
        label: '创建时间',
        align: 'left',
        field: (row: any) => row.createTime,
        format: (val: any) => `${this.globals.parseTime(val)}`,
      },
      {
        name: 'updateTime',
        label: '更新时间',
        align: 'left',
        field: (row: any) => row.updateTime,
        format: (val: any) => `${this.globals.parseTime(val)}`,
      },
      {
        name: 'action',
        label: '$action',
        field: 'action',
        align: 'left',
        inSlot: true,
      },
    ],
  };
  private dialogDetailParams = {
    id: 'dialog-upload-file',
    getDataLoading: false,
    clickLoading: false,
    visiable: false,
    title: 'Detail',
    params: [
      { label: '用户名', value: '', id: 'userName', class: '' },
      { label: '省份', value: '', id: 'province', class: '' },
      { label: '城市', value: '', id: 'city', class: '' },
      { label: 'IP', value: '', id: 'ip', class: '' },
      { label: '描述', value: '', id: 'description', class: '' },
    ],
  };
  private dialogAddUpdateParams = {
    id: 'dialog_add_update',
    dialogType: 'add',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    params: cloneDeep(CONST_PARAMS.dialog_add_update),
    input: [
      {
        model: 'userName',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        readonly: false,
        label: '用户名',
      },
      {
        model: 'avatar',
        type: 'avatar',
        label: '头像',
      },
      {
        model: 'role',
        type: 'select',
        inputSelectOption: [
          {
            label: 'ADMIN',
            value: 'ADMIN',
          },
          {
            label: 'GUEST',
            value: 'GUEST',
          },
        ],
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '角色',
      },
      {
        model: 'email',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
          (val: string) => {
            return isValidEmail(val) || '无效邮箱地址';
          },
        ],
        readonly: false,
        label: '邮箱',
      },
      {
        model: 'province',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '省份',
      },
      {
        model: 'city',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '城市',
      },
      {
        model: 'description',
        type: 'text',
        rules: [],
        label: '描述',
      },
    ],
  };
  private dialogChangePasswordParams = {
    id: 'change_password',
    dialogType: 'change',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    passwordRules: setting.passwordRules,
    title: '',
    params: cloneDeep(CONST_PARAMS.change_password),
    input: [
      {
        model: 'userName',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        readonly: true,
        label: '用户名',
      },
      {
        model: 'oldPassword',
        type: 'text',
        classes: 'input-password',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        readonly: false,
        label: '旧密码',
      },
      {
        model: 'password',
        type: 'text',
        classes: 'input-password',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
          (val: string) => {
            return isValidPassword(val) || '无效密码';
          },
          (val: any): any => {
            return this.dialogChangePasswordParams.params.rePassword === val || '两次密码不一致';
          },
        ],
        readonly: false,
        label: '新密码',
      },
      {
        model: 'rePassword',
        type: 'text',
        classes: 'input-password',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
          (val: string) => {
            return isValidPassword(val) || '无效密码';
          },
          (val: any): any => {
            return this.dialogChangePasswordParams.params.password === val || '两次密码不一致';
          },
        ],
        readonly: false,
        label: '确认密码',
      },
    ],
  };
  /**event */
  private paginationInput(data: any) {
    this.tableParams.pagination = data;
    this.getData();
  }
  private async handleQuery() {
    this.queryParams.queryLoading = true;
    this.tableParams.pagination.page = 1;
    await this.getData();
    this.queryParams.queryLoading = false;
  }
  private async handleResetQuery() {
    this.queryParams.resetLoading = true;
    this.queryParams.params = cloneDeep(CONST_PARAMS.query);
    this.tableParams.pagination.page = 1;
    await this.getData();
    this.queryParams.resetLoading = false;
  }
  private handleClickAdd() {
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'add';
    this.dialogAddUpdateParams.title = 'Add';
  }
  private handlerClickUpdate(row: any) {
    this.dialogAddUpdateParams.params.id = row.id;
    this.dialogAddUpdateParams.params.userName = row.userName;
    this.dialogAddUpdateParams.params.avatar = row.avatarPath;
    this.dialogAddUpdateParams.params.role = row.role;
    this.dialogAddUpdateParams.params.email = row.email;
    this.dialogAddUpdateParams.params.province = row.province;
    this.dialogAddUpdateParams.params.city = row.city;
    this.dialogAddUpdateParams.params.description = row.description;
    const emailIndex = this.dialogAddUpdateParams.input.findIndex((item) => item.model === 'email');
    const userNameIndex = this.dialogAddUpdateParams.input.findIndex((item) => item.model === 'userName');
    this.dialogAddUpdateParams.input[emailIndex].readonly = true;
    this.dialogAddUpdateParams.input[userNameIndex].readonly = true;
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'update';
    this.dialogAddUpdateParams.title = 'Update';
  }
  private async handlerClickChangePassword(row: any) {
    this.dialogChangePasswordParams.visiable = true;
    this.dialogChangePasswordParams.params.userName = row.userName;
    this.dialogChangePasswordParams.title = '修改密码';
  }
  private handlerClickDetail(row: any) {
    const getValue = (row: any, key: string): string => {
      switch (key) {
        case 'name':
          return `${row[key]}-description`;
        default:
          return row[key] || '--';
      }
    };
    const getClass = (row: any, key: string): string => {
      switch (key) {
        case 'sex':
          return 'text-primary';
        default:
          return '';
      }
    };
    const arr = cloneDeep(this.dialogDetailParams.params);
    for (let item of arr) {
      for (let key in row) {
        if (item.id === key) {
          item.value = getValue(row, key);
          item.class = getClass(row, key);
        }
      }
    }
    this.dialogDetailParams.params = arr;
    this.dialogDetailParams.visiable = true;
  }
  private dialogAddUpdateCloseEvent(data: { type: string }) {
    this.dialogAddUpdateParams.visiable = false;
  }
  private dialogAddUpdateBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogAddUpdateParams.params = data.params;
      this.dialogAddUpdateParams.params.avatar = (this.avatarParams.data[0] as any).path;
      const emailIndex = this.dialogAddUpdateParams.input.findIndex((item) => item.model === 'email');
      const userNameIndex = this.dialogAddUpdateParams.input.findIndex((item) => item.model === 'userName');
      this.dialogAddUpdateParams.input[emailIndex].readonly = false;
      this.dialogAddUpdateParams.input[userNameIndex].readonly = false;
    }
  }
  private dialogDetailCloseEvent(data: { type: string }) {
    this.dialogDetailParams.visiable = false;
  }
  private dialogDetailBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogAddUpdateParams.params = data.params;
    }
  }
  private dialogChangePasswordCloseEvent(data: { type: string }) {
    this.dialogChangePasswordParams.visiable = false;
  }
  private dialogChangePasswordBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogChangePasswordParams.params = data.params;
    }
  }
  /* http */
  private async getData() {
    try {
      this.tableParams.loading = true;
      const { pageData, total } = await AccountModule.getAllUser({
        userName: this.queryParams.params.userName,
        page: this.tableParams.pagination.page,
        rowsPerPage: this.tableParams.pagination.rowsPerPage,
      });
      if (pageData && pageData.length > 0) {
        this.tableParams.data = pageData;
        this.tableParams.pagination.rowsNumber = total;
      } else {
        this.tableParams.data = [];
        this.tableParams.pagination.rowsNumber = 0;
      }
      this.tableParams.loading = false;
    } catch (error) {
      this.tableParams.loading = false;
    } finally {
      return Promise.resolve();
    }
  }
  private async getAllAvatar() {
    try {
      const { pageData } = await AccountModule.getAllAvatar({});
      if (pageData && pageData.length > 0) {
        const avatarList = pageData.map((item: any) => {
          return {
            label: item.name,
            url: item.url,
            path: item.path,
          };
        });
        this.dialogAddUpdateParams.params.avatar = avatarList[0].path;
        this.avatarParams.data = avatarList;
      }
    } catch (error) {
    } finally {
      return Promise.resolve();
    }
  }
  private async dialogAddUpdateConfirmEvent() {
    try {
      this.dialogAddUpdateParams.clickLoading = true;
      if (this.dialogAddUpdateParams.dialogType === 'add') {
        await AccountModule.addUser({
          userName: this.dialogAddUpdateParams.params.userName,
          email: this.dialogAddUpdateParams.params.email,
          province: this.dialogAddUpdateParams.params.province,
          city: this.dialogAddUpdateParams.params.city,
          description: this.dialogAddUpdateParams.params.description,
          avatar: this.dialogAddUpdateParams.params.avatar,
          role: this.dialogAddUpdateParams.params.role,
          ip: '127.0.0.1',
          userType: 1, //0:默认用户，1:创建用户，2:第三方用户
        });
        this.$globalMessage.show({
          type: 'success',
          content: `添加成功，请检查您的邮件设置密码，邮件已发送至 ${this.dialogAddUpdateParams.params.email}`,
        });
      }
      if (this.dialogAddUpdateParams.dialogType === 'update') {
        await AccountModule.updateUser({
          id: this.dialogAddUpdateParams.params.id,
          province: this.dialogAddUpdateParams.params.province,
          city: this.dialogAddUpdateParams.params.city,
          description: this.dialogAddUpdateParams.params.description,
          avatar: this.dialogAddUpdateParams.params.avatar,
          ip: '127.0.0.1',
        });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
      }
      this.dialogAddUpdateParams.clickLoading = false;
      this.dialogAddUpdateParams.visiable = false;
      this.getData();
    } catch (error) {
      console.log(error);
      this.dialogAddUpdateParams.clickLoading = false;
    }
  }
  private async dialogChangePasswordConfirmEvent() {
    try {
      this.dialogChangePasswordParams.clickLoading = true;
      await UserModule.changePassword({
        username: this.dialogChangePasswordParams.params.userName,
        oldPassword: this.dialogChangePasswordParams.params.oldPassword,
        newPassword: this.dialogChangePasswordParams.params.password,
      });
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.dialogChangePasswordParams.clickLoading = false;
      this.dialogChangePasswordParams.visiable = false;
      this.getData();
    } catch (error) {
      console.log(error);
      this.dialogChangePasswordParams.clickLoading = false;
    }
  }
  private async updateUserStatus(row: any, userStatus: number) {
    try {
      this.tableParams.loading = true;
      await AccountModule.updateUserStatus({
        id: row.id,
        userStatus: userStatus,
      });
      this.tableParams.loading = false;
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    } catch (error) {
      this.tableParams.loading = false;
    }
  }
  private async unLockUser(row: any, userStatus: number) {
    try {
      this.tableParams.loading = true;
      await AccountModule.unLockUser({
        id: row.id,
      });
      this.tableParams.loading = false;
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    } catch (error) {
      this.tableParams.loading = false;
    }
  }
  private async reSendUrl(row: any) {
    try {
      this.tableParams.loading = true;
      await AccountModule.reSendUrl({
        id: row.id,
      });
      this.tableParams.loading = false;
      this.$globalMessage.show({
        type: 'success',
        content: `发送成功，请检查您的邮件设置密码，邮件已发送至 ${row.email}`,
      });
      this.getData();
    } catch (error) {
      this.tableParams.loading = false;
    }
  }
  private async handlerClickDelete(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: this.$t('messages.tishi'),
        color: 'primary',
        content: this.$t('messages.areYouSure'),
        confirmButtonText: this.$t('action.yes'),
      });
      if (result) {
        await AccountModule.deleteUser({
          id: row.id,
        });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getData();
      }
    } catch (error) {}
  }
}
</script>

<style scoped lang='scss'>
.avatar-list {
  display: flex;
  flex-wrap: wrap;
  .avatar-item {
    margin-right: 8px;
    padding: 2px;
    border-radius: 6px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    border: 2px solid transparent;
    img {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      cursor: pointer;
    }
    &.active {
      border: 2px solid $primary;
    }
  }
}
</style>
