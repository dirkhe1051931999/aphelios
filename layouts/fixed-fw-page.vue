<template>
  <div class="fixed-fw-page" ref="fixed-fw-page">
    <component :is="currentComponent" v-if="currentComponent"></component>
  </div>
</template>

<script>
export default {
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
          this.$refs['fixed-fw-page'].scrollTop = 0;
        });
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
