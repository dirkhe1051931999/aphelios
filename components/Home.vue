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
        <NavBarDetail :postList="currentPostList.pageData" :loading="currentPostList.loading">
          <template v-if="showHeader" #header>
            <NavBarPolitical :postList="politicalData" />
          </template>
          <template v-if="showHeader" #carousel>
            <NavBarCarousel :postList="carouselData" />
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
import NavBarPolitical from '~/components/widget/home/NavBarPolitical.vue';
import NavBarCarousel from '~/components/widget/home/NavBarCarousel.vue';

export default {
  components: {
    HomeSearch,
    HomeLogo,
    HomeHot,
    HomeScrollNavBar,
    NavBarDetail,
    NavBarPolitical,
    NavBarCarousel,
  },
  computed: {
    currentPostList() {
      const postList = this.$store.getters['modules/home/postList'];
      const activeChannelId = this.$store.getters['modules/home/activeChannelId'];
      return postList[activeChannelId];
    },
    curretPostListLoading() {
      return this.currentPostList.loading;
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
    carouselData() {
      return this.$store.getters['modules/home/carouselData'];
    },
    politicalData() {
      return this.$store.getters['modules/home/politicalData'];
    },
    showHeader() {
      return this.$store.getters['modules/home/activeChannelId'] === '383622c55f1643ab977aef886a7bc53e';
    },
  },
  data() {
    return {
      pullRefreshLoading: false,
      scrollBottomLock: false,
      isGetMore: false,
    };
  },
  methods: {
    clickSearch() {
      this.$router.push('/search');
    },
    channelItemClick(channel) {
      this.$store.commit('modules/home/SET_ACTIVE_CHANNEL_ID', channel.id);
      if (this.postList[channel.id].pageData.length === 0) {
        this.isGetMore = false;
        this._fetchPostList();
      }
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
      this.isGetMore = false;
      await this._fetchPostList();
      this.pullRefreshLoading = false;
    },
    pullRefreshScroll: throttle(async function ($event) {
      const { scrollTop, scrollHeight, clientHeight } = $event.target;
      const offset = 100;
      if (this.scrollBottomLock) return;
      if (scrollTop === 0) return;
      if (scrollTop + clientHeight >= scrollHeight - offset) {
        this.scrollBottomLock = true;
        this.isGetMore = true;
        await this._fetchPostList();
      }
    }, 200),
    async _fetchPostList() {
      const _currentPostList = cloneDeep(this.currentPostList);
      const _postList = cloneDeep(this.postList);
      const { finished, loading, lock, total } = _currentPostList;
      if (finished || loading || lock) return;
      _currentPostList.loading = true;
      this.$store.commit('modules/home/UPDATE_POST_LIST_LOADING_BY_CHANNEL_ID', {
        channelId: this.activeChannelId,
        loading: true,
      });
      _currentPostList.page++;
      const { pageData } = await this.$axios.$get('/h5/blog/post/getPostList', {
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
        if (pageData.length < 10) {
          _currentPostList.finished = true;
          this.isGetMore = false;
          this.scrollBottomLock = true;
        }
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
