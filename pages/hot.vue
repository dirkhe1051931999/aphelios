<template>
  <van-tabs type="card" animated class="tabs" color="#5469d4">
    <van-tab v-for="(item, index) in tabs" :title="item.title" :key="index">
      <div class="hot-news-container" v-if="item.id === 'hot-news'">
        <ul v-if="hotTop.newsData.length">
          <li v-for="(item, index) in hotTop.newsData" :key="item.id" @click="toNewsDetailFromHot(item)">
            <div class="left">
              {{ index + 1 }}
            </div>
            <div class="content">
              <div class="top">
                {{ item.title }}
              </div>
              <div class="bottom">
                <span>
                  {{ item.author.name }}
                </span>
                <span v-if="item.comment"> {{ item.comment }} 评 </span>
                <span class="ml-1">
                  {{ timeAgo(item.createTime) }}
                </span>
                <span v-if="item.view" style="margin-left: auto">
                  <van-icon name="eye-o" />
                  {{ item.view }}
                </span>
              </div>
            </div>
            <div class="right">
              <van-image :src="item.postType === '2' && item.videoPoster ? item.videoPoster : item.poster" radius="4" class="image">
                <template v-slot:loading>
                  <van-loading type="spinner" size="12" />
                </template>
                <template v-slot:error>
                  <img :src="randomDefaultImage()" fit="cover" class="image" />
                </template>
              </van-image>
            </div>
          </li>
        </ul>
      </div>
      <div class="hot-author-container" v-if="item.id === 'hot-author'">
        <ul>
          <li v-for="(item, index) in hotTop.authorData" :key="item.id" @click="toAuthorDetail(item)">
            <div class="left">
              {{ index + 1 }}
            </div>
            <div class="content">
              <div class="top">
                <span>{{ item.name }}</span>
                <span class="sub">{{ item.nick }}</span>
              </div>
              <div class="desc">
                {{ item.description }}
              </div>
              <div class="bottom">
                <span> {{ item.followCount }} 关注 </span>
                <span> {{ item.fansCount }} 粉丝 </span>
                <span> {{ item.posts }} 文章 </span>
              </div>
            </div>
            <div class="right">
              <van-image :src="item.avatarUrl" radius="50%" class="image" fit="cover">
                <template v-slot:loading>
                  <van-loading type="spinner" size="12" />
                </template>
              </van-image>
            </div>
          </li>
        </ul>
      </div>
      <div class="hot-comment-container" v-if="item.id === 'hot-comment'">
        <ul>
          <li v-for="(item, index) in hotTop.commentData" :key="item.id">
            <div class="left">
              {{ index + 1 }}
            </div>
            <div class="content">
              <div class="top">
                <span class="username" @click="toUserDetail(item)"> {{ item.user.username }}：</span>
                {{ item.content }}
              </div>
              <div class="bottom" @click="toNewsDetailFromComment(item)">
                <div class="cover">
                  <van-image :src="item.post.postType === '2' && item.post.videoPoster ? item.post.videoPoster : item.post.poster" radius="4" class="image">
                    <template v-slot:loading>
                      <van-loading type="spinner" size="12" />
                    </template>
                    <template v-slot:error>
                      <img :src="randomDefaultImage()" fit="cover" class="image" />
                    </template>
                  </van-image>
                </div>
                <div class="title">
                  {{ item.post.title }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </van-tab>
  </van-tabs>
</template>

<script>
import { mapGetters } from 'vuex';
import { removeKeywordStyle, timeAgo } from '~/utils/tools';
import PostDetail from '~/components/PostDetail/Index.vue';
import UserDetail from '~/components/UserDetail/Index.vue';
import AuthorDetail from '~/components/AuthorDetail/Index.vue';

export default {
  layout: 'navigation-page',
  async asyncData({ store }) {
    await store.dispatch('modules/home/fetchHotTop');
  },
  computed: {
    ...mapGetters({
      hotTop: 'modules/home/hotTop',
    }),
  },
  data() {
    return {
      tabs: [
        {
          title: '热门新闻',
          id: 'hot-news',
        },
        {
          title: '热门作者',
          id: 'hot-author',
        },
        {
          title: '热门评论',
          id: 'hot-comment',
        },
      ],
    };
  },
  methods: {
    randomDefaultImage() {
      const random = Math.floor(Math.random() * 5) + 1;
      return require(`~/assets/images/default-${random}.jpg`);
    },
    timeAgo(timestamp) {
      return timeAgo(timestamp);
    },
    getPostFrom(item) {
      let from = '';
      if ((item.postType === '1' && item.political === '0' && item.carousel === '0') || (item.postType === '2' && item.videoPoster)) {
        from = 'post-normal';
      } else if (item.postType === '2' && !item.videoPoster) {
        from = 'post-video';
      } else if (item.postType === '3') {
        from = 'post-gallery';
      }
      return from;
    },
    toNewsDetailFromHot(item) {
      const from = this.getPostFrom(item);
      item.title = removeKeywordStyle(item.title);
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', true);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', PostDetail);
      this.$store.commit('modules/post_detail/SET_POST_DETAIL', { ...item, fr: from });
    },
    toNewsDetailFromComment(item) {
      const post = item.post;
      const from = this.getPostFrom(post);
      post.title = removeKeywordStyle(post.title);
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', true);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', PostDetail);
      this.$store.commit('modules/post_detail/SET_POST_DETAIL', { ...post, fr: from });
    },
    toUserDetail(item) {
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', true);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', UserDetail);
      this.$store.commit('modules/user_detail/SET_USER_DETAIL', item.user);
    },
    toAuthorDetail(item) {
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', true);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', AuthorDetail);
      this.$store.commit('modules/author_detail/SET_AUTHOR_DETAIL', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  padding-top: 16px;
  background: $white-color;
}

.hot-news-container {
  background: $white-color;
  padding: 12px;
  padding-bottom: 0;

  ul {
    li {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .left {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-style: italic;
        background: $background-color;
        padding: 6px;
        border-radius: 50%;
        width: 34px;
        height: 34px;
      }

      .content {
        flex: 1;
        padding: 0 12px;
        display: flex;
        flex-direction: column;
        min-height: 60px;

        .top {
          font-size: 14px;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          padding-bottom: 4px;
        }

        .bottom {
          font-size: 12px;
          color: $subtle-text-color;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          margin-top: auto;
          display: flex;
          align-items: center;
        }
      }

      .right {
        width: 80px;
        height: 60px;

        .image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.hot-author-container {
  background: $white-color;
  padding: 12px;
  padding-bottom: 0;

  ul {
    li {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .left {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-style: italic;
        background: $background-color;
        padding: 6px;
        border-radius: 50%;
        width: 34px;
        height: 34px;
      }

      .content {
        flex: 1;
        padding: 0 12px;
        display: flex;
        flex-direction: column;
        min-height: 60px;

        .top {
          font-size: 14px;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          padding-bottom: 4px;
          font-weight: 600;

          .sub {
            font-size: 12px;
            color: $subtle-text-color;
            margin-left: 4px;
          }
        }

        .desc {
          font-size: 12px;
          color: $subtle-text-color;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          padding-bottom: 4px;
        }

        .bottom {
          font-size: 12px;
          color: $subtle-text-color;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          margin-top: auto;
        }
      }

      .right {
        width: 60px;
        height: 60px;

        .image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.hot-comment-container {
  background: $white-color;
  padding: 12px;
  padding-bottom: 0;

  ul {
    li {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .left {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-style: italic;
        background: $background-color;
        padding: 6px;
        border-radius: 50%;
        width: 34px;
        height: 34px;
      }

      .content {
        flex: 1;
        padding: 0 12px;
        display: flex;
        flex-direction: column;
        min-height: 60px;

        .top {
          font-size: 16px;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          padding-bottom: 4px;

          .username {
            font-weight: 600;
          }
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          background: $background-color;
          border-radius: 4px;
          padding: 12px 12px;

          .cover {
            width: 30%;
            height: 60px;

            .image {
              width: 100%;
              height: 100%;
            }
          }

          .title {
            height: 60px;
            width: 65%;
            font-size: 14px;
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>
