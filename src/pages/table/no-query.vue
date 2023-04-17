<template>
  <div>
    <div class="thin-shadow q-pa-md">
      <q-table
        flat
        bordered
        :columns="tableParams.column"
        :rows="tableParams.data"
        :loading="tableParams.loading"
        :pagination="tableParams.pagination"
        hide-pagination
        :no-data-label="$t(`tip.noData`)"
        class="my-table"
      >
        <template #top>
          <div class="full-width justify-end row">
            <q-btn color="primary" icon="o_add" label="Add" no-caps @click="handleClickAdd" />
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <!-- other -->
            <q-th v-for="col in props.cols" :key="col.name" :props="props" style="text-align: left">
              {{ col.label.indexOf('$') !== -1 ? $t(`table.${col.label.replace('$', '')}`) : col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:header-cell-action="props">
          <q-th :props="props"> </q-th>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- other -->
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-left">
              <span v-if="!col.inSlot">{{ col.value }}</span>
              <div class="text-left" v-else>
                <!-- name -->
                <div v-if="col.name === 'name'">
                  <span class="link-type">{{ props.row.name }}</span>
                </div>
                <!-- action -->
                <div v-if="col.name === 'action'">
                  <span class="in-table-link-button" @click="handlerClickUpdate(props.row)">{{ $t(`action.update`) }} </span>
                  <span class="in-table-delete-button m-l-10" @click="handlerClickDelete(props.row)">{{ $t(`action.delete`) }} </span>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
        <!--      loading-->
        <template v-slot:loading>
          <q-inner-loading color="primary" showing />
        </template>
      </q-table>
      <MyPagination :paginationParams="tableParams.pagination" v-if="tableParams.pagination.rowsNumber > 0" @pagination="paginationInput"></MyPagination>
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
      }"
      @close="dialogAddUpdateCloseEvent"
      @confirm="dialogAddUpdateConfirmEvent"
      @before-hide="dialogAddUpdateBeforeHideEvent"
    >
      <div class="row q-col-gutter-x-md">
        <div v-for="(item, index) in dialogAddUpdateParams.input" :key="index" class="col-6">
          <MyFormSelect
            v-if="item.type === 'select'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              userInput: true,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormDateRange
            v-if="item.type === 'date'"
            :option="{
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              dateRange: dialogAddUpdateParams.params[item.dateRange],
              label: item.label,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormDateRangeWithTime
            v-if="item.type === 'date-time'"
            :ref="dialogAddUpdateParams.id + '-date-time-' + item.model"
            :option="{
              rules: item.rules,
              classes: item.classes,
              startModel: dialogAddUpdateParams.params[item.startModel],
              endModel: dialogAddUpdateParams.params[item.endModel],
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
            }"
          />
          <MyFormSlider
            v-if="item.type === 'slider'"
            :option="{
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              min: item.min,
              max: item.max,
              step: item.step,
            }"
          />
          <MyFormRadio
            v-if="item.type === 'radio'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              disable: item.disable,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormMultipleSelect
            v-if="item.type === 'multiple-select'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-multiple-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              multiple: item.multiple,
              userInput: true,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
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
              model: dialogAddUpdateParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          >
            <template #subTitle>
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
              model: dialogAddUpdateParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
              mask: '####/####/####/####',
              hint: '####/####/####/####',
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          >
          </MyMaskInput>
        </div>
      </div>
    </MyDialog>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { defaultFill } from 'src/utils/tools';
import { getCurrentInstance } from 'vue';

const CONST_PARAMS: any = {
  query: { a: '', b: '', c: '' },
  dialog_add_update: { a: '', b: '', c: '', d: [], e: '', e_dateRange: { from: '', to: '' }, f: '', g: '', g_startModel: '', g_endModel: '', h: 10, i: 'true' },
};

@Component({ name: 'BlogPostChannelComponent' })
export default class BlogPostChannelComponent extends Vue {
  /**instance */
  declare $refs: any;
  mounted() {
    this.getData();
  }
  /**params */
  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  private tableParams = {
    loading: false,
    data: [],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    column: [
      {
        name: 'name',
        label: 'Name',
        inSlot: true,
      },
      {
        name: 'sex',
        label: 'Sex',
        align: 'left',
        field: (row: any) => row.sex,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'c',
        label: 'Table4',
        align: 'left',
        field: (row: any) => row.c,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'd',
        label: 'Table5',
        align: 'left',
        field: (row: any) => row.d,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'e',
        label: 'Table6',
        align: 'left',
        field: (row: any) => row.e,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'f',
        label: 'Table7',
        align: 'left',
        field: (row: any) => row.f,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'g',
        label: 'Table8',
        align: 'left',
        field: (row: any) => row.g,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'h',
        label: 'Table9',
        align: 'left',
        field: (row: any) => row.h,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'i',
        label: 'Table10',
        align: 'left',
        field: (row: any) => row.i,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'action',
        label: '$action',
        field: 'action',
        align: 'left',
        inSlot: true,
      },
    ],
  };
  private dialogAddUpdateParams = {
    id: 'dialog_add_update',
    dialogType: 'add',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    params: cloneDeep(CONST_PARAMS.dialog_add_update),
    input: [
      {
        model: 'a',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: 'Username',
      },
      {
        model: 'c',
        type: 'select',
        inputSelectOption: [
          {
            label: 'option1',
            value: '1',
          },
          {
            label: 'option2',
            value: '2',
          },
        ],
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: 'select',
      },
    ],
  };
  /* event */
  private paginationInput(data: any) {
    this.tableParams.pagination = data;
    this.getData();
  }
  private handleClickAdd() {
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'add';
    this.dialogAddUpdateParams.title = 'Add';
  }
  private handlerClickUpdate(row: any) {
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'update';
    this.dialogAddUpdateParams.title = 'Update';
  }
  private dialogAddUpdateCloseEvent(data: { type: string }) {
    this.dialogAddUpdateParams.visiable = false;
  }
  private dialogAddUpdateBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogAddUpdateParams.params = data.params;
    }
  }
  /* http */
  private async getData() {
    try {
      this.tableParams.loading = true;
      this.tableParams.loading = false;
    } catch (error) {
      this.tableParams.loading = false;
    } finally {
      return Promise.resolve();
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
        // await HTTP_REQUEST()
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getData();
      }
    } catch (error) {}
  }
  private async dialogAddUpdateConfirmEvent() {
    try {
      this.dialogAddUpdateParams.clickLoading = true;
      // await HTTP_REQUEST()
      this.dialogAddUpdateParams.clickLoading = false;
      this.dialogAddUpdateParams.visiable = false;
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    } catch (error) {
      this.dialogAddUpdateParams.clickLoading = false;
    }
  }
}
</script>

<style lang="scss">
.body--dark {
  .my-table th:last-child,
  .my-table td:last-child {
    box-shadow: rgba($color: #ffffff, $alpha: 0.05) 0px 20px 27px 0px;
  }
}
.body--light {
  .my-table th:last-child,
  .my-table td:last-child {
    box-shadow: rgba($color: #000000, $alpha: 0.05) 0px 20px 27px 0px;
  }
}
.my-table {
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%;
}
.my-table thead tr:last-child th:last-child {
  /* bg color is important for th; just specify one */
  background-color: var(--my-white);
}
.my-table td:last-child {
  background-color: var(--my-white);
}
.my-table th:last-child,
.my-table td:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
}
</style>
<style lang="scss" scoped></style>
