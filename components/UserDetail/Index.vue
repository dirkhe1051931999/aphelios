<template>
  <div>
    <van-sticky ref="navigationRef">
      <van-nav-bar title="详情">
        <template #left>
          <van-icon name="arrow-left" color="black" size="20px" @click="onClickLeft" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="header-container">
      <div class="header-top">
        <van-image width="72px" height="72px" fit="cover" :src="userDetail.avatarUrl" round />
        <van-button type="info" size="small" class="follow">关注</van-button>
      </div>
      <div class="header-name">
        <span class="mr-2"> {{ userDetail.username }} </span>
        <div class="level-gender">
          <div class="level">
            <div class="score-container">
              <img src="~assets/images/profile/level.png" alt="" />
              <span>{{ getAuthorLevel(1) }}</span>
            </div>
            {{ getAuthorLevelName(1) }}
          </div>
          <div
            class="gender"
            :class="{
              male: userDetail.gender === 1,
              female: userDetail.gender === 0,
            }"
          >
            <img v-if="userDetail.gender === 1" src="~assets/images/profile/male.svg" alt="" />
            <img v-else src="~assets/images/profile/female.svg" alt="" />
            <span>用户</span>
          </div>
        </div>
      </div>
      <div class="header-nickname">昵称: {{ userDetail.nickname }}</div>
    </div>
    <div class="tabs">
      <van-tabs v-model="tabsParams.active" ref="tabsRef">
        <van-tab title="评论">
          <div class="comment-list-container">123</div>
        </van-tab>
        <van-tab title="推荐">内容 2</van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getAuthorLevel, getAuthorLevelName } from '~/utils/tools';

export default {
  data() {
    return {
      tabsParams: {
        active: 0,
        pagination: {
          rowsPerPage: 10,
          page: 1,
        },
      },
    };
  },
  computed: {
    userDetail() {
      return this.$store.getters['modules/user_detail/userDetail'];
    },
  },
  mounted() {
    this.$nextTick(() => {
      const $commentListContainer = document.querySelector('.comment-list-container');
      const $navigationHeight = this.$refs.navigationRef.$el.clientHeight;
      const $headerContainerHeight = document.querySelector('.header-container').clientHeight;
      const $tabHeight = this.$refs.tabsRef.$children[1].$el.clientHeight;
      $commentListContainer.style.height = `calc(100vh - ${$navigationHeight + $headerContainerHeight + $tabHeight + 10}px)`;
      this.$store.dispatch('modules/user_detail/getUserComments', {
        id: this.userDetail.id,
        rowsPerPage: this.tabsParams.pagination.rowsPerPage,
        page: this.tabsParams.pagination.page,
      });
    });
  },
  methods: {
    getAuthorLevel,
    getAuthorLevelName,
    onClickLeft() {
      this.$store.commit('modules/fixed_fw_page/SET_PAGE_VISIBLE', false);
      this.$store.commit('modules/fixed_fw_page/SET_CURRENT_COMPONENT', null);
      this.$store.commit('modules/user_detail/SET_USER_DETAIL', {});
    },
  },
};
</script>

<style lang="scss" scoped>
.header-container {
  min-height: 120px;
  padding: 16px;

  .header-top {
    display: flex;
    align-items: center;
    padding-bottom: 8px;

    :deep(.van-button) {
      margin-left: auto;
    }
  }

  .header-name {
    display: flex;
    align-items: center;

    .level-gender {
      display: flex;
      align-items: center;
      margin: 8px 0;

      .level {
        background: #888dc3;
        height: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        padding: 0 8px;
        margin-right: 8px;

        .score-container {
          width: 16px;
          height: 16px;
          position: relative;
          margin-right: 4px;

          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }

          span {
            position: absolute;
            left: 50%;
            top: 50%;

            transform: translate(-50%, -50%);
            font-size: 10px;
          }
        }
      }

      .gender {
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        border-radius: 10px;
        padding: 0 8px;

        &.male {
          background: #0097e5;
        }

        &.female {
          background: #f76260;
        }

        img {
          width: 12px;
          margin-right: 4px;
        }
      }
    }
  }

  .header-nickname {
    font-size: 14px;
    color: #999999;
  }
}

.tabs {
  border-top: 1px solid #eeeeee;

  .comment-list-container {
    padding: 16px;
    overflow: auto;
  }
}
</style>
