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
                :multiple="item.multiple"
                :use-chips="item.multiple"
                :stack-label="item.multiple"
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
        class="blog-post-list"
        row-key="id"
        @request="sortTableData"
        binary-state-sort
      >
        <template #top-right>
          <q-btn
            color="dark"
            outline
            icon="add"
            :icon-right="item.svg"
            :label="item.label"
            no-caps
            v-for="item in tableParams.postTypeOptions"
            :key="item.value"
            class="q-ml-md"
            :class="{ hide: item.value === '4' }"
            @click="handleClickAdd(item)"
          />
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <!-- other -->
            <q-th v-for="col in props.cols" :key="col.name" :props="props" style="text-align: left">
              <div v-if="col.name === 'view'">
                {{ col.label }}
                <q-icon name="arrow_upward" size="14px" v-show="queryParams.params.orderProperty === 'view' && queryParams.params.orderDir === 'ASC'" />
                <q-icon name="arrow_downward" size="14px" v-show="queryParams.params.orderProperty === 'view' && queryParams.params.orderDir === 'DESC'" />
              </div>
              <div v-else-if="col.name === 'comment'">
                {{ col.label }}
                <q-icon name="arrow_upward" size="14px" v-show="queryParams.params.orderProperty === 'comment' && queryParams.params.orderDir === 'ASC'" />
                <q-icon name="arrow_downward" size="14px" v-show="queryParams.params.orderProperty === 'comment' && queryParams.params.orderDir === 'DESC'" />
              </div>
              <span v-else>{{ col.label.indexOf('$') !== -1 ? $t(`table.${col.label.replace('$', '')}`) : col.label }}</span>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- other -->
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-left">
              <span v-if="!col.inSlot">{{ col.value }}</span>
              <div class="text-left" v-else>
                <!-- title -->
                <div v-if="col.name === 'title'" class="row items-center">
                  <div>
                    <span class="q-pa-xs b-r-100 bg-grey-2 border-all">
                      <q-icon :name="postTypeSvgName(props.row)" size="18px">
                        <q-tooltip anchor="center left" self="center right"> {{ postTypeName(props.row) }} </q-tooltip>
                      </q-icon>
                    </span>
                    <span class="detail-link-type q-mx-sm" @click="handlerClickUpdate(props.row)"> {{ props.row.title }}</span>
                    <q-btn size="8px" color="grey" outline label="评论">
                      <q-popup-proxy class="reply-input-proxy" ref="replyInputProxyRef">
                        <q-banner style="min-width: 20vw" class="q-pa-md">
                          <SimpleRichTextInput @submit="submitReplyComment($event, props.row)" />
                        </q-banner>
                      </q-popup-proxy>
                    </q-btn>
                    <q-btn size="8px" color="grey" label="添加问卷" class="q-ml-sm" outline @click="handlerClickAddQuestion(props.row)" v-if="props.row.survey && !props.row.survey.length" />
                    <q-btn size="8px" color="primary" label="编辑问卷" class="q-ml-sm" outline @click="handlerClickUpdateQuestion(props.row)" v-if="props.row.survey && props.row.survey.length" />
                  </div>
                  <q-img :src="props.row.poster" width="60px" fit="cover" height="40px" class="q-ml-md rounded-borders" spinner-size="12px" spinner-color="primary"></q-img>
                </div>
                <div v-if="col.name === 'chip'">
                  <q-chip dense :color="item.color" :label="item.label" outline v-for="(item, index) in tableParams.chips" :key="index" :class="{ hide: props.row[item.value] !== '1' }" />
                </div>
                <div v-if="col.name === 'postTags' && props.row.postTags" class="row items-center w-200">
                  <!-- 一行最多5个 -->
                  <q-chip :label="item" v-for="(item, index) in props.row.postTags" :key="index" dense />
                </div>
                <div v-if="col.name === 'postTags' && !props.row.postTags">--</div>
                <!-- status -->
                <div v-if="col.name === 'status'">
                  <span class="my-status" :class="{ red: props.row.status === 'OFFLINE', grey: props.row.status === 'DRAFT', green: props.row.status === 'PUBLISHED' }">{{
                    postStatus(props.row)
                  }}</span>
                </div>
                <!-- authorId -->
                <div v-if="col.name === 'authorId'" class="row items-center no-wrap">
                  <div class="border-all q-pa-xs b-r-100 q-mr-sm" v-if="postAuthorImg(props.row)">
                    <q-avatar size="30px" font-size="22px">
                      <q-img :src="postAuthorImg(props.row)" spinner-color="primary" spinner-size="12px" />
                    </q-avatar>
                  </div>
                  {{ postAuthor(props.row) || '--' }}
                </div>
                <!-- directoryId -->
                <div v-if="col.name === 'directoryId'">
                  <span v-if="props.row.directoryId">{{ postCategory(props.row) }}</span>
                  <span v-else>--</span>
                </div>
                <!-- channelId -->
                <div v-if="col.name === 'channelId'">
                  <span v-if="props.row.channelId">{{ postChannel(props.row) }}</span>
                  <span v-else>--</span>
                </div>
                <!-- view -->
                <div v-if="col.name === 'view'">
                  <q-icon name="visibility" class="q-mr-sm"></q-icon>
                  <span v-if="props.row.view">{{ defaultFill(props.row.view) }}</span>
                  <span v-else>0</span>
                </div>
                <!-- comment -->
                <div v-if="col.name === 'comment'">
                  <q-icon name="chat" class="q-mr-sm" @click="openCommentDialog(props.row)" :class="{ 'text-blue cursor-pointer': props.row.comment }"></q-icon>
                  <span class="link-type" v-if="props.row.comment" @click="openCommentDialog(props.row)">{{ defaultFill(props.row.comment) }} </span>
                  <span v-else>0</span>
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
import { Component } from 'vue-facing-decorator';
import { getCurrentInstance } from 'vue';
import { addWhatPost, POST_CHECKBOX_OPTIONS, POST_RADIO_OPTIONS, POST_STATUS, POST_TYPE_OPTION, POST_TYPE_SVG_NAME, TEST_ACCOUNT, updatePost } from './utils';
import { commonPost } from 'src/mixins/post';

const CONST_PARAMS: any = {
  query: {
    title: '',
    channelId: '',
    status: '',
    authorId: '',
    haveComment: '',
    post_radio_option: [],
    postType: [],
    orderProperty: '',
    orderDir: 'ASC' /* DESC:降序 ,ASC:升序 */,
  },
};

@Component({
  name: 'BlogPostComponent',
  components: {},
})
export default class BlogPostComponent extends commonPost {
  /**instance */
  declare $refs: any;

  get addedPostId() {
    return BlogPostModule.addedPostId;
  }

  get updatePostSuccessFlag() {
    return BlogPostModule.updatePostSuccessFlag;
  }

  get addPostSuccessFlag() {
    return BlogPostModule.addPostSuccessFlag;
  }

  get updatePostSuccessFlagVideo() {
    return BlogPostModule.updatePostSuccessFlagVideo;
  }

  get addPostSuccessFlagVideo() {
    return BlogPostModule.addPostSuccessFlagVideo;
  }

  get updatePostSuccessFlagGallery() {
    return BlogPostModule.updatePostSuccessFlagGallery;
  }

  get addPostSuccessFlagGallery() {
    return BlogPostModule.addPostSuccessFlagGallery;
  }

  get updatePostSuccessFlagQuestion() {
    return BlogPostModule.updatePostSuccessFlagQuestion;
  }

  get addPostSuccessFlagQuestion() {
    return BlogPostModule.addPostSuccessFlagQuestion;
  }

  get updatePostSuccessFlagVideoEmbed() {
    return BlogPostModule.updatePostSuccessFlagVideoEmbed;
  }

  get addPostSuccessFlagVideoEmbed() {
    return BlogPostModule.addPostSuccessFlagVideoEmbed;
  }

  get updatePostSuccessFlagNormal() {
    return BlogPostModule.updatePostSuccessFlagNormal;
  }

  get addPostSuccessFlagNormal() {
    return BlogPostModule.addPostSuccessFlagNormal;
  }

  created() {
    this.$watch('addPostSuccessFlag', this.createWatcher(BlogPostModule.SET_ADD_POST_SUCCESS_FLAG, this).bind(this));
    this.$watch('updatePostSuccessFlag', this.createWatcher(BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG, this).bind(this));
    this.$watch('addPostSuccessFlagVideo', this.createWatcher(BlogPostModule.SET_ADD_POST_SUCCESS_FLAG_VIDEO, this).bind(this));
    this.$watch('updatePostSuccessFlagVideo', this.createWatcher(BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG_VIDEO, this).bind(this));
    this.$watch('addPostSuccessFlagGallery', this.createWatcher(BlogPostModule.SET_ADD_POST_SUCCESS_FLAG_GALLERY, this).bind(this));
    this.$watch('updatePostSuccessFlagGallery', this.createWatcher(BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG_GALLERY, this).bind(this));
    this.$watch('addPostSuccessFlagQuestion', this.createWatcher(BlogPostModule.SET_ADD_POST_SUCCESS_FLAG_QUESTION, this).bind(this));
    this.$watch('updatePostSuccessFlagQuestion', this.createWatcher(BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG_QUESTION, this).bind(this));
    this.$watch('addPostSuccessFlagVideoEmbed', this.createWatcher(BlogPostModule.SET_ADD_POST_SUCCESS_FLAG_VIDEO_EMBED, this).bind(this));
    this.$watch('updatePostSuccessFlagVideoEmbed', this.createWatcher(BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG_VIDEO_EMBED, this).bind(this));
    this.$watch('addPostSuccessFlagNormal', this.createWatcher(BlogPostModule.SET_ADD_POST_SUCCESS_FLAG_NORMAL, this).bind(this));
    this.$watch('updatePostSuccessFlagNormal', this.createWatcher(BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG_NORMAL, this).bind(this));
  }

  mounted() {
    if (this.$route.query.channelId) {
      this.queryParams.params.channelId = this.$route.query.channelId;
    }
    if (this.$route.query.id) {
      this.getDataById(this.$route.query.id as any);
    }
    this.getData();
    this.getAuthor();
    this.getCategories();
    this.getChannel();
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
        placeholder: '标题',
        type: 'text',
        class: 'w-250 m-r-15 m-b-15',
        id: 'title',
      },
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
        selectOption: POST_STATUS,
        id: 'status',
      },
      {
        placeholder: '作者',
        type: 'select',
        class: 'w-250 m-r-15 m-b-15',
        selectOption: [],
        id: 'authorId',
      },
      {
        placeholder: '是否有评论',
        type: 'select',
        class: 'w-250 m-r-15 m-b-15',
        selectOption: [
          {
            label: '有',
            value: '1',
          },
          {
            label: '无',
            value: '0',
          },
        ],
        id: 'haveComment',
      },
      {
        placeholder: '功能',
        type: 'select',
        multiple: true,
        class: 'w-350 m-r-15 m-b-15',
        selectOption: POST_CHECKBOX_OPTIONS,
        id: 'post_radio_option',
      },
      {
        placeholder: '文章类型',
        type: 'select',
        multiple: true,
        class: 'w-350 m-r-15 m-b-15',
        selectOption: POST_TYPE_OPTION,
        id: 'postType',
      },
    ],
  };
  public tableParams = {
    loading: false,
    data: [],
    postTypeOptions: POST_TYPE_OPTION.map((item: any) => {
      return { ...item, svg: POST_TYPE_SVG_NAME[item.value] };
    }),
    chips: POST_CHECKBOX_OPTIONS.concat(POST_RADIO_OPTIONS.map((item: any) => item.option).flat()),
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
        name: 'chip',
        label: '碎片',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'postTags',
        label: '标签',
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
        name: 'directoryId',
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
        name: 'view',
        label: '阅读数',
        align: 'left',
        sortable: true,
        inSlot: true,
      },
      {
        name: 'comment',
        label: '评论数',
        align: 'left',
        sortable: true,
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

  public handleClickAdd(item: any) {
    addWhatPost(item.value);
  }

  public handlerClickUpdate(row: any) {
    updatePost(row);
  }

  public handlerClickAddQuestion(row: any) {
    BlogPostModule.SET_POST_ADD_OR_UPDATE_QUESTION('add');
    BlogPostModule.SET_POST_DETAIL_QUESTION({
      row: row,
    });
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_QUESTION(true);
  }

  public handlerClickUpdateQuestion(row: any) {
    BlogPostModule.SET_POST_ADD_OR_UPDATE_QUESTION('update');
    BlogPostModule.SET_POST_DETAIL_QUESTION({
      row: row,
    });
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_QUESTION(true);
  }

  public openCommentDialog(row: any) {
    const detail = {
      id: row.id,
      title: row.title,
    };
    BlogPostModule.SET_COMMENT_DETAIL(detail);
    BlogPostModule.SET_COMMENT_VISIABLE(true);
  }

  public sortTableData(props: any) {
    try {
      const { sortBy } = props.pagination;
      this.tableParams.pagination.page = 1;
      this.queryParams.params.orderProperty = sortBy;
      this.queryParams.params.orderDir = this.queryParams.params.orderDir === 'DESC' ? 'ASC' : 'DESC';
      this.getData();
    } catch (error) {
      console.log(error);
    }
  }

  public createWatcher(setFlagFunction: (flag: boolean) => void, context: any) {
    return async function (newVal: string) {
      if (newVal) {
        setTimeout(() => {
          context.getData();
          setFlagFunction(false);
        }, 300);
      }
    };
  }

  /**http */
  public async getData() {
    try {
      this.tableParams.loading = true;
      const { pageData, total } = await BlogPostModule.getPostList({
        title: this.queryParams.params.title,
        channelId: this.queryParams.params.channelId,
        status: this.queryParams.params.status,
        authorId: this.queryParams.params.authorId,
        haveComment: this.queryParams.params.haveComment,
        post_radio_option: this.queryParams.params.post_radio_option,
        postType: this.queryParams.params.postType,
        orderProperty: this.queryParams.params.orderProperty,
        orderDir: this.queryParams.params.orderDir,
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

  public async getDataById(id: string) {
    try {
      const result = await BlogPostModule.getPostRowById({
        id,
      });
      updatePost(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getAuthor() {
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

  public async getCategories() {
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
      BlogPostModule.SET_ALL_CATEGORY_VIDEO(allSheet.pageData);
    } finally {
      return Promise.resolve();
    }
  }

  public async getChannel() {
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

  public async handlerClickDelete(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
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

  public async handlerClickOnline(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
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

  public async handlerClickOffline(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
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

  public async submitReplyComment(content: any, item: any) {
    try {
      let obj = {
        content,
        postId: item.srcTopicId ? item.srcTopicId : item.id,
        userId: TEST_ACCOUNT.id,
      };
      this.$q.loading.show();
      await BlogPostModule.addComment(obj);
      this.$q.loading.hide();
      this.$globalMessage.show({
        type: 'success',
        content: '回复成功',
      });
      for (let item of this.$refs.replyInputProxyRef) {
        item.hide();
      }
      this.getData();
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
<style lang="scss">
th.sortable i.q-table__sort-icon {
  display: none;
}

.body--dark {
  .blog-post-list th:last-child,
  .blog-post-list td:last-child {
    box-shadow: rgba($color: #ffffff, $alpha: 0.05) 0px 20px 27px 0px;
  }
}

.body--light {
  .blog-post-list th:last-child,
  .blog-post-list td:last-child {
    box-shadow: rgba($color: #000000, $alpha: 0.05) 0px 20px 27px 0px;
  }
}

.blog-post-list {
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%;
}

.blog-post-list thead tr:last-child th:last-child {
  /* bg color is important for th; just specify one */
  background-color: var(--my-white);
}

.blog-post-list td:last-child {
  background-color: var(--my-white);
}

.blog-post-list th:last-child,
.blog-post-list td:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
}
</style>
<style lang="scss">
.body--dark {
  .reply-input-proxy {
    box-shadow: 0px 6px 16px -1px rgba($color: #ffffff, $alpha: 0.15) !important;
  }
}

.body--light {
  .reply-input-proxy {
    box-shadow: 0px 6px 16px -1px rgba($color: #000000, $alpha: 0.15) !important;
  }
}

.reply-input-proxy {
  border-radius: 8px !important;
}
</style>
