<template>
  <div class="survey">
    <div class="survey-item" v-for="item in surveyList" :key="item.id">
      <div class="question">投票</div>
      <div class="survey-item-title">
        <span>{{ item.title }} </span>
        <span v-if="item.type === '0'">（多选）</span>
      </div>
      <ul
        class="survey-item-content"
        :class="{
          'voted-done': item.allDone,
        }"
      >
        <li v-for="option in item.selectOption" :key="option.id" @click="singleVote(item, option)" :class="{ voted: calcHaveVoted(option, item) }">
          {{ option.content }}
          <div v-if="item.type === '0' && calcHaveVoted(option, item)">
            <van-icon name="success" size="14px" />
          </div>
          <div v-if="item.type === '1' && calcHaveVoted(option, item)">
            <van-icon name="success" size="14px" />
          </div>
          <div v-if="item.allDone" class="count">
            {{ option.vote }}
          </div>
          <div class="percent" :style="calcPercentWidth(option, item)"></div>
        </li>
      </ul>
      <div v-if="item.type === '0' && !item.allDone" class="duo-submit">
        <van-button type="default" plain size="small" block @click="duoVote(item)"> 提交</van-button>
      </div>
      <!-- 参与人数，结束时间， -->
      <div class="vote-end">
        <div class="vote-count">{{ calcVoteCount(item) }}</div>
        <div class="end-time">截止时间：{{ calcEndTime(item) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

export default {
  props: {
    survey: {
      default: () => [],
    },
  },
  data() {
    return {
      surveyList: [],
    };
  },
  computed: {
    currentUserinfo() {
      return this.$store.getters['modules/user/userInfo'];
    },
    calcVoteCount() {
      return (item) => {
        const { selectOption } = item;
        if (item.allDone) {
          let count = 0;
          // 需要去重id
          const idList = [];
          selectOption.forEach((option) => {
            const { voteUserList } = option;
            voteUserList.forEach((user) => {
              if (!idList.includes(user.id)) {
                idList.push(user.id);
                count += 1;
              }
            });
          });
          return `${count}人参与`;
        } else {
          return '0人参与';
        }
      };
    },
    calcEndTime() {
      return (item) => {
        //   例子：还有 x 天结束，小于一天显示小时，小于一小时显示分钟
        const now = new Date().getTime();
        const endTime = item.endTime;
        const time = endTime - now;
        const day = Math.floor(time / (24 * 3600 * 1000));
        const hour = Math.floor((time % (24 * 3600 * 1000)) / (3600 * 1000));
        const minute = Math.floor(((time % (24 * 3600 * 1000)) % (3600 * 1000)) / (60 * 1000));
        if (day > 0) {
          return `还有${day}天结束`;
        }
        if (hour > 0) {
          return `还有${hour}小时结束`;
        }
        if (minute > 0) {
          return `还有${minute}分钟结束`;
        }
        return '已结束';
      };
    },
    // 判断是否已经投过票了
    calcHaveVoted() {
      return (option, item) => {
        const { voteUserList } = option;
        const { currentUserinfo } = this;
        if (voteUserList.length > 0) {
          const index = voteUserList.findIndex((user) => user.id === currentUserinfo.id);
          if (index > -1) {
            return true;
          }
        }
        return false;
      };
    },
    calcPercentWidth() {
      return (option, item) => {
        if (item.allDone) {
          const { selectOption } = item;
          const total = selectOption.reduce((prev, cur) => prev + cur.vote, 0);
          const percent = option.vote / total;
          if (percent > 0) {
            return `width: ${percent * 100}%`;
          }
          return 'width: 0%';
        }
      };
    },
  },
  mounted() {
    this.surveyList = cloneDeep(this.survey);
    //   加一个allDone 标志位
    this.surveyList.forEach((item) => {
      item.allDone = false;
    });
    // 如果option里面有自己的id，就说明已经投过票了
    this.surveyList.forEach((item) => {
      const { selectOption } = item;
      selectOption.forEach((option) => {
        const { voteUserList } = option;
        const index = voteUserList.findIndex((user) => user.id === this.currentUserinfo.id);
        if (index > -1) {
          item.allDone = true;
        }
      });
    });
  },
  methods: {
    singleVote(item, option) {
      const { currentUserinfo } = this;
      const { voteUserList } = option;
      const index = voteUserList.findIndex((user) => user.id === currentUserinfo.id);
      // 如果已经done了，就无法出发点击事件
      if (item.allDone && item.type === '1') {
        return;
      }
      if (item.allDone && item.type === '0') {
        return;
      }
      // 如果是多选，就可以取消选择
      if (item.type === '0') {
        // 多选
        if (index > -1) {
          voteUserList.splice(index, 1);
          option.vote -= 1;
        } else {
          voteUserList.push({
            id: currentUserinfo.id,
            username: currentUserinfo.username,
            avatarUrl: currentUserinfo.avatarUrl,
          });
          option.vote += 1;
        }
      } else {
        // 单选
        item.selectOption.forEach((option) => {
          const { voteUserList: optionVoteUserList } = option;
          const optionIndex = optionVoteUserList.findIndex((user) => user.id === currentUserinfo.id);
          if (optionIndex > -1) {
            optionVoteUserList.splice(optionIndex, 1);
            option.vote -= 1;
          }
        });
        if (index > -1) {
          voteUserList.splice(index, 1);
          option.vote -= 1;
        } else {
          voteUserList.push({
            id: currentUserinfo.id,
            username: currentUserinfo.username,
            avatarUrl: currentUserinfo.avatarUrl,
          });
          option.vote += 1;
        }
        item.allDone = true;
        this.$emit('vote', item);
      }
    },
    duoVote(item) {
      const { surveyList } = this;
      item.allDone = true;
      this.$set(surveyList, item, item);
      this.$emit('vote', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.survey {
  background-color: #fff;
  padding: 10px;
  border-bottom: solid 1px #eeeeee;

  .survey-item {
    .question {
      font-size: 14px;
      // 橘黄色
      height: 14px;
      display: flex;
      align-items: center;

      &:before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 100%;
        background-color: $primary-color;
        margin-right: 4px;
      }
    }

    .survey-item-title {
      font-size: 16px;
      padding: 10px 0;
    }

    .survey-item-content {
      li {
        font-size: 14px;
        line-height: 1;
        margin-bottom: 6px;
        text-align: center;
        padding: 6px 10px;
        border: solid 1px #e5e5e5;
        border-radius: 4px;
        color: $primary-color;

        &:last-child {
          margin-bottom: 0;
        }

        &.voted {
          display: flex;
          justify-content: center;

          .van-icon {
            margin-left: 4px;
          }
        }
      }

      &.voted-done {
        li {
          text-align: left;
          color: #333333;
          position: relative;
          z-index: 1;
          overflow: hidden;
          display: flex;

          .percent {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: #eeeeee;
            z-index: -1;
            transition: width 0.3s ease-in-out;
          }

          .count {
            color: #333333;
            margin-left: auto;
          }

          &.voted {
            color: $primary-color;

            .van-icon {
              margin-left: 4px;
            }

            .percent {
              background-color: rgba($primary-color, 0.3);
            }
          }
        }
      }
    }

    .duo-submit {
      margin-top: 10px;
    }

    .vote-end {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      font-size: 12px;
      color: $subtle-text-color;
    }
  }
}
</style>
