<template>
  <div class="navbar-detail-container">
    <div class="post-header">
      <slot name="header"></slot>
    </div>
    <div class="post-carousel">
      <slot name="carousel"></slot>
    </div>
    <div class="post-list">
      <div class="loading" v-if="loading && postList.length === 0">
        <van-loading color="#5469d4" />
      </div>
      <ul>
        <li v-for="item in postList" :key="item.id" @click="toPostDetail(item, 'post-list')">
          <PostItem :post="item" />
        </li>
      </ul>
      <div class="empty" v-if="!loading && postList.length === 0">
        <van-empty class="box" :image="emptyImageSrc" description="老铁，没数据呀！" image-size="60px" />
      </div>
    </div>
  </div>
</template>

<script>
import PostItem from '~/components/Widget/Home/PostItem.vue';
import PostDetail from '~/components/PostDetail/Index.vue';

export default {
  components: {
    PostItem,
  },
  props: {
    postList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      emptyImageSrc: require('~/assets/images/custom-empty-image.png'),
    };
  },
  methods: {
    toPostDetail(post, from) {
      this.$store.commit('modules/post_detail/SET_POST_DETAIL', { ...post, fr: from });
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', PostDetail);
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.post-header {
  background-color: $white-color;
}

.post-carousel {
  background-color: $white-color;
  margin-bottom: 10px;
}

.loading {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
