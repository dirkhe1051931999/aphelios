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
              :label="postCategory(dialogEditorParams.params.directoryId) === '--' ? '选择主题' : '主题：' + postCategory(dialogEditorParams.params.directoryId)"
              icon-right="o_keyboard_arrow_down"
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
              :tags="dialogEditorParams.params.tags"
              @tags-changed="(newTags) => (dialogEditorParams.params.tags = newTags)"
            />
          </div>
          <div class="q-mb-md">
            <p class="q-mb-sm">* 其他</p>
            <q-option-group :options="dialogEditorParams.checkedOptions" type="checkbox" v-model="dialogEditorParams.params.checked" />
          </div>
          <div class="q-mb-md">
            <p class="q-mb-sm">* 内容</p>
            <form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
              <q-editor ref="editorRef" v-model="dialogEditorParams.params.content" />
            </form>
          </div>
        </div>
        <div class="right-content">
          <div class="q-mb-md">
            <p class="q-mb-sm">* 海报 <q-btn color="primary" icon="o_add" label="选择海报" @click="handleClickUploadPoster" class="q-ml-sm" dense /></p>
            <div class="border-all h-300 row items-center justify-center b-r-6">
              <div v-if="!dialogEditorParams.params.poster">上传海报</div>
              <img :src="dialogEditorParams.params.poster" class="h-300" v-if="dialogEditorParams.params.poster" />
            </div>
          </div>
          <div class="q-mb-md">
            <p class="q-mb-sm">* 视频 <q-btn color="primary" icon="o_add" label="选择视频" @click="handleClickUploadVideo" class="q-ml-sm" dense /></p>
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
          <div class="text-right q-mt-xl">
            <q-btn flat label="取消" color="primary" @click="hide" />
            <q-btn label="确定" color="primary" class="q-ml-md" @click="handleConfirmAddOrUpdate" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <PostVideoComponent ref="PostVideoComponentRef" @pick="pickVideoSuccess"></PostVideoComponent>
  <PostAlbumComponent ref="PostAlbumComponentRef" @pick="pickAlbumSuccess"></PostAlbumComponent>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import VueTagsInput from '@sipec/vue3-tags-input';
import { commonPost } from 'src/mixins/post';
import PostVideoComponent from './video.vue';
import PostAlbumComponent from './album.vue';
import { POST_RADIO_OPTIONS } from '../utils';

const CONST_PARAMS = {
  add_or_edit: {
    id: '',
    authorId: '',
    directoryId: '',
    channelId: '',
    title: '',
    content: '',
    tag: '',
    tags: [],
    checked: [],
    videoUrl: '',
    videoPoster: '',
    poster: '',
    status: '',
  },
};
@Component({
  name: 'myEditorPostVideoComponent',
  components: {
    VueTagsInput,
    PostVideoComponent,
    PostAlbumComponent,
  },
})
export default class myEditorPostVideoComponent extends commonPost {
  declare $refs: {
    PostVideoComponentRef: PostVideoComponent;
    PostAlbumComponentRef: PostAlbumComponent;
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
      if (BlogPostModule.postAddOrUpdateVideo === 'update') {
        this.dialogEditorParams.title = '编辑视频';
        const row: any = BlogPostModule.postDetailVideo.row;
        this.dialogEditorParams.params.id = row.id;
        this.dialogEditorParams.params.authorId = row.authorId;
        this.dialogEditorParams.params.directoryId = row.directoryId;
        this.dialogEditorParams.params.channelId = row.channelId;
        this.dialogEditorParams.params.title = row.title;
        this.dialogEditorParams.params.videoUrl = row.videoUrl;
        this.dialogEditorParams.params.videoPoster = row.videoPoster;
        this.dialogEditorParams.params.poster = row.poster;
        this.dialogEditorParams.params.status = row.status;
        const checkedOptions = this.dialogEditorParams.checkedOptions;
        for (let item of checkedOptions) {
          if (row[item.value] && row[item.value] === '1') {
            this.dialogEditorParams.params.checked.push(item.value);
          }
        }
        this.getContent(row.id).then((data: any) => {
          this.dialogEditorParams.params.content = data;
        });
        if (row.tags && row.tags.length) {
          this.dialogEditorParams.params.tags = row.tags.map((item: any) => {
            return {
              text: item,
            };
          });
        }
      } else {
        this.dialogEditorParams.title = '新增视频';
      }
      this.dialogEditorParams.model = true;
      return true;
    }
  }
  public dialogEditorParams: any = {
    model: false,
    title: '新增视频',
    params: cloneDeep(CONST_PARAMS.add_or_edit),
    checkedOptions: cloneDeep(POST_RADIO_OPTIONS),
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
  public handleClickUploadPoster() {
    this.$refs.PostAlbumComponentRef.init();
  }
  public pickVideoSuccess(data: any) {
    this.dialogEditorParams.params.videoUrl = data.source;
    this.dialogEditorParams.params.videoPoster = data.poster || '';
  }
  public pickAlbumSuccess(data: any) {
    this.dialogEditorParams.params.poster = data.source;
  }
  /* http */
  public async getContent(id: string) {
    const data = await BlogPostModule.getPostContentById({ id: id });
    return Promise.resolve(data);
  }
  public async handleConfirmAddOrUpdate() {
    if (!this.dialogEditorParams.params.title) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请输入标题',
      });
      return;
    }
    if (!this.dialogEditorParams.params.directoryId) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择主题',
      });
      return;
    }
    if (!this.dialogEditorParams.params.authorId) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择作者',
      });
      return;
    }
    if (!this.dialogEditorParams.params.channelId) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择频道',
      });
      return;
    }
    if (!this.dialogEditorParams.params.tags.length) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择标签',
      });
      return;
    }
    if (!this.dialogEditorParams.params.poster) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择海报',
      });
      return;
    }
    if (!this.dialogEditorParams.params.videoUrl) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择视频',
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
      try {
        const params: any = {
          authorId: this.dialogEditorParams.params.authorId,
          channelId: this.dialogEditorParams.params.channelId,
          content: this.dialogEditorParams.params.content,
          directoryId: this.dialogEditorParams.params.directoryId,
          title: this.dialogEditorParams.params.title,
          videoUrl: this.dialogEditorParams.params.videoUrl,
          videoPoster: this.dialogEditorParams.params.videoPoster,
          poster: this.dialogEditorParams.params.poster,
          tags: this.dialogEditorParams.params.tags.map((item: any) => item.text),
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
          params[item] = '1';
        }
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
.tags-autocomplete {
  width: 100%;
  max-width: 100%;
  border-radius: 8px;
  :deep(.ti-input) {
    height: 40px;
    border-radius: 8px;
  }
}
.editor-post-card {
  max-width: 80vw;
  width: 60vw;
  .editor-post-card-content {
    display: flex;
    justify-content: space-between;
    .left-content {
      width: 60%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border: solid 1px #eeeeee;
      border-radius: 8px;
      padding: 16px;
      height: 100%;
    }
    .right-content {
      width: 39%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border: solid 1px #eeeeee;
      border-radius: 8px;
      padding: 16px;
      height: 100%;
    }
  }
}
</style>
