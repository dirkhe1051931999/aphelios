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
            <q-btn color="primary" icon="o_add" label="Add" no-caps @click="handleClickAdd" />
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
                <!-- title -->
                <div v-if="col.name === 'title'">
                  <span class="link-type q-mr-sm" @click="handlerClickUpdate(props.row)">{{ props.row.title }}</span>
                  <q-icon v-if="props.row.haveImg" color="grey" size="18px" name="o_image"></q-icon>
                </div>
                <!-- status -->
                <div v-if="col.name === 'status'">
                  <span class="my-status" :class="{ red: props.row.status === 'OFFLINE', grey: props.row.status === 'DRAFT', green: props.row.status === 'PUBLISHED' }">{{
                    postStatus(props.row)
                  }}</span>
                </div>
                <!-- authorId -->
                <div v-if="col.name === 'authorId'">
                  <span v-if="props.row.authorId">{{ postAuthor(props.row) }}</span>
                  <span v-else>--</span>
                </div>
                <!-- categoryId -->
                <div v-if="col.name === 'categoryId'">
                  <span v-if="props.row.categoryId">{{ postCategory(props.row) }}</span>
                  <span v-else>--</span>
                </div>
                <!-- channelId -->
                <div v-if="col.name === 'channelId'">
                  <span v-if="props.row.channelId">{{ postChannel(props.row) }}</span>
                  <span v-else>--</span>
                </div>
                <!-- count -->
                <div v-if="col.name === 'count'">
                  <span class="link-type" v-if="props.row.comment">{{ defaultFill(props.row.comment) }} </span>
                  <span v-else>--</span>
                  <span class="q-mx-sm">/</span>
                  <span class="link-type" v-if="props.row.view">{{ defaultFill(props.row.view) }}</span>
                  <span v-else>--</span>
                </div>
                <!-- action -->
                <div v-if="col.name === 'action'">
                  <span class="in-table-link-button" v-if="canOnline(props.row)" @click="handlerClickOnline(props.row)">上线 </span>
                  <span class="in-table-delete-button" v-if="canOffline(props.row)" @click="handlerClickOffline(props.row)" :class="{ ' m-l-10': !canOffline(props.row) }">下线 </span>
                  <span class="in-table-delete-button m-l-10" @click="handlerClickDelete(props.row)">删除 </span>
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
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { cloneDeep } from 'lodash';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { getCurrentInstance } from 'vue';

const CONST_PARAMS: any = {
  query: { channelId: '', status: '', authorId: '' },
};

@Component({
  name: 'BlogPostComponent',
  components: {},
})
export default class BlogPostComponent extends Vue {
  /**instance */
  declare $refs: any;
  get authorOptions() {
    return BlogPostModule.allValidAuthor;
  }
  get categoryOptions() {
    return BlogPostModule.allCategory;
  }
  get channelOptions() {
    return BlogPostModule.allChannel;
  }
  get addedPostId() {
    return BlogPostModule.addedPostId;
  }
  get updatePostSuccessFlag() {
    return BlogPostModule.updatePostSuccessFlag;
  }
  get addPostSuccessFlag() {
    return BlogPostModule.addPostSuccessFlag;
  }
  get postStatus() {
    return (row: any) => {
      const selectOption = this.queryParams.input.find((item: any) => item.id === 'status').selectOption;
      const item = selectOption.find((item: any) => item.value === row.status);
      return item.label;
    };
  }
  get postCategory() {
    return (row: any) => {
      if (!row.categoryId) return '--';
      function findItemById(arr: any, id: any): any {
        for (let item of arr) {
          if (item.id === id) {
            return item;
          }
          if (item.children) {
            let foundItem = findItemById(item.children, id);
            if (foundItem) {
              return foundItem;
            }
          }
        }
        return null;
      }
      const item = findItemById(this.categoryOptions, row.categoryId);
      if (item) {
        return item.name;
      } else {
        return '--';
      }
    };
  }
  get postAuthor() {
    return (row: any) => {
      if (!row.authorId) return '--';
      const selectOption = this.authorOptions;
      const item = selectOption.find((item: any) => item.value === row.authorId);
      if (item) {
        return item.label;
      } else {
        return '--';
      }
    };
  }
  get postChannel() {
    return (row: any) => {
      if (!row.channelId) return '--';
      const selectOption = this.channelOptions;
      const item = selectOption.find((item: any) => item.value === row.channelId);
      if (item) {
        return item.label;
      } else {
        return '--';
      }
    };
  }
  get canOnline() {
    return (row: any) => {
      return row.status === 'OFFLINE';
    };
  }
  get canOffline() {
    return (row: any) => {
      return row.status === 'PUBLISHED' || row.status === 'DRAFT';
    };
  }
  @Watch('addPostSuccessFlag')
  private async watchAddPostSuccessFlag(newVal: string) {
    if (newVal) {
      console.log('add id', this.addedPostId);
      this.getData();
      BlogPostModule.SET_ADD_POST_SUCCESS_FLAG(false);
    }
  }
  @Watch('updatePostSuccessFlag')
  private async watchUpdatePostSuccessFlag(newVal: string) {
    if (newVal) {
      this.getData();
      BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG(false);
    }
  }
  mounted() {
    if (this.$route.query.channelId) {
      this.queryParams.params.channelId = this.$route.query.channelId;
    }
    this.getData();
    this.getAuthor();
    this.getCategories();
    this.getChannel();
  }
  /**params */
  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  private queryParams: any = {
    id: 'query',
    queryLoading: false,
    resetLoading: false,
    params: cloneDeep(CONST_PARAMS.query),
    input: [
      {
        placeholder: '频道',
        type: 'select',
        class: 'w-250 m-r-15 m-b-15',
        selectOption: [],
        id: 'channelId',
      },
      {
        placeholder: '状态',
        type: 'select',
        class: 'w-250 m-r-15 m-b-15',
        selectOption: [
          {
            label: '草稿',
            value: 'DRAFT',
          },
          {
            label: '已发布',
            value: 'PUBLISHED',
          },
          {
            label: '已下线',
            value: 'OFFLINE',
          },
        ],
        id: 'status',
      },
      {
        placeholder: '作者',
        type: 'select',
        class: 'w-250 m-r-15 m-b-15',
        selectOption: [],
        id: 'authorId',
      },
    ],
  };
  private tableParams = {
    loading: false,
    data: [],
    categoryOptions: [],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    column: [
      {
        name: 'title',
        label: '标题',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'status',
        label: '状态',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'authorId',
        label: '作者',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'categoryId',
        label: '分类',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'channelId',
        label: '频道',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'count',
        label: '评论数/阅读数',
        align: 'left',
        inSlot: true,
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
    BlogPostModule.SET_POST_ADD_OR_UPDATE('add');
    BlogPostModule.SET_DISABLE_SELECT_CATEGORY(false);
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(true);
  }
  private handlerClickUpdate(row: any) {
    BlogPostModule.SET_POST_ADD_OR_UPDATE('update');
    BlogPostModule.SET_POST_DETAIL({
      row: {
        authorId: row.authorId,
        categoryId: row.categoryId,
        channelId: row.channelId,
        title: row.title,
        poster: row.poster,
        id: row.id,
      },
    });
    BlogPostModule.SET_DISABLE_SELECT_CATEGORY(false);
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(true);
  }
  /**http */
  private async getData() {
    try {
      this.tableParams.loading = true;
      const { pageData, total } = await BlogPostModule.getPostList({
        channelId: this.queryParams.params.channelId,
        status: this.queryParams.params.status,
        authorId: this.queryParams.params.authorId,
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
  private async getAuthor() {
    try {
      let { pageData } = await BlogPostModule.getAllPostAuthor({});
      if (pageData && pageData.length > 0) {
        const index = this.queryParams.input.findIndex((item: any) => item.id === 'authorId');
        pageData = pageData.filter((item: any) => item.status === 0 || (item.status === 4 && item.type === 0));
        pageData = pageData.map((item: any) => {
          return { ...item, label: item.name, value: item.id };
        });
        this.queryParams.input[index].selectOption = pageData;
      }
    } finally {
      return Promise.resolve();
    }
  }
  private async getCategories() {
    try {
      const allSheet = await BlogPostModule.getAllSheet({});
      const allDirectory = await BlogPostModule.getAllDirectory({});
      const allChildDirectory = await BlogPostModule.getAllChildDirectory({});
      const sheets = allSheet.pageData;
      const directorys = allDirectory.pageData;
      const childDirectorys = allChildDirectory.pageData;
      for (let item of sheets) {
        item.children = [];
        item.children = directorys.filter((directory: any) => directory.parent_id === item.id);
      }
      for (let item of sheets) {
        for (let child of item.children) {
          child.children = [];
          child.children = childDirectorys.filter((childDirectory: any) => childDirectory.parent_id === child.id);
        }
      }
      allSheet.pageData = allSheet.pageData.map((item: any) => {
        return { ...item, label: item.name, value: item.id };
      });
      BlogPostModule.SET_ALL_CATEGORY(allSheet.pageData);
    } finally {
      return Promise.resolve();
    }
  }
  private async getChannel() {
    try {
      let { pageData } = await BlogPostModule.getAllChannel({});
      pageData = pageData.map((item: any) => {
        return { ...item, label: item.name, value: item.id };
      });
      const index = this.queryParams.input.findIndex((item: any) => item.id === 'channelId');
      this.queryParams.input[index].selectOption = pageData;
    } finally {
      return Promise.resolve();
    }
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
        await BlogPostModule.deletePost({
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
  private async handlerClickOnline(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await BlogPostModule.publishPost({
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
  private async handlerClickOffline(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await BlogPostModule.offlinePost({
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
