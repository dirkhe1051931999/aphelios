<template>
  <div>
    <!-- 政治   -->
    <div class="post-item-container political" v-if="isPolitical" @click="toPostDetail(post, 'post-political')">
      <div class="title-wrap">
        <van-tag color="#ffe1e1" text-color="#ad0000">置顶</van-tag>
        <div class="title" v-html="post.title"></div>
      </div>
      <div class="sub-title">
        <span>
          {{ post.author.name }}
        </span>
        <span v-if="post.comment"> {{ post.comment }} 评 </span>
        <span>
          {{ timeAgo(post.createTime) }}
        </span>
      </div>
    </div>
    <!-- 1普通文章，2纯视频，3纯图片-->
    <div v-if="isNormal">
      <div class="post-item-container normal" @click="toPostDetail(post, 'post-normal')" :class="{ 'have-survey': post.survey.length && userInfo }">
        <div class="left">
          <div class="title" v-html="post.title"></div>
          <div class="sub-title">
            <span>
              {{ post.author.name }}
            </span>
            <span v-if="post.comment"> {{ post.comment }} 评 </span>
            <span>
              {{ timeAgo(post.createTime) }}
            </span>
            <span v-if="post.view" style="margin-left: auto">
              <van-icon name="eye-o" />
              {{ post.view }}
            </span>
          </div>
        </div>
        <div class="right">
          <van-image :src="post.postType === '2' && post.videoPoster ? post.videoPoster : post.poster" radius="4" class="image">
            <template v-slot:loading>
              <van-loading type="spinner" size="12" />
            </template>
            <template v-slot:error>
              <img :src="randomDefaultImage()" fit="cover" class="image" />
            </template>
          </van-image>
          <div class="cover" v-if="post.postType === '2' && post.videoPoster">
            <van-icon name="play-circle-o" class="play-icon" />
          </div>
        </div>
      </div>
      <Survey v-if="post.survey.length && userInfo" :survey="post.survey" @vote="userVoteDone" />
    </div>
    <div class="post-item-container video" v-if="isVideo" @click="toPostDetail(post, 'post-video')">
      <div class="top" v-html="post.title"></div>
      <div class="video">
        <div class="cover" @click.stop.prevent="playVideo(post)" :ref="post.id + '_' + 'video_cover'">
          <van-icon name="play-circle-o" class="play-icon" />
        </div>
        <video :src="post.videoUrl" width="100%" height="100%" :ref="post.id + '_' + 'video_dom'" />
      </div>
      <div class="bottom">
        <span>
          {{ post.author.name }}
        </span>
        <span v-if="post.comment"> {{ post.comment }} 评 </span>
        <span>
          {{ timeAgo(post.createTime) }}
        </span>
        <span v-if="post.view" style="margin-left: auto">
          <van-icon name="eye-o" />
          {{ post.view }}
        </span>
      </div>
    </div>
    <div class="post-item-container gallery" v-if="isGallery" @click="toPostDetail(post, 'post-gallery')">
      <div class="top" v-html="post.title"></div>
      <div class="gallery">
        <van-image v-for="(item, index) in post.galleries.slice(0, 3)" :key="index" :src="item" radius="4" class="image">
          <template v-slot:loading>
            <van-loading type="spinner" size="12" />
          </template>
          <template v-slot:error>
            <img :src="randomDefaultImage()" fit="cover" class="image" />
          </template>
        </van-image>
      </div>
      <div class="bottom">
        <span>
          {{ post.author.name }}
        </span>
        <span v-if="post.comment"> {{ post.comment }} 评 </span>
        <span>
          {{ timeAgo(post.createTime) }}
        </span>
        <span v-if="post.view" style="margin-left: auto">
          <van-icon name="eye-o" />
          {{ post.view }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { removeKeywordStyle, timeAgo } from '~/utils/tools';
import PostDetail from '~/components/PostDetail/Index.vue';
import Survey from '~/components/Widget/Home/PostItem/Survey.vue';
import Config from '~/utils/config';

export default {
  components: {
    Survey,
  },
  props: {
    post: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    userInfo() {
      return this.$store.getters['modules/user/userInfo'];
    },
    isPolitical() {
      return this.post.postType === '1' && this.post.political === '1';
    },
    isNormal() {
      return (this.post.postType === '1' && this.post.political === '0' && this.post.carousel === '0') || (this.post.postType === '2' && this.post.videoPoster);
    },
    isVideo() {
      return this.post.postType === '2' && !this.post.videoPoster;
    },
    isGallery() {
      return this.post.postType === '3';
    },
  },
  methods: {
    timeAgo(timestamp) {
      return timeAgo(timestamp);
    },
    playVideo(post) {
      this.$emit('playVideo', post);
    },
    randomDefaultImage() {
      const random = Math.floor(Math.random() * 5) + 1;
      return require(`~/assets/images/default-${random}.jpg`);
    },
    toPostDetail(post, from) {
      post.title = removeKeywordStyle(post.title);
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', true);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', PostDetail);
      this.$store.commit('modules/post_detail/SET_POST_DETAIL', { ...post, fr: from });
    },
    userVoteDone(item) {
      for (let i = 0; i < item.selectOption.length; i++) {
        const option = item.selectOption[i];
        for (let j = 0; j < option.voteUserList.length; j++) {
          const user = option.voteUserList[j];
          user.avatarUrl = user.avatarUrl.split(Config.defaultCdnUrl)[1];
        }
      }
      this.$store.dispatch('modules/post_detail/addVote', {
        id: item.id,
        selectOption: item.selectOption,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.post-item-container.political {
  display: flex;
  flex-direction: column;
  background: $white-color;
  padding: 10px;

  .title-wrap {
    display: flex;
    align-items: center;

    .title {
      //最多两行，超过两行显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 14px;
      line-height: 1.7;
      margin-left: 10px;
    }
  }

  .sub-title {
    margin-top: 4px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: $subtle-text-color;

    span {
      margin-right: 10px;
    }
  }
}

.post-item-container.normal {
  display: flex;
  justify-content: space-between;
  background: $white-color;
  border-bottom: solid 1px $border-color;
  padding: 10px;
  min-height: 80px;
  max-height: 110px;

  &.have-survey {
    border-bottom: none;
  }

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
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height: 80px;
    background: $border-color;

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      z-index: 100;

      .play-icon {
        font-size: 20px;
        color: $white-color;
      }
    }

    .image {
      min-height: 80px;
      width: 100%;
      border: 1px solid $border-color;
    }
  }
}

.post-item-container.video {
  display: flex;
  flex-direction: column;
  border-bottom: solid 1px $border-color;
  background: $white-color;
  padding: 10px;

  .top {
    //最多两行，超过两行显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 16px;
    line-height: 1.7;
  }

  .video {
    position: relative;
    margin-top: 10px;
    border-radius: 4px;
    overflow: hidden;
    height: 230px;
    width: 100%;
    background: $border-color;

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
      z-index: 100;

      .play-icon {
        font-size: 40px;
        color: $white-color;
      }
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .bottom {
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: $subtle-text-color;

    span {
      margin-right: 10px;
    }
  }
}

.post-item-container.gallery {
  display: flex;
  flex-direction: column;
  border-bottom: solid 1px $border-color;
  background: $white-color;
  padding: 10px;

  .top {
    //最多两行，超过两行显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 16px;
    line-height: 1.7;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    margin-top: 10px;
    min-height: 80px;

    .image {
      border-radius: 4px;
      max-height: 80px;
      border: 1px solid $border-color;
    }
  }

  .bottom {
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: $subtle-text-color;

    span {
      margin-right: 10px;
    }
  }
}
</style>
