<template>
  <div class="hot-list">
    <van-icon name="fire" class="icon"></van-icon>
    热榜
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.hot-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  padding: 6px;
  font-size: 12px;
  border: 1px solid $primary-color;
  border-radius: 14px;
  text-align: center;
  color: $primary-color;
  .icon {
    margin-right: 4px;
  }
}
</style>
