<template>
  <div>
    <!--    1普通文章，2纯视频，3纯图片-->
    <div class="post-item-container normal" v-if="post.postType === '1'">
      <div class="left">
        <div class="title">
          {{ post.title }}
        </div>
        <div class="sub-title">
          <span>
            {{ post.author.name }}
          </span>
          <span v-if="post.comment"> {{ post.comment }} 评 </span>
          <span>
            {{ timeAgo(post.updateTime) }}
          </span>
        </div>
      </div>
      <div class="right">
        <van-image :src="post.poster" radius="4" class="image">
          <template v-slot:loading>
            <van-loading type="spinner" size="12" />
          </template>
          <template v-slot:error>
            <img src="~assets/images/default.jpg" fit="cover" class="image" />
          </template>
        </van-image>
      </div>
    </div>
    <div class="post-item-container video" v-if="post.postType === '2'"></div>
    <div class="post-item-container gallery" v-if="post.postType === '3'"></div>
  </div>
</template>

<script>
import { timeAgo } from '~/utils/tools';

export default {
  props: {
    post: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    timeAgo(timestamp) {
      return timeAgo(timestamp);
    },
  },
};
</script>

<style lang="scss" scoped>
.post-item-container.normal {
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px $border-color;
  background: $white-color;
  padding: 10px;
  min-height: 80px;
  max-height: 110px;

  .left {
    width: 70%;
    margin-right: 10px;
    display: flex;
    flex-direction: column;

    .title {
      //最多两行，超过两行显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 16px;
      line-height: 1.7;
    }

    .sub-title {
      margin-top: auto;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: $subtle-text-color;

      span {
        margin-right: 10px;
      }
    }
  }

  .right {
    width: 30%;

    .image {
      border-radius: 4px;
      min-height: 80px;
      width: 100%;
      border: 1px solid $border-color;
    }
  }
}
</style>
