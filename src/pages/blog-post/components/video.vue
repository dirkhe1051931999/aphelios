<template>
  <q-dialog v-model="videoParams.model" position="top" transition-show="jump-up" transition-hide="jump-down">
    <q-card style="max-width: 50vw; width: 50vw">
      <q-card-actions align="left" class="q-pa-md">
        <span class="fs-20 q-mr-md">图库</span>
        <q-select
          style="width: 300px"
          v-model="videoParams.params.category"
          :options="videoParams.category"
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
      </q-card-actions>
      <div class="split-line h-1"></div>
      <q-card-section style="max-height: 500px" class="scroll">
        <ul class="video-list">
          <li v-for="(item, index) in videoParams.data" :key="index" @click="pickVideo(item)" :class="{ active: this.videoParams.currentPick === item.id }">
            <video :src="item.source" class="video h-200" controls :poster="item.poster" muted :autoplay="false"></video>
            <q-badge v-for="(categoryId, categoryIndex) in item.category" :key="categoryIndex" color="primary" :label="categoryName(categoryId)" class="q-ml-md" floating />
            <div class="banner">
              {{ item.title }}
            </div>
          </li>
        </ul>
      </q-card-section>
      <div class="split-line h-1"></div>
      <q-card-actions align="right">
        <MyPagination
          :paginationParams="videoParams.pagination"
          v-if="videoParams.pagination.rowsNumber > 0"
          @pagination="paginationInput"
          style="margin-top: -26px; margin-right: 16px"
        ></MyPagination>
        <q-btn flat label="取消" color="primary" @click="hide" />
        <q-btn label="确定" color="primary" @click="confirmPick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue } from 'vue-facing-decorator';

@Component({ name: 'myPostVideoComponent', emits: ['pick', 'hide'] })
export default class myPostVideoComponent extends Vue {
  get categoryName() {
    return (id: any) => {
      const item: any = this.videoParams.category.find((item: any) => item.id === id);
      return item ? item.label : '';
    };
  }
  public videoParams = {
    model: false,
    data: [],
    category: [],
    currentPick: null,
    pagination: {
      rowsPerPage: 10,
      rowsNumber: 0,
      page: 1,
    },
    params: {
      category: [],
    },
  };
  /* event */
  public paginationInput(data: any) {
    this.videoParams.pagination = data;
    this.getData();
  }
  public handleClickQuery() {
    this.videoParams.pagination.page = 1;
    this.getData();
  }
  public show() {
    this.videoParams.model = true;
  }
  public hide() {
    this.videoParams.model = false;
    this.$emit('hide');
  }
  public confirmPick() {
    const item = this.videoParams.data.find((item: any) => item.id === this.videoParams.currentPick);
    this.videoParams.model = false;
    this.videoParams.currentPick = null;
    this.$emit('pick', item);
    this.$emit('hide');
  }
  public pickVideo(item: any) {
    this.videoParams.currentPick = item.id;
  }
  public init() {
    this.show();
    this.videoParams.data = [];
    this.videoParams.params.category = [];
    this.videoParams.pagination.rowsNumber = 0;
    this.videoParams.pagination.page = 1;
    this.getData();
    this.getVideoCategory();
  }
  /* http */
  public async getData() {
    try {
      const { pageData, total } = await BlogPostModule.getAllVideo({
        categoryIds: this.videoParams.params.category,
        page: this.videoParams.pagination.page,
        rowsPerPage: this.videoParams.pagination.rowsPerPage,
      });
      if (pageData && pageData.length) {
        this.videoParams.data = pageData;
        this.videoParams.pagination.rowsNumber = total;
      } else {
        this.videoParams.data = [];
        this.videoParams.pagination.rowsNumber = 0;
      }
    } catch (error) {}
  }
  public async getVideoCategory() {
    try {
      this.videoParams.category = [];
      const result = await BlogPostModule.queryVideoCategory({});
      if (result && result.length) {
        this.videoParams.category = result.map((item: any) => {
          return {
            value: item.id,
            ...item,
          };
        });
      } else {
        this.videoParams.category = [];
      }
    } catch (error) {}
  }
}
</script>

<style scoped lang="scss">
.video-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
  li {
    border: solid 1px #eeeeee;
    border-radius: 8px;
    position: relative;
    cursor: pointer;
    &.active {
      border: solid 2px $primary;
    }
    .video {
      width: 100%;
      height: 100%;
      border-radius: 8px !important;
    }
    .banner {
      position: absolute;
      width: 100%;
      height: 50px;
      bottom: 0;
      left: 0;
      background: rgba($color: #000000, $alpha: 0.2);
      color: #fff;
      display: row;
      padding: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
