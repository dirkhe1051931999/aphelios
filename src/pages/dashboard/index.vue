<template>
  <div>
    <ul class="overview">
      <li v-for="(item, key) in overviewData" :key="key" class="thin-shadow" @click="clickLink(item.link)">
        <div class="label-value">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
        <div class="icon">
          <q-icon :name="item.icon"></q-icon>
        </div>
      </li>
    </ul>
    <ul class="trend">
      <li class="thin-shadow q-pa-md q-mt-md">
        <div class="fs-16 bold">文章发表走势</div>
        <q-option-group :options="articleTrend.dayOptions" type="radio" v-model="articleTrend.day" @update:model-value="onPostDayChange" inline class="q-mb-md q-mt-sm" />
        <q-card flat title="data">
          <ChartsLine :cid="'article-trend'" ref="articleTrendRef" v-if="!articleTrend.getDataLoading" />
        </q-card>
        <q-card class="h-300" flat v-if="articleTrend.getDataLoading">
          <q-item>
            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" width="50%" />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item square>
            <q-skeleton height="200px" width="100%" />
          </q-item>
        </q-card>
      </li>
    </ul>
    <ul class="channel-sheet-user-author">
      <li class="thin-shadow">
        <q-list class="q-pa-md">
          <div class="fs-16 bold">热度TOP5</div>
          <q-item v-for="(item, index) in channelSheetUserAuthor.postViewTop5" :key="item.id" class="q-my-sm b-bottom" clickable v-ripple @click.stop.prevent="handlerClickUpdate(item)">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" v-if="!item.poster">
                {{ index + 1 }}
              </q-avatar>
              <q-img :src="item.poster" :ratio="16 / 9" v-else spinner-size="12px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption lines="1">{{ item.status }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                <q-icon name="visibility"></q-icon>
                {{ item.view }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <div class="text-center">
            <span class="detail-link-type" @click="clickLink('post-index')">更多</span>
          </div>
        </q-list>
      </li>
      <li class="thin-shadow">
        <q-list class="q-pa-md">
          <div class="fs-16 bold">评论TOP5</div>
          <q-item v-for="(item, index) in channelSheetUserAuthor.postCommentTop5" :key="item.id" class="q-my-sm b-bottom" clickable v-ripple @click.stop.prevent="openCommentDialog(item)">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" v-if="!item.poster">
                {{ index + 1 }}
              </q-avatar>
              <q-img :src="item.poster" :ratio="16 / 9" v-else spinner-size="12px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption lines="1">{{ item.status }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                <q-icon name="chat"></q-icon>
                {{ item.comment }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <div class="text-center">
            <span class="detail-link-type" @click="clickLink('post-index')">更多</span>
          </div>
        </q-list>
      </li>
      <li class="thin-shadow">
        <q-list class="q-pa-md">
          <div class="fs-16 bold">频道</div>
          <q-item v-for="(item, index) in channelSheetUserAuthor.channelData" :key="item.id" class="q-my-sm b-bottom" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ index + 1 }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="1">{{ item.email }}</q-item-label>
            </q-item-section>
          </q-item>
          <div class="text-center">
            <span class="detail-link-type" @click="clickLink('post-channel')">更多</span>
          </div>
        </q-list>
      </li>
      <li class="thin-shadow">
        <q-list class="q-pa-md">
          <div class="fs-16 bold">分类</div>
          <q-item v-for="(item, index) in channelSheetUserAuthor.sheetData" :key="item.id" class="q-my-sm b-bottom" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" v-if="!item.cover">
                {{ index + 1 }}
              </q-avatar>
              <q-avatar v-else>
                <q-img :src="item.cover" spinner-size="12px"></q-img>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="1">{{ item.description }}</q-item-label>
            </q-item-section>
          </q-item>
          <div class="text-center">
            <span class="detail-link-type" @click="clickLink('post-sheet')">更多</span>
          </div>
        </q-list>
      </li>
      <li class="thin-shadow">
        <q-list class="q-pa-md" bo>
          <div class="fs-16 bold">用户</div>
          <q-item v-for="item in channelSheetUserAuthor.userData" :key="item.id" class="q-my-sm b-bottom" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                <q-img :src="item.avatarUrl" spinner-size="12px"></q-img>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.username }}</q-item-label>
              <q-item-label caption lines="1">{{ item.nickname }}</q-item-label>
            </q-item-section>
          </q-item>

          <div class="text-center">
            <span class="detail-link-type" @click="clickLink('post-user')">更多</span>
          </div>
        </q-list>
      </li>
      <li class="thin-shadow">
        <q-list class="q-pa-md">
          <div class="fs-16 bold">作者</div>
          <q-item v-for="item in channelSheetUserAuthor.authorData" :key="item.id" class="q-my-sm b-bottom" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                <q-img :src="item.avatarUrl" spinner-size="12px"></q-img>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="1">{{ item.nick }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="item.type === 0 && (item.status === 3 || item.status === 2 || item.status === 4)">
                <img src="~assets/icon/verified.png" alt="" srcset="" style="width: 18px" class="q-mr-xs" :class="{ 'process-verify': item.status === 3, 'not-verify': item.status === 2 }" />
              </q-item-label>
              <q-item-label v-else>
                <q-icon name="person" color="grey" />
              </q-item-label>
              <q-item-label caption lines="1">{{ item.type === 0 ? '企业作者' : '个人作者' }}</q-item-label>
            </q-item-section>
          </q-item>
          <div class="text-center">
            <span class="detail-link-type" @click="clickLink('post-author')">更多</span>
          </div>
        </q-list>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { DashboardModule } from 'src/store/modules/dashboard';
import ChartsLine from './components/chartsLine.vue';
import { Component, Vue } from 'vue-facing-decorator';
import { BlogPostModule } from 'src/store/modules/blog-post';

@Component({
  name: 'DashboardComponent',
  components: {
    ChartsLine,
  },
})
export default class DashboardComponent extends Vue {
  $refs: any;

  async mounted() {
    await this.getOverview();
    await this.getChannelSheetUserAuthorLimit5();
    this.articleTrend.getDataLoading = true;
    const result = await this.getPostTrends(90);
    const dataX = result.map((item: any) => item.date);
    const dataY1 = result.map((item: any) => item.count);
    this.articleTrend.getDataLoading = false;
    await this.$nextTick(() => {
      this.$refs.articleTrendRef.initChart({
        dataX: dataX,
        dataY1: dataY1,
        label1: this.articleTrend.data.label1,
      });
    });
  }

  public overviewData = {
    postCount: {
      value: 0,
      label: '文章',
      icon: 'article',
      link: 'post-index',
    },
    onlinePostCount: {
      value: 0,
      label: '在线文章',
      icon: 'article',
      link: 'post-index',
    },
    channelCount: {
      value: 0,
      label: '频道',
      icon: 'category',
      link: 'post-channel',
    },
    sheetCount: {
      value: 0,
      label: '分类',
      icon: 'checklist',
      link: 'post-sheet',
    },
    userCount: {
      value: 0,
      label: '用户',
      icon: 'person',
      link: 'post-user',
    },
    authorCount: {
      value: 0,
      label: '作者',
      icon: 'person_add',
      link: 'post-author',
    },
  };
  public articleTrend = {
    day: '90',
    dayOptions: [
      { label: '近一年', value: '365' },
      { label: '近一周', value: '7' },
      { label: '近一月', value: '30' },
      { label: '近三月', value: '90' },
    ],
    getDataLoading: false,
    data: {
      dataX: [],
      dataY1: [],
      label1: '文章数',
    },
  };
  public channelSheetUserAuthor = {
    postCommentTop5: [],
    postViewTop5: [],
    channelData: [],
    sheetData: [],
    userData: [],
    authorData: [],
  };

  /* event */
  public onPostDayChange() {
    this.articleTrend.getDataLoading = true;
    this.getPostTrends(this.articleTrend.day).then((result: any) => {
      const dataX = result.map((item: any) => item.date);
      const dataY1 = result.map((item: any) => item.count);
      this.articleTrend.getDataLoading = false;
      this.$nextTick(() => {
        this.$refs.articleTrendRef.initChart({
          dataX: dataX,
          dataY1: dataY1,
          label1: this.articleTrend.data.label1,
        });
      });
    });
  }

  public clickLink(link: string) {
    switch (link) {
      case 'post-index':
        this.$router.push('/blog-post/list');
        break;
      case 'post-channel':
        this.$router.push('/blog-post/channel');
        break;
      case 'post-sheet':
        this.$router.push('/blog-post/directory');
        break;
      case 'post-user':
        this.$router.push('/blog-post/user');
        break;
      case 'post-author':
        this.$router.push('/blog-post/author');
        break;

      default:
        break;
    }
  }

  public openCommentDialog(row: any) {
    const detail = {
      id: row.id,
      title: row.title,
    };
    BlogPostModule.SET_COMMENT_DETAIL(detail);
    BlogPostModule.SET_COMMENT_VISIABLE(true);
  }

  public handlerClickUpdate(row: any) {
    this.$router.push(`/blog-post/list?id=${row.id}`);
  }

  /* http */
  public async getOverview() {
    try {
      const result = await DashboardModule.getOverview({});
      for (let key in result) {
        (this.overviewData as any)[key].value = result[key];
      }
    } catch (error) {}
  }

  public async getPostTrends(days: any) {
    try {
      const { postTrends } = await DashboardModule.getPostTrends({ days });
      return Promise.resolve(postTrends);
    } catch (error) {}
  }

  public async getChannelSheetUserAuthorLimit5() {
    try {
      const { channelLimit5, sheetLimit5, userLimit5, authorLimit5, postViewTop5, postCommentTop5 } = await DashboardModule.getChannelSheetUserAuthorLimit5({});
      this.channelSheetUserAuthor.channelData = channelLimit5;
      this.channelSheetUserAuthor.sheetData = sheetLimit5;
      this.channelSheetUserAuthor.userData = userLimit5;
      this.channelSheetUserAuthor.authorData = authorLimit5;
      this.channelSheetUserAuthor.postViewTop5 = postViewTop5;
      this.channelSheetUserAuthor.postCommentTop5 = postCommentTop5;
    } catch (error) {}
  }

  public async getAuthor() {
    try {
      let { pageData } = await BlogPostModule.getAllPostAuthor({});
    } finally {
      return Promise.resolve();
    }
  }

  public async getCategories() {
    try {
      const allSheet = await BlogPostModule.getAllSheet({});
      const allDirectory = await BlogPostModule.getAllDirectory({});
      const allChildDirectory = await BlogPostModule.getAllChildDirectory({});
      const sheets = allSheet.pageData;
      const directorys = allDirectory.pageData;
      const childDirectorys = allChildDirectory.pageData;
      for (let item of sheets) {
        item.children = [];
        item.children = directorys.filter((directory: any) => directory.parent_id === item.id);
      }
      for (let item of sheets) {
        for (let child of item.children) {
          child.children = [];
          child.children = childDirectorys.filter((childDirectory: any) => childDirectory.parent_id === child.id);
        }
      }
      allSheet.pageData = allSheet.pageData.map((item: any) => {
        return { ...item, label: item.name, value: item.id };
      });
      BlogPostModule.SET_ALL_CATEGORY(allSheet.pageData);
      BlogPostModule.SET_ALL_CATEGORY_VIDEO(allSheet.pageData);
    } finally {
      return Promise.resolve();
    }
  }

  public async getChannel() {
    try {
      await BlogPostModule.getAllChannel({});
    } finally {
      return Promise.resolve();
    }
  }
}
</script>
<style lang="scss">
.body--dark {
}

.body--light {
}
</style>

<style lang="scss" scoped>
.overview {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 16px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;

    .label-value {
      .label {
        font-size: 14px;
        color: #999;
      }

      .value {
        font-size: 24px;
        color: #333;
        padding-top: 4px;
      }
    }

    .icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, $primary, #ffffff);
      color: #ffffff;
      font-size: 24px;
      border-radius: 8px;
    }
  }
}

.channel-sheet-user-author {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
  padding: 16px;
  margin-top: 16px;

  li {
    margin-top: 16px;

    .process-verify {
      filter: grayscale(100%);
    }

    .not-verify {
      filter: grayscale(100%);
    }
  }
}
</style>
