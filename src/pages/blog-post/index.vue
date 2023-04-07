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
                <!-- title -->
                <div v-if="col.name === 'title'">
                  <span class="link-type">{{ props.row.title }}</span>
                </div>
                <!-- status -->
                <div v-if="col.name === 'status'">
                  <span class="my-label w-50" :class="{ red: props.row.status === 'OFFLINE', grey: props.row.status === 'DRAFT', green: props.row.status === 'PUBLISHED' }">{{
                    postStatus(props.row)
                  }}</span>
                </div>
                <!-- authorId -->
                <div v-if="col.name === 'authorId'">
                  <span class="link-type" v-if="props.row.authorId">{{ postAuthor(props.row) }}</span>
                  <span v-else>--</span>
                </div>
                <!-- categoryId -->
                <div v-if="col.name === 'categoryId'">
                  <span class="link-type" v-if="props.row.categoryId">{{ postCategory(props.row) }}</span>
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
                  <span class="in-table-link-button" @click="handlerClickUpdate(props.row)">编辑 </span>
                  <span class="in-table-link-button m-l-10">上线 </span>
                  <span class="in-table-delete-button m-l-10">下线 </span>
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
    <q-dialog v-model="dialogAddUpdateParams.visiable" position="bottom">
      <q-dialog v-model="dialogAddUpdateParams.addCode.visiable" position="top">
        <q-card style="width: 500px">
          <q-card-section>
            <div class="text-h6">{{ dialogAddUpdateParams.addCode.title }}</div>
          </q-card-section>
          <q-card-section>
            <div contenteditable="true" class="h-300 q-pa-md" :ref="dialogAddUpdateParams.id + '-addCode'"></div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="确定" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-card style="height: 95vh; width: 100vw; max-width: 100vw">
        <q-inner-loading :showing="dialogAddUpdateParams.getDataLoading"></q-inner-loading>
        <q-splitter v-model="dialogAddUpdateParams.splitterModel" class="splitter">
          <template v-slot:before>
            <div class="q-pa-md" style="height: 100%">
              <input type="file" class="hide" :ref="dialogUpload.fileID" :accept="dialogUpload.accept" :draggable="false" @change="uploadFileSuccess" />
              <q-editor
                v-model="dialogAddUpdateParams.row.content"
                height="100%"
                ref="editorRef"
                min-height="100%"
                :definitions="{
                  upload: {
                    icon: 'o_cloud_upload',
                    label: '上传图片',
                    handler: handleClickUploadFile,
                  },
                }"
                :toolbar="[
                  [
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      list: 'only-icons',
                      options: ['left', 'center', 'right', 'justify'],
                    },
                  ],
                  ['upload', 'input_code'],
                  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                  ['token', 'hr', 'link', 'custom_btn'],
                  [
                    {
                      label: $q.lang.editor.formatting,
                      icon: $q.iconSet.editor.formatting,
                      list: 'no-icons',
                      options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                    },
                    {
                      label: $q.lang.editor.fontSize,
                      icon: $q.iconSet.editor.fontSize,
                      fixedLabel: true,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
                    },
                    {
                      label: $q.lang.editor.defaultFont,
                      icon: $q.iconSet.editor.font,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana'],
                    },
                    'removeFormat',
                  ],
                  ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                  ['undo', 'redo'],
                  ['viewsource'],
                ]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
              >
                <template v-slot:input_code>
                  <q-btn-dropdown dense no-caps ref="tokenRef" no-wrap unelevated color="white" text-color="black" label="上传代码" size="sm" flat dropdown-icon="app:topbar-arrow-bottom">
                    <q-list dense>
                      <q-item tag="label" clickable v-for="(item, index) in dialogAddUpdateParams.supportCodeType" :key="index" @click="addCode(item)" v-close-popup>
                        <q-item-section>{{ item.label }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </template>
              </q-editor>
            </div>
          </template>
          <template v-slot:after>
            <div class="q-pa-md">
              <div class="text-h5">{{ dialogAddUpdateParams.row.title }}</div>
              <div class="split-line h-1 q-my-md"></div>
              <ul class="row">
                <li class="q-mr-md">
                  <span>作者：</span>
                  <span>{{ postAuthor(dialogAddUpdateParams.row) }}</span>
                </li>
                <li class="q-mr-md">
                  <span>分类：</span>
                  <span>{{ postCategory(dialogAddUpdateParams.row) }}</span>
                </li>
                <li class="q-mr-md">
                  <span>评论：</span>
                  <span>{{ defaultFill(dialogAddUpdateParams.row.comment) }}</span>
                </li>
                <li>
                  <span>阅读：</span>
                  <span>{{ defaultFill(dialogAddUpdateParams.row.view) }}</span>
                </li>
                <div class="q-ml-auto">
                  {{ parseTime(dialogAddUpdateParams.row.updateTime) }}
                </div>
              </ul>
              <div class="poster q-my-lg">
                <q-img src="https://mindthegraph.com/blog/wp-content/uploads/2022/04/award-winning-scientific-750x465.jpg" height="300px" style="border-radius: 12px">
                  <template #loading> <q-skeleton height="300px" square width="100%" /> </template>?
                </q-img>
              </div>
              <div class="post-content lh-30 fs-16 h-760 thin-shadow q-pa-md" v-html="dialogAddUpdateParams.row.content"></div>
            </div>
          </template>
        </q-splitter>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { cloneDeep } from 'lodash';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { defaultFill } from 'src/utils/tools';
import { getCurrentInstance } from 'vue';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
const CONST_PARAMS: any = {
  query: { categoryId: '', status: '' },
  dialog_add_update: { a: '', b: '', c: '', d: [], e: '', e_dateRange: { from: '', to: '' }, f: '', g: '', g_startModel: '', g_endModel: '', h: 10, i: 'true' },
};

@Component({ name: 'myComponent' })
export default class myComponent extends Vue {
  /**instance */
  declare $refs: any;
  get postStatus() {
    return (row: any) => {
      const selectOption = this.queryParams.input.find((item: any) => item.id === 'status').selectOption;
      const item = selectOption.find((item: any) => item.value === row.status);
      if (!item) return '--';
      else return item.label;
    };
  }
  get postCategory() {
    return (row: any) => {
      const selectOption = this.queryParams.input.find((item: any) => item.id === 'categoryId').selectOption;
      const item = selectOption.find((item: any) => item.value === row.categoryId);
      if (!item) return '--';
      return item.label;
    };
  }
  get postAuthor() {
    return (row: any) => {
      const selectOption = this.queryParams.input.find((item: any) => item.id === 'authorId').selectOption;
      const item = selectOption.find((item: any) => item.value === row.authorId);
      if (!item) return '--';
      return item.label;
    };
  }
  mounted() {
    this.getData();
    this.getAuthor();
    this.getCategories();
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
        placeholder: '分类',
        type: 'select',
        class: 'w-250 m-r-15 m-b-15',
        selectOption: [],
        id: 'categoryId',
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
  private dialogAddUpdateParams = {
    id: 'dialog_add_update',
    dialogType: 'add',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    addCode: {
      visiable: false,
      title: '',
      content: '',
    },
    supportCodeType: [
      { label: 'JavaScript', value: 'js' },
      { label: 'Java', value: 'java' },
    ],
    splitterModel: 50,
    row: {
      content: '',
    },
  };
  private dialogUpload = {
    id: 'dialog-upload-file',
    fileID: 'dialog_upload_file',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    accept: '.png,.jpg',
    params: { file: '', fileName: '' },
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
  private addCode(type: any) {
    this.dialogAddUpdateParams.addCode.visiable = true;
    this.dialogAddUpdateParams.addCode.title = type.label;
    this.$nextTick(() => {
      this.$refs[`${this.dialogAddUpdateParams.id}-addCode`]!.focus();
      this.$refs[`${this.dialogAddUpdateParams.id}-addCode`]!.innerHTML = '<pre><code class="language-js">console.log(123123);function test(){\n return "hello"\n }</code></pre>';
      Prism.highlightAll();
    });
    // this.$refs.editorRef.caret.restore();
    // this.$refs.editorRef.runCmd(
    //   'insertHTML',
    //   '&nbsp;<div><pre><code class="language-js">console.log(123123);function test(){\n return "hello"\n }</code></pre><i class="q-icon material-icons cursor-pointer" onclick="this.parentNode.parentNode.removeChild(this.parentNode)">close</i></div> &nbsp;'
    // );
    // this.$refs.editorRef.focus();
    // this.$nextTick(() => {
    //   Prism.highlightAll();
    // });
  }
  private handleClickUploadFile() {
    this.$refs[this.dialogUpload.fileID].type = 'text';
    this.dialogUpload.params.fileName = '';
    this.dialogUpload.params.file = '';
    setTimeout(() => {
      this.$refs[this.dialogUpload.fileID].type = 'file';
      this.$refs[this.dialogUpload.fileID].value = '';
      this.$refs[this.dialogUpload.fileID].click();
    }, 100);
  }
  private uploadFileSuccess() {
    const files = this.$refs[this.dialogUpload.fileID].files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach((rawFile: any) => {
      this.dialogUpload.params.fileName = rawFile.name;
      this.dialogUpload.params.file = rawFile;
    });
  }
  private monitorDialogUploadHide() {
    this.dialogUpload.params.fileName = '';
    this.dialogUpload.params.file = '';
  }
  private dialogUploadCloseEvent(data: { type: string }) {
    this.dialogUpload.visiable = false;
  }
  private dialogUploadBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogUpload.params = data.params;
    }
  }
  /**http */
  private async getData() {
    try {
      this.tableParams.loading = true;
      const { pageData, total } = await BlogPostModule.getPostList({
        categoryId: this.queryParams.params.categoryId,
        status: this.queryParams.params.status,
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
      let { pageData } = await BlogPostModule.getAuthor({});
      if (pageData && pageData.length > 0) {
        const index = this.queryParams.input.findIndex((item: any) => item.id === 'authorId');
        pageData = pageData.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
            postId: item.postId,
          };
        });
        this.queryParams.input[index].selectOption = pageData;
      }
    } finally {
      return Promise.resolve();
    }
  }
  private async getCategories() {
    try {
      let { pageData } = await BlogPostModule.getCategories({});
      if (pageData && pageData.length > 0) {
        const index = this.queryParams.input.findIndex((item: any) => item.id === 'categoryId');
        pageData = pageData.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.queryParams.input[index].selectOption = pageData;
      }
    } finally {
      return Promise.resolve();
    }
  }
  private async handlerClickUpdate(row: any) {
    row.content = '';
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'update';
    this.dialogAddUpdateParams.title = 'Update';
    this.dialogAddUpdateParams.getDataLoading = true;
    const result = await BlogPostModule.getPostById({ id: row.id });
    row.content = result;
    this.dialogAddUpdateParams.row = row;
    this.dialogAddUpdateParams.getDataLoading = false;
  }
  private async dialogAddUpdateConfirmEvent() {
    try {
      this.dialogAddUpdateParams.clickLoading = true;
      // await HTTP_REQUEST()
      this.dialogAddUpdateParams.clickLoading = false;
      this.dialogAddUpdateParams.visiable = false;
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    } catch (error) {
      this.dialogAddUpdateParams.clickLoading = false;
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
        // await HTTP_REQUEST()
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getData();
      }
    } catch (error) {}
  }
  private async hanleClickUploadConfirm() {
    try {
      const form = new FormData();
      form.append('file', this.dialogUpload.params.file);
      this.dialogUpload.clickLoading = true;
      // await HTTP_REQUEST()
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.dialogUpload.clickLoading = false;
      this.dialogUpload.visiable = false;
      this.getData();
    } catch (error) {
      this.dialogUpload.clickLoading = false;
    }
  }
}
</script>
<style lang="scss">
pre[class*='language-'] code {
  white-space: pre-wrap;
}
</style>
<style lang="scss" scoped>
.body--dark {
  .splitter {
    background: $dark;
    .post-content {
      &::-webkit-scrollbar-thumb {
        background-color: rgba($color: #ffffff, $alpha: 0.4);
      }
    }
  }
}
.body--light {
  .splitter {
    background: #ffffff;
    .post-content {
      &::-webkit-scrollbar-thumb {
        background-color: rgba($color: #000000, $alpha: 0.4);
      }
    }
  }
}
.splitter {
  height: 100%;
  .post-content {
    overflow: auto;
    &::-webkit-scrollbar {
      background: transparent;
    }
    &::-webkit-scrollbar:vertical {
      width: 16px;
    }
    &::-webkit-scrollbar:horizontal {
      height: 16px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 99999px;
      border: 0.3125em solid transparent;
      background-clip: content-box;
    }
  }
}
</style>
