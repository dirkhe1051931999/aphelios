<template>
  <van-swipe :loop="false" :height="220" class="swipe" indicator-color="#5469d4">
    <van-swipe-item v-for="item in postList" :key="item.id" class="swipe-item" @click="toPostDetail(item, 'post-carousel')">
      <div class="image-container">
        <van-image :src="item.poster" class="image">
          <template #loading>
            <van-loading type="spinner" size="12" />
          </template>
          <template #error>
            <img :src="randomDefaultImage()" class="image" />
          </template>
        </van-image>
        <div class="cover">
          <div class="title">
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
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import { timeAgo } from '~/utils/tools';
import PostDetail from '~/components/PostDetail/Index.vue';

export default {
  props: {
    postList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    timeAgo(timestamp) {
      return timeAgo(timestamp);
    },
    randomDefaultImage() {
      const random = Math.floor(Math.random() * 5) + 1;
      return require(`~/assets/images/default-${random}.jpg`);
    },
    toPostDetail(post, from) {
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', true);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', PostDetail);
      this.$store.commit('modules/post_detail/SET_POST_DETAIL', { ...post, fr: from });
    },
  },
};
</script>

<style lang="scss" scoped>
.swipe {
  height: 220px;

  .swipe-item {
    height: 220px;

    .image-container {
      position: relative;

      .image {
        width: 100%;
        height: 100%;
        height: 220px;
      }

      .cover {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.35);
        color: $white-color;
        padding: 10px;

        line-height: 1.5;

        .title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          line-height: 1.7;
        }

        .bottom {
          display: flex;
          align-items: center;
          font-size: 12px;

          span {
            margin-right: 10px;
            color: $gray-color;
          }
        }
      }
    }
  }
}
</style>
