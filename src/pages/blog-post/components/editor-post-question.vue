<template>
  <q-dialog v-model="dialogEditorParams.model" transition-show="jump-up" transition-hide="jump-down" full-height @hide="hide">
    <q-card class="editor-question-card">
      <q-card-section class="row items-center">
        给
        <div class="q-mx-sm border-all b-r-6 q-pa-sm bold">
          <span class="q-pa-xs b-r-100 bg-grey-2 border-all">
            <q-icon :name="postTypeSvgName(postDetailQuestion.row)" size="18px"> </q-icon>
          </span>
          <span class="q-mx-sm fs-16"> {{ postDetailQuestion.row.title }}</span>
        </div>
        添加问卷
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="post-content" v-html="dialogEditorParams.params.content"></div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-form class="post-form" :ref="dialogEditorParams.id">
          <div v-for="(item, index) in dialogEditorParams.input" :key="index" class="col-6">
            <MyFormSelect
              v-if="item.type === 'select'"
              :option="{
                inputId: `${dialogEditorParams.id}-select-${item.model}`,
                rules: item.rules,
                classes: item.classes,
                model: dialogEditorParams.params[item.model],
                label: item.label,
                inputSelectOption: item.inputSelectOption,
                userInput: true,
              }"
              @input="(data) => (dialogEditorParams.params[item.model] = data)"
            />
            <MyFormDateRange
              v-if="item.type === 'date'"
              :option="{
                rules: item.rules,
                classes: item.classes,
                model: dialogEditorParams.params[item.model],
                dateRange: dialogEditorParams.params[item.dateRange],
                label: item.label,
              }"
              @input="(data) => (dialogEditorParams.params[item.model] = data)"
            />
            <MyFormDateRangeWithTime
              v-if="item.type === 'date-time'"
              :ref="dialogEditorParams.id + '-date-time-' + item.model"
              :option="{
                rules: item.rules,
                classes: item.classes,
                startModel: dialogEditorParams.params[item.startModel],
                endModel: dialogEditorParams.params[item.endModel],
                model: dialogEditorParams.params[item.model],
                label: item.label,
              }"
            />
            <MyFormSlider
              v-if="item.type === 'slider'"
              :option="{
                rules: item.rules,
                classes: item.classes,
                model: dialogEditorParams.params[item.model],
                label: item.label,
                min: item.min,
                max: item.max,
                step: item.step,
              }"
            />
            <MyFormRadio
              v-if="item.type === 'radio'"
              :option="{
                inputId: `${dialogEditorParams.id}-select-${item.model}`,
                rules: item.rules,
                classes: item.classes,
                model: dialogEditorParams.params[item.model],
                label: item.label,
                inputSelectOption: item.inputSelectOption,
                disable: item.disable,
              }"
              @input="(data) => (dialogEditorParams.params[item.model] = data)"
            />
            <MyFormMultipleSelect
              v-if="item.type === 'multiple-select'"
              :option="{
                inputId: `${dialogEditorParams.id}-multiple-select-${item.model}`,
                rules: item.rules,
                classes: item.classes,
                model: dialogEditorParams.params[item.model],
                label: item.label,
                inputSelectOption: item.inputSelectOption,
                multiple: item.multiple,
                userInput: true,
              }"
              @input="(data) => (dialogEditorParams.params[item.model] = data)"
            >
              <template #subTitle>
                <el-popover placement="top" title="popover-title" :width="320" popper-style="z-index:9999" trigger="hover">
                  <p v-for="(item, index) in ['test1', 'test2', 'test3']" :key="index">{{ index + 1 }}. {{ item }}</p>
                  <template #reference>
                    <q-icon name="o_info" class="text-grey-4 cursor-pointer" />
                  </template>
                </el-popover>
              </template>
            </MyFormMultipleSelect>
            <MyFormInput
              v-if="item.type === 'text'"
              :option="{
                model: dialogEditorParams.params[item.model],
                rules: item.rules,
                classes: item.classes,
                label: item.label,
              }"
              @input="(data) => (dialogEditorParams.params[item.model] = data)"
            >
              <template #subTitle v-if="item.subTitle">
                <el-popover placement="top" title="popover-title" :width="320" popper-style="z-index:9999" trigger="hover">
                  <p v-for="(item, index) in ['test1', 'test2', 'test3']" :key="index">{{ index + 1 }}. {{ item }}</p>
                  <template #reference>
                    <q-icon name="o_info" class="text-grey-4 cursor-pointer" />
                  </template>
                </el-popover>
              </template>
            </MyFormInput>
            <MyMaskInput
              v-if="item.type === 'mask-input'"
              :option="{
                model: dialogEditorParams.params[item.model],
                rules: item.rules,
                classes: item.classes,
                label: item.label,
                mask: '####/####/####/####',
                hint: '####/####/####/####',
              }"
              @input="(data) => (dialogEditorParams.params[item.model] = data)"
            >
            </MyMaskInput>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="post-question">
          <div v-for="(item, index) in dialogEditorParams.params.solutionList" :key="item.id" class="input-item">
            <div class="w-50">答案 {{ index + 1 }}</div>
            <q-input
              v-model.trim="item.model"
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
            <q-icon name="add_circle" size="32px" color="primary" class="cursor-pointer" @click="addSolution" v-if="index === dialogEditorParams.params.solutionList.length - 1"></q-icon>
            <q-icon name="remove_circle" size="32px" color="grey" class="cursor-pointer" @click="removeSolution" v-if="index > 1"></q-icon>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-center">
          <q-btn label="取消" color="grey-8" flat @click="hide" />
          <q-btn label="确定" color="primary" @click="handleClickConfirm" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import { BlogPostModule } from 'src/store/modules/blog-post';
import { commonPost } from 'src/mixins/post';
import { getCurrentInstance } from 'vue';
const CONST_PARAMS = {
  add_or_edit: {
    content: '',
    timeStart: '',
    timeEnd: '',
    time: '',
    status: '1',
    multipleOrSingle: '1',
    title: '',
    solutionList: [
      {
        id: Math.random().toString(36),
        model: '',
      },
      {
        id: Math.random().toString(36),
        model: '',
      },
    ],
  },
};

@Component({ name: 'myEditorPostQuestionComponent' })
export default class myEditorPostQuestionComponent extends commonPost {
  declare $refs: any;
  get isAddPost() {
    return BlogPostModule.postAddOrUpdateQuestion === 'add';
  }
  get blogEditorPostVisiableQuestion() {
    return BlogPostModule.blogEditorPostVisiableQuestion;
  }
  get postDetailQuestion() {
    console.log('postDetailQuestion', BlogPostModule.postDetailQuestion);
    return BlogPostModule.postDetailQuestion;
  }
  @Watch('blogEditorPostVisiableQuestion')
  watchBlogEditorPostVisiableQuestion(val: boolean) {
    if (val) {
      const row: any = BlogPostModule.postDetailQuestion.row;
      this.getContent(row.id).then((data: any) => {
        this.dialogEditorParams.params.content = data;
      });
      if (BlogPostModule.postAddOrUpdateQuestion === 'update') {
        this.dialogEditorParams.title = '编辑';
      } else {
        this.dialogEditorParams.title = '新增';
      }
      this.dialogEditorParams.model = true;
    }
  }
  public globals: any = getCurrentInstance()!.appContext.config.globalProperties;
  public dialogEditorParams: any = {
    id: 'dialog-post-question',
    model: false,
    title: '新增',
    params: cloneDeep(CONST_PARAMS.add_or_edit),
    input: [
      {
        model: 'time',
        startModel: 'timeStart',
        endModel: 'timeEnd',
        type: 'date-time',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '问卷时间',
      },
      {
        model: 'status',
        type: 'radio',
        inputSelectOption: [
          {
            label: '上线',
            value: '1',
          },
          {
            label: '下线',
            value: '0',
          },
        ],
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '问卷状态',
      },
      {
        model: 'multipleOrSingle',
        type: 'radio',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        inputSelectOption: [
          {
            label: '单选',
            value: '1',
          },
          {
            label: '多选',
            value: '0',
          },
        ],
        label: '单选还是多选',
      },
      {
        model: 'title',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '问卷标题',
      },
    ],
  };
  /* event */
  public hide() {
    this.dialogEditorParams.model = false;
    this.dialogEditorParams.params = cloneDeep(CONST_PARAMS.add_or_edit);
    BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_QUESTION(false);
  }
  public addSolution() {
    if (this.dialogEditorParams.params.solutionList.length > 4) {
      this.$globalMessage.show({
        type: 'error',
        content: '最多添加5个答案',
      });
      return;
    }
    this.dialogEditorParams.params.solutionList.push({
      id: Math.random().toString(36),
      model: '',
    });
  }
  public removeSolution() {
    this.dialogEditorParams.params.solutionList.pop();
  }
  /* http */
  public async getContent(id: string) {
    const data = await BlogPostModule.getPostContentById({ id: id });
    return Promise.resolve(data);
  }
  public handleClickConfirm() {
    this.$refs[this.dialogEditorParams.id].validate().then(async (valid: boolean) => {
      if (valid) {
        const result = await this.$globalConfirm.show({
          title: '友情提示',
          color: 'primary',
          content: '确定吗？老铁！？',
          confirmButtonText: '非常确定',
        });
        if (result) {
          console.log('handleClickConfirm', this.dialogEditorParams.params);
        }
      }
    });
  }
}
</script>

<style scoped lang="scss">
.editor-question-card {
  max-width: 80vw;
  width: 60vw;
  .post-content {
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0px 6px 16px -1px rgba($color: #000000, $alpha: 0.05);
    border-radius: 6px;
    padding: 16px;
  }
  .post-form {
    display: grid;
    grid-row-gap: 8px;
    box-shadow: 0px 6px 16px -1px rgba($color: #000000, $alpha: 0.05);
    border-radius: 6px;
    padding: 16px;
  }
  .post-question {
    box-shadow: 0px 6px 16px -1px rgba($color: #000000, $alpha: 0.05);
    border-radius: 6px;
    padding: 16px;
    .input-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .q-input {
        width: 45%;
        margin: 0 16px;
      }
    }
  }
}
</style>
