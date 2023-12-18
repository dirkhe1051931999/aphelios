<template>
  <div v-if="postDetail.title">
    <van-sticky>
      <van-nav-bar title="资讯频道" @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" color="black" size="20px" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <header>
      <h1>
        {{ postDetail.title }}
      </h1>
      <div class="author-date">
        <img :src="postDetail.author.avatarUrl" alt="avatarUrl" class="avatar" />
        <div class="author">
          <span>{{ postDetail.author.name }}</span>
          <div class="date">{{ timeAgo(postDetail.createTime) }}</div>
        </div>
      </div>
    </header>
    <div class="post-content" v-html="postDetail.content" />
    <div class="comment-list-container">
      <div class="sort-column">
        <span :class="{ active: commentParams.sortColumn === 0 }" @click="setActiveSortColumn(0)">最新</span>
        <span class="split-line"></span>
        <span :class="{ active: commentParams.sortColumn === 1 }" @click="setActiveSortColumn(1)">最热</span>
        <span class="split-line"></span>
        <span :class="{ active: commentParams.sortColumn === 2 }" @click="setActiveSortColumn(2)">本人</span>
      </div>
      <van-loading v-show="commentParams.loading" />
      <van-empty v-show="commentParams.noData" description="没数据，老铁~" />
      <ul class="comment-list">
        <li v-for="(item, index) in commentParams.list" :key="index">
          <div class="comment-item">
            <div class="comment-item-header">
              <img :src="item.account.avatarUrl" alt="avatarUrl" class="avatar" />
              <div class="author">
                <span>{{ item.account.username }}</span>
                <div class="date">{{ timeAgo(item.postTime) }}</div>
              </div>
              <div class="like-count">
                <van-icon name="like-o" color="#888888" size="20px" />
                {{ item.like }}
              </div>
            </div>
            <div class="comment-item-content">
              <div v-html="item.content" />
              <ul class="comment-children-list" v-if="item.children.length">
                <li v-for="child in item.children" :key="child.id">
                  <div class="comment-item-header">
                    <img :src="child.replyAccount.avatarUrl" alt="avatarUrl" class="avatar" />
                    <div class="author">
                      <span>{{ child.replyAccount.username }}</span>
                      <div class="date">{{ timeAgo(child.postTime) }}</div>
                    </div>
                    <div class="like-count">
                      <van-icon name="like-o" color="#888888" size="20px" />
                      {{ child.like }}
                    </div>
                  </div>
                  <div class="reply-user" v-if="child.replyId !== child.topId">
                    <span>回复:</span>
                    <div class="reply-content">{{ child.replyContent }}</div>
                  </div>
                  <div class="reply" :class="{ 'no-reply': child.replyId === child.topId }">
                    {{ child.content }}
                  </div>
                </li>
              </ul>
              <div v-if="item.childCommentCount && !item.noChildrenData" class="expand-children" @click="getPostLevel2CommentsById(item)">
                <van-icon name="arrow" />
                查看{{ item.childCommentCount }}条回复
                <van-loading v-show="item.childrenDataLoading" size="12px" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="post-footer-bak"></div>
    <div class="post-footer">
      <div class="post-footer-item">
        <van-icon name="like-o" color="#888888" size="20px" />
        点赞
      </div>
      <div class="post-footer-item">
        <van-icon name="share-o" color="#888888" size="20px" />
        分享
      </div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '~/utils/tools';

export default {
  data() {
    return {
      commentParams: {
        sortColumn: 0,
        loading: false,
        noData: false,
        list: [],
        pagination: {
          rowsPerPage: 10,
          page: 1,
          total: 0,
        },
      },
    };
  },
  computed: {
    postDetail() {
      return this.$store.getters['modules/post_detail/postDetail'];
    },
  },
  mounted() {
    if (this.postDetail.id) {
      this.getPostLevel1CommentsById();
    }
  },
  methods: {
    onClickLeft() {
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', false);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', null);
      this.$store.commit('modules/post_detail/SET_POST_DETAIL', {});
    },
    timeAgo,
    setActiveSortColumn(index) {
      this.commentParams.sortColumn = index;
    },
    async getPostLevel1CommentsById() {
      try {
        this.commentParams.loading = true;
        const { total, pageData } = await this.$store.dispatch('modules/post_detail/getPostLevel1CommentsById', { id: this.postDetail.id, ...this.commentParams.pagination });
        this.commentParams.pagination.total = total;
        if (pageData && pageData.length) {
          for (const item of pageData) {
            item.children = [];
            item.childrenDataLoading = false;
            item.noChildrenData = false;
            item.childrenPagination = {
              rowsPerPage: 10,
              page: 1,
            };
          }
          this.commentParams.list = pageData;
        }
        if (!total) {
          this.commentParams.noData = true;
        }
        this.commentParams.loading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async getPostLevel2CommentsById(item) {
      try {
        const parent = this.commentParams.list.find((i) => i.id2 === item.id2);
        if (parent.childrenDataLoading || parent.noChildrenData) {
          return;
        }
        parent.childrenDataLoading = true;
        const { pageData } = await this.$store.dispatch('modules/post_detail/getPostLevel2CommentsById', { id: item.id2, ...parent.childrenPagination });
        if (pageData && pageData.length < 10) {
          parent.noChildrenData = true;
        } else {
          parent.childrenPagination.page++;
          parent.noChildrenData = false;
          parent.childCommentCount = parent.childCommentCount - pageData.length;
        }
        parent.children = parent.children.concat(pageData);
        parent.childrenDataLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="scss">
@import 'Index';
</style>
<style lang="scss" scoped>
$white-color: #ffffff;
$border-color: #dddddd;
$primary-color: #5469d4;
$gray-color: #888888;
$light-gray-bg: #f5f5f5;

header {
  padding: 10px 15px;
  background-color: $white-color;

  h1 {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .author-date {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: $gray-color;
    line-height: 1.5;
    margin-bottom: 10px;

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .author {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .date {
      margin-top: 5px;
    }
  }
}

.divider {
  padding: 0 20px;
}

.comment-list-container {
  .sort-column {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: $white-color;
    padding: 0 20px;

    span {
      font-size: 14px;
      color: $gray-color;

      &.active {
        color: $primary-color;
      }

      &.split-line {
        margin: 0 10px;
        width: 1px;
        height: 20px;
        background-color: $border-color;
      }
    }
  }

  .comment-list {
    margin-top: 10px;
    background-color: $white-color;
    padding: 0 20px;

    li {
      border-bottom: 1px solid $border-color;
      margin-bottom: 8px;

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
    }

    .comment-item {
      padding: 10px 0;

      .comment-item-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .author {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .date {
          margin-top: 5px;
          color: $gray-color;
        }

        .like-count {
          margin-left: auto;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: $gray-color;

          .van-icon {
            margin-right: 5px;
          }
        }
      }

      .comment-item-content {
        font-size: 14px;
        line-height: 1.6;

        .expand-children {
          display: flex;
          align-items: center;
          color: $primary-color;
          font-size: 12px;
          margin-top: 10px;

          .van-icon {
            margin-right: 5px;
          }
        }
      }
    }

    .comment-children-list {
      margin-top: 10px;
      padding: 16px;
      border-radius: 4px;
      background: $light-gray-bg;

      li {
        border-bottom: 1px solid $border-color;
        margin-bottom: 8px;

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
      }

      .comment-item-header {
        display: flex;
        align-items: center;
        margin-bottom: 0;

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .author {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .date {
          margin-top: 0;
          color: $gray-color;
        }

        .like-count {
          margin-left: auto;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: $gray-color;

          .van-icon {
            margin-right: 5px;
          }
        }
      }

      .reply-user {
        display: grid;
        grid-template-columns: auto 1fr;
        font-size: 12px;
        color: $gray-color;
        padding-top: 10px;

        span {
          margin-right: 5px;
          width: 30px;
        }

        .reply-content {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .reply {
        font-size: 14px;
        line-height: 1.6;
        padding: 10px 0 10px 0;
      }
    }
  }
}

.post-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  background-color: $white-color;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid $border-color;

  .post-footer-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: $gray-color;

    .van-icon {
      margin-bottom: 5px;
    }
  }
}

.post-footer-bak {
  height: 50px;
  background-color: $white-color;
}
</style>
