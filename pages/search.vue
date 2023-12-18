<template>
  <div class="search-container">
    <div class="header">
      <div class="search-input">
        <van-search v-model="searchParams.value" placeholder="请输入搜索关键词" @input="searchInput" show-action @cancel="onCancel" autofocus />
      </div>
      <van-tabs v-model="searchParams.activeTab" @change="tabChange">
        <van-tab title="文章" name="post">
          <div class="search-results post" @scroll="postResultScroll">
            <van-empty image="search" description="输入关键字搜索文章" v-if="!searchParams.post.list.length && !searchParams.post.noData" />
            <van-empty class="box" :image="emptyImageSrc" description="老铁，没数据呀！" image-size="60px" v-if="searchParams.post.noData" />
            <ul>
              <li v-for="item in searchParams.post.list" :key="item.id">
                <PostItem :post="item" />
              </li>
            </ul>
            <div class="loading" v-if="searchParams.post.loading && searchParams.post.list.length === 0">
              <van-loading color="#5469d4" />
            </div>
            <div v-if="searchParams.post.noMoreData && searchParams.value" class="noMoreData">没有更多数据了</div>
          </div>
        </van-tab>
        <van-tab title="作者" name="author">
          <div class="search-results author">
            <van-empty image="search" description="输入关键字搜索作者" v-if="!searchParams.author.list.length && !searchParams.author.noData" />
            <van-empty class="box" :image="emptyImageSrc" description="老铁，没数据呀！" image-size="60px" v-if="searchParams.author.noData" />
            <ul>
              <li v-for="item in searchParams.author.list" :key="item.id">
                <div class="left">
                  <img :src="item.avatarUrl" alt="" />
                </div>
                <div class="middle">
                  <div class="top">
                    <span class="name" v-html="item.name"></span>
                    <span class="nick" v-html="item.nick"></span>
                  </div>
                  <div class="description">{{ item.description }}</div>
                </div>
                <div class="right">
                  <van-icon name="arrow" class="icon" />
                </div>
              </li>
            </ul>
            <div class="loading" v-if="searchParams.author.loading && searchParams.post.author.length === 0">
              <van-loading color="#5469d4" />
            </div>
            <div v-if="searchParams.author.noMoreData && searchParams.value" class="noMoreData">没有更多数据了</div>
          </div>
        </van-tab>
        <van-tab title="用户" name="user">
          <div class="search-results user">
            <van-empty image="search" description="输入关键字搜索用户" v-if="!searchParams.user.list.length && !searchParams.user.noData" />
            <van-empty class="box" :image="emptyImageSrc" description="老铁，没数据呀！" image-size="60px" v-if="searchParams.user.noData" />
            <ul>
              <li v-for="item in searchParams.user.list" :key="item.id">
                <div class="left">
                  <img :src="item.avatarUrl" alt="" />
                </div>
                <div class="middle">
                  <div class="top">
                    <span class="name" v-html="item.username"></span>
                    <span class="nick" v-html="item.nickname"></span>
                  </div>
                  <div class="description">{{ item.description }}</div>
                </div>
                <div class="right">
                  <van-icon name="arrow" class="icon" />
                </div>
              </li>
            </ul>
            <div class="loading" v-if="searchParams.user.loading && searchParams.post.user.length === 0">
              <van-loading color="#5469d4" />
            </div>
            <div v-if="searchParams.user.noMoreData && searchParams.value" class="noMoreData">没有更多数据了</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { cloneDeep, throttle } from 'lodash';
import PostItem from '~/components/Widget/Home/PostItem.vue';

// 给搜索keyword加上高亮的函数
function highlightKeyword(keyword, str) {
  const reg = new RegExp(keyword, 'gi');
  return str.replace(reg, `<span style="color: #e93030">${keyword}</span>`);
}

export default {
  components: { PostItem },
  data() {
    return {
      emptyImageSrc: require('~/assets/images/custom-empty-image.png'),
      searchParams: {
        activeTab: 'post',
        value: '',
        post: {
          list: [],
          hasLoad: false,
          lock: false,
          loading: false,
          noData: false,
          noMoreData: false,
          pagination: {
            page: 1,
            rowsPerPage: 10,
          },
        },
        author: {
          list: [],
          hasLoad: false,
          lock: false,
          loading: false,
          noData: false,
          noMoreData: false,
          pagination: {
            page: 1,
            rowsPerPage: 10,
          },
        },
        user: {
          list: [],
          hasLoad: false,
          lock: false,
          loading: false,
          noData: false,
          noMoreData: false,
          pagination: {
            page: 1,
            rowsPerPage: 10,
          },
        },
      },
    };
  },
  methods: {
    // 把searchInput 改成lodash的防抖函数
    searchInput: throttle(async function () {
      this.searchParams[this.searchParams.activeTab].pagination.page = 1;
      this.searchParams[this.searchParams.activeTab].hasLoad = false;
      this.searchParams[this.searchParams.activeTab].list = [];
      this.searchParams[this.searchParams.activeTab].noData = false;
      this.searchParams[this.searchParams.activeTab].lock = false;
      this.searchParams[this.searchParams.activeTab].loading = false;
      if (this.searchParams.value.trim() === '') {
        return;
      }
      await this._fetchSearch();
    }, 500),

    onCancel() {
      this.$router.back();
    },
    tabChange(name) {
      this.searchInput();
    },
    async _fetchSearch() {
      const { activeTab, value } = this.searchParams;
      const _searchParams = cloneDeep(this.searchParams);
      const { pagination } = _searchParams[activeTab];
      const { page, rowsPerPage } = pagination;
      const { data } = await this.$axios.get(`/h5/blog/post/search/`, {
        params: {
          page,
          rowsPerPage,
          keyword: value,
          type: activeTab,
        },
      });
      const { list } = data;
      list.map((item) => {
        if (this.searchParams.activeTab === 'post') {
          item.title = highlightKeyword(value, item.title);
        } else if (this.searchParams.activeTab === 'author') {
          item.name = highlightKeyword(value, item.name);
          item.nick = highlightKeyword(value, item.nick);
        } else if (this.searchParams.activeTab === 'user') {
          item.username = highlightKeyword(value, item.username);
          item.nickname = highlightKeyword(value, item.nickname);
        }
        return item;
      });
      if (list.length === 0) {
        _searchParams[activeTab].noData = true;
        _searchParams[activeTab].hasLoad = true;
        _searchParams[activeTab].loading = false;
        _searchParams[activeTab].lock = true;
        this.searchParams = _searchParams;
        return;
      }
      _searchParams[activeTab].list = list;
      _searchParams[activeTab].hasLoad = true;
      _searchParams[activeTab].loading = false;
      _searchParams[activeTab].lock = false;
      this.searchParams = _searchParams;
    },
    async _fetchSearchMore() {
      const { activeTab, value } = this.searchParams;
      const _searchParams = cloneDeep(this.searchParams);
      const { pagination } = _searchParams[activeTab];
      const { page, rowsPerPage } = pagination;
      const { data } = await this.$axios.get(`/h5/blog/post/search/`, {
        params: {
          page,
          rowsPerPage,
          keyword: value,
          type: activeTab,
        },
      });
      const { list } = data;
      list.map((item) => {
        if (this.searchParams.activeTab === 'post') {
          item.title = highlightKeyword(value, item.title);
        } else if (this.searchParams.activeTab === 'author') {
          item.name = highlightKeyword(value, item.name);
          item.nick = highlightKeyword(value, item.nick);
        } else if (this.searchParams.activeTab === 'user') {
          item.username = highlightKeyword(value, item.username);
          item.nickname = highlightKeyword(value, item.nickname);
        }
        return item;
      });
      if (list.length < _searchParams[activeTab].pagination.rowsPerPage) {
        _searchParams[activeTab].noMoreData = true;
        _searchParams[activeTab].loading = false;
        _searchParams[activeTab].lock = true;
        this.searchParams = _searchParams;
        return;
      }
      _searchParams[activeTab].list = _searchParams[activeTab].list.concat(list);
      _searchParams[activeTab].hasLoad = true;
      _searchParams[activeTab].loading = false;
      _searchParams[activeTab].lock = false;
      this.searchParams = _searchParams;
    },
    async postResultScroll($event) {
      const { scrollTop, scrollHeight, clientHeight } = $event.target;
      const offset = 100;
      const { activeTab } = this.searchParams;
      const _searchParams = cloneDeep(this.searchParams);
      const { pagination } = _searchParams[activeTab];
      const { page, rowsPerPage } = pagination;
      if (scrollTop === 0) return;
      if (scrollTop + clientHeight >= scrollHeight - offset) {
        if (_searchParams[activeTab].lock) return;
        _searchParams[activeTab].lock = true;
        _searchParams[activeTab].loading = true;
        _searchParams[activeTab].pagination.page = page + 1;
        this.searchParams = _searchParams;
        await this._fetchSearchMore();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    max-height: 100px;
    background: $white-color;
  }

  .search-results {
    border-top: solid 1px $border-color;
    padding: 10px 12px;
    padding-bottom: 0;
    overflow: auto;
    position: fixed;
    width: 100%;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    left: 0;
    top: 100px;
    background: $white-color;

    .noMoreData {
      text-align: center;
      padding: 10px 0;
      color: $subtle-body-color;
    }

    &.author,
    &.user {
      padding-top: 0;

      ul {
        li {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: solid 1px $border-color;

          .left {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .middle {
            padding-left: 10px;
            width: calc(100% - 48px);

            .top {
              display: flex;
              align-items: center;

              .name {
                font-size: 16px;
              }

              .nick {
                font-size: 14px;
                margin-left: 10px;
                color: $subtle-body-color;
              }
            }

            .description {
              font-size: 14px;
              margin-top: 10px;
              color: $subtle-body-color;
            }
          }

          .arrow {
            color: $subtle-body-color;

            .icon {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
