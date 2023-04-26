<template>
  <div>
    <div class="thin-shadow q-pa-md relative" ref="quickButton">
      <q-btn color="primary" label="快速找到主题" icon-right="o_keyboard_arrow_right">
        <q-menu>
          <q-list>
            <q-item clickable v-for="item in sheetParams.data" :key="item.id" v-close-popup="!item.children.length">
              <q-item-section class="q-px-none">
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>{{ item.description }}</q-item-label>
              </q-item-section>
              <q-item-section side v-if="item.children.length">
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>
              <q-menu anchor="top end" self="top start" v-if="item.children.length">
                <q-list>
                  <q-item
                    v-for="directory in item.children"
                    :key="directory.id"
                    clickable
                    v-close-popup="!directory.children.length"
                    @click="!directory.children.length ? selectDirectory(item.id, directory.id) : () => 0"
                  >
                    <q-item-section>
                      <q-item-label>{{ directory.name }}</q-item-label>
                      <q-item-label caption>{{ directory.subName }}</q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="directory.children.length">
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu auto-close anchor="top end" self="top start" v-if="directory.children.length">
                      <q-list>
                        <q-item
                          v-for="childDirectory in directory.children"
                          :key="childDirectory"
                          clickable
                          v-close-popup="!childDirectory.children"
                          @click="selectChildDirectory(directory.id, item.id, childDirectory.id)"
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
    <div class="thin-shadow q-pa-md">
      <q-splitter v-model="splitterModel1" @update:model-value="watchSplitterChange">
        <template v-slot:before>
          <q-tabs v-model="sheetParams.tab" class="text-grey q-" active-color="primary" indicator-color="primary" align="left" inline-label vertical>
            <div class="text-left q-my-sm q-px-sm">
              <q-btn label="新增" icon="o_add" outline color="primary" dense @click="toAddSheet"></q-btn>
            </div>
            <q-tab :name="item.id" v-for="item in sheetParams.data" :key="item.id" style="justify-content: flex-start; padding: 0" class="q-my-xs" content-class="full-width">
              <q-slide-item class="full-width" right-color="negative" left-color="primary" @right="removeItem($event, 'sheet', item)" @left="updateItem($event, 'sheet', item)">
                <template v-slot:right>
                  <div>左滑删除 <q-icon right name="o_done"></q-icon></div>
                </template>
                <template v-slot:left>
                  <div>右滑编辑 <q-icon right name="o_edit_note"></q-icon></div>
                </template>
                <div class="row justify-between full-width items-center q-px-sm">
                  <div class="row column items-start justify-start">
                    <div class="q-mb-sm">
                      <span class="q-mr-sm"> {{ item.name }}</span>
                      <q-icon name="o_folder" size="16px" v-if="item.children.length"></q-icon>
                      <span class="fs-12" :class="{ bold: item.post_count }">（共计：{{ item.post_count }}）</span>
                    </div>
                    <span class="text-grey fs-12">{{ item.description }}</span>
                  </div>
                  <q-img :src="item.cover" fit="contain" width="24px" v-if="item.cover"></q-img>
                </div>
              </q-slide-item>
            </q-tab>
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-tab-panels v-model="sheetParams.tab" animated>
            <q-tab-panel :name="item.id" class="q-pa-none" v-for="item in sheetParams.data" :key="item.id">
              <q-splitter v-model="splitterModel2" @update:model-value="watchSplitterChange">
                <template v-slot:before>
                  <q-tabs v-model="sheetParams.directoryTab" active-color="primary" indicator-color="primary" vertical>
                    <div class="text-left q-my-sm q-px-sm">
                      <q-btn label="新增" icon="o_add" outline color="primary" @click="toAddDirectory(item.id)" dense></q-btn>
                    </div>
                    <q-tab
                      :name="directory.id"
                      v-for="directory in item.children"
                      :key="directory.id"
                      style="justify-content: flex-start; padding: 0"
                      class="q-my-xs"
                      content-class="full-width"
                      :ref="directory.id"
                    >
                      <q-slide-item
                        class="full-width"
                        right-color="negative"
                        left-color="primary"
                        @right="removeItem($event, 'directory', directory)"
                        @left="updateItem($event, 'directory', directory)"
                      >
                        <template v-slot:right>
                          <div>左滑删除 <q-icon right name="o_done"></q-icon></div>
                        </template>
                        <template v-slot:left>
                          <div>右滑编辑 <q-icon right name="o_edit_note"></q-icon></div>
                        </template>
                        <div class="row column items-start justify-start q-px-sm">
                          <div class="q-mb-sm row items-center">
                            <span class="q-mr-sm"> {{ directory.name }}</span>
                            <q-icon name="o_folder" size="16px" v-if="directory.children.length" class="q-mr-md"></q-icon>
                            <p class="fs-12" :class="{ bold: directory.post_count }">（共计：{{ directory.post_count }}）</p>
                          </div>
                          <span class="text-grey fs-12">{{ directory.subName }}</span>
                        </div>
                      </q-slide-item>
                    </q-tab>
                  </q-tabs>
                </template>
                <template v-slot:after>
                  <q-tab-panels v-model="sheetParams.directoryTab" animated transition-prev="slide-down" transition-next="slide-up">
                    <q-tab-panel :name="directory.id" class="q-pa-none" v-for="directory in item.children" :key="directory.id">
                      <q-splitter v-model="splitterModel3" v-if="directory.children.length" @update:model-value="watchSplitterChange">
                        <template v-slot:before>
                          <q-tabs v-model="sheetParams.childDirectoryTab" active-color="primary" indicator-color="primary" vertical>
                            <div class="text-left q-my-sm q-px-sm">
                              <q-btn label="新增" icon="o_add" outline color="primary" @click="toAddChildDirectory(directory.id)" dense></q-btn>
                            </div>
                            <q-tab
                              :name="childDirectory.id"
                              v-for="childDirectory in directory.children"
                              :key="childDirectory.id"
                              style="justify-content: flex-start; padding: 0"
                              class="q-my-xs"
                              content-class="full-width"
                            >
                              <q-slide-item
                                class="full-width"
                                right-color="negative"
                                left-color="primary"
                                @right="removeItem($event, 'child-directory', childDirectory)"
                                @left="updateItem($event, 'child-directory', childDirectory)"
                              >
                                <template v-slot:right>
                                  <div>左滑删除 <q-icon right name="o_done"></q-icon></div>
                                </template>
                                <template v-slot:left>
                                  <div>右滑编辑 <q-icon right name="o_edit_note"></q-icon></div>
                                </template>
                                <div class="row column items-start justify-center q-px-sm full-width">
                                  <div class="row items-center q-mb-sm">
                                    <span class="q-mr-sm"> {{ childDirectory.name }}</span>
                                    <p class="fs-12" :class="{ bold: childDirectory.post_count }">（共计：{{ childDirectory.post_count }} ）</p>
                                  </div>
                                  <span class="text-grey fs-12">{{ childDirectory.subName }}</span>
                                </div>
                              </q-slide-item>
                            </q-tab>
                          </q-tabs>
                        </template>
                        <template v-slot:after>
                          <div class="absolute full-width" ref="childDirectoryRightPanelClientWidth" content="为了获取post list区域实际宽度"></div>
                          <div ref="childDirectoryRightPanel" @scroll="watchChildDirectoryRightPanelScrollBottom">
                            <q-tab-panels v-model="sheetParams.childDirectoryTab" animated transition-prev="slide-down" transition-next="slide-up">
                              <q-tab-panel :name="childDirectory.id" class="q-pa-none" v-for="childDirectory in directory.children" :key="childDirectory.id">
                                <div class="row items-center q-pa-md">
                                  <span class="text-grey">{{ item.name }}</span>
                                  <span class="q-mx-sm">-</span>
                                  <span class="text-grey">{{ directory.name }}</span>
                                  <span class="q-mx-sm">-</span>
                                  <span class="text-blue">{{ childDirectory.name }}</span>
                                  <q-btn color="primary" label="新增" class="q-ml-md" @click="handleClickAdd" icon="o_add_circle_outline"></q-btn>
                                </div>
                                <ul class="q-pa-md" v-if="childDirectory.childrenPost.length">
                                  <li v-for="(post, index) in childDirectory.childrenPost" :key="post.id" class="thin-shadow q-pa-md row q-mb-md row column">
                                    <div class="row items-center">
                                      <p class="link-type fs-16 lh-30" @click="handlerClickUpdatePost(post)">{{ post.title }}</p>
                                      <span class="q-ml-md my-label grey">{{ postChannel(post.channelId) }}</span>
                                      <span class="q-ml-md my-status red" v-if="post.status === 'OFFLINE'">已下线</span>
                                      <span class="q-ml-md my-status green" v-if="post.status === 'PUBLISHED'">已上线</span>
                                      <span class="q-ml-md my-status grey" v-if="post.status === 'DRAFT'">草稿中</span>
                                      <span class="q-ml-auto fs-18"># {{ index + 1 }}</span>
                                    </div>
                                    <div class="row items-center q-mt-sm">
                                      <p class="q-mr-sm row items-center">
                                        <q-icon name="o_visibility" class="text-grey" size="18px"></q-icon>
                                        <span class="q-ml-sm">{{ post.view }}</span>
                                      </p>
                                      <p class="q-mr-sm row items-center">
                                        <q-icon name="o_textsms" class="text-grey" size="18px"></q-icon>
                                        <span class="q-ml-sm">{{ post.comment }}</span>
                                      </p>
                                      <p class="q-mr-sm row items-center">
                                        <q-icon name="o_query_builder" class="text-grey" size="18px"></q-icon>
                                        <span class="q-ml-sm">{{ parseTime(post.createTime) }}</span>
                                      </p>
                                      <p class="q-mr-sm row items-center">
                                        <q-icon name="o_update" class="text-grey" size="18px"></q-icon>
                                        <span class="q-ml-sm">{{ parseTime(post.updateTime) }}</span>
                                      </p>
                                      <p class="q-mr-sm row items-center">
                                        <q-icon name="o_person" class="text-grey" size="18px"></q-icon>
                                        <span class="q-ml-sm">{{ postAuthor(post.authorId) }}</span>
                                      </p>
                                    </div>
                                    <div class="row items-cener q-mt-sm">
                                      <span class="link-type q-mr-sm" v-if="post.status === 'OFFLINE'" @click="handlerClickOnline(post)">上线</span>
                                      <span class="delete-type q-mr-sm" v-if="post.status === 'PUBLISHED'" @click="handlerClickOffline(post)">下线</span>
                                      <span class="delete-type q-mr-sm" @click="handlerClickDelete(post)">删除</span>
                                    </div>
                                  </li>
                                  <q-card flat style="width: 100%" v-if="childDirectory.loading">
                                    <q-card-section class="q-pa-none">
                                      <q-skeleton type="text" class="text-subtitle1" />
                                      <q-skeleton type="text" width="50%" class="text-subtitle1" />
                                      <q-skeleton type="text" class="text-caption" />
                                    </q-card-section>
                                  </q-card>
                                </ul>
                                <div class="q-table__bottom--nodata row" v-else>暂无【{{ childDirectory.name }}】文章</div>
                              </q-tab-panel>
                            </q-tab-panels>
                          </div>
                        </template>
                      </q-splitter>
                      <div v-if="!directory.children.length" class="absolute full-width" ref="directoryRightPanelClientWidth" content="为了获取post list区域实际宽度"></div>
                      <div v-if="!directory.children.length" ref="directoryRightPanel" @scroll="watchDirectoryRightPanelScrollBottom">
                        <div class="text-left q-my-sm q-px-md">
                          <q-btn :label="`给【${directory.name}】新增子目录`" icon="o_add" outline color="primary" @click="toAddChildDirectory(directory.id)" dense></q-btn>
                        </div>
                        <div class="split-line h-1 q-mt-md"></div>
                        <div class="row items-center q-px-md q-pt-md">
                          <span class="text-grey">{{ item.name }}</span>
                          <span class="q-mx-sm">-</span>
                          <span class="text-blue">{{ directory.name }}</span>
                          <q-btn color="primary" label="新增" class="q-ml-md" @click="handleClickAdd" icon="o_add_circle_outline"></q-btn>
                        </div>
                        <ul class="q-pa-md" v-if="directory.childrenPost.length">
                          <li v-for="(post, index) in directory.childrenPost" :key="post.id" class="thin-shadow q-pa-md row q-mb-md row column">
                            <div class="row items-center">
                              <p class="link-type fs-16 1h-30" @click="handlerClickUpdatePost(post)">{{ post.title }}</p>
                              <span class="q-ml-md my-label grey">{{ postChannel(post.channelId) }}</span>
                              <span class="q-ml-md my-status red" v-if="post.status === 'OFFLINE'">已下线</span>
                              <span class="q-ml-md my-status green" v-if="post.status === 'PUBLISHED'">已上线</span>
                              <span class="q-ml-md my-status grey" v-if="post.status === 'DRAFT'">草稿中</span>
                              <span class="q-ml-auto fs-18"># {{ index + 1 }}</span>
                            </div>
                            <div class="row items-center q-mt-sm">
                              <p class="q-mr-sm row items-center">
                                <q-icon name="o_visibility" class="text-grey" size="18px"></q-icon>
                                <span class="q-ml-sm">{{ post.view }}</span>
                              </p>
                              <p class="q-mr-sm row items-center">
                                <q-icon name="o_textsms" class="text-grey" size="18px"></q-icon>
                                <span class="q-ml-sm">{{ post.comment }}</span>
                              </p>
                              <p class="q-mr-sm row items-center">
                                <q-icon name="o_query_builder" class="text-grey" size="18px"></q-icon>
                                <span class="q-ml-sm">{{ parseTime(post.createTime) }}</span>
                              </p>
                              <p class="q-mr-sm row items-center">
                                <q-icon name="o_update" class="text-grey" size="18px"></q-icon>
                                <span class="q-ml-sm">{{ parseTime(post.updateTime) }}</span>
                              </p>
                              <p class="q-mr-sm row items-center">
                                <q-icon name="o_person" class="text-grey" size="18px"></q-icon>
                                <span class="q-ml-sm">{{ postAuthor(post.authorId) }}</span>
                              </p>
                            </div>
                            <div class="row items-cener q-mt-sm">
                              <span class="link-type q-mr-sm" v-if="post.status === 'OFFLINE'" @click="handlerClickOnline(post)">上线</span>
                              <span class="delete-type q-mr-sm" v-if="post.status === 'PUBLISHED'" @click="handlerClickOffline(post)">下线</span>
                              <span class="delete-type q-mr-sm" @click="handlerClickDelete(post)">删除</span>
                            </div>
                          </li>
                          <q-card flat style="width: 100%" v-if="directory.loading">
                            <q-card-section class="q-pa-none">
                              <q-skeleton type="text" class="text-subtitle1" />
                              <q-skeleton type="text" width="50%" class="text-subtitle1" />
                              <q-skeleton type="text" class="text-caption" />
                            </q-card-section>
                          </q-card>
                        </ul>
                        <div class="q-table__bottom--nodata row" v-else>暂无【{{ directory.name }}】文章</div>
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
                </template>
              </q-splitter>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </div>
    <MyDialog
      :option="{
        id: dialogAddUpdateParams.id,
        dialogType: dialogAddUpdateParams.dialogType,
        clickLoading: dialogAddUpdateParams.clickLoading,
        getDataLoading: dialogAddUpdateParams.getDataLoading,
        visiable: dialogAddUpdateParams.visiable,
        title: dialogAddUpdateParams.title,
        params: dialogAddUpdateParams.params,
        customComfirm: true,
      }"
      ref="dialogAddUpdate"
      width="30vw"
      @close="dialogAddUpdateCloseEvent"
      @confirm="dialogAddUpdateConfirmEvent"
      @before-hide="dialogAddUpdateBeforeHideEvent"
    >
      <div class="row q-col-gutter-x-md">
        <div v-for="(item, index) in dialogAddUpdateParams.input" :key="index" class="col-12">
          <MyFormSelect
            v-if="item.type === 'select'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              userInput: false,
              showClose: false,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormInput
            v-if="item.type === 'text'"
            :option="{
              model: dialogAddUpdateParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          >
          </MyFormInput>
          <div v-if="item.type === 'file'">
            <p class="f-bold fs-12 p-b-8 row items-center">
              <span class="m-r-6">* {{ item.label }}</span>
            </p>
            <div class="row">
              <input type="file" class="hide" :ref="dialogAddUpdateParams.upload.fileID" :accept="dialogAddUpdateParams.upload.accept" :draggable="false" @change="uploadFileSuccess" />
              <q-btn
                color="primary"
                :label="`点击上传图片（${dialogAddUpdateParams.upload.accept}，size: 10KB）`"
                outline
                :style="this.dialogAddUpdateParams.upload.params.file ? 'width: 92%' : 'width:100%'"
                no-caps
                @click="handleClickUploadFile"
              ></q-btn>
              <div v-if="this.dialogAddUpdateParams.upload.params.file" class="q-pa-xs b-r-8 thin-shadow">
                <q-img :src="this.dialogAddUpdateParams.upload.params.file" fit="contain" width="32px"></q-img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MyDialog>
    <div class="hide">{{ fixedDirectoryRightChannel }}{{ isCollapse }}</div>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import { getCurrentInstance } from 'vue';
import { AppModule } from 'src/store/modules/app';
const CONST_PARAMS: any = {
  dialog_add_update: { name: '', subName: '', parent_id: '', id: '', type: '0', description: '' },
};
const findItemById = (id: any, items: any): any => {
  for (let item of items) {
    if (item.id === id) {
      return item;
    } else if (item.children && item.children.length > 0) {
      let result = findItemById(id, item.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
};
@Component({
  name: 'BlogPostDirectoryComponent',
  components: {},
})
export default class BlogPostDirectoryComponent extends Vue {
  $refs: any;
  get postChannel() {
    return (channelId: string) => {
      const selectOption = BlogPostModule.allChannel;
      const item: any = selectOption.find((item: any) => item.value === channelId);
      if (item) {
        return item.label;
      } else {
        return '--';
      }
    };
  }
  get postAuthor() {
    return (channelId: string) => {
      const selectOption = BlogPostModule.allValidAuthor;
      const item: any = selectOption.find((item: any) => item.value === channelId);
      if (item) {
        return item.label;
      } else {
        return '--';
      }
    };
  }
  get fixedDirectoryRightChannel() {
    if (BlogPostModule.fixedDirectoryRightChannel) {
      if (this.$refs['directoryRightPanel'] && this.$refs['directoryRightPanel'][0]) {
        let directoryRightPanel = this.$refs['directoryRightPanel'][0];
        directoryRightPanel.style = `position:fixed;overflow-y:scroll;transition: all .1s ease;background:#ffffff;width:${this.sheetParams.directoryRightPanel.width}px;height:${this.sheetParams.directoryRightPanel.height}px;height:${this.sheetParams.directoryRightPanel.height}px;top:${this.sheetParams.directoryRightPanel.top}px;left:${this.sheetParams.directoryRightPanel.left}px;`;
      }
      if (this.$refs['childDirectoryRightPanel'] && this.$refs['childDirectoryRightPanel'][0]) {
        let childDirectoryRightPanel = this.$refs['childDirectoryRightPanel'][0];
        childDirectoryRightPanel.style = `position:fixed;overflow-y:scroll;transition: all .1s ease;background:#ffffff;width:${this.sheetParams.childDirectoryRightPanel.width}px;height:${this.sheetParams.childDirectoryRightPanel.height}px;height:${this.sheetParams.childDirectoryRightPanel.height}px;top:${this.sheetParams.childDirectoryRightPanel.top}px;left:${this.sheetParams.childDirectoryRightPanel.left}px;`;
      }
    } else {
      if (this.$refs['directoryRightPanel'] && this.$refs['directoryRightPanel'][0]) {
        let directoryRightPanel = this.$refs['directoryRightPanel'][0];
        directoryRightPanel.style = '';
      }
      if (this.$refs['childDirectoryRightPanel'] && this.$refs['childDirectoryRightPanel'][0]) {
        let childDirectoryRightPanel = this.$refs['childDirectoryRightPanel'][0];
        childDirectoryRightPanel.style = '';
      }
    }
    return BlogPostModule.fixedDirectoryRightChannel;
  }
  get isCollapse() {
    return !AppModule.sidebar.opened;
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
  @Watch('sheetParams.tab')
  private async watchSheetTab(newVal: string) {
    if (!this.sheetParams.isClickSelect) {
      this.sheetParams.directoryTab = (this.sheetParams.data.find((item: any) => item.id === newVal) as any).children.length
        ? (this.sheetParams.data.find((item: any) => item.id === newVal) as any).children[0].id
        : '';
      this.sheetParams.childDirectoryTab =
        (this.sheetParams.data.find((item: any) => item.id === newVal) as any).children[0] && (this.sheetParams.data.find((item: any) => item.id === newVal) as any).children[0].children[0]
          ? (this.sheetParams.data.find((item: any) => item.id === newVal) as any).children[0].children[0].id
          : '';
    }
    this.$nextTick(() => {
      BlogPostModule.SET_SCROLL_TOP(Math.random());
    });
  }
  @Watch('sheetParams.directoryTab')
  private async watchDirectoryTab(newVal: string) {
    if (!this.sheetParams.isClickSelect) {
      this.sheetParams.childDirectoryTab =
        (this.sheetParams.data.find((item: any) => item.id === this.sheetParams.tab) as any).children.find((item: any) => item.id === newVal) &&
        (this.sheetParams.data.find((item: any) => item.id === this.sheetParams.tab) as any).children.find((item: any) => item.id === newVal).children[0]
          ? (this.sheetParams.data.find((item: any) => item.id === this.sheetParams.tab) as any).children.find((item: any) => item.id === newVal).children[0].id
          : '';
    }
    this.$nextTick(() => {
      if (newVal && !this.sheetParams.childDirectoryTab) {
        this.getPostListByCategoryId(newVal);
      }
      BlogPostModule.SET_SCROLL_TOP(Math.random());
    });
    this.getPostListContainerBox();
  }
  @Watch('sheetParams.childDirectoryTab')
  private async watchChildDirectoryTab(newVal: string) {
    this.$nextTick(() => {
      if (newVal) {
        this.getPostListByCategoryId(newVal);
      }
      BlogPostModule.SET_SCROLL_TOP(Math.random());
    });
  }
  @Watch('isCollapse')
  private async watchIsCollapse(newVal: boolean) {
    this.getPostListContainerBox();
  }
  @Watch('addPostSuccessFlag')
  private async watchAddPostSuccessFlag(newVal: string) {
    if (newVal) {
      const result = await BlogPostModule.getPostRowById({
        id: this.addedPostId,
      });
      BlogPostModule.SET_ADDED_POST_ID('');
      const item = findItemById(result.categoryId, this.sheetParams.data);
      item.childrenPost.unshift(result);
      BlogPostModule.SET_ADD_POST_SUCCESS_FLAG(false);
    }
  }
  @Watch('updatePostSuccessFlag')
  private async watchUpdatePostSuccessFlag(newVal: string) {
    if (newVal) {
      const result = await BlogPostModule.getPostRowById({
        id: this.postParams.params.postId,
      });
      const item = findItemById(result.categoryId, this.sheetParams.data);
      let index = item.childrenPost.findIndex((post: any) => post.id === result.id);
      item.childrenPost[index] = result;
      BlogPostModule.SET_UPDATE_POST_SUCCESS_FLAG(false);
    }
  }
  async mounted() {
    this.getAllSheetDirectory();
    this.getChannel();
    this.getAuthor();
  }
  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  private postParams = {
    pagination: {
      rowsPerPage: 20,
    },
    params: {
      categoryId: '',
      postId: null,
    },
  };
  private sheetParams = {
    data: [],
    loading: false,
    tab: '',
    directoryRightPanel: {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    },
    childDirectoryRightPanel: {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    },
    directoryTab: '',
    childDirectoryTab: '',
    isClickSelect: false,
  };
  private dialogAddUpdateParams = {
    id: 'dialog_add_update',
    dialogType: '',
    isAdd: true,
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    params: cloneDeep(CONST_PARAMS.dialog_add_update),
    upload: {
      id: 'dialog-upload-file',
      fileID: 'dialog_upload_file',
      visiable: false,
      accept: '.jpg,.png,.jpeg',
      params: { file: '', fileName: '' },
    },
    sheetInput: [
      {
        model: 'name',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '栏目名',
      },
      {
        model: 'description',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '描述',
      },
      {
        model: 'covers',
        type: 'file',
        accept: '.jpg,.png,.jpeg',
        rules: [],
        label: '图片',
      },
    ],
    directoryInput: [
      {
        model: 'name',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '栏目名',
      },
      {
        model: 'subName',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '栏目副名',
      },
      {
        model: 'type',
        type: 'select',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        inputSelectOption: [
          {
            label: '无下级',
            value: '0',
          },
          {
            label: '有下级',
            value: '1',
          },
        ],
        label: '栏目副名',
      },
    ],
    childDirectoryInput: [
      {
        model: 'name',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '栏目名',
      },
      {
        model: 'subName',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '栏目副名',
      },
    ],
    input: [],
  };
  private splitterModel1 = 10;
  private splitterModel2 = 12;
  private splitterModel3 = 15;
  /* event */
  private toAddSheet() {
    this.dialogAddUpdateParams.dialogType = 'sheet';
    this.dialogAddUpdateParams.isAdd = true;
    this.dialogAddUpdateParams.params.parent_id = 'to-fill-data';
    this.dialogAddUpdateParams.title = '添加栏目';
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.input = this.dialogAddUpdateParams.sheetInput as any;
    this.$nextTick(() => {
      this.$refs[this.dialogAddUpdateParams.upload.fileID][0].type = 'text';
      this.dialogAddUpdateParams.upload.params.fileName = '';
      this.dialogAddUpdateParams.upload.params.file = '';
      setTimeout(() => {
        this.$refs[this.dialogAddUpdateParams.upload.fileID][0].type = 'file';
        this.$refs[this.dialogAddUpdateParams.upload.fileID][0].value = '';
      }, 100);
    });
  }
  private toAddDirectory(parentId: string) {
    this.dialogAddUpdateParams.dialogType = 'directory';
    this.dialogAddUpdateParams.isAdd = true;
    this.dialogAddUpdateParams.params.parent_id = this.sheetParams.tab;
    this.dialogAddUpdateParams.input = this.dialogAddUpdateParams.directoryInput as any;
    const parentIndex = this.sheetParams.data.findIndex((item: any) => item.id === parentId);
    this.dialogAddUpdateParams.title = `添加【${(this.sheetParams.data[parentIndex] as any).name}】的二级栏目`;
    this.dialogAddUpdateParams.visiable = true;
  }
  private toAddChildDirectory(parentId: string) {
    this.dialogAddUpdateParams.dialogType = 'child-directory';
    this.dialogAddUpdateParams.isAdd = true;
    this.dialogAddUpdateParams.title = '添加三级栏目';
    this.dialogAddUpdateParams.params.parent_id = this.sheetParams.directoryTab;
    this.dialogAddUpdateParams.input = this.dialogAddUpdateParams.childDirectoryInput as any;
    this.dialogAddUpdateParams.visiable = true;
  }
  private handleClickUploadFile() {
    this.$nextTick(() => {
      this.$refs[this.dialogAddUpdateParams.upload.fileID][0].type = 'text';
      this.dialogAddUpdateParams.upload.params.fileName = '';
      this.dialogAddUpdateParams.upload.params.file = '';
      setTimeout(() => {
        this.$refs[this.dialogAddUpdateParams.upload.fileID][0].type = 'file';
        this.$refs[this.dialogAddUpdateParams.upload.fileID][0].value = '';
        this.$refs[this.dialogAddUpdateParams.upload.fileID][0].click();
      }, 100);
    });
  }
  private handlerClickUpdatePost(row: any) {
    this.postParams.params.postId = row.id;
    BlogPostModule.SET_POST_ADD_OR_UPDATE('update');
    BlogPostModule.SET_DISABLE_SELECT_CATEGORY(true);
    BlogPostModule.SET_CURRENT_CATEGORY_ID(row.categoryId);
    BlogPostModule.SET_POST_DETAIL({ row });
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(true);
  }
  private handleClickAdd() {
    BlogPostModule.SET_POST_ADD_OR_UPDATE('add');
    BlogPostModule.SET_DISABLE_SELECT_CATEGORY(true);
    const categoryId = this.sheetParams.childDirectoryTab ? this.sheetParams.childDirectoryTab : this.sheetParams.directoryTab;
    BlogPostModule.SET_CURRENT_CATEGORY_ID(categoryId);
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(true);
  }
  private uploadFileSuccess() {
    const files = this.$refs[this.dialogAddUpdateParams.upload.fileID][0].files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach((rawFile: any) => {
      this.dialogAddUpdateParams.upload.params.fileName = rawFile.name;
      const fileType = rawFile.type.toLowerCase();
      const allowedExtensions = this.dialogAddUpdateParams.upload.accept.split(',').map((item) => item.replace('.', ''));
      if (!allowedExtensions.some((ext) => fileType.endsWith(ext))) {
        this.$globalMessage.show({
          type: 'error',
          content: '文件格式不正确',
        });
        return;
      }
      if (rawFile.size <= 10240) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const base64String = event.target.result;
          this.dialogAddUpdateParams.upload.params.file = base64String;
        };
        reader.readAsDataURL(rawFile);
      } else {
        // Handle file that exceeds size limit
        this.$globalMessage.show({
          type: 'error',
          content: '图片大小超过10KB',
        });
      }
    });
  }
  private selectDirectory(parent_id: string, id: string) {
    this.sheetParams.isClickSelect = true;
    this.sheetParams.directoryTab = id;
    this.sheetParams.tab = parent_id;
    this.$nextTick(() => {
      this.sheetParams.isClickSelect = false;
      BlogPostModule.SET_SCROLL_TOP(Math.random());
    });
  }
  private selectChildDirectory(parent_id: string, paretn_parent_id: string, id: string) {
    this.sheetParams.isClickSelect = true;
    this.sheetParams.childDirectoryTab = id;
    this.sheetParams.directoryTab = parent_id;
    this.sheetParams.tab = paretn_parent_id;
    this.$nextTick(() => {
      this.sheetParams.isClickSelect = false;
    });
  }
  private dialogAddUpdateCloseEvent(data: { type: string }) {
    this.dialogAddUpdateParams.visiable = false;
  }
  private dialogAddUpdateBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogAddUpdateParams.params = data.params;
    }
  }
  private getPostListContainerBox() {
    this.$nextTick(() => {
      if (this.$refs['directoryRightPanel'] && this.$refs['directoryRightPanel'][0]) {
        setTimeout(() => {
          const clientWidth = this.$refs['directoryRightPanelClientWidth'][0].offsetWidth;
          this.sheetParams.directoryRightPanel.width = clientWidth;
          this.sheetParams.directoryRightPanel.height = window.innerHeight - 98;
          this.sheetParams.directoryRightPanel.left = window.innerWidth - clientWidth - 48;
          this.sheetParams.directoryRightPanel.top = 98;
        }, 300);
      }
      if (this.$refs['childDirectoryRightPanel'] && this.$refs['childDirectoryRightPanel'][0]) {
        setTimeout(() => {
          const clientWidth = this.$refs['childDirectoryRightPanelClientWidth'][0].offsetWidth;
          this.sheetParams.childDirectoryRightPanel.width = clientWidth;
          this.sheetParams.childDirectoryRightPanel.height = window.innerHeight - 98;
          this.sheetParams.childDirectoryRightPanel.left = window.innerWidth - clientWidth - 48;
          this.sheetParams.childDirectoryRightPanel.top = 98;
        }, 300);
      }
    });
  }
  private watchSplitterChange() {
    this.getPostListContainerBox();
  }
  private watchDirectoryRightPanelScrollBottom() {
    const id = this.sheetParams.directoryTab;
    const div = this.$refs['directoryRightPanel'][0];
    if (div.scrollTop + div.clientHeight + 10 >= div.scrollHeight) {
      const item = findItemById(id, this.sheetParams.data);
      if (!item.lock) {
        item.lock = true;
        this.getPostListByCategoryId(id);
      }
    }
  }
  private watchChildDirectoryRightPanelScrollBottom() {
    const id = this.sheetParams.childDirectoryTab;
    const div = this.$refs['childDirectoryRightPanel'][0];
    if (div.scrollTop + div.clientHeight + 10 >= div.scrollHeight) {
      const item = findItemById(id, this.sheetParams.data);
      if (!item.lock) {
        item.lock = true;
        this.getPostListByCategoryId(id);
      }
    }
  }
  /* http */
  private async getAllSheetDirectory(dialogType?: string, id?: string) {
    try {
      this.$q.loading.show();
      const allSheet = await BlogPostModule.getAllSheet({});
      const allDirectory = await BlogPostModule.getAllDirectory({});
      const allChildDirectory = await BlogPostModule.getAllChildDirectory({});
      const sheets = allSheet.pageData;
      let directorys = allDirectory.pageData;
      let childDirectorys = allChildDirectory.pageData;
      directorys = directorys.map((directory: any) => {
        directory.childrenPost = [];
        directory.postPage = 1;
        return directory;
      });
      childDirectorys = childDirectorys.map((childDirectory: any) => {
        childDirectory.childrenPost = [];
        childDirectory.postPage = 1;
        return childDirectory;
      });
      for (let item of sheets) {
        item.children = [];
        item.children = directorys.filter((directory: any) => directory.parent_id === item.id);
      }
      for (let item of sheets) {
        for (let child of item.children) {
          child.children = [];
          child.children = childDirectorys.filter((childDirectory: any) => childDirectory.parent_id === child.id);
          child.post_count += child.children.reduce((acc: any, innerChild: any) => acc + innerChild.post_count, 0);
        }
      }
      for (let item of sheets) {
        item.post_count += item.children.reduce((acc: any, child: any) => acc + child.post_count, 0);
      }
      BlogPostModule.SET_ALL_CATEGORY(allSheet.pageData);
      this.sheetParams.data = allSheet.pageData;
      if (this.dialogAddUpdateParams.isAdd) {
        if (dialogType && id) {
          if (dialogType === 'directory') {
            this.sheetParams.directoryTab = id;
          } else if (dialogType === 'child-directory') {
            this.sheetParams.childDirectoryTab = id;
          } else if (dialogType === 'sheet') {
            this.sheetParams.tab = id;
          }
          this.$nextTick(() => {
            if (dialogType === 'directory') {
              BlogPostModule.SET_SCROLL_TOP(Math.random());
            }
          });
        } else {
          this.sheetParams.childDirectoryTab = allSheet.pageData[0].children[0].children[0].id;
          this.sheetParams.directoryTab = allSheet.pageData[0].children[0].id;
          this.sheetParams.tab = allSheet.pageData[0].id;
        }
      }
    } catch (error) {
      this.sheetParams.data = [];
    }
    this.$nextTick(() => {
      this.$q.loading.hide();
    });
  }
  private async getChannel() {
    try {
      await BlogPostModule.getAllChannel({});
    } finally {
      return Promise.resolve();
    }
  }
  private async getAuthor() {
    try {
      await BlogPostModule.getAllPostAuthor({});
    } finally {
      return Promise.resolve();
    }
  }
  private async getPostListByCategoryId(id: string) {
    try {
      this.postParams.params.categoryId = id;
      const item = findItemById(this.postParams.params.categoryId, this.sheetParams.data);
      if (!item.noData) {
        this.$q.loading.show();
        const { pageData } = await BlogPostModule.getPostListByCategoryId({
          categoryId: this.postParams.params.categoryId,
          page: item.postPage,
          rowsPerPage: this.postParams.pagination.rowsPerPage,
        });
        if (pageData.length === 0) {
          item.noData = true;
          item.loading = false;
          item.lock = true;
        } else if (pageData.length === this.postParams.pagination.rowsPerPage) {
          item.childrenPost.push(...pageData);
          item.postPage++;
          item.noData = false;
          item.loading = true;
          item.lock = false;
        } else if (pageData.length < this.postParams.pagination.rowsPerPage) {
          item.childrenPost.push(...pageData);
          item.noData = true;
          item.loading = false;
          item.lock = true;
        }
        this.$q.loading.hide();
      }
    } catch (error) {
      console.log(error);
      this.$q.loading.hide();
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
        const item = findItemById(row.categoryId, this.sheetParams.data);
        const index = item.childrenPost.findIndex((post: any) => post.id === row.id);
        item.childrenPost.splice(index, 1);
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
      }
    } catch (error) {}
  }
  private async handlerClickOnline(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 上线提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await BlogPostModule.publishPost({
          id: row.id,
        });

        const result = await BlogPostModule.getPostRowById({
          id: row.id,
        });
        row.status = result.status;
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
      }
    } catch (error) {}
  }
  private async handlerClickOffline(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 下线提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await BlogPostModule.offlinePost({
          id: row.id,
        });
        const result = await BlogPostModule.getPostRowById({
          id: row.id,
        });
        row.status = result.status;
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
      }
    } catch (error) {}
  }
  private async dialogAddUpdateConfirmEvent() {
    if (this.dialogAddUpdateParams.dialogType === 'sheet') {
      if (!this.dialogAddUpdateParams.upload.params.file) {
        this.$globalMessage.show({
          type: 'error',
          content: '请上传图片',
        });
        return;
      }
    }
    const result = await this.$refs['dialogAddUpdate'].validForm();
    if (!result) {
      return;
    }
    if (this.dialogAddUpdateParams.isAdd) {
      try {
        this.$q.loading.show();
        let id = '';
        if (this.dialogAddUpdateParams.dialogType === 'sheet') {
          id = await this.addSheet();
        }
        if (this.dialogAddUpdateParams.dialogType === 'directory') {
          id = await this.addDirectory();
        }
        if (this.dialogAddUpdateParams.dialogType === 'child-directory') {
          id = await this.addChildDirectory();
        }
        this.dialogAddUpdateParams.visiable = false;
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getAllSheetDirectory(this.dialogAddUpdateParams.dialogType, id);
      } catch (error) {}
      this.$q.loading.hide();
    } else {
      try {
        this.$q.loading.show();
        if (this.dialogAddUpdateParams.dialogType === 'sheet') {
          await this.updateSheet();
        }
        if (this.dialogAddUpdateParams.dialogType === 'directory') {
          await this.updateDirectory();
        }
        if (this.dialogAddUpdateParams.dialogType === 'child-directory') {
          await this.updateChildDirectory();
        }
        this.dialogAddUpdateParams.visiable = false;
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getAllSheetDirectory();
      } catch (error) {}
      this.$q.loading.hide();
    }
  }
  private async addSheet() {
    const params = {
      name: this.dialogAddUpdateParams.params.name,
      description: this.dialogAddUpdateParams.params.description,
      cover: this.dialogAddUpdateParams.upload.params.file,
    };
    const { id } = await BlogPostModule.addSheet(params);
    return Promise.resolve(id);
  }
  private async updateSheet() {
    const params = {
      id: this.dialogAddUpdateParams.params.id,
      name: this.dialogAddUpdateParams.params.name,
      description: this.dialogAddUpdateParams.params.description,
      cover: this.dialogAddUpdateParams.upload.params.file,
    };
    await BlogPostModule.updateSheet(params);
    return Promise.resolve();
  }
  private async addDirectory() {
    const params = {
      name: this.dialogAddUpdateParams.params.name,
      subName: this.dialogAddUpdateParams.params.subName,
      type: Number(this.dialogAddUpdateParams.params.type),
      parent_id: this.dialogAddUpdateParams.params.parent_id,
    };
    const { id } = await BlogPostModule.addDirectory(params);
    return Promise.resolve(id);
  }
  private async updateDirectory() {
    const params = {
      id: this.dialogAddUpdateParams.params.id,
      name: this.dialogAddUpdateParams.params.name,
      subName: this.dialogAddUpdateParams.params.subName,
    };
    await BlogPostModule.updateDirectory(params);
    return Promise.resolve();
  }
  private async addChildDirectory() {
    const params = {
      name: this.dialogAddUpdateParams.params.name,
      subName: this.dialogAddUpdateParams.params.subName,
      type: 0,
      parent_id: this.dialogAddUpdateParams.params.parent_id,
    };
    const { id } = await BlogPostModule.addChildDirectory(params);
    return Promise.resolve(id);
  }
  private async updateChildDirectory() {
    const params = {
      id: this.dialogAddUpdateParams.params.id,
      name: this.dialogAddUpdateParams.params.name,
      subName: this.dialogAddUpdateParams.params.subName,
    };
    await BlogPostModule.updateChildDirectory(params);
    return Promise.resolve();
  }
  private async removeItem(event: any, type: string, item: any) {
    this.dialogAddUpdateParams.isAdd = false;
    const result = await this.$globalConfirm.show({
      title: '💕💕💕 提示',
      color: 'primary',
      content: '确定要执行该操作吗 :) ?',
      confirmButtonText: '嗯，是的',
    });
    if (!result) {
      event.reset();
    } else {
      try {
        if (type === 'sheet') {
          await BlogPostModule.removeSheet({ id: item.id });
        }
        if (type === 'directory') {
          await BlogPostModule.removeDirectory({ id: item.id });
        }
        if (type === 'child-directory') {
          await BlogPostModule.removeChildDirectory({ id: item.id });
        }
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getAllSheetDirectory();
        if (type === 'sheet') {
          if (this.sheetParams.tab === item.id) {
            this.sheetParams.tab = (this.sheetParams.data[0] as any).id;
          }
        }
        if (type === 'directory') {
          if (this.sheetParams.directoryTab === item.id) {
            this.sheetParams.directoryTab = (this.sheetParams.data[0] as any).children[0] ? (this.sheetParams.data[0] as any).children[0].id : '';
          }
        }
        if (type === 'child-directory') {
          if (this.sheetParams.childDirectoryTab === item.id) {
            this.sheetParams.childDirectoryTab = (this.sheetParams.data[0] as any).children[0]
              ? (this.sheetParams.data[0] as any).children[0].children[0]
                ? (this.sheetParams.data[0] as any).children[0].children[0].id
                : ''
              : '';
          }
        }
      } catch (error) {
        event.reset();
      }
    }
  }
  private async updateItem(event: any, type: string, item: any) {
    this.dialogAddUpdateParams.isAdd = false;
    if (type === 'sheet') {
      this.dialogAddUpdateParams.upload.params.file = item.cover;
      this.dialogAddUpdateParams.params.name = item.name;
      this.dialogAddUpdateParams.params.description = item.description;
      this.dialogAddUpdateParams.input = this.dialogAddUpdateParams.sheetInput as any;
    } else if (type === 'directory') {
      this.dialogAddUpdateParams.params.name = item.name;
      this.dialogAddUpdateParams.params.subName = item.subName;
      this.dialogAddUpdateParams.params.type = item.type;
      this.dialogAddUpdateParams.input = this.dialogAddUpdateParams.directoryInput as any;
      const index = this.dialogAddUpdateParams.input.findIndex((item: any) => item.name === 'type');
      this.dialogAddUpdateParams.input.splice(index, 1);
    } else if (type === 'child-directory') {
      this.dialogAddUpdateParams.params.name = item.name;
      this.dialogAddUpdateParams.params.subName = item.subName;
      this.dialogAddUpdateParams.input = this.dialogAddUpdateParams.childDirectoryInput as any;
    }
    event.reset();
    this.dialogAddUpdateParams.dialogType = type;
    this.dialogAddUpdateParams.title = '编辑';
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.params.id = item.id;
  }
}
</script>
<style lang="scss">
.body--dark {
  .splitter {
    background: $dark;
  }
  .upload-button,
  .upload-img {
    background: $dark;
    border: solid 1px #ffffff;
  }
  .post-list-topbar {
    background: $dark;
  }
}
.body--light {
  .splitter {
    background: #ffffff;
  }
  .upload-button,
  .upload-img {
    background: #ffffff;
    border: solid 1px $dark;
  }
  .post-list-topbar {
    background: #ffffff;
  }
}
.splitter {
  height: 100%;
}
</style>
