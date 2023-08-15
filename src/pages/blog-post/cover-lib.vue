<template>
  <div>
    <q-table
      title="图库"
      flat
      :rows="tableParams.data"
      :columns="tableParams.columns"
      row-key="id"
      :loading="tableParams.loading"
      :pagination="tableParams.pagination"
      hide-pagination
      :no-data-label="$t(`tip.noData`)"
      class="my-table"
      :selected-rows-label="(numberOfRows) => `select ${numberOfRows} ${$t(`table.per`)}`"
      selection="multiple"
      v-model:selected="tableParams.selected"
    >
      <template v-slot:top-left>
        <div class="row">
          <q-select
            style="width: 300px"
            v-model="coverLib.params.category"
            :options="coverLib.categoryOptions"
            label="选择分类"
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
            multiple
            use-chips
          />
          <q-btn color="primary" icon="search" label="查询" @click="handleClickQuery" class="q-ml-md" />
          <q-btn color="primary" label="编辑分类" outline class="q-ml-md" @click="handleEditCategory" />
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <!-- selected -->
          <q-th style="text-align: left">
            <q-checkbox color="primary" v-model="props.selected" />
          </q-th>
          <!-- other -->
          <q-th v-for="col in props.cols" :key="col.name" :props="props" style="text-align: left">
            {{ col.label.indexOf('$') !== -1 ? $t(`table.${col.label.replace('$', '')}`) : col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-btn color="primary" icon="o_add" label="Add" no-caps @click="handleClickAdd" />
        <input type="file" class="hide" ref="batchUpload" accept=".zip" :draggable="false" @change="uploadZipFileSuccess" />
        <q-btn color="primary" icon="o_add" label="批量上传" no-caps @click="handleClickBatchUpload" class="q-ml-md" />
        <q-btn color="negative" icon="delete" label="批量删除" @click="handleClickBatchDelete" :disable="!tableParams.selected.length" class="q-ml-md" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- selected -->
          <q-td class="text-left" style="width: 50px">
            <q-checkbox color="primary" v-model="props.selected" />
          </q-td>
          <!-- other -->
          <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-left" :style="col.name === 'source' || col.name === 'category' ? 'width:400px' : ''">
            <span v-if="!col.inSlot">{{ col.value }}</span>
            <div class="text-left" v-else>
              <!-- source -->
              <div v-if="col.name === 'source'">
                <photo-provider>
                  <photo-consumer v-for="src in [props.row[col.name]]" :intro="src" :key="src" :src="src">
                    <img :src="src" style="max-width: 140px" />
                  </photo-consumer>
                </photo-provider>

                <q-btn color="primary" outline label="编辑" @click="onUpdate(props.row)" dense class="q-ml-md" />
                <q-btn color="negative" outline label="删除" @click="handleClickDelete(props.row)" dense class="q-ml-md" />
              </div>
              <!-- category -->
              <div v-if="col.name === 'category'">
                <q-badge v-for="(item, index) in props.row[col.name]" :key="index" class="q-mr-sm">
                  {{ getCategoryName(item) }}
                </q-badge>
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
    <q-dialog v-model="categoryParams.model" position="top" transition-show="jump-up" transition-hide="jump-down">
      <q-card style="max-width: 50vw; width: 40vw">
        <q-card-section class="row items-center">
          <ul>
            <li v-for="(item, index) in categoryParams.data" :key="item.id" class="q-mb-md">
              <span class="w-100 inline-block q-pa-sm border-all cursor-pointer">{{ index + 1 }}. {{ item.label }}</span>
              <q-icon name="close" v-if="!item.default" @click.prevent.stop="removeCategory(item)" class="q-ml-md cursor-pointer"></q-icon>
              <q-popup-edit v-model="item.label" :validate="(val) => val.length > 0" v-slot="scope">
                <q-input autofocus dense v-model="scope.value" :model-value="scope.value" :rules="[(val) => scope.validate(val) || '必填']" outlined>
                  <template v-slot:after>
                    <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />
                    <q-btn
                      flat
                      dense
                      color="positive"
                      icon="check_circle"
                      @click.stop.prevent="confirmAddCategory(scope, item)"
                      :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
                    />
                  </template>
                </q-input>
              </q-popup-edit>
            </li>
            <!-- 新增 -->
            <li>
              <q-btn color="primary" icon="add" label="新增" @click="newCategory" />
            </li>
          </ul>
        </q-card-section>
      </q-card>
    </q-dialog>
    <MyDialog
      :option="{
        id: dialogUpload.id,
        dialogType: 'upload',
        clickLoading: dialogUpload.clickLoading,
        getDataLoading: dialogUpload.getDataLoading,
        visiable: dialogUpload.visiable,
        title: dialogUpload.title,
        params: dialogUpload.params,
      }"
      width="30vw"
      @close="dialogUploadCloseEvent"
      @confirm="hanleClickUploadConfirm"
      @before-hide="dialogUploadBeforeHideEvent"
    >
      <div class="dialog-upload-form">
        <q-img :src="dialogUpload.imgBase64" class="h-200" v-if="dialogUpload.imgBase64"></q-img>
        <input type="file" class="hide" :ref="dialogUpload.fileID" :accept="dialogUpload.accept" :draggable="false" @change="uploadFileSuccess" />
        <div class="container q-my-md">
          <div class="center" @click="handleClickUploadFile">
            <q-icon name="o_cloud_upload" class="fs-50" color="primary"></q-icon>
            <p class="click">Click to upload</p>
            <p class="format">File type is: {{ dialogUpload.accept.split(',').join(' ,') }}</p>
            <p class="fileName" v-if="dialogUpload.params.fileName">
              {{ dialogUpload.params.fileName }}
            </p>
          </div>
        </div>
        <div v-for="(item, index) in dialogUpload.input" :key="index" class="col-12">
          <MyFormInput
            v-if="item.type === 'text'"
            :option="{
              model: dialogUpload.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
            }"
            @input="(data) => (dialogUpload.params[item.model] = data)"
          >
          </MyFormInput>
          <MyFormMultipleSelect
            v-if="item.type === 'multiple-select'"
            :option="{
              inputId: `${dialogUpload.id}-multiple-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogUpload.params[item.model],
              label: item.label,
              inputSelectOption: item.inputSelectOption,
              multiple: item.multiple,
              userInput: false,
            }"
            @input="(data) => (dialogUpload.params[item.model] = data)"
          >
          </MyFormMultipleSelect>
        </div>
      </div>
    </MyDialog>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { getCurrentInstance } from 'vue';
import { Component, Vue } from 'vue-facing-decorator';

@Component({ name: 'myBlogPostCoverLib' })
export default class myBlogPostCoverLib extends Vue {
  $refs: any;
  get getCategoryName() {
    return (category: number) => {
      const categoryObj: any = this.categoryParams.data.find((item: any) => item.id === category);
      return categoryObj ? categoryObj.label : '';
    };
  }
  mounted() {
    this.getData();
    this.queryCategory();
  }
  /**params */
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public coverLib = {
    categoryOptions: [],
    zipFile: '',
    zipFileName: '',
    params: {
      category: [],
    },
  };
  public categoryParams = {
    data: [],
    model: false,
  };
  public tableParams = {
    selected: [],
    loading: false,
    columns: [
      { name: 'source', label: '图片', align: 'left', inSlot: true },
      { name: 'category', label: '分类', align: 'left', inSlot: true },
      {
        name: 'title',
        required: true,
        label: '标题',
        align: 'left',
        field: (row: any) => row.title,
        format: (val: any) => `${this.globals.defaultFill(val)}`,
      },
      { name: 'description', align: 'left', label: '描述', field: (row: any) => row.description, format: (val: any) => `${this.globals.defaultFill(val)}` },
    ],
    data: [],
    pagination: {
      rowsPerPage: 10,
      rowsNumber: 0,
      page: 1,
    },
  };
  public dialogUpload = {
    id: 'dialog-upload-file',
    fileID: 'dialog_upload_file',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    imgBase64: '',
    accept: '.jpg,.png,.jpeg',
    dialogType: 'add',
    input: [
      {
        model: 'title',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '标题',
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
        model: 'category',
        type: 'multiple-select',
        inputSelectOption: [],
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: '分类',
      },
    ],
    params: { file: '', fileName: '', title: '', description: '', category: [], id: '' },
  };

  /* event */
  public handleClickQuery() {
    this.getData();
  }
  public paginationInput(pagination: any) {
    this.tableParams.pagination = pagination;
    this.getData();
  }
  public handleClickAdd() {
    this.dialogUpload.visiable = true;
    this.dialogUpload.title = 'Upload';
    this.dialogUpload.dialogType = 'add';
    this.$nextTick(() => {
      this.$refs[this.dialogUpload.fileID].type = 'text';
      this.dialogUpload.params.fileName = '';
      this.dialogUpload.params.file = '';
      this.dialogUpload.imgBase64 = '';
      setTimeout(() => {
        this.$refs[this.dialogUpload.fileID].type = 'file';
        this.$refs[this.dialogUpload.fileID].value = '';
      }, 100);
    });
  }
  public handleEditCategory() {
    this.categoryParams.model = true;
  }
  public newCategory() {
    (this.categoryParams.data as any).push({
      label: '',
      id: this.categoryParams.data.length,
      default: 0,
    });
  }
  public onUpdate(row: any) {
    this.dialogUpload.visiable = true;
    this.dialogUpload.title = 'Update';
    this.dialogUpload.dialogType = 'update';
    this.dialogUpload.params.id = row.id;
    this.dialogUpload.params.title = row.title;
    this.dialogUpload.params.description = row.description;
    this.dialogUpload.params.category = row.category;
    this.dialogUpload.params.file = row.source;
    this.dialogUpload.imgBase64 = row.source;
  }
  public handleClickBatchUpload() {
    this.$nextTick(() => {
      this.$refs.batchUpload.type = 'text';
      setTimeout(() => {
        this.$refs.batchUpload.type = 'file';
        this.$refs.batchUpload.value = '';
        this.$refs.batchUpload.click();
      }, 100);
    });
  }
  public handleClickUploadFile() {
    this.$refs[this.dialogUpload.fileID].type = 'text';
    this.dialogUpload.params.fileName = '';
    this.dialogUpload.params.file = '';
    this.dialogUpload.imgBase64 = '';
    setTimeout(() => {
      this.$refs[this.dialogUpload.fileID].type = 'file';
      this.$refs[this.dialogUpload.fileID].value = '';
      this.$refs[this.dialogUpload.fileID].click();
    }, 100);
  }
  public uploadFileSuccess() {
    const files = this.$refs[this.dialogUpload.fileID].files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach((rawFile: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(rawFile);
      reader.onload = () => {
        this.dialogUpload.imgBase64 = reader.result as string;
      };
      this.dialogUpload.params.fileName = rawFile.name;
      this.dialogUpload.params.file = rawFile;
    });
  }
  public monitorDialogUploadHide() {
    this.dialogUpload.params.id = '';
    this.dialogUpload.params.fileName = '';
    this.dialogUpload.params.file = '';
    this.dialogUpload.imgBase64 = '';
    this.dialogUpload.params.title = '';
    this.dialogUpload.params.description = '';
    this.dialogUpload.params.category = [];
  }
  public dialogUploadCloseEvent(data: { type: string }) {
    this.dialogUpload.visiable = false;
  }
  public dialogUploadBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogUpload.params = data.params;
    }
  }
  /* http */
  public async getData() {
    const { pageData, total } = await BlogPostModule.getAllCover({
      categoryIds: this.coverLib.params.category,
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
  }
  public async queryCategory() {
    const result = await BlogPostModule.queryCategory({});
    if (result && result.length) {
      this.coverLib.categoryOptions = result.map((item: any) => ({ value: item.id, ...item }));
      this.categoryParams.data = result;
      const index = this.dialogUpload.input.findIndex((item: any) => item.model === 'category');
      this.dialogUpload.input[index].inputSelectOption = result.map((item: any) => ({ value: item.id, ...item }));
    }
  }
  public async hanleClickUploadConfirm() {
    try {
      if (!this.dialogUpload.params.file) {
        this.$globalMessage.show({
          type: 'error',
          content: '请上传图片',
        });
        return;
      }
      this.dialogUpload.clickLoading = true;
      if (this.dialogUpload.dialogType === 'add') {
        await BlogPostModule.addCover({
          title: this.dialogUpload.params.title,
          description: this.dialogUpload.params.description,
          categoryIds: this.dialogUpload.params.category,
          file: this.dialogUpload.imgBase64,
        });
      } else {
        await BlogPostModule.updateCover({
          id: this.dialogUpload.params.id,
          title: this.dialogUpload.params.title,
          description: this.dialogUpload.params.description,
          categoryIds: this.dialogUpload.params.category,
          file: this.dialogUpload.params.file,
        });
      }
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.dialogUpload.clickLoading = false;
      this.dialogUpload.visiable = false;
      this.getData();
    } catch (error) {
      this.dialogUpload.clickLoading = false;
    }
  }
  public uploadZipFileSuccess() {
    const files = this.$refs.batchUpload.files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach(async (rawFile: any) => {
      const formData = new FormData();
      formData.append('file', rawFile);
      const result = await BlogPostModule.batchAddCover(formData);
      if (result) {
        this.$globalMessage.show({
          type: 'success',
          content: '上传成功，请刷新页面查看',
        });
        this.getData();
      }
    });
  }
  public async confirmAddCategory(scope: any, item: any) {
    try {
      scope.set();
      await BlogPostModule.addCategory({
        id: item.id,
        label: scope.value,
      });
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.queryCategory();
    } catch (error) {}
  }
  public async handleClickDelete(row: any) {
    try {
      const result = await this.$globalConfirm.show({
        title: '💕💕💕 提示',
        color: 'primary',
        content: '确定要执行该操作吗 :) ?',
        confirmButtonText: '嗯，是的',
      });
      if (result) {
        await BlogPostModule.deleteCover({
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
  public async handleClickBatchDelete() {
    const result = await this.$globalConfirm.show({
      title: '💕💕💕 提示',
      color: 'primary',
      content: '确定要执行该操作吗 :) ?',
      confirmButtonText: '嗯，是的',
    });
    if (result) {
      await BlogPostModule.batchDelteCover({
        idList: this.tableParams.selected.map((item: any) => item.id),
      });
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    }
  }
  public async removeCategory(item: any) {
    try {
      await BlogPostModule.deleteCategory({
        id: item.id,
      });
      this.categoryParams.data = this.categoryParams.data.filter((i: any) => i.id !== item.id);
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.queryCategory();
    } catch (error) {}
  }
}
</script>

<style scoped lang="scss"></style>
