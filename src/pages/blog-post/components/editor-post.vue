<template>
  <div class="editor-wrap" ref="editorWrap">
    <div class="editor-content thin-shadow" v-if="blogEditorPostVisiable">
      <div class="q-pb-md">
        <q-btn color="primary" label="确定" class="q-mr-md" @click="dialogAddUpdateConfirmEvent" />
        <q-btn color="primary" label="存为草稿" class="q-mr-md" />
        <q-btn color="primary" outline label="取消" @click="hideDialog" flat></q-btn>
      </div>
      <div id="editor-toolbar"></div>
      <q-input
        v-model.trim="dialogAddUpdateParams.row.title"
        type="text"
        label="请输入标题"
        autocapitalize="off"
        autocomplete="new-password"
        autocorrect="off"
        clearable
        dense
        outlined
        class="q-my-md"
        dropdown-icon="app:topbar-arrow-bottom"
        clear-icon="app:clear"
        :spellcheck="false"
      />
      <div class="row q-my-md items-center">
        <q-select
          outlined
          class="w-p-20 q-mr-md"
          v-model="dialogAddUpdateParams.row.authorId"
          :options="authorOptions"
          label="选择作者"
          color="primary"
          :spellcheck="false"
          autocapitalize="off"
          autocomplete="new-password"
          autocorrect="off"
          clearable
          dense
          options-dense
          emit-value
          dropdown-icon="app:topbar-arrow-bottom"
          clear-icon="app:clear"
          map-options
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  <q-img :src="scope.opt.avatarUrl"> </q-img>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.name }} <q-icon name="verified" size="14px" color="primary" v-if="scope.opt.status === 4"></q-icon></q-item-label>
                <q-item-label caption>{{ scope.opt.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          class="q-mr-md w-p-30 h-40 category-select"
          :label="postCategory(dialogAddUpdateParams.row) === '--' ? '选择主题' : '主题：' + postCategory(dialogAddUpdateParams.row)"
          icon-right="o_keyboard_arrow_down"
          outline
          align="left"
          :disable="disableSelectCategory"
        >
          <q-menu class="w-p-10">
            <q-list>
              <q-item clickable v-for="item in categoryOptions" :key="item.id" v-close-popup="!item.children.length">
                <q-item-section class="q-px-none">
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>{{ item.description }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="item.children.length">
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>
                <q-menu anchor="top end" self="top start" v-if="item.children.length" class="w-p-10">
                  <q-list>
                    <q-item
                      v-for="directory in item.children"
                      :key="directory.id"
                      clickable
                      v-close-popup="!directory.children.length"
                      @click.stop.prevent="!directory.children.length ? (dialogAddUpdateParams.row.categoryId = directory.id) : () => 0"
                    >
                      <q-item-section>
                        <q-item-label>{{ directory.name }}</q-item-label>
                        <q-item-label caption>{{ directory.subName }}</q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="directory.children.length">
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start" v-if="directory.children.length" class="w-p-10">
                        <q-list>
                          <q-item
                            v-for="childDirectory in directory.children"
                            :key="childDirectory"
                            clickable
                            v-close-popup="!childDirectory.children"
                            @click.stop.prevent="dialogAddUpdateParams.row.categoryId = childDirectory.id"
                          >
                            <q-item-section>
                              <q-item-label>{{ childDirectory.name }}</q-item-label>
                              <q-item-label caption>{{ childDirectory.subName }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-select
          v-model="dialogAddUpdateParams.row.channelId"
          :options="channelOptions"
          label="请选择频道"
          class="w-p-20"
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
      <div class="poster q-my-lg relative q-pa-md">
        <input type="file" class="hide" :ref="dialogUpload.fileID" :accept="dialogUpload.accept" :draggable="false" @change="uploadFileSuccess" />
        <q-img :src="dialogAddUpdateParams.row.poster" height="300px" style="border-radius: 12px" v-if="dialogAddUpdateParams.row.poster" fit="contain">
          <template #loading> <q-skeleton height="300px" square width="100%" /> </template>
        </q-img>
        <div v-else class="h-300 row items-center justify-center">
          <div class="text-center cursor-pointer" @click.stop.prevent="handleOpenUploadPosterContainer">
            <q-icon name="o_add" size="80px"></q-icon>
            <p class="q-mt-md">上传封面</p>
          </div>
        </div>
        <span class="link-type absolute top-30 right-30 thin-shadow q-py-sm q-px-md" @click.stop.prevent="handleOpenUploadPosterContainer" v-if="dialogAddUpdateParams.row.poster">修改</span>
      </div>
      <div id="editor-container">
        <div id="editor-text-area" style="min-height: 300px"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue, Watch } from 'vue-facing-decorator';

@Component({
  name: 'myBlogEditorPostDialogComponent',
  components: {},
})
export default class myBlogEditorPostDialogComponent extends Vue {
  $refs: any;
  get blogEditorPostVisiable() {
    return BlogPostModule.blogEditorPostVisiable;
  }
  get authorOptions() {
    return BlogPostModule.allValidAuthor;
  }
  get categoryOptions() {
    return BlogPostModule.allCategory;
  }
  get channelOptions() {
    return BlogPostModule.allChannel;
  }
  get disableSelectCategory() {
    return BlogPostModule.disableSelectCategory;
  }
  get postAddOrUpdate() {
    return BlogPostModule.postAddOrUpdate;
  }
  get postDetail() {
    return BlogPostModule.postDetail;
  }
  get currentCategoryId() {
    return BlogPostModule.currentCategoryId;
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
  @Watch('blogEditorPostVisiable')
  onBlogEditorPostVisiableChanged(val: boolean, oldVal: boolean) {
    const initForm = () => {
      this.dialogAddUpdateParams.row.authorId = '';
      this.dialogAddUpdateParams.row.categoryId = '';
      this.dialogAddUpdateParams.row.channelId = '';
      this.dialogAddUpdateParams.row.title = '';
      this.dialogAddUpdateParams.row.poster = '';
      this.dialogAddUpdateParams.row.content = '';
      BlogPostModule.SET_POST_DETAIL({
        row: {
          authorId: '',
          categoryId: '',
          channelId: '',
          title: '',
          poster: '',
          content: '',
          id: '',
        },
      });
      this.editor.setHtml('');
    };
    this.$nextTick(async () => {
      if (val) {
        this.editor = window.wangEditor.createEditor({
          selector: '#editor-text-area',
          content: [],
          // html: '',
          config: this.editorConfig,
        });
        this.editor.on('modalOrPanelShow', (modalOrPanel: any) => {
          if (modalOrPanel.type !== 'modal') return;
          const { $elem } = modalOrPanel; // modal element
          $elem[0].style = 'left: 50%;top: 50%;transform: translate(-50%, -50%);';
          // 设置 modal 样式（定位、z-index）
          // 显示蒙层
        });
        this.editor.on('modalOrPanelHide', () => {
          // 隐藏蒙层
        });
        this.toolbar = window.wangEditor.createToolbar({
          editor: this.editor,
          selector: '#editor-toolbar',
          config: {
            excludeKeys: 'fullScreen',
          },
        });
        document.getElementById('editor-text-area')!.addEventListener('click', (e: any) => {
          if (e.target.id === 'editor-text-area') {
            this.editor.blur();
            this.editor.focus(true);
            // focus 到末尾
          }
        });
        if (this.postAddOrUpdate === 'add') {
          initForm();
          if (this.currentCategoryId) {
            this.dialogAddUpdateParams.row.categoryId = this.currentCategoryId;
            BlogPostModule.SET_CURRENT_CATEGORY_ID('');
          }
        } else {
          this.editor.setHtml('');
          this.dialogAddUpdateParams.row.authorId = this.postDetail.row.authorId;
          this.dialogAddUpdateParams.row.categoryId = this.postDetail.row.categoryId;
          this.dialogAddUpdateParams.row.channelId = this.postDetail.row.channelId;
          this.dialogAddUpdateParams.row.title = this.postDetail.row.title;
          this.dialogAddUpdateParams.row.poster = this.postDetail.row.poster;
          this.dialogAddUpdateParams.row.id = this.postDetail.row.id;
          this.$q.loading.show();
          const data = await BlogPostModule.getPostContentById({ id: this.postDetail.row.id });
          this.$q.loading.hide();
          this.dialogAddUpdateParams.row.content = data;
          this.editor.setHtml(data);
        }
        this.$refs.editorWrap.style = 'transform: translateY(0)';
      } else {
        this.$refs.editorWrap.style = 'transform: translateY(-100vh);';
        initForm();
      }
    });
  }
  mounted() {}
  private dialogAddUpdateParams = {
    row: {
      title: '',
      authorId: '',
      categoryId: '',
      channelId: '',
      content: '',
      poster: '',
      id: '',
    },
  };
  private dialogUpload = {
    id: 'dialog-upload-img',
    fileID: 'dialog_upload_img',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    maxCount: 1,
    title: '',
    type: 'poster',
    accept: '.png,.jpg',
    posterFile: null,
  };
  private editorConfig = {
    placeholder: '请输入内容',
    scroll: false,
    modalAppendToBody: true,
    // 禁止编辑器滚动
    MENU_CONF: {
      uploadImage: {
        fieldName: 'file',
        base64LimitSize: 10 * 1024, // 10K 以下插入 base64
        allowedFileTypes: ['image/*'],
        withCredentials: true,
        customUpload: async (res: any, insertFn: any) => {
          try {
            const posterform = new FormData();
            posterform.append('file', res as any);
            const imgUrl = await BlogPostModule.uploadPostImgs(posterform);
            // url, alt, data-href
            insertFn(imgUrl, '', imgUrl);
          } catch (error) {
            this.$globalMessage.show({
              type: 'error',
              content: '上传图片失败',
            });
          }
        },
      },
    },
    onChange: (editor: any) => {
      if (this.blogEditorPostVisiable) {
        this.dialogAddUpdateParams.row.content = editor.getHtml();
      }
    },
  };
  // 先创建 editor
  private editor: any;
  // 创建 toolbar
  private toolbar: any;
  /* event */
  hideDialog() {
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(false);
  }
  private handleOpenUploadPosterContainer() {
    this.$refs[this.dialogUpload.fileID].type = 'text';
    setTimeout(() => {
      this.$refs[this.dialogUpload.fileID].type = 'file';
      this.$refs[this.dialogUpload.fileID].value = '';
      this.$refs[this.dialogUpload.fileID].click();
    }, 100);
  }
  private async uploadFileSuccess() {
    const files = this.$refs[this.dialogUpload.fileID].files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    function getBase64(file: any) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    }
    const base64 = await getBase64(postFiles[0]);
    this.dialogAddUpdateParams.row.poster = base64 as any;
    this.dialogUpload.posterFile = postFiles[0];
  }
  /* http */
  private async dialogAddUpdateConfirmEvent() {
    if (!this.dialogAddUpdateParams.row.title) {
      this.$globalMessage.show({
        type: 'error',
        content: '请输入标题',
      });
      return;
    } else if (!this.dialogAddUpdateParams.row.authorId) {
      this.$globalMessage.show({
        type: 'error',
        content: '请选择作者',
      });
      return;
    } else if (!this.dialogAddUpdateParams.row.categoryId) {
      this.$globalMessage.show({
        type: 'error',
        content: '请选择分类',
      });
      return;
    } else if (!this.dialogAddUpdateParams.row.content) {
      this.$globalMessage.show({
        type: 'error',
        content: '请输入内容',
      });
      return;
    } else if (!this.dialogAddUpdateParams.row.poster) {
      this.$globalMessage.show({
        type: 'error',
        content: '请上传封面',
      });
      return;
    }
    const result = await this.$globalConfirm.show({
      title: '💕💕💕 提示',
      color: 'primary',
      content: '确定要执行该操作吗 :) ?',
      confirmButtonText: '嗯，是的',
    });
    if (result) {
      this.$q.loading.show();
      if (this.dialogAddUpdateParams.row.poster.indexOf('data:image') !== -1) {
        // 判断this.dialogAddUpdateParams.row.poster是否是base64
        try {
          const posterform = new FormData();
          posterform.append('file', this.dialogUpload.posterFile as any);
          const imgUrl = await BlogPostModule.uploadPostImgs(posterform);
          this.dialogAddUpdateParams.row.poster = imgUrl;
        } catch (error) {
          this.$q.loading.hide();
          this.$globalMessage.show({
            type: 'error',
            content: '上传图片失败',
          });
        }
      }
      let postParams: any = {
        title: this.dialogAddUpdateParams.row.title,
        content: this.dialogAddUpdateParams.row.content,
        poster: this.dialogAddUpdateParams.row.poster,
        authorId: this.dialogAddUpdateParams.row.authorId,
        categoryId: this.dialogAddUpdateParams.row.categoryId,
        channelId: this.dialogAddUpdateParams.row.channelId,
        codeCount: 0,
        postType: 1,
      };
      if (this.postAddOrUpdate === 'add') {
        try {
          const { id } = await BlogPostModule.addPost(postParams);
          this.hideDialog();
          this.$globalMessage.show({
            type: 'success',
            content: this.$t('messages.success'),
          });
          BlogPostModule.SET_ADDED_POST_ID(id);
          BlogPostModule.SET_ADD_POST_SUCCESS_FLAG(true);
        } catch (error) {
          this.$q.loading.hide();
        }
      } else if (this.postAddOrUpdate === 'update') {
        postParams['id'] = this.dialogAddUpdateParams.row.id;
        try {
          await BlogPostModule.updatePost(postParams);
          this.hideDialog();
          this.$globalMessage.show({
            type: 'success',
            content: this.$t('messages.success'),
          });
          BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG(true);
        } catch (error) {
          this.$q.loading.hide();
        }
      }
      this.dialogUpload.posterFile = null;
      this.$q.loading.hide();
    }
  }
}
</script>
<style lang="scss">
.body--dark {
  .w-e-bar {
    background: #000000 !important;
  }
  .w-e-bar-item button {
    color: #f5f5f5 !important;
  }
  .w-e-bar svg {
    fill: #f5f5f5 !important;
  }
  .w-e-text-container {
    background-color: #000000 !important;
    color: #f5f5f5 !important;
    border: solid 1px rgba(255, 255, 255, 0.6);
  }
  .w-e-bar-item button:hover {
    background: $dark !important;
  }
  .w-e-drop-panel {
    background: $dark !important;
  }
  .w-e-bar-item-menus-container {
    background: $dark !important;
  }
  .w-e-bar-item .active {
    background: $dark !important;
  }
  .w-e-text-container [data-slate-editor] table th {
    background: $dark !important;
  }
  .w-e-panel-content-table {
    background: #000000 !important;
  }
  .category-select {
    &.q-btn--outline:before {
      border: solid 1px rgba(255, 255, 255, 0.6) !important;
    }
    .q-btn__content {
      color: rgba(255, 255, 255, 0.541);
    }
  }
}
.body--light {
  .w-e-text-container {
    border: solid 1px rgba(0, 0, 0, 0.24);
  }
  .category-select {
    &.q-btn--outline:before {
      border: solid 1px rgba(0, 0, 0, 0.24) !important;
    }
    .q-btn__content {
      color: rgba(0, 0, 0, 0.541);
    }
  }
}
.w-e-hover-bar {
  z-index: 99999;
}
.w-e-text-container {
  min-height: 300px;
  border-radius: 8px;
}
.w-e-bar {
  border-radius: 8px;
}
</style>
<style lang="scss" scoped>
.body--dark {
  .editor-wrap {
    .editor-content {
      background: $dark;
    }
  }
  #editor-toolbar {
    border: solid 1px rgba(255, 255, 255, 0.6);
  }
  .poster {
    background: #000000;
    border: solid 1px rgba(255, 255, 255, 0.6);
  }
}
.body--light {
  .editor-wrap {
    .editor-content {
      background: #ffffff;
    }
  }
  #editor-toolbar {
    border: solid 1px rgba(0, 0, 0, 0.24);
    background: #ffffff;
  }
  .poster {
    border: solid 1px rgba(0, 0, 0, 0.24);
  }
}
.editor-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1003;
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  // transition: all 0.3s;
  transform: translateY(-100vh);
  .editor-content {
    position: absolute;
    padding: 16px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
  }
  .poster {
    border-radius: 8px;
  }
  #editor-toolbar {
    border-radius: 8px;
  }
}
</style>
