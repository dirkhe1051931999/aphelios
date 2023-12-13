<!-- layouts/my-layout.vue -->
<template>
  <div class="layouts-container">
    <Nuxt />
    <footer>
      <ul class="bottomTabBar">
        <li v-for="item in bottomTabBar" :key="item.name" :class="{ active: activeTab === item.name }" @click="bottomTabBarItemClick(item)">
          <van-icon :name="activeTab === item.name ? currentIcon : item.icon" size="20px" class="icon" />
          <span class="label">{{ item.label }}</span>
        </li>
      </ul>
    </footer>
  </div>
</template>
<script>
export default {
  computed: {
    activeTab() {
      return this.$store.getters['modules/app/activeTab'];
    },
    currentIcon() {
      const item = this.bottomTabBar.find((item) => item.name === this.activeTab);
      return item ? item.activeIcon : null;
    },
  },
  data() {
    return {
      bottomTabBar: this.$store.getters['modules/app/bottomTabBar'],
    };
  },
  methods: {
    bottomTabBarItemClick(item) {
      this.$store.commit('modules/app/SET_ACTIVE_TAB', item.name);
    },
  },
};
</script>
<style scoped lang="scss">
.layouts-container {
  background-color: $background-color;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: $bottomTabBarHeight;
  background-color: $white-color;
  border-top: 1px solid $border-color;

  ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;

    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 4px 10px;
      border-radius: 4px;

      &:active {
        background-color: $background-color;
      }

      span {
        font-size: 12px;
        padding-top: 4px;
      }

      &.active {
        color: $primary-color;

        &:active {
          color: $primary-active-color;
        }
      }
    }
  }
}
</style>
