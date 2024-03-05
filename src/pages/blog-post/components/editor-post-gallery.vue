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
              * 图集
              <q-btn color="primary" icon="o_add" label="选择图集" @click="handleClickUploadPoster" class="q-ml-sm" dense />
            </p>
            <div class="border-all min-h-320 row items-center justify-center b-r-6 q-pa-sm">
              <div v-if="!dialogEditorParams.params.galleries.length">上传图集</div>
              <ul v-else class="galleries-list">
                <photo-provider>
                  <photo-consumer v-for="item in dialogEditorParams.params.galleries" :key="item.source" :src="item.source" class="grid-item">
                    <img :src="item.source" fit="contain" class="image" />
                    <q-icon name="cancel" class="remove" @click="removeImage(item)" />
                  </photo-consumer>
                </photo-provider>
                <li v-if="dialogEditorParams.params.galleries.length > 9" class="more">+{{ dialogEditorParams.params.galleries.length - 8 }}</li>
              </ul>
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
  <PostAlbumComponent ref="PostAlbumComponentRef" @pick="pickAlbumSuccess" :multiple="true" :max-multiple="9"></PostAlbumComponent>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import VueTagsInput from '@sipec/vue3-tags-input';
import { commonPost } from 'src/mixins/post';
import PostAlbumComponent from './album.vue';
import { COMMON_POST_PARAMS, onBeforeEditorDone, onEditorVisiableShow, POST_CHECKBOX_OPTIONS, POST_RADIO_OPTIONS } from '../utils';

const CONST_PARAMS = {
  add_or_edit: {
    ...COMMON_POST_PARAMS,
    galleries: [],
  },
};
@Component({
  name: 'myEditorPostGalleryComponent',
  components: {
    VueTagsInput,
    PostAlbumComponent,
  },
})
export default class myEditorPostGalleryComponent extends commonPost {
  declare $refs: {
    PostAlbumComponentRef: PostAlbumComponent;
  };

  get isAddPost() {
    return BlogPostModule.postAddOrUpdateGallery === 'add';
  }

  get blogEditorPostVisiableGallery() {
    return BlogPostModule.blogEditorPostVisiableGallery;
  }

  get disableSelectCategory() {
    return BlogPostModule.disableSelectCategoryGallery;
  }

  @Watch('blogEditorPostVisiableGallery')
  watchBlogEditorPostVisiableGallery(val: boolean) {
    if (val) {
      if (BlogPostModule.postAddOrUpdateGallery === 'update') onEditorVisiableShow(this, BlogPostModule.postDetailGallery.row, '3');
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
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_GALLERY(false);
  }

  public handleClickUploadPoster() {
    this.$refs.PostAlbumComponentRef.init();
  }

  public pickAlbumSuccess(data: any) {
    this.dialogEditorParams.params.galleries = this.dialogEditorParams.params.galleries.concat(data);
  }

  public removeImage(row: any) {
    this.dialogEditorParams.params.galleries = this.dialogEditorParams.params.galleries.filter((item: any) => item.source !== row.source);
  }

  /* http */
  public async getContent(id: string) {
    const data = await BlogPostModule.getPostContentById({ id: id });
    return Promise.resolve(data);
  }

  public async handleConfirmAddOrUpdate() {
    const validations = cloneDeep(this.commonValidations);
    validations.push(...[{ key: 'galleries', message: '请选择图集', check: (value: any) => value.length > 0 }]);
    if (this.validateParams(this.dialogEditorParams.params, validations)) {
      const result = await this.$globalConfirm.show({
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
      });
      if (result) {
        try {
          const params: any = onBeforeEditorDone(this, '3');
          this.$q.loading.show();
          if (BlogPostModule.postAddOrUpdateGallery === 'add') {
            await BlogPostModule.addGalleryPost(params);
            BlogPostModule.SET_ADD_POST_SUCCESS_FLAG_GALLERY(true);
          } else {
            params.id = this.dialogEditorParams.params.id;
            await BlogPostModule.updateGalleryPost(params);
            BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG_GALLERY(true);
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

.body--dark {
  .editor-post-card {
    .right-content {
      .galleries-list {
        .grid-item {
          .remove {
            color: $dark;
            background: rgba($color: #ffffff, $alpha: 0.2);
          }
        }

        .more {
          background: $dark;
          color: #ffffff;
          border: solid 1px #3c3c3c;
        }
      }
    }
  }
}

.body--light {
  .editor-post-card {
    .right-content {
      .galleries-list {
        .grid-item {
          .remove {
            color: #fff;
            background: rgba($color: #000000, $alpha: 0.2);
          }
        }

        .more {
          background: #fff;
          color: $dark;
          border: solid 1px #eeeeee;
        }
      }
    }
  }
}

.galleries-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 三列，等宽 */
  grid-template-rows: 1fr 1fr 1fr; /* 三列，等宽 */
  grid-gap: 10px; /* 格子间距 */
  width: 100%;
  height: 320px;
  overflow: hidden;
  position: relative;

  .grid-item {
    height: 100px;
    overflow: hidden; /* 隐藏超出部分 */
    width: 100%;
    position: relative;

    .image {
      height: 100%;
      width: 100%;
      object-fit: cover; /* 填充但保持比例 */
      border-radius: 4px;
      position: absolute;
      left: 0;
      top: 0;
      cursor: pointer;
    }

    .remove {
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      font-size: 20px;
      border-radius: 50%;
      padding: 4px;
    }
  }

  .more {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100px;
    width: calc(33.333333% - 5px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 40px;
    border-radius: 4px;
    z-index: 999;
  }
}
</style>
