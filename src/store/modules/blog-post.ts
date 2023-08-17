import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import {
  addChannel,
  addChildDirectory,
  addDirectory,
  addPost,
  addPostAuthor,
  addPostUser,
  addSheet,
  deletePost,
  deletePostUser,
  getAllChannel,
  getAllChildDirectory,
  getAllDirectory,
  getAllPostAuthor,
  getAllPostUser,
  getAllSheet,
  getAreaData,
  getLevel1CommentsByPostId,
  getCompanyAuthorVerifyInfo,
  getIP,
  getPostContentById,
  getPostList,
  getPostListByCategoryId,
  getPostRowById,
  offlinePost,
  publishPost,
  removeChannel,
  removeChildDirectory,
  removeCompanyAuthorVerify,
  removeDirectory,
  removePostAuthor,
  removeSheet,
  setCommentStatus,
  setPostUserStatus,
  updateChannelName,
  updateChannelPos,
  updateChildDirectory,
  updateDirectory,
  updatePost,
  updatePostAuthor,
  updateSheet,
  uploadPostImgs,
  verifyCompanyAuthor,
  viewUserPassword,
  getLevel2CommentsByTopId,
  setMood,
  replyComment,
  addComment,
  getAllCover,
  addCover,
  updateCover,
  deleteCover,
  batchAddCover,
  batchDelteCover,
  deleteCategory,
  queryCategory,
  addCategory,
} from 'src/api/blog-post';
import { th } from 'element-plus/es/locale';

interface IBlogPost {}

@Module({ dynamic: true, namespaced: true, store, name: 'BlogPost' })
class BlogPost extends VuexModule implements IBlogPost {
  public scrollTop = 0;
  public fixedDirectoryRightChannel = false;
  public directoryLeftSideBarNotScroll = false;
  /* 悬浮post新增编辑 */
  public allValidAuthor: any[] = [];
  public allCategory: any[] = [];
  public allChannel: any[] = [];
  public disableSelectCategory = false;
  public blogEditorPostVisiable = false;
  public postDetail = {
    row: {
      authorId: '',
      categoryId: '',
      channelId: '',
      title: '',
      status: '',
      poster: '',
      content: '',
      id: '',
    },
  };
  public postAddOrUpdate = 'add';
  public addedPostId = '';
  public currentCategoryId = '';
  public updatePostSuccessFlag = false;
  public addPostSuccessFlag = false;
  /* 悬浮评论 */
  public commentVisiable = false;
  public commentDetail = {
    id: null,
    title: '',
  };
  /* 悬浮post视频新增编辑 */
  public allValidAuthorVideo: any[] = [];
  public allCategoryVideo: any[] = [];
  public allChannelVideo: any[] = [];
  public disableSelectCategoryVideo = false;
  public blogEditorPostVisiableVideo = false;
  public postDetailVideo = {
    row: {},
  };
  public postAddOrUpdateVideo = 'add';
  public addedPostIdVideo = '';
  public currentCategoryIdVideo = '';
  public updatePostSuccessFlagVideo = false;
  public addPostSuccessFlagVideo = false;
  /* 悬浮post纯图片新增编辑 */
  public allValidAuthorImage: any[] = [];
  public allCategoryImage: any[] = [];
  public allChannelImage: any[] = [];
  public disableSelectCategoryImage = false;
  public blogEditorPostVisiableImage = false;
  public postDetailImage = {
    row: {},
  };
  public postAddOrUpdateImage = 'add';
  public addedPostIdImage = '';
  public currentCategoryIdImage = '';
  public updatePostSuccessFlagImage = false;
  public addPostSuccessFlagImage = false;
  /* 悬浮post调查问卷新增编辑 */
  public allValidAuthorQuestion: any[] = [];
  public allCategoryQuestion: any[] = [];
  public allChannelQuestion: any[] = [];
  public disableSelectCategoryQuestion = false;
  public blogEditorPostVisiableQuestion = false;
  public postDetailQuestion = {
    row: {},
  };
  public postAddOrUpdateQuestion = 'add';
  public addedPostIdQuestion = '';
  public currentCategoryIdQuestion = '';
  public updatePostSuccessFlagQuestion = false;
  public addPostSuccessFlagQuestion = false;
  /* 悬浮post内嵌视频新增编辑 */
  public allValidAuthorVideoEmbed: any[] = [];
  public allCategoryVideoEmbed: any[] = [];
  public allChannelVideoEmbed: any[] = [];
  public disableSelectCategoryVideoEmbed = false;
  public blogEditorPostVisiableVideoEmbed = false;
  public postDetailVideoEmbed = {
    row: {},
  };
  public postAddOrUpdateVideoEmbed = 'add';
  public addedPostIdVideoEmbed = '';
  public currentCategoryIdVideoEmbed = '';
  public updatePostSuccessFlagVideoEmbed = false;
  public addPostSuccessFlagVideoEmbed = false;
  /* 悬浮时政新增编辑*/
  public allValidAuthorPolitical: any[] = [];
  public allCategoryPolitical: any[] = [];
  public allChannelPolitical: any[] = [];
  public disableSelectCategoryPolitical = false;
  public blogEditorPostVisiablePolitical = false;
  public postDetailPolitical = {
    row: {},
  };
  public postAddOrUpdatePolitical = 'add';
  public addedPostIdPolitical = '';
  public currentCategoryIdPolitical = '';
  public updatePostSuccessFlagPolitical = false;
  public addPostSuccessFlagPolitical = false;

  @Mutation
  public SET_SCROLL_TOP(scrollTop: number) {
    this.scrollTop = scrollTop;
  }

  @Mutation
  public SET_FIXED_DIRECTORY_RIGHT_CHANNEL(fixedDirectoryRightChannel: boolean) {
    this.fixedDirectoryRightChannel = fixedDirectoryRightChannel;
  }

  @Mutation
  public SET_DIRECTORY_LEFT_SIDE_BAR_NOT_SCROLL(directoryLeftSideBarNotScroll: boolean) {
    this.directoryLeftSideBarNotScroll = directoryLeftSideBarNotScroll;
  }

  /* 悬浮post新增编辑 */
  @Mutation
  public SET_ALL_VALID_AUTHOR(allAuthor: any[]) {
    this.allValidAuthor = allAuthor;
  }

  @Mutation
  public SET_ALL_CATEGORY(allCategory: any[]) {
    this.allCategory = allCategory;
  }

  @Mutation
  public SET_ALL_CHANNEL(allChannel: any[]) {
    this.allChannel = allChannel;
  }

  @Mutation
  public SET_EDITOR_BLOG_POST_VISIABLE(blogEditorPostVisiable: boolean) {
    this.blogEditorPostVisiable = blogEditorPostVisiable;
  }

  @Mutation
  public SET_DISABLE_SELECT_CATEGORY(disableSelectCategory: boolean) {
    this.disableSelectCategory = disableSelectCategory;
  }

  @Mutation
  public SET_POST_DETAIL(postDetail: any) {
    this.postDetail = postDetail;
  }

  @Mutation
  public SET_POST_ADD_OR_UPDATE(postAddOrUpdate: string) {
    this.postAddOrUpdate = postAddOrUpdate;
  }

  @Mutation
  public SET_ADDED_POST_ID(addedPostId: string) {
    this.addedPostId = addedPostId;
  }

  @Mutation
  public SET_UPDATE_POST_SUCCESS_FLAG(updatePostSuccessFlag: boolean) {
    this.updatePostSuccessFlag = updatePostSuccessFlag;
  }

  @Mutation
  public SET_ADD_POST_SUCCESS_FLAG(addPostSuccessFlag: boolean) {
    this.addPostSuccessFlag = addPostSuccessFlag;
  }

  @Mutation
  public SET_CURRENT_CATEGORY_ID(currentCategoryId: string) {
    this.currentCategoryId = currentCategoryId;
  }

  /* 悬浮评论 */
  @Mutation
  public SET_COMMENT_VISIABLE(commentVisiable: boolean) {
    this.commentVisiable = commentVisiable;
  }

  @Mutation
  public SET_COMMENT_DETAIL(commentDetail: any) {
    this.commentDetail = commentDetail;
  }

  /* 悬浮post视频新增编辑 */
  @Mutation
  public SET_ALL_VALID_AUTHOR_VIDEO(allAuthor: any[]) {
    this.allValidAuthorVideo = allAuthor;
  }
  @Mutation
  public SET_ALL_CATEGORY_VIDEO(allCategory: any[]) {
    this.allCategoryVideo = allCategory;
  }
  @Mutation
  public SET_ALL_CHANNEL_VIDEO(allChannel: any[]) {
    this.allChannelVideo = allChannel;
  }
  @Mutation
  public SET_EDITOR_BLOG_POST_VISIABLE_VIDEO(blogEditorPostVisiable: boolean) {
    this.blogEditorPostVisiableVideo = blogEditorPostVisiable;
  }
  @Mutation
  public SET_DISABLE_SELECT_CATEGORY_VIDEO(disableSelectCategory: boolean) {
    this.disableSelectCategoryVideo = disableSelectCategory;
  }
  @Mutation
  public SET_POST_DETAIL_VIDEO(postDetail: any) {
    this.postDetailVideo = postDetail;
  }
  @Mutation
  public SET_POST_ADD_OR_UPDATE_VIDEO(postAddOrUpdate: string) {
    this.postAddOrUpdateVideo = postAddOrUpdate;
  }
  @Mutation
  public SET_ADDED_POST_ID_VIDEO(addedPostId: string) {
    this.addedPostIdVideo = addedPostId;
  }
  @Mutation
  public SET_UPDATE_POST_SUCCESS_FLAG_VIDEO(updatePostSuccessFlag: boolean) {
    this.updatePostSuccessFlagVideo = updatePostSuccessFlag;
  }
  @Mutation
  public SET_ADD_POST_SUCCESS_FLAG_VIDEO(addPostSuccessFlag: boolean) {
    this.addPostSuccessFlagVideo = addPostSuccessFlag;
  }
  @Mutation
  public SET_CURRENT_CATEGORY_ID_VIDEO(currentCategoryId: string) {
    this.currentCategoryIdVideo = currentCategoryId;
  }

  @Action({ rawError: true })
  public async getPostList(data: any) {
    const result = await getPostList(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getPostListByCategoryId(data: any) {
    const result = await getPostListByCategoryId(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getPostRowById(data: any) {
    const result = await getPostRowById(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getPostContentById(data: any) {
    const result = await getPostContentById(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async uploadPostImgs(data: any) {
    const result = await uploadPostImgs(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addPost(data: any) {
    const result = await addPost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async deletePost(data: any) {
    const result = await deletePost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updatePost(data: any) {
    const result = await updatePost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async offlinePost(data: any) {
    const result = await offlinePost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async publishPost(data: any) {
    const result = await publishPost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getAllChannel(data: any) {
    const result = await getAllChannel(data);
    let { pageData } = result;
    pageData = pageData.map((item: any) => {
      return { ...item, label: item.name, value: item.id };
    });
    this.SET_ALL_CHANNEL(pageData);
    this.SET_ALL_CHANNEL_VIDEO(pageData);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateChannelPos(data: any) {
    const result = await updateChannelPos(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateChannelName(data: any) {
    const result = await updateChannelName(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addChannel(data: any) {
    const result = await addChannel(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async removeChannel(data: any) {
    const result = await removeChannel(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getAllSheet(data: any) {
    const result = await getAllSheet(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getAllDirectory(data: any) {
    const result = await getAllDirectory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getAllChildDirectory(data: any) {
    const result = await getAllChildDirectory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addSheet(data: any) {
    const result = await addSheet(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addDirectory(data: any) {
    const result = await addDirectory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addChildDirectory(data: any) {
    const result = await addChildDirectory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async removeSheet(data: any) {
    const result = await removeSheet(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async removeDirectory(data: any) {
    const result = await removeDirectory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async removeChildDirectory(data: any) {
    const result = await removeChildDirectory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateSheet(data: any) {
    const result = await updateSheet(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateDirectory(data: any) {
    const result = await updateDirectory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateChildDirectory(data: any) {
    const result = await updateChildDirectory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getAllPostAuthor(data: any) {
    const result = await getAllPostAuthor(data);
    let { pageData } = result;
    if (pageData && pageData.length > 0) {
      pageData = pageData.filter((item: any) => item.status === 0 || (item.status === 4 && item.type === 0));
      pageData = pageData.map((item: any) => {
        return { ...item, label: item.name, value: item.id };
      });
      this.SET_ALL_VALID_AUTHOR(pageData);
      this.SET_ALL_VALID_AUTHOR_VIDEO(pageData);
    }
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addPostAuthor(data: any) {
    const result = await addPostAuthor(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async removePostAuthor(data: any) {
    const result = await removePostAuthor(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updatePostAuthor(data: any) {
    const result = await updatePostAuthor(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async verifyCompanyAuthor(data: any) {
    const result = await verifyCompanyAuthor(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getCompanyAuthorVerifyInfo(data: any) {
    const result = await getCompanyAuthorVerifyInfo(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async removeCompanyAuthorVerify(data: any) {
    const result = await removeCompanyAuthorVerify(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getLevel1CommentsByPostId(data: any) {
    const result = await getLevel1CommentsByPostId(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getLevel2CommentsByTopId(data: any) {
    const result = await getLevel2CommentsByTopId(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async setCommentStatus(data: any) {
    const result = await setCommentStatus(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async setMood(data: any) {
    const result = await setMood(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async replyComment(data: any) {
    const result = await replyComment(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addComment(data: any) {
    const result = await addComment(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getAllPostUser(data: any) {
    const result = await getAllPostUser(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getAreaData(data: any) {
    const result = await getAreaData(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getIP(data: any) {
    const result = await getIP(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addPostUser(data: any) {
    const result = await addPostUser(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async deletePostUser(data: any) {
    const result = await deletePostUser(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async viewUserPassword(data: any) {
    const result = await viewUserPassword(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async setPostUserStatus(data: any) {
    const result = await setPostUserStatus(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async getAllCover(data: any) {
    const result = await getAllCover(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addCover(data: any) {
    const result = await addCover(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateCover(data: any) {
    const result = await updateCover(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async deleteCover(data: any) {
    const result = await deleteCover(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async batchAddCover(data: any) {
    const result = await batchAddCover(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async batchDelteCover(data: any) {
    const result = await batchDelteCover(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addCategory(data: any) {
    const result = await addCategory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async deleteCategory(data: any) {
    const result = await deleteCategory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async queryCategory(data: any) {
    const result = await queryCategory(data);
    return Promise.resolve(result);
  }
}

export const BlogPostModule = getModule(BlogPost);
