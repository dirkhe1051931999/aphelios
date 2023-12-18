<template>
  <div class="profile-container">
    <div v-if="!userInfo" class="header no-login">
      <div @click="toLogin">登录</div>
    </div>
    <div v-if="userInfo" class="header have-login">
      <div class="top" @click="toMine">
        <img :src="userInfo.avatarUrl" alt="avatarUrl" class="avatar" />
        <div class="right">
          <div class="username-ip">
            <span class="username">{{ userInfo.username }}</span>
            <van-tag color="#f5f5f5" text-color="#1a1a1a">IP属地：{{ ipShenfen }}</van-tag>
          </div>
          <div class="level-gender">
            <div class="level">
              <div class="score-container">
                <img src="~assets/images/profile/level.png" alt="" />
                <span>{{ getAuthorLevel(userInfo.score) }}</span>
              </div>
              {{ getAuthorLevelName(userInfo.score) }}
            </div>
            <div
              class="gender"
              :class="{
                male: userInfo.gender === 1,
                female: userInfo.gender === 0,
              }"
            >
              <img v-if="userInfo.gender === 1" src="~assets/images/profile/male.svg" alt="" />
              <img v-else src="~assets/images/profile/female.svg" alt="" />
              <span>用户</span>
            </div>
          </div>
          <div class="nickname">昵称: {{ userInfo.nickname }}</div>
        </div>
        <van-icon name="arrow" class="mine" />
      </div>
      <ul class="count">
        <li>
          <div class="num">{{ userInfo.friendCount }}</div>
          <div class="label">关注</div>
        </li>
        <li>
          <div class="num">{{ userInfo.fansCount }}</div>
          <div class="label">粉丝</div>
        </li>
        <li>
          <div class="num">0</div>
          <div class="label">@我</div>
        </li>
        <li>
          <div class="num">0</div>
          <div class="label">Like我</div>
        </li>
      </ul>
    </div>
    <van-cell v-if="userInfo" title="消息" is-link />
    <van-cell v-if="userInfo" title="收藏" is-link />
    <van-cell v-if="userInfo" title="历史" is-link />
    <van-cell title="缓存" is-link @click="clearCache" />
    <van-cell title="设置" is-link />
    <van-cell title="深色模式" is-link />
    <van-cell v-if="userInfo" title="反馈建议" is-link />
    <van-cell v-if="userInfo" title="更多" is-link url="https://www.baidu.com" />
    <van-cell v-if="userInfo" title="退出登录" title-style="color:#e93030;text-align:center" @click="toLogout" />
    <van-action-sheet v-model="cacheParams.show" :actions="cacheParams.actions" cancel-text="取消" description="APP 内缓存" close-on-click-action @select="selectCacheAction" />
  </div>
</template>

<script>
import { enRegionToZhRegion, getAuthorLevel, getAuthorLevelName } from '~/utils/tools';
import Mine from '~/components/Widget/Profile/Mine.vue';

export default {
  data() {
    return {
      cacheParams: {
        show: false,
        actions: [{ name: '清除缓存' }],
      },
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['modules/user/userInfo'];
    },
    ipAddress() {
      return this.$store.getters['modules/user/ipAddress'];
    },
    ipShenfen() {
      return enRegionToZhRegion(this.ipAddress.regionName) || '未知';
    },
  },
  methods: {
    getAuthorLevel,
    getAuthorLevelName,
    toLogin() {
      this.$router.push('/login');
    },
    toLogout() {
      this.$store.dispatch('modules/user/logout');
    },
    clearCache() {
      this.cacheParams.show = true;
    },
    selectCacheAction({ name }) {
      if (name === '清除缓存') {
        this.$toast('清除缓存成功1');
      }
    },
    toMine() {
      this.$store.commit('modules/profile/SET_CURRENT_COMPONENT', Mine);
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-container {
  .header.no-login {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: $primary-color;
      color: $white-color;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .header.have-login {
    .top {
      display: flex;
      align-items: center;
      padding: 20px 16px 10px;
      background: #ffffff;
      border-bottom: 1px solid #eeeeee;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 16px;
      }

      .right {
        display: flex;
        flex-direction: column;

        .username-ip {
          display: flex;
          align-items: center;

          .username {
            color: #888888;
            font-size: 16px;
            margin-right: 8px;
          }
        }

        .nickname {
          color: #888888;
          font-size: 14px;
        }

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

      .mine {
        margin-left: auto;
      }
    }

    ul.count {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 0;
      text-align: center;
      background: #ffffff;
      padding: 16px 0;
      border-bottom: 1px solid #eeeeee;

      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .num {
          font-size: 16px;
          margin-bottom: 8px;
        }

        .label {
          font-size: 14px;
          color: #888888;
        }
      }
    }
  }
}
</style>
