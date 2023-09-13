<template>
  <van-tabs type="card" animated class="tabs">
    <van-tab v-for="(item, index) in tabs" :title="item.title" :key="index">
      <div class="hot-news-container" v-if="item.id === 'hot-news'">
        <ul v-if="hotTop.newsData.length">
          <li v-for="(item, index) in hotTop.newsData" :key="item.id">
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
                <span>
                  {{ timeAgo(item.createTime) }}
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
          <li v-for="(item, index) in hotTop.authorData" :key="item.id">
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
              <van-image :src="item.avatarUrl" radius="4" class="image">
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
                <span class="username"> {{ item.user.username }}：</span>
                {{ item.content }}
              </div>
              <div class="bottom">
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
import { timeAgo } from '~/utils/tools';

export default {
  async asyncData({ store }) {
    await store.dispatch('modules/home/fetchHotTop');
  },
  layout: 'navigation-page',
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
        text-align: center;
        font-size: 16px;
        margin-bottom: auto;
        margin-top: 10px;
        font-weight: 600;
        font-style: italic;
        background: $background-color;
        padding: 6px;
        border-radius: 50%;
        width: 20px;
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
        text-align: center;
        font-size: 16px;
        margin-bottom: auto;
        margin-top: 10px;
        font-weight: 600;
        font-style: italic;
        background: $background-color;
        padding: 6px;
        border-radius: 50%;
        width: 20px;
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
        text-align: center;
        font-size: 16px;
        margin-bottom: auto;
        margin-top: 10px;
        font-weight: 600;
        font-style: italic;
        background: $background-color;
        padding: 6px;
        border-radius: 50%;
        width: 20px;
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
