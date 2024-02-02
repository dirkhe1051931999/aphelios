<template>
  <div ref="fixed-fw-page" class="fixed-fw-page" @scroll="onFixedFwPageScroll">
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
export default {
  name: 'FixedFwPage',
  computed: {
    currentComponent() {
      return this.$store.getters['modules/fixed_fw_page/currentComponent'];
    },
    pageVisible() {
      return this.$store.getters['modules/fixed_fw_page/pageVisible'];
    },
  },
  watch: {
    pageVisible(val) {
      if (val) {
        this.$nextTick(() => {
          if (this.$refs['fixed-fw-page']) {
            this.$refs['fixed-fw-page'].scrollTop = 0;
          }
        });
      }
    },
  },
  methods: {
    onFixedFwPageScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      // 判断是否滚动到底部
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        if (this.currentComponent.name === 'PostDetail') {
          if (!this.$store.getters['modules/post_detail/lockPageToBottom']) {
            this.$store.commit('modules/post_detail/SET_LOCK_PAGE_TO_BOTTOM', true);
            this.$store.commit('modules/post_detail/SET_PAGE_TO_BOTTOM', true);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fixed-fw-page {
  width: 100%;
  height: 100%;
  background-color: $white-color;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
