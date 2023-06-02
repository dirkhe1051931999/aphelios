<template>
  <div>
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
                  <!-- authorId -->
                  <div v-if="col.name === 'authorId'">
                    <span class="link-type">{{ props.row.authorId }}</span>
                  </div>
                  <!-- status -->
                  <div v-if="col.name === 'status'">
                    <span class="my-status grey" v-if="props.row.status === 0">审核中</span>
                    <span class="my-status green" v-if="props.row.status === 1">已通过</span>
                    <span class="my-status red" v-if="props.row.status === 2">未通过 </span>
                  </div>
                  <!-- pdf -->
                  <div v-if="col.name === 'pdf'">
                    <a :href="props.row.companyLicense" target="__blank" class="link-type">预览</a>
                  </div>
                  <!-- action -->
                  <div v-if="col.name === 'action'">
                    <span class="in-table-link-button" @click="handlerClickPass(props.row)">通过 </span>
                    <span class="in-table-delete-button q-ml-md" @click="handlerClickReject(props.row)">不通过 </span>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { defaultFill } from 'src/utils/tools';
import { getCurrentInstance } from 'vue';
import { AuditModule } from 'src/store/modules/audit';

@Component({ name: 'MyCompanyCertificationComponent' })
export default class MyCompanyCertificationComponent extends Vue {
  /**instance */
  declare $refs: any;
  mounted() {
    this.getData();
  }
  /**params */
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
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
        name: 'authorId',
        label: '作者',
        inSlot: true,
      },
      {
        name: 'status',
        label: '状态',
        inSlot: true,
      },
      {
        name: 'failMessage',
        label: '错误原因',
        align: 'left',
        field: (row: any) => row.failMessage,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'pdf',
        label: 'PDF',
        inSlot: true,
      },
      {
        name: 'companyName',
        label: '公司名',
        align: 'left',
        field: (row: any) => row.companyName,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'companyCode',
        label: '统一社会信用代码',
        align: 'left',
        field: (row: any) => row.companyCode,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'companyType',
        label: '公司类型',
        align: 'left',
        field: (row: any) => row.companyType,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'createTime',
        label: '创建时间',
        align: 'left',
        field: (row: any) => row.createTime,
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
  /* event */
  public paginationInput(data: any) {
    this.tableParams.pagination = data;
    this.getData();
  }

  /* http */
  public async getData() {
    try {
      this.tableParams.loading = true;
      const { pageData } = await AuditModule.getCompanyCertificationList({
        page: this.tableParams.pagination.page,
        rowsPerPage: this.tableParams.pagination.rowsPerPage,
      });
      if (pageData && pageData.length) {
        this.tableParams.data = pageData;
        this.tableParams.pagination.rowsNumber = pageData.total;
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
  public async handlerClickPass(item: any) {
    try {
      this.$q.loading.show();
      await AuditModule.passCompanyCertification({
        id: item.id,
        authorId: item.authorId,
      });
      this.$globalMessage.show({
        type: 'success',
        content: '操作成功',
      });
      this.getData();
    } catch (error) {}
    this.$q.loading.hide();
  }
  public async handlerClickReject(item: any) {
    this.$q
      .dialog({
        title: '不通过原因',
        message: '输入不通过原因',
        prompt: {
          model: '',
          type: 'text', // optional
        },
        cancel: true,
        persistent: true,
      })
      .onOk(async (data) => {
        try {
          this.$q.loading.show();
          await AuditModule.rejectCompanyCertification({
            id: item.id,
            authorId: item.authorId,
            failMessage: data,
          });
          this.$globalMessage.show({
            type: 'success',
            content: '操作成功',
          });
          this.getData();
        } catch (error) {}
        this.$q.loading.hide();
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  }
}
</script>

<style lang="scss" scoped></style>
