<template>
  <section class="app-main" :style="[calcStyle1, calcStyle2]" ref="appMain" @scroll="watchAppMainScroll">
    <div class="hide">{{ scrollTop }}</div>
    <router-view v-slot="{ Component }" v-if="refreshPage">
      <transition name="fade-transform" mode="out-in">
        <!-- <keep-alive> -->
        <component :is="Component" :key="key" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </section>
</template>
<script lang="ts">
import { debounce } from 'quasar';
import { AppModule } from 'src/store/modules/app';
import { BlogPostModule } from 'src/store/modules/blog-post';
import { getCurrentInstance } from 'vue';

import { Component, Vue, Watch } from 'vue-facing-decorator';

@Component({
  name: 'AppMainComponent',
  components: {},
})
export default class AppMainComponent extends Vue {
  $refs: any;
  get scrollTop() {
    this.$nextTick(() => {
      this.$refs['appMain'].scrollTo({
        top: BlogPostModule.scrollTop,
        left: 0,
        behavior: 'smooth',
      });
    });
    return BlogPostModule.scrollTop;
  }
  get isCollapse() {
    return !AppModule.sidebar.opened;
  }
  get key() {
    this.$nextTick(() => {
      if (this.$refs.appMain.offsetHeight === this.$refs.appMain.scrollHeight) {
        this.calcStyle2 = 'padding:16px';
      } else {
        this.calcStyle2 = 'padding:16px';
      }
    });
    return this.$route.path;
  }
  get refreshPage() {
    return AppModule.refreshPage;
  }
  @Watch('isCollapse', { immediate: true })
  onchange(newVal: boolean) {
    if (newVal) {
      this.calcStyle1 = 'width:calc(100vw - 58px)';
    } else {
      this.calcStyle1 = 'width:calc(100vw - 220px)';
    }
  }
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public calcStyle1 = '';
  public calcStyle2 = '';
  /* event */
  public watchAppMainScroll(e: any) {
    const offsetTop = e.target.offsetTop;
    const scrollTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;
    const scrollHeight = e.target.scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight - 16) {
      BlogPostModule.SET_FIXED_DIRECTORY_RIGHT_CHANNEL(true);
      BlogPostModule.SET_DIRECTORY_LEFT_SIDE_BAR_NOT_SCROLL(true);
    } else {
      BlogPostModule.SET_DIRECTORY_LEFT_SIDE_BAR_NOT_SCROLL(false);
      if (scrollTop > offsetTop) {
        BlogPostModule.SET_FIXED_DIRECTORY_RIGHT_CHANNEL(true);
      } else {
        BlogPostModule.SET_FIXED_DIRECTORY_RIGHT_CHANNEL(false);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.body--dark {
  .app-main {
    box-shadow: 0px 6px 16px -1px rgba(#ffffff, 0.05);
    &::-webkit-scrollbar-thumb {
      background-color: rgba($color: #ffffff, $alpha: 0.4);
    }
  }
}
.body--light {
  .app-main {
    box-shadow: 0px 6px 16px -1px rgba(#000000, 0.05);
    &::-webkit-scrollbar-thumb {
      background-color: rgba($color: #000000, $alpha: 0.4);
    }
  }
}

.app-main {
  position: fixed;
  height: calc(100vh - var(--v3-header-height)-var(--v3-navigationbar-height) - 16px - 16px);
  top: calc(var(--v3-navigationbar-height) + var(--v3-header-height));
  bottom: 0;
  right: 0;
  transition: all 0.2s;
  overflow: auto;
  &::-webkit-scrollbar {
    background: transparent;
  }
  &::-webkit-scrollbar:vertical {
    width: 16px;
  }
  &::-webkit-scrollbar:horizontal {
    height: 16px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 99999px;
    border: 0.3125em solid transparent;
    background-clip: content-box;
  }
}
.hasTagsView {
  .app-main {
    height: calc(100vh - var(--v3-header-height)-var(--v3-navigationbar-height) - 16px - 16px);
  }
}
</style>
