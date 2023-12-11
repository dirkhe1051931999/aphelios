<template>
  <div>
    <q-tabs v-model="approvalParams.tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left">
      <q-tab name="author-company-user" label="作者公司用户认证" />
      <q-tab name="author-normal-user" label="作者普通用户认证" />
    </q-tabs>
    <q-tab-panels v-model="approvalParams.tab" animated>
      <q-tab-panel name="author-company-user">
        <div class="thin-shadow q-pa-md">
          <q-table
            flat
            bordered
            :columns="approvalParams.authorCompany.tableParams.column"
            :rows="approvalParams.authorCompany.tableParams.data"
            :loading="approvalParams.authorCompany.tableParams.loading"
            :pagination="approvalParams.authorCompany.tableParams.pagination"
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
                      <span class="link-type" @click="getAuthorCompanyDetail(props.row.authorId)">{{ props.row.authorId }}</span>
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
                      <span class="in-table-link-button" @click="handlerClickPassAuthorCompany(props.row)">通过 </span>
                      <span class="in-table-delete-button q-ml-md" @click="handlerClickRejectAuthorCompany(props.row)">不通过 </span>
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
          <MyPagination
            :paginationParams="approvalParams.authorCompany.tableParams.pagination"
            v-if="approvalParams.authorCompany.tableParams.pagination.rowsNumber > 0"
            @pagination="paginationInputAuthorCompany"
          ></MyPagination>
        </div>
        <q-dialog v-model="approvalParams.authorCompany.detailParams.model" transition-show="jump-up" transition-hide="jump-down">
          <q-card flat style="max-width: 50vw; width: 30vw">
            <div class="q-pa-md">
              <q-img :src="approvalParams.authorCompany.detailParams.data.coverUrl" spinner-color="primary" spinner-size="12px" width="100%" height="200px" fit="contain" />
            </div>
            <q-card-section>
              <q-list bordered>
                <q-item v-ripple>
                  <q-item-section avatar> 用户名： </q-item-section>
                  <q-item-section>{{ approvalParams.authorCompany.detailParams.data.name }}</q-item-section>
                </q-item>
                <q-item v-ripple>
                  <q-item-section avatar> 昵称： </q-item-section>
                  <q-item-section>{{ approvalParams.authorCompany.detailParams.data.nick }}</q-item-section>
                </q-item>
                <q-item v-ripple>
                  <q-item-section avatar> 头像： </q-item-section>
                  <q-item-section>
                    <q-avatar rounded> <img :src="approvalParams.authorCompany.detailParams.data.avatarUrl" /> </q-avatar>
                  </q-item-section>
                </q-item>
                <q-item v-ripple>
                  <q-item-section avatar> 描述： </q-item-section>
                  <q-item-section>{{ approvalParams.authorCompany.detailParams.data.description }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-tab-panel>
      <q-tab-panel name="author-normal-user">
        <div class="thin-shadow q-pa-md">
          <q-table
            flat
            bordered
            :columns="approvalParams.authorNormal.tableParams.column"
            :rows="approvalParams.authorNormal.tableParams.data"
            :loading="approvalParams.authorNormal.tableParams.loading"
            :pagination="approvalParams.authorNormal.tableParams.pagination"
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
                    <div v-if="col.name === 'name'" class="row items-center">
                      <span class="q-mr-md">用户名：{{ props.row.name }}</span>
                      <div class="q-mr-md">头像：<q-img :src="props.row.avatarUrl" spinner-color="primary" spinner-size="12px" width="40px" height="40px" /></div>
                      <div>背景图：<q-img :src="props.row.coverUrl" spinner-color="primary" spinner-size="12px" width="200px" /></div>
                    </div>
                    <!-- status -->
                    <div v-if="col.name === 'status'">
                      <span class="my-status grey" v-if="props.row.status === 0">审核中</span>
                      <span class="my-status green" v-if="props.row.status === 1">已通过</span>
                      <span class="my-status red" v-if="props.row.status === 2">未通过 </span>
                    </div>
                    <!-- action -->
                    <div v-if="col.name === 'action'">
                      <span class="in-table-link-button" @click="handlerClickPassAuthorNormal(props.row)">通过 </span>
                      <span class="in-table-delete-button q-ml-md" @click="handlerClickRejectAuthorNormal(props.row)">不通过 </span>
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
          <MyPagination
            :paginationParams="approvalParams.authorNormal.tableParams.pagination"
            v-if="approvalParams.authorNormal.tableParams.pagination.rowsNumber > 0"
            @pagination="paginationInputAuthorNormal"
          ></MyPagination>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { defaultFill } from 'src/utils/tools';
import { getCurrentInstance } from 'vue';
import { AuditModule } from 'src/store/modules/audit';

@Component({ name: 'MyAuthorCompanyComponent' })
export default class MyAuthorCompanyComponent extends Vue {
  /**instance */
  declare $refs: any;
  mounted() {
    this.getDataAuthorCompany();
    this.getDataAuthorNormal();
  }
  /**params */
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public approvalParams = {
    tab: 'author-company-user',
    authorCompany: {
      detailParams: {
        model: false,
        data: {},
      },
      tableParams: {
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
      },
    },
    authorNormal: {
      tableParams: {
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
            label: '作者',
            inSlot: true,
          },
          {
            name: 'status',
            label: '状态',
            inSlot: true,
          },
          {
            name: 'rejectReason',
            label: '失败原因',
            align: 'left',
            field: (row: any) => row.rejectReason,
            format: (val: any) => `${defaultFill(val)}`,
          },
          {
            name: 'nick',
            label: '昵称',
            align: 'left',
            field: (row: any) => row.nick,
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
      },
    },
  };
  /* event */
  public paginationInputAuthorCompany(data: any) {
    this.approvalParams.authorCompany.tableParams.pagination = data;
    this.getDataAuthorCompany();
  }
  public paginationInputAuthorNormal(data: any) {
    this.approvalParams.authorNormal.tableParams.pagination = data;
    this.getDataAuthorNormal();
  }
  /* http */
  public async getDataAuthorCompany() {
    try {
      this.approvalParams.authorCompany.tableParams.loading = true;
      const { pageData } = await AuditModule.getAuthorCompanyList({
        page: this.approvalParams.authorCompany.tableParams.pagination.page,
        rowsPerPage: this.approvalParams.authorCompany.tableParams.pagination.rowsPerPage,
      });
      if (pageData && pageData.length) {
        this.approvalParams.authorCompany.tableParams.data = pageData;
        this.approvalParams.authorCompany.tableParams.pagination.rowsNumber = pageData.total;
      } else {
        this.approvalParams.authorCompany.tableParams.data = [];
        this.approvalParams.authorCompany.tableParams.pagination.rowsNumber = 0;
      }
      this.approvalParams.authorCompany.tableParams.loading = false;
    } catch (error) {
      this.approvalParams.authorCompany.tableParams.loading = false;
    } finally {
      return Promise.resolve();
    }
  }
  public async getAuthorCompanyDetail(id: any) {
    try {
      this.$q.loading.show();
      const result = await AuditModule.getAuthorCompanyDetail({
        id,
      });
      console.log(result);
      this.$q.loading.hide();
      this.approvalParams.authorCompany.detailParams.data = result;
      this.approvalParams.authorCompany.detailParams.model = true;
    } catch (error) {
    } finally {
      return Promise.resolve();
    }
  }

  public async getDataAuthorNormal() {
    try {
      this.approvalParams.authorNormal.tableParams.loading = true;
      const { pageData } = await AuditModule.getAuthorNormalList({
        page: this.approvalParams.authorNormal.tableParams.pagination.page,
        rowsPerPage: this.approvalParams.authorNormal.tableParams.pagination.rowsPerPage,
      });
      if (pageData && pageData.length) {
        this.approvalParams.authorNormal.tableParams.data = pageData;
        this.approvalParams.authorNormal.tableParams.pagination.rowsNumber = pageData.total;
      } else {
        this.approvalParams.authorNormal.tableParams.data = [];
        this.approvalParams.authorNormal.tableParams.pagination.rowsNumber = 0;
      }
      this.approvalParams.authorNormal.tableParams.loading = false;
    } catch (error) {
      this.approvalParams.authorNormal.tableParams.loading = false;
    } finally {
      return Promise.resolve();
    }
  }
  public async handlerClickPassAuthorCompany(item: any) {
    try {
      this.$q.loading.show();
      await AuditModule.passAuthorCompany({
        id: item.id,
        authorId: item.authorId,
      });
      this.$globalMessage.show({
        type: 'success',
        content: '操作成功',
      });
      this.getDataAuthorCompany();
    } catch (error) {}
    this.$q.loading.hide();
  }
  public async handlerClickPassAuthorNormal(item: any) {
    try {
      this.$q.loading.show();
      await AuditModule.passAuthorNormal({
        id: item.id,
      });
      this.$globalMessage.show({
        type: 'success',
        content: '操作成功',
      });
      this.getDataAuthorNormal();
    } catch (error) {}
    this.$q.loading.hide();
  }
  public async handlerClickRejectAuthorCompany(item: any) {
    this.$q
      .dialog({
        title: '不通过原因',
        message: '输入不通过原因',
        transitionHide: 'jump-up',
        transitionShow: 'jump-down',
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
          await AuditModule.rejectAuthorCompany({
            id: item.id,
            authorId: item.authorId,
            failMessage: data,
          });
          this.$globalMessage.show({
            type: 'success',
            content: '操作成功',
          });
          this.getDataAuthorCompany();
        } catch (error) {}
        this.$q.loading.hide();
      });
  }
  public async handlerClickRejectAuthorNormal(item: any) {
    this.$q
      .dialog({
        title: '不通过原因',
        message: '输入不通过原因',
        transitionHide: 'jump-up',
        transitionShow: 'jump-down',
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
          await AuditModule.rejectAuthorNormal({
            id: item.id,
            rejectReason: data,
          });
          this.$globalMessage.show({
            type: 'success',
            content: '操作成功',
          });
          this.getDataAuthorNormal();
        } catch (error) {}
        this.$q.loading.hide();
      });
  }
}
</script>

<style lang="scss" scoped></style>
