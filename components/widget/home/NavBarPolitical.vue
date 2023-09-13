<template>
  <ul class="political">
    <li v-for="item in postList" :key="item.id">
      <PostItem :post="item" />
    </li>
  </ul>
</template>

<script>
import PostItem from '~/components/widget/home/PostItem.vue';

export default {
  components: {
    PostItem,
  },
  props: {
    postList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped></style>
