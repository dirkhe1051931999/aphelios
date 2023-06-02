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
        <q-card-section style="max-height: 50vh" class="scroll">
          <q-inner-loading :showing="_commentDetail.loading"></q-inner-loading>
          <ul class="comment-list">
            <li v-for="item in _commentDetail.data" :key="item.id" class="q-mb-md q-pb-md">
              <div class="top row items-center q-mb-sm">
                <div class="left row">
                  <q-avatar size="35px">
                    <img src="~assets/logo.png" />
                  </q-avatar>
                  <div style="margin-left: 12px">
                    <div>{{ item.userId }}</div>
                    <div class="text-grey q-pt-xs">{{ parseTime(item.postTime) }}</div>
                  </div>
                </div>
                <div class="action self-start q-ml-auto">
                  <span class="link-type" @click="setCommentStatus(item, 2)" v-if="item.status === 1">拉黑</span>
                  <span class="link-type q-ml-sm" @click="setCommentStatus(item, 1)" v-if="item.status === 2 || item.status === 3">恢复</span>
                  <span class="delete-type q-ml-sm" @click="setCommentStatus(item, 3)">删除</span>
                </div>
              </div>
              <div class="content q-ml-xl flex items-center" :class="{ 'level-1': item.children }">
                {{ defaultFill(item.content) }}
                <span class="my-label red q-ml-md" v-if="item.status === 2">已拉黑</span>
                <span class="my-label yellow q-ml-md" v-if="item.status === 3">已删除</span>
              </div>
              <ul class="child-comment q-ml-xl q-pt-md" v-if="item.children">
                <li v-for="child in item.children" :key="child.id" class="q-mb-md q-pb-md">
                  <div class="top row items-center q-mb-sm">
                    <div class="left row">
                      <q-avatar size="35px">
                        <img src="~assets/avatar.jpg" />
                      </q-avatar>
                      <div style="margin-left: 12px">
                        <div>{{ child.userId }}</div>
                        <div class="text-grey q-pt-xs">{{ parseTime(child.postTime) }}</div>
                      </div>
                    </div>
                    <div class="action self-start q-ml-auto">
                      <span class="link-type" @click="setCommentStatus(child, 2)" v-if="child.status === 1">拉黑</span>
                      <span class="link-type q-ml-sm" @click="setCommentStatus(child, 1)" v-if="child.status === 2 || child.status === 3">恢复</span>
                      <span class="delete-type q-ml-sm" @click="setCommentStatus(child, 3)">删除</span>
                    </div>
                  </div>
                  <div class="content q-ml-xl flex items-center">
                    <span class="text-grey">{{ child.replyText ? (child.replyText.slice(0, 10) + child.replyText.length > 10 ? '...' : '') : '' }}</span> {{ defaultFill(child.content) }}
                    <span class="my-label red q-ml-md" v-if="child.status === 2">已拉黑</span>
                    <span class="my-label yellow q-ml-md" v-if="child.status === 3">已删除</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Component, Vue, Watch } from 'vue-facing-decorator';

@Component({ name: 'MyPostCommentComponent' })
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
      this.getData();
    }
  }
  public closeDialog() {
    this.blogCommentVisiable = false;
    BlogPostModule.SET_COMMENT_VISIABLE(false);
    this._commentDetail.data = [];
    this._commentDetail.pagination.page = 1;
    this._commentDetail.pagination.rowsPerPage = 10;
    this._commentDetail.pagination.total = 0;
  }
  public blogCommentVisiable = false;
  public _commentDetail = {
    id: null,
    title: '',
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      total: 0,
    },
    data: [],
  };
  /* event */
  /* http */
  public async getData() {
    try {
      this._commentDetail.loading = true;
      let { pageData } = await BlogPostModule.getCommentsByPostId({ id: this._commentDetail.id });
      pageData[0].replyId = null;
      if (pageData && pageData.length) {
        function buildTree(comments: any, parentId = null) {
          let tree = [];
          for (let comment of comments) {
            if (comment.replyId === parentId) {
              let children = buildTree(comments, comment.id2);
              if (children.length > 0) {
                comment.children = children;
              }
              tree.push(comment);
            }
          }
          return tree;
        }
        function flattenChildren(comments: any) {
          comments.forEach((comment: any) => {
            if (comment.children) {
              comment.children.forEach((child: any) => {
                if (child.children) {
                  child.children.forEach((grandchild: any) => {
                    if (grandchild.replyId === child.id2) {
                      grandchild.replyText = `回复 【${child.content}】`;
                    }
                    comment.children.push(grandchild);
                  });
                  delete child.children;
                }
              });
            }
          });
          return comments;
        }
        pageData = pageData.map((item: any) => {
          let isReplyIdInList = pageData.some((listItem: any) => listItem.id2 === item.replyId);
          if (!isReplyIdInList) {
            item.replyId = null;
          }
          return item;
        });
        let tree = buildTree(pageData);
        let flattenTree = flattenChildren(tree);
        this._commentDetail.data = flattenTree;
      }
      this._commentDetail.loading = false;
      return Promise.resolve();
    } catch (error) {
      console.log(error);
      this._commentDetail.loading = false;
    }
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
}
</script>

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
      .level-1.content {
        padding-bottom: 16px;
        border-bottom: solid 1px #eaeaea;
      }
    }
  }
}
</style>
