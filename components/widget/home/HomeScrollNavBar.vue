<template>
  <div class="home-scroll-navbar-container">
    <ul>
      <li v-for="item in postChannels" :key="item.id" :class="{ active: activeChannelId === item.id }" @click="onChannelItemClick(item)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    postChannels: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeChannelId: this.$store.getters['modules/home/activeChannelId'],
    };
  },
  methods: {
    onChannelItemClick(item) {
      this.activeChannelId = item.id;
      this.$emit('channelItemClick', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.home-scroll-navbar-container {
  position: relative;

  ul {
    overflow-x: auto;
    white-space: nowrap;
    background: $white-color;
    border-bottom: 1px solid $border-color;

    &::-webkit-scrollbar {
      display: none;
    }

    li {
      display: inline-block;
      padding: 0 10px;
      line-height: 40px;
      font-size: 14px;
      color: $primary-text-color;

      &:last-child {
        padding-right: 30px;
      }

      &.active {
        color: $primary-color;
        font-weight: 500;
        position: relative;

        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 50%;
          height: 2px;
          background: $primary-color;
          transform: translateX(-50%);
        }
      }
    }
  }

  //  使得滚动到最左边和最右边时，文字不会被遮挡
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 1));
  }
}
</style>
