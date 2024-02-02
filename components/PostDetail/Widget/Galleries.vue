<template>
  <div class="galleries-container">
    <van-image v-for="(item, index) in galleries" :key="index" :src="item" width="100%" height="auto" fit="contain" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

export default {
  computed: {
    postDetail() {
      return this.$store.getters['modules/post_detail/postDetail'];
    },
    galleries() {
      return cloneDeep(this.postDetail.galleries);
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.galleries-container {
  padding: 0 20px 20px;

  & > .van-image {
    margin-bottom: 10px;
  }
}
</style>
