<template>
  <div>
    <van-image round width="28px" height="28px" :src="logoSrc" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoSrc: require('@/assets/images/app_logo.png'),
    };
  },
};
</script>

<style lang="scss" scoped></style>
