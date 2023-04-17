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
                <!-- permissionList -->
                <div v-if="col.name === 'permissionList'">
                  <q-badge color="primary" v-for="(item, index) in permissionList(props.row.permissionList)" :key="index" class="q-mr-sm">{{ item }} </q-badge>
                </div>
                <!-- action -->
                <div v-if="col.name === 'action'">
                  <div>
                    <span class="in-table-link-button" @click="handlerClickUpdate(props.row)" v-if="canUpdate(props.row)" :class="{ 'm-r-8': canUpdate(props.row) }">{{ $t(`action.update`) }} </span>
                    <span class="in-table-delete-button" @click="handlerClickDelete(props.row)" v-if="canDelete(props.row)" :class="{ 'm-r-8': canDelete(props.row) }">{{ $t(`action.delete`) }} </span>
                  </div>
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
    </div>
    <RightPanel ref="addUpdatePannel" @isOpen="dialogAddUpdateBeforeHideEvent" :title="dialogAddUpdateParams.title">
      <q-form class="row q-col-gutter-x-md q-pa-md" :ref="dialogAddUpdateParams.id" v-if="dialogAddUpdateParams.visiable">
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
          <MyFormInput
            v-if="item.type === 'text'"
            :option="{
              model: dialogAddUpdateParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
              readonly: item.readonly || false,
            }"
            @input="(data) => (dialogAddUpdateParams.params[item.model] = data)"
          >
          </MyFormInput>
        </div>
        <div class="full-width" v-if="dialogAddUpdateParams.select.length">
          <div class="f-bold fs-12 q-my-md row items-center">
            <span class="q-mr-sm">* 权限选择</span>
            <div class="q-mr-sm">
              <q-checkbox dense v-model="dialogAddUpdateParams.isAllCheck" :label="dialogAddUpdateParams.isAllCheck ? '取消全选' : '全选'" @update:model-value="monitorAllChecked" />
            </div>
          </div>
          <q-tree
            v-if="!dialogAddUpdateParams.getDataLoading"
            :nodes="dialogAddUpdateParams.select"
            node-key="value"
            accordion
            ref="qtree"
            label-key="label"
            tick-strategy="leaf"
            no-nodes-label="暂无数据"
            v-model:selected="dialogAddUpdateParams.selected"
            v-model:ticked="dialogAddUpdateParams.ticked"
            v-model:expanded="dialogAddUpdateParams.expanded"
            icon="app:navigation-arrow-right"
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <span>{{ prop.node.label }}</span>
              </div>
            </template>
            <template v-slot:header-api="prop">
              <div class="row items-center">
                <span>{{ prop.node.label }}</span>
              </div>
            </template>
            <template v-slot:header-view="prop">
              <div class="row items-center">
                <span>{{ prop.node.label }}</span>
              </div>
            </template>
          </q-tree>
        </div>
        <div class="row items-center justify-center full-width q-mt-md">
          <q-btn label="确定" @click="dialogAddUpdateConfirmEvent" style="width: 120px" color="primary" :loading="dialogAddUpdateParams.clickLoading"></q-btn>
        </div>
      </q-form>
    </RightPanel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { UserModule } from '../../store/modules/user';
import setting from 'src/setting.json';
import { cloneDeep, uniq, compact } from 'lodash';
import { getCurrentInstance } from 'vue';
import { defaultFill } from 'src/utils/tools';
import { AccountModule } from 'src/store/modules/account';
const CONST_PARAMS: any = {
  dialog_add_update: { name: '', id: '', description: '', permissionList: [] },
};
@Component({
  name: 'AccountRoleComponent',
})
export default class AccountRoleComponent extends Vue {
  $refs: any;
  get canUpdate() {
    return (row: any) => {
      return row.name !== 'ADMIN';
    };
  }
  get canDelete() {
    return (row: any) => {
      return row.name !== 'ADMIN';
    };
  }
  get permissionList() {
    return (data: any) => {
      return data ? data : [];
    };
  }
  @Watch('dialogAddUpdateParams.ticked', { deep: true })
  onPermissionListChange(newVal: any) {
    if (!newVal.length) {
      this.dialogAddUpdateParams.isAllCheck = false;
      return;
    }
    try {
      if (newVal.toString() === this.dialogAddUpdateParams.permissionViewTreeId.toString()) {
        this.dialogAddUpdateParams.isAllCheck = true;
      } else {
        this.dialogAddUpdateParams.isAllCheck = false;
      }
    } catch (error) {
      this.dialogAddUpdateParams.isAllCheck = false;
    }
  }
  /**params */
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  async created() {
    this.getData();
    this.getAllPermission();
  }
  public tableParams = {
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
        label: '角色名',
        align: 'left',
        field: (row: any) => row.name,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'description',
        label: '描述',
        align: 'left',
        field: (row: any) => row.description,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'permissionList',
        label: '权限',
        align: 'left',
        inSlot: true,
      },
      {
        name: 'createTime',
        label: '创建时间',
        align: 'left',
        field: (row: any) => row.createTime,
        format: (val: any) => `${this.globals.parseTime(val)}`,
      },
      {
        name: 'updateTime',
        label: '更新时间',
        align: 'left',
        field: (row: any) => row.updateTime,
        format: (val: any) => `${this.globals.parseTime(val)}`,
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
  public dialogAddUpdateParams = {
    id: 'dialog_add_update',
    dialogType: 'add',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    isAllCheck: false,
    selected: [],
    ticked: [],
    expanded: [],
    select: [],
    permissionViewTreeId: [],
    orginData: [],
    title: '',
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
        readonly: false,
        label: '用户名',
      },
      {
        model: 'description',
        type: 'text',
        rules: [],
        label: '描述',
      },
    ],
  };
  /* event */
  public handleClickAdd() {
    const index = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'name');
    this.dialogAddUpdateParams.input[index].readonly = false;
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'add';
    this.dialogAddUpdateParams.title = 'Add';
    this.$nextTick(() => {
      this.$refs['addUpdatePannel'].isOpened = true;
    });
  }
  public handlerClickUpdate(row: any) {
    this.dialogAddUpdateParams.params.id = row.id;
    const index = this.dialogAddUpdateParams.input.findIndex((item: any) => item.model === 'name');
    this.dialogAddUpdateParams.input[index].readonly = true;
    this.dialogAddUpdateParams.visiable = true;
    this.dialogAddUpdateParams.dialogType = 'update';
    this.dialogAddUpdateParams.title = 'Update';
    this.$nextTick(() => {
      this.$refs['addUpdatePannel'].isOpened = true;
    });
    this.dialogAddUpdateParams.ticked = row.permissionList ? row.permissionList : [];
    this.dialogAddUpdateParams.params.name = row.name;
    this.dialogAddUpdateParams.params.description = row.description;
  }
  public dialogAddUpdateBeforeHideEvent(visiable: boolean) {
    if (!visiable) {
      this.dialogAddUpdateParams.params.id = '';
      this.dialogAddUpdateParams.params.name = '';
      this.dialogAddUpdateParams.params.description = '';
      this.dialogAddUpdateParams.params.permissionList = [];
      this.dialogAddUpdateParams.ticked = [];
      this.dialogAddUpdateParams.isAllCheck = false;
      this.dialogAddUpdateParams.visiable = false;
    }
  }
  public monitorAllChecked(newVal: boolean) {
    if (newVal) {
      this.dialogAddUpdateParams.ticked = this.dialogAddUpdateParams.permissionViewTreeId;
    } else {
      this.dialogAddUpdateParams.ticked = [];
    }
  }
  /* http */
  public async getData() {
    try {
      this.tableParams.loading = true;
      const { pageData } = await AccountModule.getAllRole({});
      if (pageData && pageData.length > 0) {
        this.tableParams.data = pageData;
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
  public async getAllPermission() {
    function buildHierarchy(originalArray: any, parentId = null): any {
      const hierarchy = [];
      const children = originalArray.filter((item: any) => item.parent === parentId);
      for (const child of children) {
        const childNode = {
          id: child.id,
          label: child.label,
          value: child.value,
          description: child.description,
          children: buildHierarchy(originalArray, child.value),
        };
        hierarchy.push(childNode);
      }
      return hierarchy;
    }
    try {
      const { pageData } = await AccountModule.getAllPermission({});
      if (pageData && pageData.length > 0) {
        for (let item of pageData) {
          (this.dialogAddUpdateParams.permissionViewTreeId as any).push(item.value);
        }
        this.dialogAddUpdateParams.orginData = pageData;
        const tree = buildHierarchy(pageData);
        this.dialogAddUpdateParams.select = tree;
      }
    } finally {
      return Promise.resolve();
    }
  }
  public async dialogAddUpdateConfirmEvent() {
    if (!this.dialogAddUpdateParams.ticked.length) {
      this.$globalMessage.show({
        type: 'error',
        content: '请选择权限',
      });
      return;
    }
    try {
      this.$refs[this.dialogAddUpdateParams.id].validate().then(async (valid: boolean) => {
        if (valid) {
          const arr: any = [];
          for (let item of this.dialogAddUpdateParams.ticked) {
            const obj: any = this.dialogAddUpdateParams.orginData.find((data: any) => {
              return data.value === item;
            });
            if (obj) {
              arr.push(obj.parent);
            }
          }
          if (this.dialogAddUpdateParams.dialogType === 'add') {
            await AccountModule.addRole({
              name: this.dialogAddUpdateParams.params.name,
              description: this.dialogAddUpdateParams.params.description,
              permissionList: compact(uniq(this.dialogAddUpdateParams.ticked.concat(arr))),
            });
          }
          if (this.dialogAddUpdateParams.dialogType === 'update') {
            await AccountModule.updateRole({
              id: this.dialogAddUpdateParams.params.id,
              description: this.dialogAddUpdateParams.params.description,
              permissionList: compact(uniq(this.dialogAddUpdateParams.ticked.concat(arr))),
            });
          }
          this.$globalMessage.show({
            type: 'success',
            content: this.$t('messages.success'),
          });
          this.dialogAddUpdateParams.clickLoading = false;
          this.dialogAddUpdateParams.visiable = false;
          this.$refs['addUpdatePannel'].isOpened = false;
          this.getData();
        }
      });
    } catch (error) {
      console.log(error);
      this.$refs['addUpdatePannel'].isOpened = false;
      this.dialogAddUpdateParams.clickLoading = false;
    }
  }
  public async handlerClickDelete(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await AccountModule.deleteRole({
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
}
</script>

<style scoped lang="scss"></style>
