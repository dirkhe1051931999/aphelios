<template>
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
                      <q-img :src="scope.opt.avatarUrl" spinner-size="12px" spinner-color="primary" />
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
              * 视频
              <q-btn color="primary" icon="o_add" label="选择视频" @click="handleClickUploadVideo" class="q-ml-sm" dense />
            </p>
            <div class="border-all h-300 row items-center justify-center b-r-6">
              <div v-if="!dialogEditorParams.params.videoUrl">上传视频</div>
              <video
                :src="dialogEditorParams.params.videoUrl"
                class="video h-300"
                controls
                muted
                :autoplay="false"
                :poster="dialogEditorParams.params.videoPoster"
                v-if="dialogEditorParams.params.videoUrl"
              ></video>
            </div>
          </div>
          <div class="q-mb-md">
            <p class="q-mb-sm">* 内容</p>
            <form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
              <q-editor ref="editorRef" v-model="dialogEditorParams.params.content" />
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
  <PostVideoComponent ref="PostVideoComponentRef" @pick="pickVideoSuccess"></PostVideoComponent>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import VueTagsInput from '@sipec/vue3-tags-input';
import { commonPost } from 'src/mixins/post';
import PostVideoComponent from './video.vue';
import { COMMON_POST_PARAMS, onBeforeEditorDone, onEditorVisiableShow, POST_CHECKBOX_OPTIONS, POST_RADIO_OPTIONS } from '../utils';

const CONST_PARAMS = {
  add_or_edit: {
    ...COMMON_POST_PARAMS,
    videoUrl: '',
    videoPoster: '',
  },
};
@Component({
  name: 'myEditorPostVideoComponent',
  components: {
    VueTagsInput,
    PostVideoComponent,
  },
})
export default class myEditorPostVideoComponent extends commonPost {
  declare $refs: {
    PostVideoComponentRef: PostVideoComponent;
  };

  get isAddPost() {
    return BlogPostModule.postAddOrUpdateVideo === 'add';
  }

  get blogEditorPostVisiableVideo() {
    return BlogPostModule.blogEditorPostVisiableVideo;
  }

  get disableSelectCategory() {
    return BlogPostModule.disableSelectCategoryVideo;
  }

  @Watch('blogEditorPostVisiableVideo')
  watchBlogEditorPostVisiableVideo(val: boolean) {
    if (val) {
      if (BlogPostModule.postAddOrUpdateVideo === 'update') onEditorVisiableShow(this, BlogPostModule.postDetailVideo.row, '2');
      this.dialogEditorParams.model = true;
    }
  }

  public dialogEditorParams: any = {
    model: false,
    title: '新增',
    params: cloneDeep(CONST_PARAMS.add_or_edit),
    checkedOptions: cloneDeep(POST_CHECKBOX_OPTIONS),
    radioOptions: cloneDeep(POST_RADIO_OPTIONS),
  };

  /* event */
  public hide() {
    this.dialogEditorParams.model = false;
    this.dialogEditorParams.params = cloneDeep(CONST_PARAMS.add_or_edit);
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_VIDEO(false);
  }

  public handleClickUploadVideo() {
    this.$refs.PostVideoComponentRef.init();
  }

  public pickVideoSuccess(data: any) {
    this.dialogEditorParams.params.videoUrl = data.source;
    this.dialogEditorParams.params.videoPoster = data.poster || '';
  }

  /* http */
  public async getContent(id: string) {
    const data = await BlogPostModule.getPostContentById({ id: id });
    return Promise.resolve(data);
  }

  public async handleConfirmAddOrUpdate() {
    const validations = cloneDeep(this.commonValidations);
    validations.push(...[{ key: 'videoUrl', message: '请选择视频', check: (value: any) => !!value }]);
    if (this.validateParams(this.dialogEditorParams.params, validations)) {
      const result = await this.$globalConfirm.show({
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
      });
      if (result) {
        try {
          const params: any = onBeforeEditorDone(this, '2');
          this.$q.loading.show();
          if (BlogPostModule.postAddOrUpdateVideo === 'add') {
            await BlogPostModule.addVideoPost(params);
            BlogPostModule.SET_ADD_POST_SUCCESS_FLAG_VIDEO(true);
          } else {
            params.id = this.dialogEditorParams.params.id;
            await BlogPostModule.updateVideoPost(params);
            BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG_VIDEO(true);
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
<style lang="scss">
.body--dark {
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
  .category-select {
    &.q-btn--outline:before {
      border: solid 1px rgba(0, 0, 0, 0.24) !important;
    }

    .q-btn__content {
      color: rgba(0, 0, 0, 0.541);
    }
  }
}
</style>
<style scoped lang="scss">
@import '../utils/editor.scss';
</style>
