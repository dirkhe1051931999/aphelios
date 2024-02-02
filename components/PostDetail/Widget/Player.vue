<template>
  <div class="player-container" v-if="postDetail.title">
    <video id="post-detail-player" controls :poster="postDetail.videoPoster">
      <source type="video/mp4" :src="postDetail.videoUrl" />
      <!-- 其他视频格式的源 -->
    </video>
  </div>
</template>

<script>
export default {
  computed: {
    postDetail() {
      return this.$store.getters['modules/post_detail/postDetail'];
    },
    pageVisible() {
      return this.$store.getters['modules/fixed_fw_page/pageVisible'];
    },
  },
  mounted() {
    this.playVideo();
  },
  methods: {
    playVideo() {
      const player = new Plyr('#post-detail-player', {});
    },
  },
};
</script>

<style lang="scss">
.plyr__control:hover {
  background: rgba(0, 0, 0, 0.1) !important;
}
</style>

<style lang="scss" scoped>
.player-container {
  padding: 0 20px 20px;
}
</style>
