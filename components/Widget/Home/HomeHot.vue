<template>
  <div class="hot-list" @click="openHot">
    <van-icon name="fire" class="icon"></van-icon>
    热榜
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  components: {},
  methods: {
    ...mapMutations('modules/app', ['SET_LAYOUT_HEAD_OPTIONS']),
    openHot() {
      this.$router.push('/hot');
      this.SET_LAYOUT_HEAD_OPTIONS({
        title: '热榜',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.hot-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  padding: 6px;
  font-size: 12px;
  border: 1px solid $primary-color;
  border-radius: 14px;
  text-align: center;
  color: $primary-color;

  .icon {
    margin-right: 4px;
  }
}
</style>
