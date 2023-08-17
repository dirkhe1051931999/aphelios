<template>
  <div>
    <div class="query-form-and-action">
      <q-form ref="queryFrom">
        <div class="row">
          <div class="row items-start">
            <div v-for="(item, index) in queryParams.input" :key="index">
              <q-input
                v-model.trim="queryParams.params[item.id]"
                :type="item.inputType"
                :class="['', item.class]"
                :label="item.placeholder"
                v-if="item.type === 'text'"
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
              <q-select
                v-if="item.type === 'select'"
                :class="['', item.class]"
                v-model="queryParams.params[item.id]"
                :options="item.selectOption"
                :label="item.placeholder"
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
          </div>
          <div>
            <q-btn color="primary" icon="search" :label="$t('action.search')" no-caps class="m-r-15" :loading="queryParams.queryLoading" @click="handleQuery" />
            <q-btn icon="restart_alt" :label="$t('action.reset')" outline color="primary" no-caps :loading="queryParams.resetLoading" @click="handleResetQuery" />
          </div>
        </div>
      </q-form>
    </div>
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
        :selected-rows-label="(numberOfRows) => `select ${numberOfRows} ${$t(`table.per`)}`"
        selection="multiple"
        v-model:selected="tableParams.selected"
        row-key="id"
        @request="sortTableData"
        binary-state-sort
      >
        <template #top>
          <div class="full-width justify-end row">
            <q-btn color="negative" label="批量拉黑" no-caps @click="batchBan" outline :disable="!this.tableParams.selected.length" />
            <q-btn color="negative" label="批量删除" no-caps @click="batchDelte" outline class="q-ml-md" :disable="!this.tableParams.selected.length" />
            <q-btn color="primary" label="批量恢复" no-caps @click="batchRecover" outline class="q-ml-md" :disable="!this.tableParams.selected.length" />
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <!-- selected -->
            <q-th style="text-align: left; width: 50px">
              <q-checkbox color="primary" v-model="props.selected" />
            </q-th>
            <!-- other -->
            <q-th v-for="col in props.cols" :key="col.name" :props="props" style="text-align: left">
              <div v-if="col.name === 'unlike'">
                {{ col.label }}
                <q-icon name="arrow_upward" size="14px" v-show="queryParams.params.orderProperty === 'unlike' && queryParams.params.orderDir === 'ASC'" />
                <q-icon name="arrow_downward" size="14px" v-show="queryParams.params.orderProperty === 'unlike' && queryParams.params.orderDir === 'DESC'" />
              </div>
              <span v-else>{{ col.label.indexOf('$') !== -1 ? $t(`table.${col.label.replace('$', '')}`) : col.label }}</span>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:header-cell-action="props">
          <q-th :props="props"> </q-th>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- selected -->
            <q-td class="text-left">
              <q-checkbox color="primary" v-model="props.selected" />
            </q-td>
            <!-- other -->
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-left">
              <span v-if="!col.inSlot">{{ col.value }}</span>
              <div class="text-left" v-else>
                <!-- status -->
                <div v-if="col.name === 'unlike'" class="row items-center">
                  <q-icon name="thumb_down" class="q-mr-sm"></q-icon>
                  {{ props.row.unlike }}
                </div>
                <!-- status -->
                <div v-if="col.name === 'status'">
                  <span v-if="props.row.status === 1" class="my-status green">正常</span>
                  <span v-if="props.row.status === 2" class="my-status red">拉黑</span>
                  <span v-if="props.row.status === 3" class="my-status red">删除</span>
                </div>
                <!-- content -->
                <div v-if="col.name === 'content'" class="row items-center">
                  <div style="min-width: 100px; max-width: 1000px; overflow-wrap: pre-wrap">{{ props.row.content }}</div>
                  <div class="q-ml-md">
                    <span class="in-table-delete-button" @click="handlerClickBan(props.row)" v-if="props.row.status === 1">拉黑 </span>
                    <span class="in-table-delete-button q-ml-md" @click="handlerClickDelete(props.row)" v-if="props.row.status === 1">删除 </span>
                    <span class="in-table-link-button" @click="handlerClickRecover(props.row)" v-if="props.row.status === 2 || props.row.status === 3">恢复正常</span>
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
      <MyPagination :paginationParams="tableParams.pagination" v-if="tableParams.pagination.rowsNumber > 0" @pagination="paginationInput"></MyPagination>
    </div>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { getCurrentInstance } from 'vue';
import { AuditModule } from 'src/store/modules/audit';

const CONST_PARAMS: any = {
  query: { status: '', orderProperty: '', orderDir: 'ASC' /* DESC:降序 ,ASC:升序 */ },
};

@Component({ name: 'MyAudioCommentPage' })
export default class MyAudioCommentPage extends Vue {
  /**instance */
  declare $refs: any;
  mounted() {
    this.getData();
  }
  /**params */
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public queryParams: any = {
    id: 'query',
    queryLoading: false,
    resetLoading: false,
    params: cloneDeep(CONST_PARAMS.query),
    input: [
      {
        placeholder: '状态',
        type: 'select',
        class: 'w-250 m-r-15 m-b-15',
        selectOption: [
          {
            label: '正常',
            value: '1',
          },
          {
            label: '拉黑',
            value: '2',
          },
          {
            label: '删除',
            value: '3',
          },
        ],
        id: 'status',
      },
    ],
  };
  public tableParams = {
    selected: [],
    loading: false,
    data: [],
    pagination: {
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 0,
    },
    column: [
      {
        name: 'unlike',
        label: '踩',
        align: 'left',
        sortable: true,
        inSlot: true,
      },
      {
        name: 'status',
        label: '状态',
        inSlot: true,
      },
      {
        name: 'postTime',
        label: '评论时间',
        align: 'left',
        field: (row: any) => row.postTime,
        format: (val: any) => `${this.globals.parseTime(val)}`,
      },
      {
        name: 'content',
        label: '评论',
        align: 'left',
        inSlot: true,
      },
    ],
  };

  /**event */
  public paginationInput(data: any) {
    this.tableParams.pagination = data;
    this.getData();
  }
  public async handleQuery() {
    this.queryParams.queryLoading = true;
    this.tableParams.pagination.page = 1;
    await this.getData();
    this.queryParams.queryLoading = false;
  }
  public async handleResetQuery() {
    this.queryParams.resetLoading = true;
    this.queryParams.params = cloneDeep(CONST_PARAMS.query);
    this.tableParams.pagination.page = 1;
    await this.getData();
    this.queryParams.resetLoading = false;
  }
  public sortTableData(props: any) {
    try {
      const { sortBy } = props.pagination;
      this.tableParams.pagination.page = 1;
      this.queryParams.params.orderProperty = sortBy;
      this.queryParams.params.orderDir = this.queryParams.params.orderDir === 'DESC' ? 'ASC' : 'DESC';
      this.getData();
    } catch (error) {
      console.log(error);
    }
  }
  /**http */
  public async getData() {
    try {
      this.tableParams.loading = true;
      const { pageData, total } = await AuditModule.getPostAllCommnet({
        orderProperty: this.queryParams.params.orderProperty,
        orderDir: this.queryParams.params.orderDir,
        status: this.queryParams.params.status,
        page: this.tableParams.pagination.page,
        rowsPerPage: this.tableParams.pagination.rowsPerPage,
      });
      if (pageData && pageData.length) {
        this.tableParams.data = pageData;
        this.tableParams.pagination.rowsNumber = total;
      } else {
        this.tableParams.data = [];
        this.tableParams.pagination.rowsNumber = 0;
      }
      this.tableParams.loading = false;
    } catch (error) {
      this.tableParams.loading = false;
    } finally {
      return Promise.resolve();
    }
  }
  public async batchBan() {
    let ids: any[] = [];
    this.tableParams.selected.forEach((item: any) => {
      if (item.status === 1) {
        ids.push(item.id);
      }
    });
    if (!ids.length) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择正常状态的评论',
      });
      return;
    }
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await AuditModule.setPostCommentStatus({ id: ids, status: 2 });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.tableParams.selected = [];
        this.getData();
      }
    } catch (error) {}
  }
  public async batchDelte() {
    let ids: any[] = [];
    this.tableParams.selected.forEach((item: any) => {
      if (item.status === 1) {
        ids.push(item.id);
      }
    });
    if (!ids.length) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择正常状态的评论',
      });
      return;
    }
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await AuditModule.setPostCommentStatus({ id: ids, status: 3 });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.tableParams.selected = [];
        this.getData();
      }
    } catch (error) {}
  }
  public async batchRecover() {
    let ids: any[] = [];
    this.tableParams.selected.forEach((item: any) => {
      if (item.status === 2 || item.status === 3) {
        ids.push(item.id);
      }
    });
    if (!ids.length) {
      this.$globalMessage.show({
        type: 'warning',
        content: '请选择拉黑或删除状态的评论',
      });
      return;
    }
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await AuditModule.setPostCommentStatus({ id: ids, status: 1 });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.tableParams.selected = [];
        this.getData();
      }
    } catch (error) {}
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
        await AuditModule.setPostCommentStatus({ id: row.id, status: 3 });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getData();
      }
    } catch (error) {}
  }
  public async handlerClickBan(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await AuditModule.setPostCommentStatus({ id: row.id, status: 2 });
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getData();
      }
    } catch (error) {}
  }
  public async handlerClickRecover(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await AuditModule.setPostCommentStatus({ id: row.id, status: 1 });
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
<style lang="scss">
th.sortable i.q-table__sort-icon {
  display: none;
}
</style>
<style lang="scss" scoped></style>
