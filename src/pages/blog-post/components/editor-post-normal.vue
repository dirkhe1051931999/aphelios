<template>
  <div>
    <q-dialog v-model="dialogEditorParams.model" transition-show="jump-up" transition-hide="jump-down" full-height @hide="hide">
      <q-card class="editor-post-card">
        <q-card-section class="text-h6 q-pb-none row items-center">
          {{ dialogEditorParams.title }}
          <q-badge class="q-ml-sm" :color="dialogEditorParams.params.status === 'OFFLINE' ? 'negative' : 'primary'" v-if="!isAddPost">{{ postStatus(dialogEditorParams.params) }}</q-badge>
        </q-card-section>
        <div class="split-line h-1"></div>
        <q-card-section class="editor-post-card-content">
          <div class="left-content">
            <div class="q-mb-md">
              <p class="q-mb-sm">* 标题</p>
              <q-input
                v-model.trim="dialogEditorParams.params.title"
                class="full-width q-mb-md"
                label="请输入"
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
            </div>
            <div class="q-mb-md">
              <p class="q-mb-sm">* 主题</p>
              <q-btn
                class="h-40 category-select full-width"
                :label="!dialogEditorParams.params.directoryId ? '点击选择主题' : postCategory({ directoryId: dialogEditorParams.params.directoryId })"
                outline
                align="left"
                :disable="disableSelectCategory"
              >
                <q-menu>
                  <q-list dense>
                    <q-item clickable v-for="item in categoryOptions" :key="item.id" v-close-popup="!item.children.length">
                      <q-item-section class="q-px-none">
                        <q-item-label>{{ item.name }}</q-item-label>
                        <q-item-label caption>{{ item.description }}</q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="item.children.length">
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu anchor="top end" self="top start" v-if="item.children.length">
                        <q-list dense>
                          <q-item
                            v-for="directory in item.children"
                            :key="directory.id"
                            clickable
                            v-close-popup="!directory.children.length"
                            @click.stop.prevent="!directory.children.length ? (dialogEditorParams.params.directoryId = directory.id) : () => 0"
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
                                  @click.stop.prevent="dialogEditorParams.params.directoryId = childDirectory.id"
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
              <p class="q-mb-sm">* 作者</p>
              <q-select
                class="full-width q-mb-md"
                v-model="dialogEditorParams.params.authorId"
                label="请选择"
                :options="authorOptions"
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
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar color="primary" text-color="white">
                        <q-img :src="scope.opt.avatarUrl"></q-img>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        >{{ scope.opt.name }}
                        <q-icon name="verified" size="14px" color="primary" v-if="scope.opt.status === 4"></q-icon>
                      </q-item-label>
                      <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="q-mb-md">
              <p class="q-mb-sm">* 频道</p>
              <q-select
                class="full-width q-mb-md"
                label="请选择"
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
              >
              </q-select>
            </div>
            <div class="q-mb-md">
              <p class="q-mb-sm">* 标签</p>
              <vue-tags-input
                class="tags-autocomplete"
                v-model="dialogEditorParams.params.tag"
                :tags="dialogEditorParams.params.postTags"
                @tags-changed="(newTags) => (dialogEditorParams.params.postTags = newTags)"
              />
            </div>
            <div class="q-mb-md">
              <p class="q-mb-sm">* 上架时间</p>
              <el-date-picker
                v-model="dialogEditorParams.params.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY/MM/DD hh:mm:ss"
                value-format="YYYY/MM/DD hh:mm:ss"
              >
              </el-date-picker>
            </div>
            <div class="q-mb-md">
              <p class="q-mb-sm">* 其他</p>
              <q-option-group :options="dialogEditorParams.checkedOptions" type="checkbox" v-model="dialogEditorParams.params.checked">
                <template #label="opt">
                  <div class="row items-center">
                    <span>{{ opt.label }}</span>
                    <div class="row items-center q-ml-md">
                      <q-icon name="info" color="grey"></q-icon>
                      <span class="text-grey q-ml-sm fs-12">{{ opt.description }} </span>
                    </div>
                  </div>
                </template>
              </q-option-group>
              <div class="split-line h-1"></div>
              <div v-for="(item, index) in dialogEditorParams.radioOptions" :key="index">
                <q-option-group v-model="dialogEditorParams.params[item.model]" :options="item.option" color="primary">
                  <template #label="opt">
                    <div class="row items-center">
                      <span>{{ opt.label }}</span>
                      <div class="row items-center q-ml-md">
                        <q-icon name="info" color="grey"></q-icon>
                        <span class="text-grey q-ml-sm fs-12">{{ opt.description }} </span>
                      </div>
                    </div>
                  </template>
                </q-option-group>
              </div>
            </div>
          </div>
          <div class="right-content">
            <div class="q-mb-md">
              <p class="q-mb-sm">
                * 海报
                <q-btn color="primary" icon="o_add" label="选择海报" @click="handleClickUploadPoster" class="q-ml-sm" dense />
              </p>
              <div class="border-all h-300 row items-center justify-center b-r-6">
                <div v-if="!dialogEditorParams.params.poster">上传海报</div>
                <img :src="dialogEditorParams.params.poster" class="h-300" v-if="dialogEditorParams.params.poster" />
              </div>
            </div>
            <div class="q-mb-md">
              <p class="q-mb-sm">* 内容</p>
              <form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
                <q-editor
                  v-model="dialogEditorParams.params.content"
                  ref="editorRef"
                  :fonts="dialogEditorParams.fonts"
                  :definitions="dialogEditorParams.definitions"
                  :toolbar="dialogEditorParams.toolbar()"
                />
              </form>
            </div>
            <div class="text-right q-mt-xl">
              <q-btn flat label="取消" color="primary" @click="hide" />
              <q-btn label="确定" color="primary" class="q-ml-md" @click="handleConfirmAddOrUpdate" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <PostAlbumComponent ref="PostAlbumComponentRef" @pick="pickAlbumSuccess"></PostAlbumComponent>
    <PostVideoComponent ref="PostVideoComponentRef" @pick="pickVideoSuccess"></PostVideoComponent>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import VueTagsInput from '@sipec/vue3-tags-input';
import { commonPost } from 'src/mixins/post';
import PostAlbumComponent from './album.vue';
import PostVideoComponent from './video.vue';
import { POST_CHECKBOX_OPTIONS, POST_RADIO_OPTIONS, COMMON_POST_PARAMS, onEditorVisiableShow, onBeforeEditorDone } from '../utils';
import { QEditor } from 'quasar';
import { getCurrentInstance } from 'vue';

const CONST_PARAMS = {
  add_or_edit: {
    ...COMMON_POST_PARAMS,
    poster: '',
  },
};

@Component({
  name: 'myEditorPostNormalComponent',
  components: {
    VueTagsInput,
    PostAlbumComponent,
    PostVideoComponent,
  },
})
export default class myEditorPostNormalComponent extends commonPost {
  declare $refs: {
    PostAlbumComponentRef: PostAlbumComponent;
    editorRef: QEditor;
    PostVideoComponentRef: PostVideoComponent;
  };

  get isAddPost() {
    return BlogPostModule.postAddOrUpdateNormal === 'add';
  }

  get blogEditorPostVisiableNormal() {
    return BlogPostModule.blogEditorPostVisiableNormal;
  }

  get disableSelectCategory() {
    return BlogPostModule.disableSelectCategoryNormal;
  }

  @Watch('blogEditorPostVisiableNormal')
  watchBlogEditorPostVisiableNormal(val: boolean) {
    if (val) {
      if (BlogPostModule.postAddOrUpdateNormal === 'update') onEditorVisiableShow(this, BlogPostModule.postDetailNormal.row, '6');
      this.dialogEditorParams.model = true;
    }
  }

  mounted() {
    this.dialogEditorParams.definitions.uploadImage.handler = this.editorUpdateImage.bind(this);
    this.dialogEditorParams.definitions.uploadVideo.handler = this.editorUpdateVideo.bind(this);
  }

  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public dialogEditorParams: any = {
    model: false,
    title: '新增文章',
    addImageFrom: '',
    fonts: {
      arial: 'Arial',
      arial_black: 'Arial Black',
      comic_sans: 'Comic Sans MS',
      courier_new: 'Courier New',
      impact: 'Impact',
      lucida_grande: 'Lucida Grande',
      times_new_roman: 'Times New Roman',
      verdana: 'Verdana',
    },
    definitions: {
      uploadImage: {
        tip: '上传图片',
        icon: 'image',
        label: '上传图片',
        handler: null,
      },
      uploadVideo: {
        tip: '上传视频',
        icon: 'cloud_upload',
        label: '上传视频',
        handler: null,
      },
    },
    toolbar: () => {
      return [
        ['bold', 'italic', 'strike', 'underline'],
        [
          {
            label: this.globals.$q.lang.editor.formatting,
            icon: this.globals.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h3', 'h4', 'h5', 'h6'],
          },
        ],
        [
          {
            label: this.globals.$q.lang.editor.defaultFont,
            icon: this.globals.$q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana'],
          },
        ],
        ['uploadImage', 'uploadVideo'],
      ];
    },
    params: cloneDeep(CONST_PARAMS.add_or_edit),
    checkedOptions: cloneDeep(POST_CHECKBOX_OPTIONS),
    radioOptions: cloneDeep(POST_RADIO_OPTIONS),
  };

  /* event */
  public hide() {
    this.dialogEditorParams.model = false;
    this.dialogEditorParams.params = cloneDeep(CONST_PARAMS.add_or_edit);
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_NORMAL(false);
  }

  public handleClickUploadPoster() {
    this.dialogEditorParams.addImageFrom = 'poster';
    this.$refs.PostAlbumComponentRef.init();
  }

  public pickAlbumSuccess(data: any) {
    if (this.dialogEditorParams.addImageFrom === 'poster') {
      this.dialogEditorParams.params.poster = data.source;
    } else {
      const edit = this.$refs.editorRef;
      this.$nextTick(() => {
        edit.focus();
        edit.caret.restore();
        edit.runCmd('insertHTML', `&nbsp;<img src="${data.source}" style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;" />&nbsp`);
      });
    }
  }

  public pickVideoSuccess(data: any) {
    const edit = this.$refs.editorRef;
    this.$nextTick(() => {
      edit.focus();
      edit.caret.restore();
      edit.runCmd('insertHTML', `&nbsp;<video src="${data.source}" controls="controls" style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;" />&nbsp`);
    });
  }

  public editorUpdateImage() {
    console.log(this);
    this.dialogEditorParams.addImageFrom = 'content';
    this.$refs.PostAlbumComponentRef.init();
  }

  public editorUpdateVideo() {
    this.$refs.PostVideoComponentRef.init();
  }

  /* http */
  public async getContent(id: string) {
    const data = await BlogPostModule.getPostContentById({ id: id });
    return Promise.resolve(data);
  }

  public async handleConfirmAddOrUpdate() {
    const validations = cloneDeep(this.commonValidations);
    validations.push(...[{ key: 'poster', message: '请选择海报', check: (value: any) => !!value }]);
    if (this.validateParams(this.dialogEditorParams.params, validations)) {
      const result = await this.$globalConfirm.show({
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
      });
      if (result) {
        try {
          const params: any = onBeforeEditorDone(this, '1');
          this.$q.loading.show();
          if (BlogPostModule.postAddOrUpdateNormal === 'add') {
            await BlogPostModule.addNormalPost(params);
            BlogPostModule.SET_ADD_POST_SUCCESS_FLAG_NORMAL(true);
          } else {
            params.id = this.dialogEditorParams.params.id;
            await BlogPostModule.updateNormalPost(params);
            BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG_NORMAL(true);
          }
          this.hide();
          this.$q.loading.hide();
          this.$globalMessage.show({
            type: 'success',
            content: '操作成功',
          });
        } catch (error) {}
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '../utils/editor.scss';

:deep(.q-editor__content) {
  height: 500px;

  img {
    max-width: 100%;
    max-height: 100%;
    transform: scale(0.8);
  }
}
</style>
