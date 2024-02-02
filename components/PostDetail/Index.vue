<template>
  <div>
    <van-sticky>
      <van-nav-bar title="资讯频道">
        <template #left>
          <van-icon name="arrow-left" color="black" size="20px" @click="onClickLeft" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div v-if="postDetail.title">
      <img :src="addPostViewUrl + '?id=' + postDetail.id" alt="addPostViewUrl" style="display: none" />
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
      <Galleries v-if="postDetail.postType === '3'" />
      <Player v-if="postDetail.postType === '2'" />
      <div class="post-content" v-html="postDetail.content" />
      <div class="comment-list-container">
        <div class="sort-column">
          <span :class="{ active: commentParams.sortColumn === 0 }" @click="setActiveSortColumn(0)">最新</span>
          <span class="split-line"></span>
          <span :class="{ active: commentParams.sortColumn === 1 }" @click="setActiveSortColumn(1)">最热</span>
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
                <div class="like-count" v-if="userinfo">
                  <van-icon name="like-o" color="#888888" size="12px" />
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
                      <div class="like-count" v-if="userinfo">
                        <van-icon name="like-o" color="#888888" size="12px" />
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
                    <div class="action-reply-report" v-if="userinfo">
                      <div class="replay" @click="replyPostComment(child)">
                        <van-icon name="chat-o" />
                        回复
                      </div>
                      <div class="report">
                        <van-icon name="warning-o" />
                        举报
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-if="item.childCommentCount && !item.noChildrenData" class="expand-children" @click="getPostLevel2CommentsById(item)">
                  <van-icon name="arrow" />
                  查看{{ item.childCommentCount }}条回复
                  <van-loading v-show="item.childrenDataLoading" size="12px" />
                </div>
                <div class="action-reply-report" v-if="userinfo">
                  <div class="replay" @click="replyPostComment(item)">
                    <van-icon name="chat-o" />
                    回复
                  </div>
                  <div class="report">
                    <van-icon name="warning-o" />
                    举报
                  </div>
                </div>
              </div>
            </div>
          </li>
          <div v-show="commentParams.noAnyData && !commentParams.noData" class="no-any-data">没有更多数据了</div>
        </ul>
      </div>
      <van-action-sheet v-model="commentActionParams.visible" title="" @close="commentActionDialogClose">
        <div class="comment-dialog-content">
          <div class="title">
            {{ postDetail.title }}
          </div>
          <SimpleRichTextInput ref="SimpleRichTextInputRef" @submit="onSimpleRichTextInputSubmit" />
        </div>
      </van-action-sheet>
      <van-share-sheet v-model="shareActionParams.visible" title="立即分享给好友" :options="shareActionParams.options" />
      <div class="post-footer-bak"></div>
      <div class="post-footer">
        <div class="post-footer-item">
          <van-icon name="like-o" color="#888888" size="20px" v-authenticate />
          点赞
        </div>
        <div class="post-footer-item" @click="addPostComment" v-authenticate>
          <van-icon name="comment-o" color="#888888" size="20px" />
          评论
        </div>
        <div class="post-footer-item" @click="openShareDialog" v-authenticate>
          <van-icon name="share-o" color="#888888" size="20px" />
          分享
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { timeAgo } from '~/utils/tools';
import Galleries from '~/components/PostDetail/Widget/Galleries.vue';
import Player from '~/components/PostDetail/Widget/Player.vue';
import SimpleRichTextInput from '~/components/PostDetail/Widget/SimpleRichTextInput.vue';
import Config from '~/utils/config';

const COMMENT_PARAMS = {
  sortColumn: 0,
  loading: false,
  noData: false,
  noAnyData: false,
  list: [],
  pagination: {
    rowsPerPage: 10,
    page: 1,
    total: 0,
  },
};
export default {
  components: {
    Galleries,
    Player,
    SimpleRichTextInput,
  },
  data() {
    return {
      addPostViewUrl: Config.oldCdnUrl + '/h5/blog/post/addPostView',
      commentParams: cloneDeep(COMMENT_PARAMS),
      commentActionParams: {
        visible: false,
        model: '',
        isReply: false,
        currentRow: {},
      },
      shareActionParams: {
        visible: false,
        options: [
          [
            { name: '微信', icon: 'wechat' },
            { name: '朋友圈', icon: 'wechat-moments' },
            { name: '微博', icon: 'weibo' },
            { name: 'QQ', icon: 'qq' },
          ],
          [
            { name: '复制链接', icon: 'link' },
            { name: '分享海报', icon: 'poster' },
            { name: '二维码', icon: 'qrcode' },
            { name: '小程序码', icon: 'weapp-qrcode' },
          ],
        ],
      },
    };
  },
  computed: {
    postDetail() {
      return this.$store.getters['modules/post_detail/postDetail'];
    },
    userinfo() {
      return this.$store.getters['modules/user/userInfo'];
    },
    pageToBottom() {
      return this.$store.getters['modules/post_detail/pageToBottom'];
    },
    lockPageToBottom() {
      return this.$store.getters['modules/post_detail/lockPageToBottom'];
    },
  },
  watch: {
    pageToBottom(val) {
      if (val) {
        if (this.commentParams.noAnyData) {
          return;
        }
        this.commentParams.pagination.page++;
        this.getPostLevel1CommentsById();
      }
    },
  },
  mounted() {
    this.commentParams = cloneDeep(COMMENT_PARAMS);
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
    addPostComment() {
      this.commentActionParams.isReply = false;
      this.commentActionParams.currentRow = {};
      this.commentActionParams.visible = true;
    },
    replyPostComment(item) {
      this.commentActionParams.isReply = true;
      this.commentActionParams.currentRow = item;
      this.commentActionParams.visible = true;
    },
    onSimpleRichTextInputSubmit(content) {
      this.commentActionParams.visible = false;
      if (!this.commentActionParams.isReply) {
        this.$store.dispatch('modules/post_detail/addPostComment', {
          content,
          postId: this.postDetail.id,
          userId: this.$store.getters['modules/user/userInfo'].id,
        });
        this.commentParams.list.unshift({
          account: this.$store.getters['modules/user/userInfo'],
          createTime: new Date().getTime(),
          children: [],
          childrenDataLoading: false,
          id: new Date().getTime(),
          id2: new Date().getTime(),
          content,
          postId: this.postDetail.id,
          replyId: null,
          status: 1,
          postTime: new Date().getTime(),
          like: 0,
          unlike: 0,
          topId: null,
          childCommentCount: 0,
        });
      } else {
        this.$store.dispatch('modules/post_detail/replyUserComment', {
          topId: !this.commentActionParams.currentRow.topId && !this.commentActionParams.currentRow.replyId ? this.commentActionParams.currentRow.id2 : this.commentActionParams.currentRow.topId, // 是回复的评论的id
          content, // 是回复的内容
          postId: this.postDetail.id, // 是帖子的id
          userId: this.$store.getters['modules/user/userInfo'].id, // 是回复者的id
          replyId: this.commentActionParams.currentRow.id2, // 是回复的评论的id
        });
        if (!this.commentActionParams.currentRow.replyId) {
          const parent = this.commentParams.list.find((i) => i.id2 === this.commentActionParams.currentRow.id2);
          parent.children = parent.children.concat([
            {
              account: parent.account,
              replyAccount: this.$store.getters['modules/user/userInfo'],
              replyContent: this.commentActionParams.currentRow.content,
              content,
              id: new Date().getTime(),
              id2: new Date().getTime(),
              postId: this.postDetail.id,
              userId: this.$store.getters['modules/user/userInfo'].id,
              replyId: this.commentActionParams.currentRow.id2,
              status: 1,
              postTime: new Date().getTime(),
              like: 0,
              unlike: 0,
              topId: this.commentActionParams.currentRow.id2,
            },
          ]);
          parent.children = parent.children.reverse();
        } else {
          const parent = this.commentParams.list.find((i) => i.id2 === this.commentActionParams.currentRow.topId);
          const child = parent.children.find((i) => i.id2 === this.commentActionParams.currentRow.id2);
          parent.children = parent.children.concat([
            {
              account: child.account,
              replyAccount: this.$store.getters['modules/user/userInfo'],
              replyContent: this.commentActionParams.currentRow.content,
              content,
              id: new Date().getTime(),
              id2: new Date().getTime(),
              postId: this.postDetail.id,
              userId: this.$store.getters['modules/user/userInfo'].id,
              replyId: this.commentActionParams.currentRow.id2,
              status: 1,
              postTime: new Date().getTime(),
              like: 0,
              unlike: 0,
              topId: this.commentActionParams.currentRow.topId,
            },
          ]);
          parent.children = parent.children.reverse();
        }
      }
      if (this.commentParams.noData) {
        this.commentParams.noData = false;
      }
    },
    openShareDialog() {
      this.shareActionParams.visible = true;
    },
    commentActionDialogClose() {
      this.$refs.SimpleRichTextInputRef.clearData();
      this.commentActionParams.isReply = false;
      this.commentActionParams.currentRow = {};
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
          this.commentParams.list = this.commentParams.list.concat(pageData);
        }
        if (!total) {
          this.commentParams.noData = true;
        }
        this.commentParams.loading = false;
        if (pageData.length < 10) {
          this.commentParams.noAnyData = true;
        }
        this.$store.commit('modules/post_detail/SET_PAGE_TO_BOTTOM', false);
        this.$store.commit('modules/post_detail/SET_LOCK_PAGE_TO_BOTTOM', false);
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

    .no-any-data {
      text-align: center;
      padding: 10px 0;
      color: $gray-color;
    }

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

        .action-reply-report {
          display: flex;
          margin-top: 10px;
          font-size: 12px;
          color: $gray-color;

          .replay {
            display: flex;
            align-items: center;
            margin-right: 20px;

            .van-icon {
              margin-right: 5px;
            }
          }

          .report {
            display: flex;
            align-items: center;

            .van-icon {
              margin-right: 5px;
            }
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

          .action-reply-report {
            margin-bottom: 0;
          }
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

      .action-reply-report {
        margin-top: 0 !important;
        margin-bottom: 10px;
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

.comment-dialog-content {
  min-height: 100px;
  background-color: $white-color;
  font-size: 14px;
  position: relative;
  .title {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
  }
}
</style>
