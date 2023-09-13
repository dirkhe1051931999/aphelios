<template>
  <div>
    <div class="row items-center justify-end q-mb-md">
      <q-btn class="q-mr-md" color="primary" label="新增" @click="handleClickAdd" />
      <q-btn class="q-mr-md" color="primary" label="保存" @click="handleClickSave" :disable="!isSorted" />
    </div>
    <q-inner-loading style="min-height: 300px" :showing="tableParams.loading"></q-inner-loading>
    <div id="listWithHandle" class="list-group" v-if="!tableParams.loading && tableParams.data.length">
      <div class="list-group-item row thin-shadow q-mb-md q-pa-sm items-center h-60" v-for="item in tableParams.data" :key="item.name">
        <q-icon name="drag_indicator" class="move" size="20px"></q-icon>
        <span v-if="!dialogAddParams.showEdit[item.id]" class="q-ml-md">{{ item.name }}</span>
        <TextToInput
          class="inline-block w-300 q-ml-md"
          v-if="dialogAddParams.showEdit[item.id]"
          :value="dialogAddParams.param[item.id]"
          :that="item.id"
          :loading="dialogAddParams.loading[item.id]"
          @confirm="textToInputConfirmForEmail"
          @close="textToInputCloseForEmail"
        >
        </TextToInput>
        <span class="link-type q-ml-sm" @click="toPostList(item)">({{ item.count }})</span>
        <div class="q-ml-xl">
          <q-checkbox v-model="item.visible" @update:model-value="updateChannelVisible(item)" :true-value="'1'" :false-value="'0'" label="web接口是否可见" left-label dense></q-checkbox>
          <span class="link-type q-ml-sm" v-if="!dialogAddParams.showEdit[item.id]" @click="(dialogAddParams.showEdit[item.id] = true), (dialogAddParams.param[item.id] = item.name || '')">修改 </span>
          <span class="delete-type q-ml-sm" @click="handlerClickDelete(item)">删除 </span>
        </div>
      </div>
    </div>
    <div v-else>暂无数据</div>
    <MyDialog
      :option="{
        id: dialogAddParams.id,
        dialogType: dialogAddParams.dialogType,
        clickLoading: dialogAddParams.clickLoading,
        getDataLoading: dialogAddParams.getDataLoading,
        visiable: dialogAddParams.visiable,
        title: dialogAddParams.title,
        params: dialogAddParams.params,
      }"
      width="30vw"
      @close="dialogAddCloseEvent"
      @confirm="dialogAddConfirmEvent"
      @before-hide="dialogAddBeforeHideEvent"
    >
      <div class="row q-col-gutter-x-md">
        <div v-for="(item, index) in dialogAddParams.input" :key="index" class="col-12">
          <MyFormSelect
            v-if="item.type === 'select'"
            :option="{
              inputId: `${dialogAddParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              userInput: true,
            }"
            @input="(data) => (dialogAddParams.params[item.model] = data)"
          />
          <MyFormInput
            v-if="item.type === 'text'"
            :option="{
              model: dialogAddParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
            }"
            @input="(data) => (dialogAddParams.params[item.model] = data)"
          >
          </MyFormInput>
        </div>
      </div>
    </MyDialog>
  </div>
</template>

<script lang="ts">
import { cloneDeep, isEqual, differenceWith } from 'lodash';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { defaultFill } from 'src/utils/tools';
import { getCurrentInstance } from 'vue';
import { BlogPostModule } from 'src/store/modules/blog-post';
import Sortable from 'sortablejs';

const CONST_PARAMS: any = {
  dialog_add_update: { name: '', pos: 0 },
};

@Component({
  name: 'BlogPostChannelComponent',
  components: {},
})
export default class BlogPostChannelComponent extends Vue {
  /**instance */
  declare $refs: any;

  get channelNameList() {
    return (data: any) => {
      return data.map((item: any) => item.name);
    };
  }

  get channelIndexList() {
    return (data: any) => {
      return data.map((item: any) => item.pos);
    };
  }

  get isSorted() {
    return !isEqual(this.tableParams.data, this.tableParams.oldData);
  }

  mounted() {
    // List with handle
    this.getData();
  }

  /**params */
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public tableParams = {
    loading: false,
    data: [],
    oldData: [],
  };
  public dialogAddParams = {
    id: 'dialog_add_update',
    dialogType: 'add',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    showEdit: {},
    param: {},
    loading: {},
    params: cloneDeep(CONST_PARAMS.dialog_add_update),
    input: [
      {
        model: 'name',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '频道名',
      },
    ],
  };

  /* event */
  public handleClickAdd() {
    this.dialogAddParams.visiable = true;
    this.dialogAddParams.dialogType = 'add';
    this.dialogAddParams.title = 'Add';
  }

  public dialogAddCloseEvent(data: { type: string }) {
    this.dialogAddParams.visiable = false;
  }

  public dialogAddBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogAddParams.params = data.params;
    }
  }

  public toPostList(item: any) {
    this.$router.push(`/blog-post/list?channelId=${item.id}`);
  }

  /* http */
  public async getData() {
    try {
      this.tableParams.loading = true;
      const { pageData } = await BlogPostModule.getAllChannel({});
      if (pageData && pageData.length > 0) {
        this.tableParams.data = pageData;
        this.tableParams.oldData = cloneDeep(pageData);
        let showEdit: any = this.dialogAddParams.showEdit;
        let param: any = this.dialogAddParams.param;
        let loading: any = this.dialogAddParams.loading;
        for (let item of this.tableParams.oldData as any) {
          showEdit[item.id] = false;
          param[item.id] = '';
          loading[item.id] = false;
        }
        this.$nextTick(() => {
          Sortable.create(document.querySelector('#listWithHandle'), {
            animation: 150,
            // Called by any change to the list (add / update / remove)
            onSort: (event: any) => {
              let { oldIndex, newIndex } = event;
              const data: any = cloneDeep(this.tableParams.data);
              let temp = data[oldIndex];
              data[oldIndex] = data[newIndex];
              data[newIndex] = temp;
              for (let i = 0; i < data.length; i++) {
                data[i].pos = i + 1;
              }
              this.tableParams.data = data;
            },
          });
        });
      } else {
        this.tableParams.data = [];
      }
      this.tableParams.loading = false;
    } catch (error) {
      this.tableParams.loading = false;
    } finally {
      return Promise.resolve();
    }
  }

  public async handleClickSave() {
    const diff = differenceWith(this.tableParams.data, this.tableParams.oldData, isEqual);
    if (diff.length > 0) {
      try {
        const result = await this.$globalConfirm.show({
          title: '友情提示',
          color: 'primary',
          content: '确定吗？老铁！？',
          confirmButtonText: '非常确定',
        });
        if (result) {
          await BlogPostModule.updateChannelPos({
            diff,
          });
          this.$globalMessage.show({
            type: 'success',
            content: this.$t('messages.success'),
          });
          this.getData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async textToInputConfirmForEmail({ value, that }: { value: string; that: any }) {
    let showEdit: any = this.dialogAddParams.showEdit;
    let param: any = this.dialogAddParams.param;
    let loading: any = this.dialogAddParams.loading;
    loading[that] = true;
    try {
      await BlogPostModule.updateChannelName({
        id: that,
        name: value,
      });
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    } catch (error) {
      console.log(error);
    }
    loading[that] = false;
    showEdit[that] = false;
  }

  public textToInputCloseForEmail({ value, that }: { value: string; that: any }) {
    let showEdit: any = this.dialogAddParams.showEdit;
    let param: any = this.dialogAddParams.param;
    let loading: any = this.dialogAddParams.loading;
    showEdit[that] = false;
  }

  public async handlerClickDelete(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
      });
      if (result) {
        await BlogPostModule.removeChannel({
          id: row.id,
        });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getData();
      }
    } catch (error) {}
  }

  public async dialogAddConfirmEvent() {
    try {
      this.dialogAddParams.clickLoading = true;
      await BlogPostModule.addChannel({
        name: this.dialogAddParams.params.name,
      });
      this.dialogAddParams.clickLoading = false;
      this.dialogAddParams.visiable = false;
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    } catch (error) {
      this.dialogAddParams.clickLoading = false;
    }
  }

  public async updateChannelVisible(row: any) {
    try {
      await BlogPostModule.updateChannelVisible({
        id: row.id,
        visible: row.visible,
      });
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
<style lang="scss" scoped></style>
