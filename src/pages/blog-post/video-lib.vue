<template>
  <div>
    <q-table
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
            v-model="videoLib.params.category"
            :options="videoLib.categoryOptions"
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
          <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-left" :style="col.name === 'source' || col.name === 'category' ? 'width:600px' : ''">
            <span v-if="!col.inSlot">{{ col.value }}</span>
            <div class="text-left" v-else>
              <!-- source -->
              <div v-if="col.name === 'source'" class="row items-center">
                <video :src="props.row.source" style="width: 340px; border-radius: 8px; height: 200px" class="cursor-pointer" :poster="props.row.poster" controls />
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
        <q-card-section> 分类</q-card-section>
        <div class="split-line h-1"></div>
        <q-card-section class="scroll" style="max-height: 200px">
          <ul class="categoryList">
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
          </ul>
        </q-card-section>
        <div class="split-line h-1"></div>
        <q-card-actions vertical align="left" class="q-pa-md">
          <q-btn color="primary" icon="add" label="新增" @click="newCategory" />
        </q-card-actions>
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
        <div>
          <div class="row items-center justify-between">
            <div class="text-center w-p-50 q-py-sm">
              封面
              <q-btn color="primary" icon="add" label="点击上传封面" flat @click="handleClickUploadPoster" dense class="q-ml-sm" />
            </div>
            <div class="text-center w-p-50 q-py-sm">
              视频
              <q-btn color="primary" icon="add" label="点击上传视频" flat @click="handleClickUploadVideo" dense class="q-ml-sm" v-if="dialogUpload.dialogType === 'add'" />
            </div>
          </div>
          <div class="split-line h-1"></div>
        </div>
        <div class="row items-center justify-between q-my-md">
          <input type="file" class="hide" :ref="dialogUpload.videoFileID" :accept="dialogUpload.accept" :draggable="false" @change="uploadFileSuccess" />
          <q-img :src="dialogUpload.params.poster" v-if="dialogUpload.params.poster" class="w-p-49 h-200 border-all" fit="contain" spinner-size="12px" spinner-color="primary" />
          <div class="h-200 row items-center justify-center w-p-49 border-all q-my-md b-r-6 bg-grey-2" v-else>上传封面</div>
          <video :src="dialogUpload.videoBase64" controls class="w-p-50 h-200 border-all" autoplay v-if="dialogUpload.videoBase64"></video>
          <div class="h-200 row items-center justify-center w-p-50 border-all b-r-6 q-my-md bg-grey-2" v-else>上传视频格式为：{{ dialogUpload.accept.split(',').join(' ,') }}</div>
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
    <PostAlbumComponent ref="PostAlbumComponentRef" @pick="pickSuccess" />
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { getCurrentInstance } from 'vue';
import { Component, Vue } from 'vue-facing-decorator';
import PostAlbumComponent from './components/album.vue';

@Component({
  name: 'myBlogPostVideoLib',
  components: {
    PostAlbumComponent,
  },
})
export default class myBlogPostVideoLib extends Vue {
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
  public videoLib = {
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
      { name: 'source', label: '视频', align: 'left', inSlot: true },
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
    videoFileID: 'dialog_upload_file',
    clickLoading: false,
    getDataLoading: false,
    visiable: false,
    title: '',
    videoBase64: '',
    accept: '.mp4',
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
    params: { video: '', videoName: '', title: '', description: '', poster: '', category: [], id: '' },
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
      this.$refs[this.dialogUpload.videoFileID].type = 'text';
      this.dialogUpload.params.videoName = '';
      this.dialogUpload.params.video = '';
      this.dialogUpload.videoBase64 = '';
      setTimeout(() => {
        this.$refs[this.dialogUpload.videoFileID].type = 'file';
        this.$refs[this.dialogUpload.videoFileID].value = '';
      }, 100);
    });
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
    this.dialogUpload.params.poster = row.poster;
    this.dialogUpload.params.description = row.description;
    this.dialogUpload.params.category = row.category;
    this.dialogUpload.params.video = row.source;
    this.dialogUpload.videoBase64 = row.source;
  }

  public handleClickUploadPoster() {
    this.$refs.PostAlbumComponentRef.init();
  }

  public handleClickUploadVideo() {
    this.$refs[this.dialogUpload.videoFileID].type = 'text';
    this.dialogUpload.params.videoName = '';
    this.dialogUpload.params.video = '';
    this.dialogUpload.videoBase64 = '';
    setTimeout(() => {
      this.$refs[this.dialogUpload.videoFileID].type = 'file';
      this.$refs[this.dialogUpload.videoFileID].value = '';
      this.$refs[this.dialogUpload.videoFileID].click();
    }, 100);
  }

  public uploadFileSuccess() {
    const files = this.$refs[this.dialogUpload.videoFileID].files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach((rawFile: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(rawFile);
      reader.onload = () => {
        this.dialogUpload.videoBase64 = reader.result as string;
      };
      this.dialogUpload.params.videoName = rawFile.name;
      this.dialogUpload.params.video = rawFile;
    });
  }

  public dialogUploadCloseEvent(data: { type: string }) {
    this.dialogUpload.visiable = false;
  }

  public dialogUploadBeforeHideEvent(data: { type: string; params: any }) {
    if (data.params) {
      this.dialogUpload.params = data.params;
    }
  }

  public pickSuccess(data: any) {
    this.dialogUpload.params.poster = data.source;
  }

  /* http */
  public async getData() {
    const { pageData, total } = await BlogPostModule.getAllVideo({
      categoryIds: this.videoLib.params.category,
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

  public uploadZipFileSuccess() {
    const files = this.$refs.batchUpload.files;
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.slice(0, 1);
    postFiles.forEach(async (rawFile: any) => {
      const formData = new FormData();
      formData.append('file', rawFile);
      const result = await BlogPostModule.batchAddVideo(formData);
      if (result) {
        this.$globalMessage.show({
          type: 'success',
          content: '上传成功，请刷新页面查看',
        });
        this.getData();
      }
    });
  }

  public async queryCategory() {
    const result = await BlogPostModule.queryVideoCategory({});
    if (result && result.length) {
      this.videoLib.categoryOptions = result.map((item: any) => ({ value: item.id, ...item }));
      this.categoryParams.data = result;
      const index = this.dialogUpload.input.findIndex((item: any) => item.model === 'category');
      this.dialogUpload.input[index].inputSelectOption = result.map((item: any) => ({ value: item.id, ...item }));
    }
  }

  public async hanleClickUploadConfirm() {
    try {
      if (!this.dialogUpload.params.video) {
        this.$globalMessage.show({
          type: 'error',
          content: '请上传视频',
        });
        return;
      }
      if (!this.dialogUpload.params.poster) {
        this.$globalMessage.show({
          type: 'error',
          content: '请上传视频封面',
        });
        return;
      }
      this.dialogUpload.clickLoading = true;
      if (this.dialogUpload.dialogType === 'add') {
        const form = new FormData();
        let obj: any = {
          title: this.dialogUpload.params.title,
          description: this.dialogUpload.params.description,
          categoryIds: this.dialogUpload.params.category,
          file: this.dialogUpload.params.video,
          poster: this.dialogUpload.params.poster,
        };
        for (let key in obj) {
          if (key === 'categoryIds') {
            form.append(key, JSON.stringify(obj[key]));
          } else {
            form.append(key, obj[key]);
          }
        }
        await BlogPostModule.addVideo(form);
      } else {
        await BlogPostModule.updateVideo({
          id: this.dialogUpload.params.id,
          title: this.dialogUpload.params.title,
          description: this.dialogUpload.params.description,
          categoryIds: this.dialogUpload.params.category,
          file: this.dialogUpload.videoBase64,
          poster: this.dialogUpload.params.poster,
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

  public async confirmAddCategory(scope: any, item: any) {
    try {
      scope.set();
      await BlogPostModule.addVideoCategory({
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
        title: '友情提示',
        color: 'primary',
        content: '确定吗？老铁！？',
        confirmButtonText: '非常确定',
      });
      if (result) {
        await BlogPostModule.deleteVideo({
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
      title: '友情提示',
      color: 'primary',
      content: '确定吗？老铁！？',
      confirmButtonText: '非常确定',
    });
    if (result) {
      await BlogPostModule.batchDelteVideo({
        idList: this.tableParams.selected.map((item: any) => item.id),
      });
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
      this.tableParams.selected = [];
    }
  }

  public async removeCategory(item: any) {
    try {
      await BlogPostModule.deleteVideoCategory({
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

<style scoped lang="scss">
.categoryList {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
}
</style>
