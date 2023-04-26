<template>
  <div>
    <q-dialog v-model="dialogAddUpdateParams.visiable" position="bottom" @before-hide="handlerDialogBeforeHide">
      <!-- code -->
      <q-dialog v-model="dialogAddUpdateParams.addCode.visiable" position="top">
        <q-card style="min-width: 1000px" v-if="dialogAddUpdateParams.addCode.visiable">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6">{{ dialogAddUpdateParams.addCode.title }}</div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <MonacoEditor :ref="dialogAddUpdateParams.id + '-addCode'" class="h-300 q-px-md q-pb-md"></MonacoEditor>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="确定" @click="submitAddCode" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogUpload.visiable" position="top">
        <q-card style="min-width: 1000px">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6">{{ dialogUpload.title }}</div>
          </q-card-section>
          <q-card-section class="q-py-none">
            <input type="file" class="hide" :ref="dialogUpload.fileID" :accept="dialogUpload.accept" :draggable="false" @change="uploadFileSuccess" />
            <ul class="row">
              <li
                class="upload-img relative"
                v-for="(item, index) in dialogUpload.params.fileBase64"
                :key="item"
                :class="{ 'w-148 h-148 q-mr-md': dialogUpload.maxCount !== 1, 'full-width h-300': dialogUpload.maxCount === 1 }"
              >
                <q-img :src="item" :width="dialogUpload.maxCount !== 1 ? '128px' : '100%'" :height="dialogUpload.maxCount !== 1 ? '128px' : '300px'" fit="contain"> </q-img>
                <q-icon name="close" size="20px" class="absolute right-10 top-10 cursor-pointer" color="grey" style="z-index: 1000" @click="removeCurrentImg(index)"></q-icon>
              </li>
              <div class="upload-button" @click="handleClickUploadFile" v-if="canUploadImg">
                <q-icon name="o_add" size="50px"></q-icon>
              </div>
            </ul>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="确定" @click="saveBase64ImgInHTML" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-card style="height: 95vh; width: 100vw; max-width: 100vw">
        <q-inner-loading :showing="dialogAddUpdateParams.getDataLoading"></q-inner-loading>
        <q-splitter v-model="dialogAddUpdateParams.splitterModel" class="splitter">
          <template v-slot:before>
            <div class="q-pa-md" style="height: 100%">
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
                dropdown-icon="app:topbar-arrow-bottom"
                clear-icon="app:clear"
                :spellcheck="false"
              />
              <div class="split-line h-1 q-my-md"></div>
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
                  class="q-mr-md w-p-30"
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
                              @click="!directory.children.length ? (dialogAddUpdateParams.row.categoryId = directory.id) : () => 0"
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
                                    @click="dialogAddUpdateParams.row.categoryId = childDirectory.id"
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
              <div class="poster q-my-lg relative thin-shadow q-pa-md">
                <q-img :src="dialogAddUpdateParams.row.poster" height="300px" style="border-radius: 12px" v-if="dialogAddUpdateParams.row.poster" fit="contain">
                  <template #loading> <q-skeleton height="300px" square width="100%" /> </template>
                </q-img>
                <div v-else class="h-300 row items-center justify-center">
                  <div class="text-center cursor-pointer" @click="handleOpenUploadPosterContainer">
                    <q-icon name="o_add" size="80px"></q-icon>
                    <p class="q-mt-md">上传封面</p>
                  </div>
                </div>
                <span class="link-type absolute top-30 right-30 thin-shadow q-py-sm q-px-md" @click="handleOpenUploadPosterContainer" v-if="dialogAddUpdateParams.row.poster">修改</span>
              </div>
              <q-editor
                v-model="dialogAddUpdateParams.row.content"
                ref="qEditor"
                class="thin-shadow"
                style="min-height: 500px"
                :definitions="{
                  upload: {
                    icon: 'o_cloud_upload',
                    label: '上传图片',
                    handler: handleOpenUploadContainer,
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
                    'undo',
                    'redo',
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
                  <q-btn-dropdown dense no-caps ref="tokenRef" no-wrap unelevated label="上传代码" size="sm" flat dropdown-icon="app:topbar-arrow-bottom" icon="o_code">
                    <q-list dense>
                      <q-item tag="label" clickable v-for="(item, index) in dialogAddUpdateParams.supportCodeType" :key="index" @click="addCode(item)" v-close-popup>
                        <q-item-section>{{ item.label }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </template>
              </q-editor>
              <div class="row items-center justify-center q-mt-xl">
                <q-btn color="primary" outline class="w-200 q-mb-xl">存为草稿</q-btn>
                <q-btn color="primary" @click="dialogAddUpdateConfirmEvent" class="w-200 q-ml-md q-mb-xl">保存</q-btn>
              </div>
            </div>
          </template>
          <template v-slot:after>
            <div class="q-pa-md">
              <div class="text-h5 h-40 lh-40" v-if="dialogAddUpdateParams.row.title">{{ dialogAddUpdateParams.row.title }}</div>
              <div class="h-40 lh-40 text-grey" v-else>请在左侧输入框输入标题</div>
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
                  <span>频道：</span>
                  <span>{{ postChannel(dialogAddUpdateParams.row) }}</span>
                </li>
                <li class="q-mr-md" v-if="dialogAddUpdateParams.dialogType === 'update'">
                  <span>评论：</span>
                  <span>{{ defaultFill(dialogAddUpdateParams.row.comment) }}</span>
                </li>
                <li v-if="dialogAddUpdateParams.dialogType === 'update'">
                  <span>阅读：</span>
                  <span>{{ defaultFill(dialogAddUpdateParams.row.view) }}</span>
                </li>
                <div class="q-ml-auto">
                  {{ parseTime(dialogAddUpdateParams.row.updateTime) }}
                </div>
              </ul>
              <div class="poster q-my-xl thin-shadow q-pa-md" v-if="dialogAddUpdateParams.row.poster">
                <q-img :src="dialogAddUpdateParams.row.poster" height="300px" style="border-radius: 12px" fit="contain">
                  <template #loading> <q-skeleton height="300px" square width="100%" /> </template>
                </q-img>
              </div>
              <div class="poster q-mt-xl q-mb-lg thin-shadow q-pa-md h-332 text-grey fs-16 1h-30" v-if="!dialogAddUpdateParams.row.poster">请点击左侧上传按钮上传封面</div>
              <div
                class="post-content lh-30 fs-16 thin-shadow q-pa-md min-h-500"
                v-html="viewPostHTML(dialogAddUpdateParams.row.content)"
                ref="postContent"
                v-if="dialogAddUpdateParams.row.content"
              ></div>
              <div class="post-content lh-30 fs-16 thin-shadow q-pa-md min-h-500 text-grey" v-else>请在左侧输入内容</div>
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
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { defaultFill, sleep } from 'src/utils/tools';
import MonacoEditor from 'src/components/MonacoEditor/index.vue';
import { getCurrentInstance } from 'vue';
import { supportCodeType } from './utils';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
import { copyToClipboard } from 'quasar';

@Component({
  name: 'myBlogPostDialogComponent',
  components: {
    MonacoEditor,
  },
  emits: ['addSuccess', 'updateSuccess'],
})
export default class myBlogPostDialogComponent extends Vue {
  /**instance */
  declare $refs: any;
  @Prop({ default: '' }) private from!: string;
  get authorOptions() {
    return BlogPostModule.allValidAuthor;
  }
  get categoryOptions() {
    return BlogPostModule.allCategory;
  }
  get channelOptions() {
    return BlogPostModule.allChannel;
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
        this.dialogAddUpdateParams.row.categoryName = item.name;
        return item.name;
      } else {
        return '--';
      }
    };
  }
  get postAuthor() {
    return (row: any) => {
      if (!row.authorId) return '--';
      const selectOption = BlogPostModule.allValidAuthor;
      const item = selectOption.find((item: any) => item.value === row.authorId);
      if (item) {
        this.dialogAddUpdateParams.row.authorName = item.label;
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
        this.dialogAddUpdateParams.row.channelName = item.label;
        return item.label;
      } else {
        return '--';
      }
    };
  }
  get viewPostHTML() {
    return (html: any) => {
      return this._viewPostHTML(html);
    };
  }
  get canUploadImg() {
    return this.dialogUpload.params.fileBase64.length < this.dialogUpload.maxCount;
  }
  get disableSelectCategory() {
    const disable = ['directory'];
    return disable.includes(this.from);
  }
  private dialogUpload = {
    id: 'dialog-upload-img',
    fileID: 'dialog_upload_img',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    maxCount: 3,
    title: '',
    type: 'html',
    accept: '.png,.jpg',
    posterBase64: [],
    posterFile: [],
    htmlImgBase64: [],
    htmlImgFile: [],
    params: { file: [], fileName: [], fileBase64: [] },
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
      lang: '',
      deleteId: 'blog-post-editor-add-code-delete-button-',
      copyId: 'blog-post-editor-add-code-copy-button-',
      editId: 'blog-post-editor-add-code-edit-button-',
      contentId: 'blog-post-editor-add-code-content-',
      curContentId: '',
      action: 'add',
    },
    supportCodeType: supportCodeType,
    splitterModel: 50,
    codeNum: 0,
    row: {
      id: null,
      content: '',
      title: '',
      poster: '',
      authorId: null,
      authorName: null,
      categoryId: null,
      categoryName: null,
      channelId: null,
      channelName: null,
    },
  };
  /* event */
  private handlerDialogBeforeHide() {
    this.$refs.qEditor.caret.el.removeEventListener('click', this.handlerActionCode);
    this.$refs.postContent && this.$refs.postContent.removeEventListener('click', this.handlerActionCode);
  }
  private async submitAddCode() {
    if (!this.$refs[`${this.dialogAddUpdateParams.id}-addCode`].code) {
      if (this.dialogAddUpdateParams.addCode.action === 'add') {
        this.$globalMessage.show({
          type: 'error',
          content: '请输入代码',
        });
      } else {
        this.$globalMessage.show({
          type: 'error',
          content: '未编辑',
        });
      }
      return;
    }
    const isValid = this.$refs[`${this.dialogAddUpdateParams.id}-addCode`].validateCode(this.dialogAddUpdateParams.addCode.lang);
    const init = () => {
      setTimeout(() => {
        this.dialogAddUpdateParams.addCode.visiable = false;
        const code = this.$refs[`${this.dialogAddUpdateParams.id}-addCode`].code;
        this.$nextTick(() => {
          if (this.dialogAddUpdateParams.addCode.action === 'add') {
            this.$refs.qEditor.caret.restore();
            this.$refs.qEditor.runCmd(
              'insertHTML',
              `&nbsp;
            <div contenteditable="false" class="relative">
            <pre><code class="language-js" id="${this.dialogAddUpdateParams.addCode.contentId}${this.dialogAddUpdateParams.codeNum + 1}">${code}</code></pre>
            <span class="link-type fs-12 absolute right-90 top-10" lang="${this.dialogAddUpdateParams.addCode.lang}" cId="${this.dialogAddUpdateParams.addCode.contentId}${
                this.dialogAddUpdateParams.codeNum + 1
              }" id="${this.dialogAddUpdateParams.addCode.editId}${this.dialogAddUpdateParams.codeNum + 1}">编辑</span>
            <span class="link-type fs-12 absolute right-50 top-10" id="${this.dialogAddUpdateParams.addCode.copyId}${this.dialogAddUpdateParams.codeNum + 1}">复制</span>
            <span class="link-type fs-12 absolute right-10 top-10" id="${this.dialogAddUpdateParams.addCode.deleteId}${this.dialogAddUpdateParams.codeNum + 1}">删除</span>
            </div>
            &nbsp;`
            );
            this.$refs.qEditor.focus();
            this.dialogAddUpdateParams.codeNum++;
          } else {
            const id = this.dialogAddUpdateParams.addCode.curContentId;
            const regExp = new RegExp(`<code.*?id="${id}".*?>([\\s\\S]*?)<\/code>`);
            const matchResult = this.dialogAddUpdateParams.row.content.match(regExp)!;
            const codeStr = matchResult[1];
            this.dialogAddUpdateParams.row.content = this.dialogAddUpdateParams.row.content.replace(codeStr, code);
            document.querySelector(`#${this.dialogAddUpdateParams.addCode.curContentId}`)!.innerHTML = code;
          }
          setTimeout(() => {
            Prism.highlightAll();
          }, 300);
        });
      }, 300);
    };
    if (!isValid) {
      const result = await this.$globalConfirm.show({
        title: '再次确认',
        color: 'primary',
        content: '语法不符合规范，是否继续添加？',
        confirmButtonText: 'Confirm',
      });
      if (result) {
        init();
      }
    } else {
      this.$refs[`${this.dialogAddUpdateParams.id}-addCode`].formatCode();
      init();
    }
  }
  private handlerActionCode(event: any) {
    let isDelete = /blog-post-editor-add-code-delete-button-\d+/.test(event.target.id);
    let isCopy = /blog-post-editor-add-code-copy-button-\d+/.test(event.target.id);
    let isEdit = /blog-post-editor-add-code-edit-button-\d+/.test(event.target.id);
    if (isDelete) {
      event.target.parentNode.remove();
      this.dialogAddUpdateParams.row.content = this.$refs.qEditor.getContentEl().innerHTML;
    } else if (isCopy) {
      copyToClipboard(event.target.parentNode.children[0].innerText);
      this.$globalMessage.show({
        content: '复制成功',
        type: 'success',
      });
    } else if (isEdit) {
      this.dialogAddUpdateParams.addCode.visiable = true;
      this.dialogAddUpdateParams.addCode.title = 'Edit';
      this.dialogAddUpdateParams.addCode.action = 'update';
      this.dialogAddUpdateParams.addCode.lang = event.target.getAttribute('lang');
      this.dialogAddUpdateParams.addCode.curContentId = event.target.getAttribute('cId');
      this.$nextTick(() => {
        this.$refs[`${this.dialogAddUpdateParams.id}-addCode`].initEditor({
          language: event.target.getAttribute('lang'),
          value: event.target.parentNode.children[0].innerText,
        });
      });
    }
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
    (this.dialogUpload.params.fileName as any).push(postFiles[0].name);
    (this.dialogUpload.params.file as any).push(postFiles[0]);
    const base64 = await getBase64(postFiles[0]);
    (this.dialogUpload.params.fileBase64 as any).push(base64);
    if (this.dialogUpload.type === 'html') {
      (this.dialogUpload.htmlImgBase64 as any).push(base64);
      (this.dialogUpload.htmlImgFile as any).push(postFiles[0]);
    } else {
      (this.dialogUpload.posterBase64 as any).push(base64);
      (this.dialogUpload.posterFile as any).push(postFiles[0]);
    }
  }
  private removeCurrentImg(index: number) {
    (this.dialogUpload.params.fileName as any).splice(index, 1);
    (this.dialogUpload.params.file as any).splice(index, 1);
    (this.dialogUpload.params.fileBase64 as any).splice(index, 1);
  }
  private handleClickUploadFile() {
    this.$refs[this.dialogUpload.fileID].type = 'text';
    setTimeout(() => {
      this.$refs[this.dialogUpload.fileID].type = 'file';
      this.$refs[this.dialogUpload.fileID].value = '';
      this.$refs[this.dialogUpload.fileID].click();
    }, 100);
  }
  private saveBase64ImgInHTML() {
    if (!this.dialogUpload.params.fileBase64.length) {
      this.$globalMessage.show({ type: 'error', content: '请上传图片' });
      return;
    }
    if (this.dialogUpload.type === 'poster') {
      this.dialogAddUpdateParams.row.poster = this.dialogUpload.params.fileBase64[0];
      this.dialogUpload.visiable = false;
    } else if (this.dialogUpload.type === 'html') {
      let html = '';
      this.dialogUpload.params.fileBase64.forEach((item: string, index: number) => {
        html += `<div><img src="${item}" alt=""  style="max-height:30em;"/></div>`;
      });
      this.$refs.qEditor.caret.restore();
      this.$refs.qEditor.runCmd(
        'insertHTML',
        `&nbsp;
          ${html}
      &nbsp;`
      );
      this.$refs.qEditor.focus();
      this.dialogUpload.visiable = false;
    }
  }
  private handleOpenUploadPosterContainer() {
    this.dialogUpload.params.file = [];
    this.dialogUpload.params.fileBase64 = [];
    this.dialogUpload.params.fileName = [];
    this.dialogUpload.type = 'poster';
    this.dialogUpload.maxCount = 1;
    this.dialogUpload.visiable = true;
    this.dialogUpload.title = '上传封面';
  }
  private handleOpenUploadContainer() {
    this.dialogUpload.params.file = [];
    this.dialogUpload.params.fileBase64 = [];
    this.dialogUpload.params.fileName = [];
    this.dialogUpload.type = 'html';
    this.dialogUpload.maxCount = 3;
    this.dialogUpload.visiable = true;
    this.dialogUpload.title = '上传图片';
  }
  private _viewPostHTML(html: any) {
    function removeDOMByPartialId(html: string, id: string) {
      const regex = new RegExp(`<[^>]*id=['"].*${id}.*['"][^>]*>(.*?)<\/[^>]*>`, 'gi');
      return html.replace(regex, '');
    }
    function replaceClassByPartialId(html: string, partialId: string, newClass: string) {
      const regex = new RegExp(`(?<=<[^>]*id=['"].*${partialId}.*['"][^>]*class=['"])[^'"]*(?=['"])`, 'gi');
      return html.replace(regex, newClass);
    }
    const result1 = removeDOMByPartialId(html, this.dialogAddUpdateParams.addCode.deleteId);
    const result2 = removeDOMByPartialId(result1, this.dialogAddUpdateParams.addCode.editId);
    const regex = /(?<=class="[^"]*\s)(.*\s)?right-50(\s.*)?(?=\s.*top-10.*)/g;
    const result3 = result2.replace(regex, '$1right-30$2');
    const regex2 = new RegExp(`id="${this.dialogAddUpdateParams.addCode.copyId}\\d+"`, 'g');
    const result = result3.replace(regex2, (match) => {
      return `${match.slice(0, -1)}-view"`;
    });
    return result;
  }
  private addCode(type: any) {
    this.dialogAddUpdateParams.addCode.visiable = true;
    this.dialogAddUpdateParams.addCode.title = type.label;
    this.dialogAddUpdateParams.addCode.lang = type.value;
    this.dialogAddUpdateParams.addCode.action = 'add';
    this.dialogAddUpdateParams.addCode.curContentId = '';
    this.$nextTick(() => {
      this.$refs[`${this.dialogAddUpdateParams.id}-addCode`].initEditor({
        language: type.value,
        value: '',
      });
    });
  }
  public addPost(row: any) {
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'add';
    this.dialogAddUpdateParams.title = 'Add';
    this.dialogAddUpdateParams.row = {
      content: '',
      title: '',
      poster: '',
      authorId: null,
      authorName: null,
      categoryId: null,
      categoryName: null,
      channelId: null,
      channelName: null,
      id: null,
    };
    if (row) {
      this.dialogAddUpdateParams.row.categoryId = row.categoryId;
    }
    this.dialogAddUpdateParams.codeNum = 0;
    this.dialogUpload.params.file = [];
    this.dialogUpload.params.fileBase64 = [];
    this.dialogUpload.params.fileName = [];
    this.dialogUpload.posterBase64 = [];
    this.dialogUpload.posterFile = [];
    this.dialogUpload.htmlImgBase64 = [];
    this.dialogUpload.htmlImgFile = [];
    this.$nextTick(() => {
      this.$refs.qEditor.caret.el.addEventListener('click', this.handlerActionCode);
      this.$refs.postContent && this.$refs.postContent.addEventListener('click', this.handlerActionCode);
    });
  }

  /* http */
  public async openPostDetail(row: any) {
    row.content = '';
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'update';
    this.dialogAddUpdateParams.title = 'Update';
    this.dialogAddUpdateParams.getDataLoading = true;
    const result = await BlogPostModule.getPostContentById({ id: row.id });
    row.content = result;
    this.dialogAddUpdateParams.row = row;
    this.dialogAddUpdateParams.codeNum = row.codeCount;
    this.dialogAddUpdateParams.getDataLoading = false;
    this.dialogUpload.params.file = [];
    this.dialogUpload.params.fileBase64 = [];
    this.dialogUpload.params.fileName = [];
    this.dialogUpload.posterBase64 = [];
    this.dialogUpload.posterFile = [];
    this.dialogUpload.htmlImgBase64 = [];
    this.dialogUpload.htmlImgFile = [];
    this.$refs.qEditor.caret.el.addEventListener('click', this.handlerActionCode);
    this.$refs.postContent && this.$refs.postContent.addEventListener('click', this.handlerActionCode);
    setTimeout(() => {
      Prism.highlightAll();
    }, 100);
  }
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
      const htmlImgFile = this.dialogUpload.htmlImgFile;
      const htmlImgBase64 = this.dialogUpload.htmlImgBase64;
      const htmlimgform = new FormData();
      this.$q.loading.show();
      for (let i = 0; i < htmlImgFile.length; i++) {
        try {
          htmlimgform.append('file', htmlImgFile[i]);
          const res = await BlogPostModule.uploadPostImgs(htmlimgform);
          this.dialogAddUpdateParams.row.content = this.dialogAddUpdateParams.row.content.replace(htmlImgBase64[i], res[0]);
        } catch (error) {
          this.$q.loading.hide();
          this.$globalMessage.show({
            type: 'error',
            content: '上传图片失败',
          });
        }
      }
      const posterFile = this.dialogUpload.posterFile;
      const posterBase64 = this.dialogUpload.posterBase64;
      const posterform = new FormData();
      for (let i = 0; i < posterFile.length; i++) {
        try {
          posterform.append('file', posterFile[i]);
          const res = await BlogPostModule.uploadPostImgs(posterform);
          // 判断poster是不是base64
          this.dialogAddUpdateParams.row.poster = res[0];
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
        codeCount: this.dialogAddUpdateParams.codeNum,
      };
      if (this.dialogAddUpdateParams.dialogType === 'add') {
        postParams['postType'] = 1; //1 文章 2 视频
        try {
          const { id } = await BlogPostModule.addPost(postParams);
          this.dialogAddUpdateParams.visiable = false;
          this.$globalMessage.show({
            type: 'success',
            content: this.$t('messages.success'),
          });
          this.$emit('addSuccess', { id });
        } catch (error) {
          this.$q.loading.hide();
        }
      } else if (this.dialogAddUpdateParams.dialogType === 'update') {
        postParams['id'] = this.dialogAddUpdateParams.row.id;
        try {
          await BlogPostModule.updatePost(postParams);
          this.dialogAddUpdateParams.visiable = false;
          this.$globalMessage.show({
            type: 'success',
            content: this.$t('messages.success'),
          });
          this.$emit('updateSuccess');
        } catch (error) {
          this.$q.loading.hide();
        }
      }
      setTimeout(() => {
        this.$q.loading.hide();
        Prism.highlightAll();
      }, 100);
    }
  }
}
</script>

<style lang="scss">
pre[class*='language-'] {
  padding: 1.5em 1em;
}
pre[class*='language-'] code {
  white-space: pre-wrap;
}
</style>
<style lang="scss" scoped>
.body--dark {
  .splitter {
    background: $dark;
  }
  .upload-button,
  .upload-img {
    background: $dark;
    border: solid 1px #ffffff;
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
}
.splitter {
  height: 100%;
}
.upload-button {
  width: 148px;
  height: 148px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
}
.upload-img {
  padding: 8px;
  border-radius: 4px;
}
</style>
