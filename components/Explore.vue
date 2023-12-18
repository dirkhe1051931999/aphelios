<template>
  <div @scroll="exploreScroll" class="explore-container">
    <ul class="list-container">
      <van-tabs style="margin: 12px 0">
        <van-tab title="探索"></van-tab>
      </van-tabs>
      <div class="loading-wrap">
        <van-loading text-color="#5469d4" v-if="exploreParams.loading" />
      </div>
      <li v-for="item in exploreParams.list" :key="item.id">
        <div class="top">
          <div class="left">
            <img :src="item.author.avatarUrl" alt="" />
          </div>
          <div class="right">
            <div class="name">
              {{ item.author.name }}
              <svg t="1694594296156" class="verify-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-if="item.author.type === 0">
                <path
                  d="M437.802667 637.866667l-103.253334-103.253334a32 32 0 1 1 45.226667-45.226666l80.64 80.64 183.466667-183.466667a32 32 0 0 1 45.226666 45.226667l-205.994666 206.08a31.914667 31.914667 0 0 1-45.226667 0z"
                  p-id="4019"
                ></path>
                <path
                  d="M512.042667 970.666667a114.56 114.56 0 0 1-74.666667-26.88l-67.413333-58.026667a65.024 65.024 0 0 0-32.853334-11.946667h-73.386666a114.474667 114.474667 0 0 1-114.346667-114.346666v-72.96a64.256 64.256 0 0 0-11.946667-32.426667l-57.6-67.84a117.290667 117.290667 0 0 1 0-148.053333l57.6-67.84a64.256 64.256 0 0 0 11.946667-32.426667V264.533333a114.474667 114.474667 0 0 1 114.346667-114.346666h73.813333a69.888 69.888 0 0 0 32.853333-11.946667l67.413334-58.026667a116.522667 116.522667 0 0 1 148.864 0l67.413333 58.026667a64.938667 64.938667 0 0 0 32.810667 11.946667h72.533333a114.474667 114.474667 0 0 1 114.346667 114.346666v72.533334a66.432 66.432 0 0 0 12.373333 32.853333l58.112 67.413333a116.650667 116.650667 0 0 1 0 148.906667l-58.026667 67.413333a66.773333 66.773333 0 0 0-12.373333 32.853334v72.533333a114.474667 114.474667 0 0 1-114.346667 114.346667h-72.533333a69.802667 69.802667 0 0 0-32.810667 11.946666l-67.413333 58.026667a112.682667 112.682667 0 0 1-74.709333 27.306667zM263.722667 214.186667a50.389333 50.389333 0 0 0-50.346667 50.346666v72.96a125.269333 125.269333 0 0 1-27.306667 73.813334l-57.6 67.84a53.418667 53.418667 0 0 0 0 65.28l57.6 67.84a127.146667 127.146667 0 0 1 27.306667 73.813333v72.96a50.389333 50.389333 0 0 0 50.346667 50.346667h73.813333a126.464 126.464 0 0 1 74.709333 27.733333l67.370667 58.026667a53.802667 53.802667 0 0 0 65.749333 0l67.413334-58.026667a128.938667 128.938667 0 0 1 74.666666-27.733333h72.533334a50.432 50.432 0 0 0 50.389333-50.346667v-72.533333a126.464 126.464 0 0 1 27.733333-74.666667l58.026667-67.413333a53.76 53.76 0 0 0 0-65.706667l-58.026667-67.413333a126.421333 126.421333 0 0 1-27.733333-74.666667V264.533333a50.432 50.432 0 0 0-50.389333-50.346666h-72.533334a126.464 126.464 0 0 1-74.666666-27.733334l-67.413334-58.026666a53.802667 53.802667 0 0 0-65.749333 0l-67.413333 58.453333a128.682667 128.682667 0 0 1-74.709334 27.306667z"
                  p-id="4020"
                ></path>
              </svg>
            </div>
            <div class="description">
              {{ item.author.description }}
            </div>
          </div>
          <div class="follow">关注</div>
        </div>
        <div class="content" v-html="item.content"></div>
        <div class="bottom">
          <div class="like">
            <van-icon name="like-o" />
            <span>{{ item.like }}</span>
          </div>
          <div class="comment">
            <van-icon name="comment-o" />
            <span>{{ item.comment }}</span>
          </div>
          <div class="share">
            <van-icon name="share-o" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// 替换dom算法
/*
 * 1. 把url转换成a标签
 * 2.
 * */
function replaceURLsWithLinks(text) {
  // 正则表达式用于匹配URL
  const urlRegex = /https?:\/\/[^\s<]+/gi;

  return text.replace(urlRegex, function (url) {
    // 确保不替换 video 或 img 的 src
    const precedingChars = text.substring(text.indexOf(url) - 10, text.indexOf(url)).toLowerCase();
    if (precedingChars.includes('src=')) {
      return url;
    }

    // 替换成 a 标签
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
}

export default {
  data() {
    return {
      exploreParams: {
        loading: false,
        list: [],
        page: 1,
        rowsPerPage: 10,
        noMoreData: false,
      },
    };
  },
  methods: {
    async getExplore() {
      try {
        this.exploreParams.loading = true;
        const { data } = await this.$axios.get('/h5/blog/post/getAuthorEssay', {
          params: {
            page: this.exploreParams.page,
            rowsPerPage: this.exploreParams.rowsPerPage,
          },
        });
        let { list } = data;
        list = list.map((item) => {
          item.content = replaceURLsWithLinks(item.content);
          return item;
        });
        this.exploreParams.list = this.exploreParams.list.concat(list);
        this.exploreParams.loading = false;
        if (list.length < this.exploreParams.rowsPerPage) {
          this.exploreParams.noMoreData = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    exploreScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop + clientHeight >= scrollHeight - 10 && !this.exploreParams.noMoreData) {
        this.exploreParams.page++;
        this.getExplore();
      }
    },
  },
  mounted() {
    this.getExplore();
  },
};
</script>
<style lang="scss">
.list-container li .content img {
  width: 100%;
  margin: 4px 0;
  border-radius: 2px;
}

.list-container li .content video {
  width: 100%;
  margin: 4px 0;
}

.list-container li .content a {
  color: $primary-color;
}

.list-container li .content p {
  //  强制换行
  word-break: break-all;
}
</style>
<style lang="scss" scoped>
.explore-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  background: $background-color;
  height: calc(100vh - 50px);
  width: 100%;
  overflow: auto;

  .loading-wrap {
    text-align: center;
  }

  .list-container {
    padding: 0 10px;

    li {
      margin-bottom: 10px;
      background: $white-color;
      border-radius: 5px;
      padding: 10px;

      .top {
        display: flex;
        align-items: center;

        .left {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: solid 1px $border-color;
          padding: 4px;
          margin-right: 12px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .right {
          width: 70%;

          .name {
            font-size: 14px;
            display: flex;
            align-items: center;

            .verify-svg {
              margin-left: 5px;
              fill: $primary-color;
              width: 16px;
              height: 16px;
            }
          }

          .description {
            font-size: 12px;
            margin-top: 8px;
            color: $subtle-text-color;
          }
        }

        .follow {
          width: 20%;
          height: 24px;
          border-radius: 16px;
          color: $primary-color;
          border: solid 1px $primary-color;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
        }
      }

      .content {
        margin-top: 10px;
        font-size: 14px;
        line-height: 1.5;
        width: 100%;
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid $border-color;

        .like,
        .comment,
        .share {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 33%;
          height: 32px;

          .van-icon {
            font-size: 20px;
          }

          span {
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>
