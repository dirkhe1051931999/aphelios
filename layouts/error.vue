<template>
  <div>
    <!-- 你的错误页面内容 -->
  </div>
</template>

<script>
export default {
  props: ['error'],
  mounted() {
    // 检查是否因为页面不存在（404 错误）而渲染了错误页面
    if (this.error.statusCode === 404) {
      // 重定向到根路径
      this.$router.replace('/');
    }
  },
};
</script>
