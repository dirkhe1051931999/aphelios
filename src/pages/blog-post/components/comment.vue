<template>
  <div>
    <q-dialog v-model="blogCommentVisiable" transition-show="jump-up" transition-hide="jump-down" persistent>
      <q-card style="min-width: 50vw" class="comment-content">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ commentDetail.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeDialog" />
        </q-card-section>
        <div class="split-line h-1"></div>
        <q-card-section style="height: 50vh" class="scroll" @scroll="listenScrollEvent" ref="cardSectionRef">
          <q-inner-loading :showing="_commentDetail.loading"></q-inner-loading>
          <ul class="comment-list">
            <li v-for="item in _commentDetail.data" :key="item.id" class="q-mb-md q-pb-md">
              <div class="top row items-center q-mb-sm">
                <div class="left row">
                  <q-avatar size="35px">
                    <img :src="item.account.avatarUrl" />
                  </q-avatar>
                  <div style="margin-left: 12px">
                    <div>
                      {{ item.account.username }}
                    </div>
                    <div class="text-grey q-pt-xs fs-12">{{ upToNowParseTime(item.postTime) }}</div>
                  </div>
                </div>
                <div class="action self-start q-ml-auto row items-center text-grey">
                  <div class="cursor-pointer q-ml-sm" v-if="!item.clickLike" @click="setMood(item, 1, 'like')">
                    <q-icon name="o_thumb_up" color="grey"></q-icon> <span>{{ item.like }}</span>
                  </div>
                  <div class="cursor-pointer q-ml-sm" v-if="item.clickLike" @click="setMood(item, 1, 'cancel-like')">
                    <q-icon name="thumb_up" color="primary"></q-icon> <span>{{ item.like + 1 }}</span>
                  </div>
                  <div class="cursor-pointer q-ml-sm" v-if="!item.clickUnLike" @click="setMood(item, 0, 'unlike')"><q-icon name="o_thumb_down" color="grey"></q-icon></div>
                  <div class="cursor-pointer q-ml-sm" v-if="item.clickUnLike" @click="setMood(item, 0, 'cancel-unlike')"><q-icon name="thumb_down" color="primary"></q-icon> <span>1</span></div>
                  <span class="link-type q-ml-sm" @click="setCommentStatus(item, 2)" v-if="item.status === 1">拉黑</span>
                  <span class="link-type q-ml-sm" @click="setCommentStatus(item, 1)" v-if="item.status === 2 || item.status === 3">恢复</span>
                  <span class="delete-type q-ml-sm" @click="setCommentStatus(item, 3)">删除</span>
                </div>
              </div>
              <div class="content q-ml-xl flex items-center" :class="{ 'level-1': item.children && item.children.length }">
                {{ defaultFill(item.content) }}
                <span class="my-label red q-ml-md" v-if="item.status === 2">已拉黑</span>
                <span class="my-label yellow q-ml-md" v-if="item.status === 3">已删除</span>
                <q-btn class="q-ml-sm" label="回复" flat size="small" dense color="primary">
                  <q-popup-proxy class="reply-input-proxy" ref="replyInputProxyRef">
                    <q-banner style="min-width: 20vw" class="q-pa-md">
                      <SimpleRichTextInput @submit="submitReplyComment($event, item)" />
                    </q-banner>
                  </q-popup-proxy>
                </q-btn>
              </div>
              <div v-if="item.childCommentCount && item.showMoreText" class="row items-center q-ml-xl q-pt-md">
                <div class="w-15 h-1 bg-grey-5 q-mr-sm"></div>
                <div class="link-type" @click="getLevel2CommentsByTopId(item)">展开{{ item.childCommentCount }}条回复 <q-icon name="expand_more" size="20px"></q-icon></div>
              </div>
              <ul class="child-comment q-ml-xl q-pt-md" v-if="item.children && item.children.length">
                <li v-for="(child, idx) in item.children" :key="child.id" class="q-mb-md q-pb-md" :class="{ 'no-border-bottom': item.children.length === idx + 1 }">
                  <div class="top row items-center q-mb-sm">
                    <div class="left row">
                      <q-avatar size="35px">
                        <img :src="child.account.avatarUrl" />
                      </q-avatar>
                      <div style="margin-left: 12px" class="text-grey">
                        <div class="row items-center">
                          {{ child.account.username }}
                          <div v-if="child.replyId !== item.id2" class="q-mr-sm"><q-icon name="arrow_right" size="24px"></q-icon> {{ child.replyAccount.username }}：</div>
                          <span v-if="child.replyId !== item.id2" class="fs-12">【</span>
                          <div v-if="child.replyId !== item.id2" style="max-width: 20vw" class="ellipsis fs-12">{{ child.replyContent }}</div>
                          <span v-if="child.replyId !== item.id2" class="fs-12">】</span>
                        </div>
                        <div class="q-pt-xs fs-12">{{ upToNowParseTime(child.postTime) }}</div>
                      </div>
                    </div>
                    <div class="action self-start q-ml-auto row items-center text-grey" v-if="!child.noAction">
                      <div class="cursor-pointer q-ml-sm" v-if="!child.clickLike" @click="setMood(child, 1, 'like')">
                        <q-icon name="o_thumb_up" color="grey"></q-icon> <span>{{ child.like }}</span>
                      </div>
                      <div class="cursor-pointer q-ml-sm" v-if="child.clickLike" @click="setMood(child, 1, 'cancel-like')">
                        <q-icon name="thumb_up" color="primary"></q-icon> <span>{{ child.like + 1 }}</span>
                      </div>
                      <div class="cursor-pointer q-ml-sm" v-if="!child.clickUnLike" @click="setMood(child, 0, 'unlike')"><q-icon name="o_thumb_down" color="grey"></q-icon></div>
                      <div class="cursor-pointer q-ml-sm" v-if="child.clickUnLike" @click="setMood(child, 0, 'cancel-unlike')"><q-icon name="thumb_down" color="primary"></q-icon> <span>1</span></div>
                      <span class="link-type q-ml-sm" @click="setCommentStatus(child, 2)" v-if="child.status === 1">拉黑</span>
                      <span class="link-type q-ml-sm" @click="setCommentStatus(child, 1)" v-if="child.status === 2 || child.status === 3">恢复</span>
                      <span class="delete-type q-ml-sm" @click="setCommentStatus(child, 3)">删除</span>
                    </div>
                  </div>
                  <div class="content q-ml-xl flex items-center">
                    {{ defaultFill(child.content) }}
                    <span class="my-label red q-ml-md" v-if="child.status === 2">已拉黑</span>
                    <span class="my-label yellow q-ml-md" v-if="child.status === 3">已删除</span>
                    <q-btn class="q-ml-sm" label="回复" flat size="small" dense color="primary" v-if="!child.noAction">
                      <q-popup-proxy class="reply-input-proxy" ref="replyInputProxyRef">
                        <q-banner style="min-width: 20vw" class="q-pa-md">
                          <SimpleRichTextInput @submit="submitReplyComment($event, child, item)" />
                        </q-banner>
                      </q-popup-proxy>
                    </q-btn>
                  </div>
                </li>
                <div v-if="item.showInnerMoreText" class="row items-center q-ml-xl">
                  <div class="link-type" @click="getLevel2CommentsByTopIdMore(item)">更多<q-icon name="expand_more" size="20px"></q-icon></div>
                </div>
              </ul>
            </li>
          </ul>
          <div class="text-grey row items-center justify-center h-32" v-if="this._commentDetail.loadingMore"><q-spinner color="primary" size="16px" class="q-mr-sm" /> 加载中...</div>
          <div class="text-grey text-center h-32 lh-32 q-mt-md" v-if="this._commentDetail.noData">已经到底部了...</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { TEST_ACCOUNT } from '../utils';
@Component({
  name: 'MyPostCommentComponent',
  components: {},
})
export default class MyPostCommentComponent extends Vue {
  $refs: any;
  get commentVisiable() {
    return BlogPostModule.commentVisiable;
  }
  get commentDetail() {
    return BlogPostModule.commentDetail;
  }
  mounted() {
    BlogPostModule.SET_COMMENT_VISIABLE(false);
  }
  @Watch('commentVisiable')
  public onCommentVisiableChange(val: boolean) {
    this.blogCommentVisiable = val;
    if (val) {
      this._commentDetail.id = this.commentDetail.id;
      this._commentDetail.title = this.commentDetail.title;
      this.getData('init');
    }
  }
  public closeDialog() {
    this.blogCommentVisiable = false;
    BlogPostModule.SET_COMMENT_VISIABLE(false);
    this._commentDetail.data = [];
    this._commentDetail.pagination.page = 1;
    this._commentDetail.pagination.rowsPerPage = 10;
    this._commentDetail.pagination.total = 0;
    this._commentDetail.lock = false;
    this._commentDetail.noData = false;
  }
  public blogCommentVisiable = false;
  public _commentDetail = {
    id: null,
    title: '',
    loading: false,
    lock: false,
    noData: false,
    loadingMore: false,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      total: 0,
    },
    data: [],
  };
  /* event */
  public async listenScrollEvent($event: any) {
    const { target } = $event;
    const { scrollTop, scrollHeight, clientHeight } = target;
    if (scrollTop + clientHeight + 20 >= scrollHeight) {
      if (!this._commentDetail.lock) {
        this._commentDetail.pagination.page++;
        this._commentDetail.loadingMore = true;
        const result = await this.getData();
        this._commentDetail.loadingMore = false;
        if (result.length < this._commentDetail.pagination.rowsPerPage) {
          this._commentDetail.lock = true;
          this._commentDetail.data = this._commentDetail.data.concat(result);
          this._commentDetail.noData = true;
          return;
        }
        this._commentDetail.lock = false;
      }
    }
  }
  public getLevel2CommentsByTopIdMore(item: any) {
    if (!item.childrenLock) {
      item.childrenPage++;
      this.getLevel2CommentsByTopId(item);
    }
  }
  /* http */
  public async getData(type?: string) {
    try {
      if (type === 'init') {
        this._commentDetail.loading = true;
      }
      let { pageData } = await BlogPostModule.getLevel1CommentsByPostId({
        id: this._commentDetail.id,
        page: this._commentDetail.pagination.page,
        rowsPerPage: this._commentDetail.pagination.rowsPerPage,
      });
      pageData = pageData.map((item: any) => {
        return {
          ...item,
          children: [],
          showMoreText: true,
          showInnerMoreText: true,
          childrenLock: false,
          childrenPage: 1,
          childrenRowsPerPage: 3,
          clickLike: false,
          clickUnLike: false,
        };
      });
      if (type === 'init') {
        this._commentDetail.loading = false;
        this._commentDetail.data = pageData;
        if (pageData.length < this._commentDetail.pagination.rowsPerPage) {
          this._commentDetail.noData = true;
          this._commentDetail.lock = true;
        }
      }
      return Promise.resolve(pageData);
    } catch (error) {
      console.log(error);
      this._commentDetail.loading = false;
    }
  }
  public async getLevel2CommentsByTopId(item: any) {
    try {
      item.childrenLock = true;
      let { pageData } = await BlogPostModule.getLevel2CommentsByTopId({
        id: item.id2,
        page: item.childrenPage,
        rowsPerPage: item.childrenRowsPerPage,
      });
      pageData = pageData.map((data: any) => {
        return {
          ...data,
          clickLike: false,
          clickUnLike: false,
        };
      });
      item.children = item.children.concat(pageData);
      item.showMoreText = false;
      item.childrenLock = false;
      if (item.children.length === item.childCommentCount) {
        item.showInnerMoreText = false;
        item.childrenLock = true;
      }
    } catch (error) {}
  }
  public async setCommentStatus(item: any, status: number) {
    try {
      await BlogPostModule.setCommentStatus({ id: item.id, status: status });
      this.$globalMessage.show({
        type: 'success',
        content: '操作成功',
      });
      item.status = status;
    } catch (error) {}
  }
  public async setMood(item: any, status: number, type: string) {
    try {
      await BlogPostModule.setMood({ id: item.id, mood: type });
      if (['like', 'cancel-like'].includes(type)) {
        item.clickLike = !item.clickLike;
      }
      if (['unlike', 'cancel-unlike'].includes(type)) {
        item.clickUnLike = !item.clickUnLike;
      }
    } catch (error) {}
  }
  public async submitReplyComment(content: any, item: any, topFather: any) {
    try {
      let obj = {
        topId: !item.topId && !item.replyId ? item.id2 : item.topId,
        content,
        postId: item.postId,
        userId: TEST_ACCOUNT.id,
        replyId: item.id2,
      };
      this.$q.loading.show();
      await BlogPostModule.replyComment(obj);
      this.$q.loading.hide();
      this.$globalMessage.show({
        type: 'success',
        content: '回复成功',
      });
      let tempComment = {
        id: Math.random().toString(),
        id2: Math.random().toString(),
        content: obj.content,
        postId: obj.postId,
        userId: obj.userId,
        replyId: obj.replyId,
        status: 1,
        postTime: +new Date(),
        like: 0,
        unlike: 0,
        noAction: true,
        topId: obj.topId,
        account: TEST_ACCOUNT,
        replyAccount: item.account,
        replyContent: item.content,
      };
      if (topFather) {
        topFather.children.unshift(tempComment);
      } else {
        item.children.unshift(tempComment);
      }
      for (let item of this.$refs.replyInputProxyRef) {
        item.hide();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
<style lang="scss">
.body--dark {
  .reply-input-proxy {
    box-shadow: 0px 6px 16px -1px rgba($color: #ffffff, $alpha: 0.15) !important;
  }
}
.body--light {
  .reply-input-proxy {
    box-shadow: 0px 6px 16px -1px rgba($color: #000000, $alpha: 0.15) !important;
  }
}
.reply-input-proxy {
  border-radius: 8px !important;
}
</style>
<style lang="scss" scoped>
.comment-content {
  .comment-list {
    li {
      border-bottom: solid 1px #eaeaea;
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .content {
        line-height: 1.6;
      }
    }
  }
  .no-border-bottom {
    border-bottom: none !important;
    margin-bottom: 0 !important;
  }
}
</style>
