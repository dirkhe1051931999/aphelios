<template>
  <div>
    <div class="header-container">
      <div class="header-search">
        <HomeLogo />
        <HomeSearch @clickSearch="clickSearch" class="home-search-component" />
        <HomeHot />
      </div>
      <HomeScrollNavBar :postChannels="postChannels" @channelItemClick="channelItemClick" />
    </div>
    <div class="home-container">
      <van-pull-refresh v-model="pullRefreshLoading" @refresh="onRefresh" class="pull-refresh" success-text="刷新成功" @scroll.native="pullRefreshScroll">
        <NavBarDetail :postList="currentPostList.pageData">
          <template #header>
            <div>header</div>
          </template>
        </NavBarDetail>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { throttle, cloneDeep } from 'lodash';
import HomeSearch from '~/components/widget/home/HomeSearch.vue';
import HomeLogo from '~/components/widget/home/HomeLogo.vue';
import HomeHot from '~/components/widget/home/HomeHot.vue';
import HomeScrollNavBar from '~/components/widget/home/HomeScrollNavBar.vue';
import NavBarDetail from '~/components/widget/home/NavBarDetail.vue';

export default {
  components: {
    HomeSearch,
    HomeLogo,
    HomeHot,
    HomeScrollNavBar,
    NavBarDetail,
  },
  computed: {
    currentPostList() {
      const postList = this.$store.getters['modules/home/postList'];
      const activeChannelId = this.$store.getters['modules/home/activeChannelId'];
      return postList[activeChannelId];
    },
    postChannels() {
      return this.$store.getters['modules/home/postChannels'];
    },
    postList() {
      return this.$store.getters['modules/home/postList'];
    },
    activeChannelId() {
      return this.$store.getters['modules/home/activeChannelId'];
    },
  },
  data() {
    return {
      pullRefreshLoading: false,
      scrollBottomLock: false,
    };
  },
  methods: {
    clickSearch() {
      // this.$router.push('/directory');
    },
    channelItemClick(channel) {
      this.$store.commit('modules/home/SET_ACTIVE_CHANNEL_ID', channel.id);
      this._fetchPostList();
    },
    async onRefresh() {
      this.pullRefreshLoading = true;
      const _currentPostList = cloneDeep(this.currentPostList);
      const _postList = cloneDeep(this.postList);
      _currentPostList.page = 0;
      _currentPostList.pageData = [];
      _currentPostList.finished = false;
      _currentPostList.loading = false;
      _currentPostList.lock = false;
      const newPostList = Object.assign(_postList, {
        [this.activeChannelId]: _currentPostList,
      });
      this.$store.commit('modules/home/SET_POST_LIST', newPostList);
      await this._fetchPostList();
      this.pullRefreshLoading = false;
    },
    pullRefreshScroll: throttle(async function ($event) {
      const { scrollTop, scrollHeight, clientHeight } = $event.target;
      const offset = 100;
      if (this.scrollBottomLock) return;
      if (scrollTop + clientHeight >= scrollHeight - offset) {
        this.scrollBottomLock = true;
        await this._fetchPostList();
      }
    }, 200),
    async _fetchPostList() {
      const _currentPostList = cloneDeep(this.currentPostList);
      const _postList = cloneDeep(this.postList);
      const { finished, loading, lock, total } = _currentPostList;
      if (finished || loading || lock) return;
      _currentPostList.loading = true;
      _currentPostList.page++;
      const { pageData } = await this.$axios.$get('/blog/getPostList', {
        params: {
          channelId: this.activeChannelId,
          page: _currentPostList.page,
        },
      });
      if (pageData.length === 0) {
        _currentPostList.finished = true;
      } else {
        _currentPostList.pageData = _currentPostList.pageData.concat(pageData);
        _currentPostList.total = total;
        this.scrollBottomLock = false;
      }
      _currentPostList.loading = false;
      const newPostList = Object.assign(_postList, {
        [this.activeChannelId]: _currentPostList,
      });
      this.$store.commit('modules/home/SET_POST_LIST', newPostList);
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.header-container {
  background: $white-color;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  max-height: $topBarHeight;

  .header-search {
    display: flex;
    padding: 0 8px;
    align-items: center;
    justify-content: space-between;

    .home-search-component {
      width: 100%;
    }
  }
}

.home-container {
  margin-top: $topBarHeight;
  height: calc(100vh - $topBarHeight - $bottomTabBarHeight);
  margin-bottom: $bottomTabBarHeight;

  .pull-refresh {
    overflow: auto;
    height: 100%;
  }
}
</style>
