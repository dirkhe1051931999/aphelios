<template>
  <div class="editor-wrap" ref="editorWrap">
    <div class="editor-content thin-shadow" v-if="blogEditorPostVisiable">
      <div class="left">
        <div class="q-mb-md">
          <p class="q-mb-sm row items-center">
            * 标题 <q-badge class="q-ml-sm" :color="dialogEditorParams.params.status === 'OFFLINE' ? 'negative' : 'primary'" v-if="!isAddPost">{{ postStatus(dialogEditorParams.params) }}</q-badge>
          </p>
          <q-input
            v-model.trim="dialogEditorParams.params.title"
            type="text"
            autocapitalize="off"
            autocomplete="new-password"
            autocorrect="off"
            clearable
            dense
            outlined
            class="q-mb-sm"
            dropdown-icon="app:topbar-arrow-bottom"
            clear-icon="app:clear"
            :spellcheck="false"
          />
        </div>
        <div class="q-mb-md">
          <p class="q-mb-sm">* 作者</p>
          <q-select
            outlined
            v-model="dialogEditorParams.params.authorId"
            :options="authorOptions"
            class="q-mb-sm"
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
        </div>
        <div class="q-mb-md">
          <p class="q-mb-sm">* 主题</p>
          <q-btn
            class="h-40 category-select full-width"
            :label="postCategory(dialogEditorParams.params) === '--' ? '选择主题' : '主题：' + postCategory(dialogEditorParams.params)"
            icon-right="o_keyboard_arrow_down"
            outline
            align="left"
            :disable="disableSelectCategory"
          >
            <q-menu class="w-p-7">
              <q-list dense>
                <q-item clickable v-for="item in categoryOptions" :key="item.id" v-close-popup="!item.children.length">
                  <q-item-section class="q-px-none">
                    <q-item-label>{{ item.name }}</q-item-label>
                    <q-item-label caption>{{ item.description }}</q-item-label>
                  </q-item-section>
                  <q-item-section side v-if="item.children.length">
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>
                  <q-menu anchor="top end" self="top start" v-if="item.children.length" class="w-p-7">
                    <q-list dense>
                      <q-item
                        v-for="directory in item.children"
                        :key="directory.id"
                        clickable
                        v-close-popup="!directory.children.length"
                        @click.stop.prevent="!directory.children.length ? (dialogEditorParams.params.categoryId = directory.id) : () => 0"
                      >
                        <q-item-section>
                          <q-item-label>{{ directory.name }}</q-item-label>
                          <q-item-label caption>{{ directory.subName }}</q-item-label>
                        </q-item-section>
                        <q-item-section side v-if="directory.children.length">
                          <q-icon name="keyboard_arrow_right" />
                        </q-item-section>
                        <q-menu auto-close anchor="top end" self="top start" v-if="directory.children.length" class="w-p-7">
                          <q-list dense>
                            <q-item
                              v-for="childDirectory in directory.children"
                              :key="childDirectory"
                              clickable
                              v-close-popup="!childDirectory.children"
                              @click.stop.prevent="dialogEditorParams.params.categoryId = childDirectory.id"
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
        </div>
        <div class="q-mb-md">
          <p class="q-mb-sm">* 频道</p>
          <q-select
            v-model="dialogEditorParams.params.channelId"
            :options="channelOptions"
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
        <div class="q-mb-md">
          <p class="q-mb-sm">* 标签</p>
          <vue-tags-input
            class="tags-autocomplete"
            v-model="dialogEditorParams.params.tag"
            :tags="dialogEditorParams.params.tags"
            @tags-changed="(newTags) => (dialogEditorParams.params.tags = newTags)"
          />
        </div>
        <div id="editor-toolbar"></div>
        <div id="editor-container">
          <div id="editor-text-area" style="min-height: 500px; max-height: 1000px"></div>
        </div>
      </div>
      <div class="right">
        <div class="poster q-mt-lg q-mb-md relative q-pa-xl">
          <img :src="dialogEditorParams.params.poster" v-if="dialogEditorParams.params.poster" />
          <div v-else class="h-300 row items-center justify-center">
            <div class="text-center cursor-pointer" @click.stop.prevent="handleOpenUploadPosterContainer">
              <q-icon name="o_add" size="80px"></q-icon>
              <p class="q-mt-md">上传封面</p>
            </div>
          </div>
          <q-btn color="primary" label="修改" @click.stop.prevent="handleOpenUploadPosterContainer" v-if="dialogEditorParams.params.poster" outline class="absolute top-16 right-10" dense />
        </div>
        <div class="q-mb-md">
          <p class="q-mb-sm">* 其他</p>
          <q-option-group :options="dialogEditorParams.checkedOptions" type="checkbox" v-model="dialogEditorParams.params.checked" />
        </div>
        <div>
          <q-btn color="primary" label="确定" class="q-mr-md" @click="dialogAddUpdateConfirmEvent" />
          <q-btn color="primary" label="存为草稿" class="q-mr-md" />
          <q-btn color="primary" outline label="取消" @click="hideDialog" flat></q-btn>
        </div>
      </div>
    </div>
    <PostAlbumComponent ref="PostAlbumComponentRef" @pick="pickSuccess" @hide="postAlbumComponentHide" />
  </div>
</template>

<script lang="ts">
import { commonPost } from 'src/mixins/post';
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import VueTagsInput from '@sipec/vue3-tags-input';
import PostAlbumComponent from './album.vue';
import { cloneDeep } from 'lodash';
import { POST_RADIO_OPTIONS } from '../utils';
let registerEditorAction = false;
const PARANS = {
  authorId: '',
  status: '',
  categoryId: '',
  channelId: '',
  title: '',
  poster: '',
  content: '',
  checked: [],
  tags: [],
  tag: '',
  id: '',
};
@Component({
  name: 'myBlogEditorPostDialogComponent',
  components: {
    PostAlbumComponent,
    VueTagsInput,
  },
})
export default class myBlogEditorPostDialogComponent extends commonPost {
  $refs: any;
  get blogEditorPostVisiable() {
    return BlogPostModule.blogEditorPostVisiable;
  }
  get disableSelectCategory() {
    return BlogPostModule.disableSelectCategory;
  }
  get isAddPost() {
    return BlogPostModule.postAddOrUpdate === 'add';
  }
  @Watch('blogEditorPostVisiable')
  onBlogEditorPostVisiableChanged(val: boolean, oldVal: boolean) {
    const initForm = () => {
      this.dialogEditorParams.params = cloneDeep(PARANS);
      BlogPostModule.SET_POST_DETAIL(cloneDeep(this.dialogEditorParams.params));
      this.editor.setHtml('');
    };
    this.$nextTick(async () => {
      if (val) {
        this.editor = window.wangEditor.createEditor({
          selector: '#editor-text-area',
          content: [],
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
            excludeKeys: ['fullScreen', 'group-image'],
            insertKeys: {
              index: 0,
              keys: [this.editCutomeAction.imageUploadKey], // show menu in toolbar
            },
          },
        });
        document.getElementById('editor-text-area')!.addEventListener('click', (e: any) => {
          if (e.target.id === 'editor-text-area') {
            this.editor.blur();
            this.editor.focus(true);
            // focus 到末尾
          }
        });
        if (BlogPostModule.postAddOrUpdate === 'add') {
          initForm();
          if (BlogPostModule.currentCategoryId) {
            this.dialogEditorParams.params.categoryId = BlogPostModule.currentCategoryId;
            BlogPostModule.SET_CURRENT_CATEGORY_ID('');
          }
        } else {
          this.editor.setHtml('');
          const row: any = cloneDeep(BlogPostModule.postDetail.row);
          this.dialogEditorParams.params.authorId = row.authorId;
          this.dialogEditorParams.params.status = row.status;
          this.dialogEditorParams.params.categoryId = row.categoryId;
          this.dialogEditorParams.params.channelId = row.channelId;
          this.dialogEditorParams.params.title = row.title;
          this.dialogEditorParams.params.poster = row.poster;
          this.dialogEditorParams.params.id = row.id;
          this.dialogEditorParams.params.tags = row.tags
            ? row.tags.map((item: any) => {
                return {
                  text: item,
                };
              })
            : [];
          const checkedOptions = this.dialogEditorParams.checkedOptions;
          for (let item of checkedOptions) {
            if (row[item.value] && row[item.value] === '1') {
              (this.dialogEditorParams.params.checked as any).push(item.value);
            }
          }
          this.$q.loading.show();
          const data = await BlogPostModule.getPostContentById({ id: row.id });
          this.$q.loading.hide();
          this.dialogEditorParams.params.content = data;
          this.editor.setHtml(data);
        }
        this.$refs.editorWrap.style = 'transform: translateY(0)';
      } else {
        this.$refs.editorWrap.style = 'transform: translateY(-100vh);';
        initForm();
      }
    });
  }
  mounted() {
    if (!registerEditorAction) {
      this.registerEditorAction();
      registerEditorAction = true;
    }
  }
  public editCutomeAction = {
    active: false,
    editorInstance: null,
    imageUploadKey: '',
  };
  public dialogEditorParams = {
    params: cloneDeep(PARANS),
    checkedOptions: cloneDeep(POST_RADIO_OPTIONS),
  };
  public editorConfig = {
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
              content: '上传图片失败了',
            });
          }
        },
      },
    },
    onChange: (editor: any) => {
      if (this.blogEditorPostVisiable) {
        this.dialogEditorParams.params.content = editor.getHtml();
      }
    },
  };
  // 先创建 editor
  public editor: any;
  // 创建 toolbar
  public toolbar: any;
  /* event */
  hideDialog() {
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(false);
  }
  public handleOpenUploadPosterContainer() {
    this.$refs.PostAlbumComponentRef.init();
  }
  public pickSuccess(data: any) {
    if (this.editCutomeAction.active && this.editCutomeAction.editorInstance) {
      (this.editCutomeAction.editorInstance as any).dangerouslyInsertHtml(`<img src="${data.source}" />`);
      this.editCutomeAction.active = false;
      this.editCutomeAction.editorInstance = null;
      return;
    }
    this.dialogEditorParams.params.poster = data.source;
  }
  public postAlbumComponentHide() {
    this.editCutomeAction.active = false;
    this.editCutomeAction.editorInstance = null;
  }
  public registerEditorAction() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.editCutomeAction.imageUploadKey = `albumCover${Math.random().toString()}`;
    window.wangEditor.Boot.registerMenu({
      key: this.editCutomeAction.imageUploadKey,
      factory() {
        class AlbumCover {
          title: string;
          tag: string;
          iconSvg: string;
          constructor() {
            this.title = '图片上传';
            this.iconSvg =
              '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>';
            this.tag = 'button';
          }
          getValue(editor: any) {
            return '';
          }
          isActive(editor: any) {
            return false; // or true
          }
          isDisabled(editor: any) {
            return false; // or true
          }
          exec(editor: any, value: any) {
            // do something
            that.editCutomeAction.active = true;
            that.editCutomeAction.editorInstance = editor;
            that.$refs.PostAlbumComponentRef.init();
          }
        }
        return new AlbumCover();
      },
    });
  }
  /* http */
  public async dialogAddUpdateConfirmEvent() {
    if (!this.dialogEditorParams.params.title) {
      this.$globalMessage.show({
        type: 'error',
        content: '请输入标题',
      });
      return;
    } else if (!this.dialogEditorParams.params.authorId) {
      this.$globalMessage.show({
        type: 'error',
        content: '请选择作者',
      });
      return;
    } else if (!this.dialogEditorParams.params.categoryId) {
      this.$globalMessage.show({
        type: 'error',
        content: '请选择分类',
      });
      return;
    } else if (!this.dialogEditorParams.params.content) {
      this.$globalMessage.show({
        type: 'error',
        content: '请输入内容',
      });
      return;
    } else if (!this.dialogEditorParams.params.poster) {
      this.$globalMessage.show({
        type: 'error',
        content: '请上传封面',
      });
      return;
    } else if (!this.dialogEditorParams.params.channelId) {
      this.$globalMessage.show({
        type: 'error',
        content: '请选择频道',
      });
      return;
    } else if (!this.dialogEditorParams.params.tags.length) {
      this.$globalMessage.show({
        type: 'error',
        content: '请选择标签',
      });
      return;
    }
    const result = await this.$globalConfirm.show({
      title: '友情提示',
      color: 'primary',
      content: '确定吗？老铁！？',
      confirmButtonText: '非常确定',
    });
    if (result) {
      this.$q.loading.show();
      let postParams: any = {
        title: this.dialogEditorParams.params.title,
        content: this.dialogEditorParams.params.content,
        poster: this.dialogEditorParams.params.poster,
        authorId: this.dialogEditorParams.params.authorId,
        categoryId: this.dialogEditorParams.params.categoryId,
        channelId: this.dialogEditorParams.params.channelId,
        tags: this.dialogEditorParams.params.tags.map((item: any) => item.text),
        postType: 1,
        pinned: '0',
        recommended: '0',
        featured: '0',
        hot: '0',
        original: '0',
        paid: '0',
        free: '0',
        privated: '0',
        publiced: '0',
      };
      for (let item of this.dialogEditorParams.params.checked) {
        postParams[item] = '1';
      }
      if (BlogPostModule.postAddOrUpdate === 'add') {
        try {
          const { id } = await BlogPostModule.addPost(postParams);
          this.hideDialog();
          this.$globalMessage.show({
            type: 'success',
            content: this.$t('messages.success'),
          });
          BlogPostModule.SET_ADDED_POST_ID(id);
          setTimeout(() => {
            BlogPostModule.SET_ADD_POST_SUCCESS_FLAG(true);
          }, 1000);
        } catch (error) {
          this.$q.loading.hide();
        }
      } else if (BlogPostModule.postAddOrUpdate === 'update') {
        postParams['id'] = this.dialogEditorParams.params.id;
        try {
          await BlogPostModule.updatePost(postParams);
          this.hideDialog();
          this.$globalMessage.show({
            type: 'success',
            content: this.$t('messages.success'),
          });
          setTimeout(() => {
            BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG(true);
          }, 1000);
        } catch (error) {
          this.$q.loading.hide();
        }
      }
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
  min-height: 500px;
  border-radius: 8px;
}
.w-e-bar {
  border-radius: 8px;
}
.w-e-scroll {
  overflow: auto !important;
  max-height: 500px;
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
  transform: translateY(-100vh);
  .editor-content {
    height: 100%;
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 16px 32px 32px;
    justify-content: space-between;
    .tags-autocomplete {
      width: 100%;
      max-width: 100%;
      border-radius: 8px;
      :deep(.ti-input) {
        height: 40px;
        border-radius: 8px;
      }
    }
    .left {
      width: 50%;
    }
    .right {
      width: 48%;
    }
  }
  .poster {
    border-radius: 8px;
    box-sizing: border-box;
    img {
      height: 300px;
      border-radius: 8px;
      width: 100%;
      display: inline-block;
    }
  }
  #editor-toolbar {
    border-radius: 8px;
    margin-bottom: 8px;
  }
}
</style>
