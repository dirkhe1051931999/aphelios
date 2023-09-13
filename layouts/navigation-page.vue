<template>
  <div class="navigation-page-container">
    <div class="navigation-container">
      <div class="left">
        <van-icon name="arrow-left" @click="goBack" size="30" />
      </div>
      <div class="title">
        <span>{{ layoutHeadOptions.title }}</span>
      </div>
      <div class="right-container">
        <div class="right" v-if="layoutHeadOptions.showShare"></div>
        <div class="right" v-if="layoutHeadOptions.showSearch"></div>
        <div class="right" v-if="layoutHeadOptions.showMore"></div>
      </div>
    </div>
    <div class="page-container">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  computed: {
    layoutHeadOptions() {
      return this.$store.getters['modules/app/layoutHeadOptions'];
    },
  },
  beforeDestroy() {
    this.SET_LAYOUT_HEAD_OPTIONS({
      title: '',
      showShare: false,
      showSearch: false,
      showMore: false,
    });
  },
  methods: {
    ...mapMutations('modules/app', ['SET_LAYOUT_HEAD_OPTIONS']),
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.navigation-page-container {
  .navigation-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    background-color: $white-color;
    border-bottom: 1px solid $border-color;
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    left: 0;
    top: 0;
    right: 0;
    z-index: 999;

    .left {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      overflow-x: auto;
      white-space: nowrap;

      &::-webkit-scrollbar {
        display: none;
      }

      span {
        font-size: 18px;
        font-weight: 500;
      }
    }

    .right-container {
      min-width: 50px;
      height: 50px;

      .right {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .page-container {
    height: calc(100vh - 50px);
    overflow: auto;
    margin-top: 50px;
    background: $background-color;
  }
}
</style>
