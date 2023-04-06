<template>
  <div>blog-post</div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue } from 'vue-facing-decorator';

@Component({ name: 'myComponent' })
export default class myComponent extends Vue {
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
