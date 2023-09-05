<template>
  <div class="navbar-detail-container">
    <div class="post-header">
      <slot name="header"></slot>
    </div>
    <div class="post-list">
      <ul>
        <li v-for="item in postList" :key="item.id">
          <PostItem :post="item" />
        </li>
      </ul>
    </div>
  </div>
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

<style lang="scss" scoped>
.post-header {
  height: 100px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  text-align: center;
}
</style>
