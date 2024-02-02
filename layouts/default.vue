<!-- layouts/default.vue -->
<template>
  <div>
    <Nuxt />
    <FixedFwPage v-show="pageVisible" />
  </div>
</template>

<script>
import FixedFwPage from '~/layouts/fixed-fw-page.vue';

export default {
  components: { FixedFwPage },
  computed: {
    pageVisible() {
      return this.$store.getters['modules/fixed_fw_page/pageVisible'];
    },
  },
  mounted() {},
};
</script>
