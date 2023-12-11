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
        bordered
        flat
        :columns="tableParams.column"
        :rows="tableParams.data"
        :loading="tableParams.loading"
        :pagination="tableParams.pagination"
        hide-pagination
        :no-data-label="$t(`tip.noData`)"
        class="my-table"
      >
        <template #top-right>
          <q-btn color="primary" icon="add" :label="$t('action.add')" no-caps @click="handlerClickAdd" />
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <!-- other -->
            <q-th v-for="col in props.cols" :key="col.name" :props="props" style="text-align: left">
              {{ col.label.indexOf('$') !== -1 ? $t(`table.${col.label.replace('$', '')}`) : col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- other -->
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-left">
              <span v-if="!col.inSlot">{{ col.value }}</span>
              <div class="text-left" v-else>
                <!-- username -->
                <div v-if="col.name === 'username'">
                  <q-icon name="male" color="blue" v-if="props.row.gender === 1"></q-icon>
                  <q-icon name="female" color="red" v-if="props.row.gender === 0"></q-icon>
                  <span class="link-type q-ml-sm" @click="handlerClickDetail(props.row)">{{ props.row.username }}</span>
                  <span class="text-grey q-ml-sm">（{{ props.row.nickname }}）</span>
                  <q-avatar size="32px" class="q-ml-sm">
                    <q-img :src="calacAavatar(props.row.avatarUrl)" spinner-color="primary" spinner-size="12px"></q-img>
                  </q-avatar>
                </div>
                <!-- score -->
                <div v-if="col.name === 'score'">
                  <span>{{ scoreName(props.row.score) }}</span>
                </div>
                <!-- count -->
                <div v-if="col.name === 'count'">
                  <span>{{ defaultFill(props.row.fansCount) }} / {{ defaultFill(props.row.friendCount) }}</span>
                </div>
                <!-- type -->
                <div v-if="col.name === 'type'">
                  <span class="my-status green" v-if="props.row.type === 1">正常</span>
                  <span class="my-status red" v-if="props.row.type === 2">被禁</span>
                </div>
                <!-- IP地址 -->
                <div v-if="col.name === 'region'">
                  {{ props.row.region }}
                  <span class="text-grey">（{{ props.row.ip }}）</span>
                </div>
                <!-- action -->
                <div v-if="col.name === 'action'">
                  <span class="in-table-delete-button" @click="handlerClickDelete(props.row)">{{ $t(`action.delete`) }} </span>
                  <span class="in-table-link-button q-ml-md" @click="handlerClickViewPassword(props.row)">查看密码 </span>
                  <span class="in-table-link-button q-ml-md" @click="handlerClickDisable(props.row)" v-if="props.row.type === 1">禁用 </span>
                  <span class="in-table-link-button q-ml-md" @click="handlerClickEnable(props.row)" v-if="props.row.type === 2">启用 </span>
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
    <RightPanel ref="userDetailDialogRef" @isOpen="dialogDetailBeforeHideEvent" :title="dialogDetailParams.title">
      <q-form class="row q-col-gutter-x-md q-pa-md" ref="userDetailDialogFormRef">
        <div v-for="(item, index) in dialogDetailParams.input" :key="index" class="col-6">
          <div v-if="item.type === 'avatar'" class="q-mb-md">
            <p class="f-bold fs-12 p-b-8 row items-center">
              <span class="m-r-6">* 头像</span>
            </p>
            <ul class="avatar-list">
              <li
                v-for="(item, index) in dialogDetailParams.avatarList"
                :key="index"
                :class="{ active: item === dialogDetailParams.params.avatarUrl }"
                @click="dialogDetailParams.params.avatarUrl = item"
              >
                <q-avatar size="40px">
                  <q-img :src="item" />
                </q-avatar>
              </li>
            </ul>
          </div>
          <MyMenuTreeComponent
            v-if="item.type === 'menuTree'"
            :option="{
              model: dialogDetailParams.params[item.model],
              detail_model: dialogDetailParams.params[item.detail_model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
            }"
            @detail_input="(data) => (dialogDetailParams.params[item.detail_model] = data)"
            @input="(data) => (dialogDetailParams.params[item.model] = data)"
            @init="item.onInit"
            @change="item.onChange"
            @splicing="item.onSplicing"
          >
          </MyMenuTreeComponent>
          <MyFormSelect
            v-if="item.type === 'select'"
            :option="{
              inputId: `${dialogDetailParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogDetailParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              userInput: true,
            }"
            @input="(data) => (dialogDetailParams.params[item.model] = data)"
          />
          <MyFormSlider
            v-if="item.type === 'slider'"
            :option="{
              rules: item.rules,
              classes: item.classes,
              model: dialogDetailParams.params[item.model],
              label: item.label,
              min: item.min,
              max: item.max,
              step: item.step,
            }"
          />
          <MyFormRadio
            v-if="item.type === 'radio'"
            :option="{
              inputId: `${dialogDetailParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogDetailParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              disable: item.disable,
            }"
            @input="(data) => (dialogDetailParams.params[item.model] = data)"
          />
          <MyFormMultipleSelect
            v-if="item.type === 'multiple-select'"
            :option="{
              inputId: `${dialogDetailParams.id}-multiple-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogDetailParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              multiple: item.multiple,
              userInput: true,
            }"
            @input="(data) => (dialogDetailParams.params[item.model] = data)"
          >
            <template #subTitle>
              <el-popover placement="top" title="popover-title" :width="320" popper-style="z-index:9999" trigger="hover">
                <p v-for="(item, index) in ['test1', 'test2', 'test3']" :key="index">{{ index + 1 }}. {{ item }}</p>
                <template #reference>
                  <q-icon name="o_info" class="text-grey-4 cursor-pointer" />
                </template>
              </el-popover>
            </template>
          </MyFormMultipleSelect>
          <MyFormInput
            v-if="item.type === 'text'"
            :option="{
              model: dialogDetailParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
              disable: item.readonly || false,
            }"
            @input="(data) => (dialogDetailParams.params[item.model] = data)"
          >
            <template #subTitle>
              <span @click="generatePassword" v-if="item.model === 'password' && dialogDetailParams.dialogType === 'add'" class="link-type">生成密码</span>
              <el-popover placement="top" title="规范" :width="320" popper-style="z-index:9999" trigger="hover" v-if="item.model === 'username'">
                <p v-for="(item, index) in ['字母（大写或小写）、数字或下划线', '长度必须在5到32之间']" :key="index">{{ index + 1 }}. {{ item }}</p>
                <template #reference>
                  <q-icon name="o_info" class="text-grey cursor-pointer" />
                </template>
              </el-popover>
              <span @click="generateUsername" v-if="item.model === 'username' && dialogDetailParams.dialogType === 'add'" class="link-type q-ml-sm">生成用户名</span>
            </template>
          </MyFormInput>
        </div>
        <!-- 提交按钮 -->
        <div class="row justify-center q-mt-lg full-width" v-if="dialogDetailParams.dialogType === 'add'">
          <q-btn
            color="primary"
            label="确定"
            no-caps
            :loading="dialogDetailParams.clickLoading"
            @click="dialogDetailParams.dialogType === 'add' ? handlerClickAddUser() : handlerClickUpdateUser()"
            style="min-width: 100px"
          />
        </div>
      </q-form>
    </RightPanel>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { cloneDeep } from 'lodash';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { getCurrentInstance } from 'vue';
import { isValidEmail, isValidUsername } from 'src/utils/validate';
import setting from 'src/setting.json';
import { RSAEnCrypty } from 'src/utils/tools';
import { getAuthorLevel, getAuthorLevelName } from './utils';

const CONST_PARAMS: any = {
  query: { username: '', type: '' },
  dialog_add_update: {
    gender: '1',
    nickname: '',
    username: '',
    email: '',
    password: '',
    avatarUrl: `${setting.ip}/cdn/avatar/LOL.png`,
    address_detail: '',
    address: '',
    ip: '',
    region: '',
    description: '',
  },
};
@Component({ name: 'BlogPostUserComponent' })
export default class BlogPostUserComponent extends Vue {
  /**instance */
  declare $refs: any;

  get scoreName() {
    return (score: number) => {
      return `Lv.${getAuthorLevel(score)} ${getAuthorLevelName(score)}`;
    };
  }

  get calacAavatar() {
    return (path: string) => {
      return `${setting.ip}${path}`;
    };
  }

  mounted() {
    this.getData();
  }

  /**params */
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public queryParams: any = {
    id: 'query',
    queryLoading: false,
    resetLoading: false,
    params: cloneDeep(CONST_PARAMS.query),
    input: [
      {
        placeholder: '用户名',
        type: 'text',
        class: 'w-250 m-r-15 m-b-15',
        id: 'username',
        inputType: 'text',
      },
      {
        placeholder: '状态',
        type: 'select',
        class: 'w-250 m-r-15 m-b-15',
        selectOption: [
          {
            label: '正常',
            value: '1',
          },
          {
            label: '禁用',
            value: '2',
          },
        ],
        id: 'type',
      },
    ],
  };
  public tableParams = {
    loading: false,
    data: [],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    column: [
      {
        name: 'username',
        label: '用户名',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'score',
        label: '等级',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'count',
        label: '粉丝数/关注数',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'type',
        label: '状态',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'region',
        label: 'IP 地址',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'loginTime',
        label: '登录时间',
        align: 'left',
        field: (row: any) => row.loginTime,
        format: (val: any) => `${this.globals.parseTime(val)}`,
      },
      {
        name: 'createTime',
        label: '创建时间',
        align: 'left',
        field: (row: any) => row.createTime,
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

  public dialogDetailParams = {
    id: 'dialog_add_update',
    dialogType: 'add',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    params: cloneDeep(CONST_PARAMS.dialog_add_update),
    defaultAvatarList: [`${setting.ip}/cdn/avatar/LOL.png`, `${setting.ip}/cdn/avatar/Aphelios.png`, `${setting.ip}/cdn/avatar/Malphite.png`, `${setting.ip}/cdn/avatar/Milio.png`],
    avatarList: [],
    input: [
      {
        model: 'username',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
          (val: string) => {
            return isValidUsername(val) || 'Invalid username';
          },
        ],
        readonly: false,
        label: '用户名',
      },
      {
        model: 'nickname',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '昵称',
      },
      {
        model: 'email',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
          (val: string) => {
            return isValidEmail(val) || 'Invalid email';
          },
        ],
        readonly: false,
        label: '邮箱',
      },
      {
        model: 'password',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        readonly: false,
        label: '密码',
      },
      {
        type: 'avatar',
      },
      {
        model: 'address',
        detail_model: 'address_detail',
        type: 'menuTree',
        level: 4,
        label: '地址',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        onSplicing: (data: any) => {
          let { level1, level2, level3, level4, ctx } = data;
          ctx.model = `${level1.name};${level2.name};${level3.name}${level4 ? `;${level4.name}` : ''}`;
        },
        onChange: (data: any) => {
          let { ctx, currentLevel, nextLevel, row } = data;
          if (!row.lock) {
            row.lock = true;
            this.getAreaData(row.pinyin).then((result: any) => {
              const zhixiashi = ['北京市', '天津市', '上海市', '重庆市'];
              const isZhixiashi = zhixiashi.includes(row.name);
              const currentLevelIndex = ctx.firstLevelSelectOption.findIndex((item: any) => item.code === row.code);
              ctx.firstLevelSelectOption[currentLevelIndex].children = isZhixiashi ? result[0].children : result;
            });
          }
        },
        onInit: async (ctx: any) => {
          let result = await this.getAreaData('province');
          result = result.map((item: any) => {
            return {
              ...item,
              children: [],
              lock: false,
              zhixiashi: item.name.indexOf('市') !== -1,
              showSideArrow: true,
            };
          });
          ctx.firstLevelSelectOption = result;
        },
      },
      {
        model: 'gender',
        type: 'radio',
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
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
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
        label: '介绍',
      },
    ],
  };

  /**event */
  public paginationInput(data: any) {
    this.tableParams.pagination = data;
    this.getData();
  }

  public async handleQuery() {
    this.queryParams.queryLoading = true;
    this.tableParams.pagination.page = 1;
    await this.getData();
    this.queryParams.queryLoading = false;
  }

  public async handleResetQuery() {
    this.queryParams.resetLoading = true;
    this.queryParams.params = cloneDeep(CONST_PARAMS.query);
    this.tableParams.pagination.page = 1;
    await this.getData();
    this.queryParams.resetLoading = false;
  }

  public async handlerClickDetail(row: any) {
    this.dialogDetailParams.dialogType = 'update';
    this.$refs.userDetailDialogRef.isOpened = true;
    this.getIP();
    this.dialogDetailParams.title = 'Detail';
    this.dialogDetailParams.params.username = row.username;
    this.dialogDetailParams.params.nickname = row.nickname;
    this.dialogDetailParams.params.email = row.email;
    this.dialogDetailParams.params.password = '********';
    this.dialogDetailParams.params.avatarUrl = `${setting.ip}${row.avatarUrl}`;
    if (`${setting.ip}${row.avatarUrl}`.indexOf(setting.ip) !== -1) {
      this.dialogDetailParams.avatarList = this.dialogDetailParams.defaultAvatarList as any;
    } else {
      this.dialogDetailParams.avatarList = [row.avatarUrl, ...this.dialogDetailParams.defaultAvatarList] as any;
    }
    this.dialogDetailParams.params.address = row.address.split('&')[0];
    this.dialogDetailParams.params.address_detail = row.address.split('&')[1];
    this.dialogDetailParams.params.gender = String(row.gender);
    this.dialogDetailParams.params.description = row.description;
    const usernameIndex = this.dialogDetailParams.input.findIndex((item: any) => item.model === 'username');
    const passwordIndex = this.dialogDetailParams.input.findIndex((item: any) => item.model === 'password');
    const emailIndex = this.dialogDetailParams.input.findIndex((item: any) => item.model === 'email');
    this.dialogDetailParams.input[usernameIndex].readonly = true;
    this.dialogDetailParams.input[passwordIndex].readonly = true;
    this.dialogDetailParams.input[emailIndex].readonly = true;
  }

  public handlerClickAdd() {
    this.dialogDetailParams.dialogType = 'add';
    this.dialogDetailParams.title = '添加用户';
    this.dialogDetailParams.params = cloneDeep(CONST_PARAMS.dialog_add_update);
    this.getIP();
    this.$refs.userDetailDialogRef.isOpened = true;
    this.dialogDetailParams.avatarList = this.dialogDetailParams.defaultAvatarList as any;
    const usernameIndex = this.dialogDetailParams.input.findIndex((item: any) => item.model === 'username');
    const passwordIndex = this.dialogDetailParams.input.findIndex((item: any) => item.model === 'password');
    const emailIndex = this.dialogDetailParams.input.findIndex((item: any) => item.model === 'email');
    this.dialogDetailParams.input[usernameIndex].readonly = false;
    this.dialogDetailParams.input[passwordIndex].readonly = false;
    this.dialogDetailParams.input[emailIndex].readonly = false;
  }

  public dialogDetailBeforeHideEvent() {
    this.$nextTick(() => {
      this.$refs.userDetailDialogFormRef.resetValidation();
    });
  }

  public generatePassword() {
    function generate() {
      const length = 8;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let retVal = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    }

    this.dialogDetailParams.params.password = generate();
  }

  public generateUsername() {
    function generate() {
      const length = 5;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let retVal = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    }

    this.dialogDetailParams.params.username = generate();
  }

  /**http */
  public async getData() {
    try {
      this.tableParams.loading = true;
      const params = {
        ...this.queryParams.params,
        page: this.tableParams.pagination.page,
        rowsPerPage: this.tableParams.pagination.rowsPerPage,
      };
      const { pageData, total } = await BlogPostModule.getAllPostUser(params);
      if (pageData && pageData.length) {
        this.tableParams.data = pageData;
        this.tableParams.pagination.rowsNumber = total;
      } else {
        this.tableParams.data = [];
        this.tableParams.pagination.rowsNumber = 0;
      }
      this.tableParams.loading = false;
    } catch (error) {
      console.log(error);
      this.tableParams.loading = false;
    } finally {
      return Promise.resolve();
    }
  }

  public async getAreaData(pinyin: string) {
    try {
      const result = await BlogPostModule.getAreaData({ pinyin });
      if (result && result.length) {
        return Promise.resolve(result);
      } else if (result && result.children && result.children.length) {
        return Promise.resolve(result.children);
      } else {
        return Promise.resolve([]);
      }
    } catch (error) {
      return Promise.resolve([]);
    }
  }

  public async getIP() {
    try {
      const result = await BlogPostModule.getIP({});
      const { query, city, country } = result;
      if (query && city && country) {
        this.dialogDetailParams.params.region = `${country};${city}`;
        this.dialogDetailParams.params.ip = query;
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve([]);
    }
  }

  public async handlerClickDelete(row: any) {
    try {
      this.$q.loading.show();
      await BlogPostModule.deletePostUser({ id: row.id });
      this.$globalMessage.show({
        type: 'success',
        content: '删除成功',
      });
      this.$q.loading.hide();
      this.getData();
    } catch (error) {}
  }

  public handlerClickAddUser() {
    this.$refs.userDetailDialogFormRef.validate().then(async (valid: boolean) => {
      if (valid) {
        this.dialogDetailParams.clickLoading = true;
        try {
          const params = {
            gender: Number(this.dialogDetailParams.params.gender),
            nickname: this.dialogDetailParams.params.nickname,
            username: this.dialogDetailParams.params.username,
            email: this.dialogDetailParams.params.email,
            password: RSAEnCrypty(this.dialogDetailParams.params.password),
            avatarUrl: this.dialogDetailParams.params.avatarUrl.split(setting.ip)[1],
            address: this.dialogDetailParams.params.address,
            address_detail: this.dialogDetailParams.params.address_detail,
            ip: this.dialogDetailParams.params.ip,
            region: this.dialogDetailParams.params.region,
            description: this.dialogDetailParams.params.description,
          };
          await BlogPostModule.addPostUser(params);
          this.$globalMessage.show({
            type: 'success',
            content: '添加成功',
          });
          this.$refs.userDetailDialogRef.isOpened = false;
          this.getData();
          // this.getData();
        } catch (error) {
          console.log(error);
        } finally {
          this.dialogDetailParams.clickLoading = false;
        }
      }
    });
  }

  public handlerClickUpdateUser() {
    this.$refs.userDetailDialogFormRef.validate().then(async (valid: boolean) => {
      if (valid) {
        this.dialogDetailParams.clickLoading = true;
        try {
          this.getData();
        } catch (error) {
          console.log(error);
        } finally {
          this.dialogDetailParams.clickLoading = false;
        }
      }
    });
  }

  public async handlerClickViewPassword(row: any) {
    try {
      const result = await BlogPostModule.viewUserPassword({ data: row.password });
      this.$q.dialog({
        title: row.username,
        message: result,
        transitionHide: 'jump-up',
        transitionShow: 'jump-down',
      });
    } catch (error) {}
  }

  public async handlerClickDisable(row: any) {
    try {
      const result = await BlogPostModule.setPostUserStatus({
        id: row.id,
        status: 2,
      });
      this.$globalMessage.show({
        type: 'success',
        content: 'Successfully',
      });
      this.getData();
    } catch (error) {}
  }

  public async handlerClickEnable(row: any) {
    try {
      const result = await BlogPostModule.setPostUserStatus({
        id: row.id,
        status: 1,
      });
      this.$globalMessage.show({
        type: 'success',
        content: 'Successfully',
      });
      this.getData();
    } catch (error) {}
  }
}
</script>

<style lang="scss" scoped>
.avatar-list {
  display: flex;
  flex-wrap: wrap;

  li {
    width: 58px;
    height: 58px;
    margin-right: 8px;
    cursor: pointer;
    box-sizing: border-box;
    transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
    padding: 8px;

    &:hover,
    &.active {
      border: 1px solid $primary;
      border-radius: 8px;
    }
  }
}
</style>
