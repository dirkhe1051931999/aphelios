<template>
  <div class="home-search-container">
    <van-search v-model="value" placeholder="请输入搜索关键词" @click="clickSearch" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
    };
  },
  methods: {
    clickSearch() {
      this.$emit('clickSearch');
    },
  },
};
</script>

<style lang="scss" scoped></style>
