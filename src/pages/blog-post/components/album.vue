<template>
  <q-dialog v-model="albumParams.model" position="top" transition-show="jump-up" transition-hide="jump-down">
    <q-card style="max-width: 50vw; width: 50vw">
      <q-card-actions align="left" class="q-pa-md">
        <span class="fs-20 q-mr-md">图库</span>
        <q-select
          style="width: 300px"
          v-model="albumParams.params.category"
          :options="albumParams.category"
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
        <ul class="album-list">
          <li v-for="(item, index) in albumParams.data" :key="index" @click="pickAlbum(item)" :class="{ active: isPicked(item.id) }">
            <q-img :src="item.source" :alt="item.title" fit="contain" class="img">
              <q-badge v-for="(directoryId, categoryIndex) in item.category" :key="categoryIndex" color="primary" :label="categoryName(directoryId)" class="q-ml-md" floating />
            </q-img>
            <div class="banner">
              {{ item.title }}
            </div>
          </li>
        </ul>
      </q-card-section>
      <div class="split-line h-1"></div>
      <q-card-actions align="right">
        <MyPagination
          :paginationParams="albumParams.pagination"
          v-if="albumParams.pagination.rowsNumber > 0"
          @pagination="paginationInput"
          style="margin-top: -26px; margin-right: 16px"
        ></MyPagination>
        <q-btn flat label="取消" color="primary" @click="hide" />
        <q-btn label="确定" color="primary" @click="confirmPick" :disable="!albumParams.currentPick || (albumParams.currentPick && !albumParams.currentPick.length)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { uniqBy } from 'lodash';

@Component({ name: 'myPostAlbumComponent', emits: ['pick', 'hide'] })
export default class myPostAlbumComponent extends Vue {
  @Prop({ type: Boolean, default: false }) public readonly multiple!: boolean;
  @Prop({ type: Number, default: 8 }) public readonly 'maxMultiple'!: number;
  get categoryName() {
    return (id: any) => {
      const item: any = this.albumParams.category.find((item: any) => item.id === id);
      return item ? item.label : '';
    };
  }
  get isPicked() {
    return (id: any) => {
      if (!this.albumParams.currentPick) return false;
      if (!this.multiple) {
        return this.albumParams.currentPick === id;
      } else {
        return this.albumParams.currentPick.includes(id);
      }
    };
  }
  public albumParams = {
    model: false,
    data: [],
    allData: [],
    category: [],
    currentPick: this.multiple ? ([] as string[]) : null,
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
    this.albumParams.pagination = data;
    this.getData();
  }
  public handleClickQuery() {
    this.albumParams.pagination.page = 1;
    this.getData();
  }
  public show() {
    this.albumParams.model = true;
  }
  public hide() {
    this.albumParams.model = false;
    this.$emit('hide');
  }
  public confirmPick() {
    if (!this.multiple) {
      const item = this.albumParams.allData.find((item: any) => item.id === this.albumParams.currentPick);
      this.albumParams.model = false;
      this.albumParams.currentPick = null;
      this.$emit('pick', item);
    } else {
      const items = this.albumParams.allData.filter((item: any) => this.albumParams.currentPick!.includes(item.id));
      this.albumParams.model = false;
      this.albumParams.currentPick = [];
      this.$emit('pick', items);
    }
    this.$emit('hide');
  }
  public pickAlbum(item: any) {
    if (!this.multiple) {
      if (this.albumParams.currentPick === item.id) {
        this.albumParams.currentPick = null;
        return;
      }
      this.albumParams.currentPick = item.id;
    } else {
      if (this.albumParams.currentPick!.includes(item.id)) {
        this.albumParams.currentPick = this.albumParams.currentPick!.filter((id: any) => id !== item.id);
        return;
      }
      if (this.albumParams.currentPick!.length >= this.maxMultiple) {
        this.$globalMessage.show({
          type: 'error',
          content: `最多只能选择${this.maxMultiple}张图片！`,
        });
        return;
      }
      this.albumParams.currentPick?.push(item.id);
    }
  }
  public init() {
    this.show();
    this.albumParams.data = [];
    this.albumParams.allData = [];
    this.albumParams.params.category = [];
    this.albumParams.pagination.rowsNumber = 0;
    this.albumParams.pagination.page = 1;
    this.getData();
    this.getAlbumCategory();
  }
  /* http */
  public async getData() {
    try {
      const { pageData, total } = await BlogPostModule.getAllCover({
        categoryIds: this.albumParams.params.category,
        page: this.albumParams.pagination.page,
        rowsPerPage: this.albumParams.pagination.rowsPerPage,
      });
      if (pageData && pageData.length) {
        this.albumParams.data = pageData;
        this.albumParams.allData = this.albumParams.allData.concat(pageData);
        this.albumParams.allData = uniqBy(this.albumParams.allData, 'id');
        this.albumParams.pagination.rowsNumber = total;
      } else {
        this.albumParams.data = [];
        this.albumParams.pagination.rowsNumber = 0;
      }
    } catch (error) {}
  }
  public async getAlbumCategory() {
    try {
      this.albumParams.category = [];
      const result = await BlogPostModule.queryCategory({});
      if (result && result.length) {
        this.albumParams.category = result.map((item: any) => {
          return {
            value: item.id,
            ...item,
          };
        });
      } else {
        this.albumParams.category = [];
      }
    } catch (error) {}
  }
}
</script>

<style scoped lang="scss">
.album-list {
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
    .img {
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
