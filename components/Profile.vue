<template>
  <component :is="currentComponent"></component>
</template>

<script>
import Index from '~/components/Widget/Profile/Index.vue';

export default {
  computed: {
    currentComponent() {
      return this.$store.getters['modules/profile/currentComponent'] || Index;
    },
  },
};
</script>

<style lang="scss" scoped></style>
