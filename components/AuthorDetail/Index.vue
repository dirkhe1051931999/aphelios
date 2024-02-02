<template>
  <div>
    <van-sticky ref="navigationRef">
      <van-nav-bar title="详情">
        <template #left>
          <van-icon name="arrow-left" color="black" size="20px" @click="onClickLeft" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="header-container" :style="calcAuthorCover">
      <div class="header-top">
        <van-image width="48px" height="48px" fit="cover" :src="authorDetail.avatarUrl" round />
        <van-button type="info" size="small" class="follow">关注</van-button>
      </div>
      <div class="header-name">
        <span class="mr-2">
          {{ authorDetail.name }}
        </span>
        <img src="~assets/images/profile/verified.png" alt="" class="verified" v-if="authorDetail.type === 0" />
      </div>
      <div class="header-nickname">{{ authorDetail.description }}</div>
      <ul class="header-count">
        <li>
          <p>文章数</p>
          <p>{{ authorDetail.posts }}</p>
        </li>
        <li>
          <p>粉丝数</p>
          <p>{{ authorDetail.fansCount }}</p>
        </li>
        <li>
          <p>关注数</p>
          <p>{{ authorDetail.followCount }}</p>
        </li>
      </ul>
    </div>
    <div class="tabs">
      <van-tabs v-model="tabsParams.active" ref="tabsRef">
        <van-tab title="文章">
          <ul class="post-list-container" @scroll="onPostListScroll">
            <li v-for="(post, index) in authorPosts.pageData" :key="post.id + index" @click="toNewsDetailFromAuthorPost(post)">
              <div class="content">
                <van-image fit="cover" :src="post.poster">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="12" />
                  </template>
                  <template v-slot:error>
                    <img :src="randomDefaultImage()" fit="cover" class="image" />
                  </template>
                </van-image>
                <h3>{{ post.title }}</h3>
              </div>
              <div class="info">
                <div>
                  <van-icon name="clock-o" />
                  {{ timeAgo(post.createTime) }}
                </div>
                <div>
                  <van-icon name="eye-o" />
                  {{ post.view }}
                </div>
                <div>
                  <van-icon name="comment-o" />
                  {{ post.comment }}
                </div>
              </div>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '~/utils/tools';
import PostDetail from '~/components/PostDetail/Index.vue';

export default {
  data() {
    return {
      authorPosts: {
        pageData: [],
        total: 0,
        lockPageToBottom: false,
      },
      tabsParams: {
        active: 0,
        pagination: {
          rowsPerPage: 10,
          page: 1,
        },
      },
    };
  },
  computed: {
    authorDetail() {
      return this.$store.getters['modules/author_detail/authorDetail'];
    },
    calcAuthorCover() {
      return {
        background: `rgba(0, 0, 0, 0.5) url(${this.authorDetail.coverUrl}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
  },
  mounted() {
    this.$nextTick(async () => {
      const $postListContainer = document.querySelector('.post-list-container');
      const $navigationHeight = this.$refs.navigationRef.$el.clientHeight;
      const $headerContainerHeight = document.querySelector('.header-container').clientHeight;
      const $tabHeight = this.$refs.tabsRef.$children[1].$el.clientHeight;
      $postListContainer.style.height = `calc(100vh - ${$navigationHeight + $headerContainerHeight + $tabHeight + 10}px)`;
      this.authorPosts = await this.$store.dispatch('modules/author_detail/getAuthorPost', {
        id: this.authorDetail.id,
        rowsPerPage: this.tabsParams.pagination.rowsPerPage,
        page: this.tabsParams.pagination.page,
      });
    });
  },
  methods: {
    timeAgo,
    randomDefaultImage() {
      const random = Math.floor(Math.random() * 5) + 1;
      return require(`~/assets/images/default-${random}.jpg`);
    },
    onClickLeft() {
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', false);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', null);
      this.$store.commit('modules/user_detail/SET_USER_DETAIL', {});
    },
    toNewsDetailFromAuthorPost(item) {
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', true);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', PostDetail);
      this.$store.commit('modules/post_detail/SET_POST_DETAIL', { ...item, fr: 'author' });
    },
    onPostListScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (this.authorDetail.total === this.authorPosts.pageData.length) {
        return;
      }
      // 判断是否滚动到底部
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        if (!this.authorPosts.lockPageToBottom) {
          this.authorPosts.lockPageToBottom = true;
          this.getMorePost();
        }
      }
    },
    async getMorePost() {
      this.tabsParams.pagination.page += 1;
      const res = await this.$store.dispatch('modules/author_detail/getAuthorPost', {
        id: this.authorDetail.id,
        rowsPerPage: this.tabsParams.pagination.rowsPerPage,
        page: this.tabsParams.pagination.page,
      });
      this.authorPosts.pageData = this.authorPosts.pageData.concat(res.pageData);
      this.authorPosts.lockPageToBottom = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.header-container {
  height: 200px;
  padding: 16px;
  position: relative;
  z-index: 1;
  // mask
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: -1;
  }

  .header-top {
    display: flex;
    align-items: center;
    padding-bottom: 16px;

    :deep(.van-button) {
      margin-left: auto;
    }
  }

  .header-name {
    display: flex;
    align-items: center;
    padding-bottom: 8px;

    span {
      color: #ffffff;
      font-size: 18px;
    }

    .verified {
      width: 20px;
      height: 20px;
    }
  }

  .header-nickname {
    font-size: 14px;
    color: #dddddd;
  }

  .header-count {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;

      p {
        font-size: 16px;
        color: #ffffff;
        margin-bottom: 10px;
      }

      p:nth-child(2) {
        font-size: 18px;
        color: #ffffff;
      }
    }
  }
}

.tabs {
  border-top: 1px solid #eeeeee;

  .post-list-container {
    padding: 16px;
    overflow: auto;

    li {
      padding: 16px 0;
      border-bottom: 1px solid #eeeeee;

      &:last-child {
        border-bottom: none;
      }

      .content {
        display: flex;
        margin-right: 16px;

        h3 {
          font-size: 16px;
          color: #333333;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .van-image {
          margin-right: 16px;
          min-width: 115px;
          max-width: 115px;
          min-height: 80px;
          max-height: 80px;
          border-radius: 4px;
        }
      }
    }

    .info {
      display: flex;
      justify-content: space-between;
      color: #999999;
      margin-top: 16px;
      font-size: 12px;

      div {
        display: flex;
        align-items: center;
        margin-right: 16px;
        font-size: 14px;

        .van-icon {
          margin-right: 4px;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
