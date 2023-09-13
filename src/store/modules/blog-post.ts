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
  getAllVideo,
  addVideo,
  updateVideo,
  deleteVideo,
  batchAddVideo,
  batchDelteVideo,
  addVideoCategory,
  deleteVideoCategory,
  queryVideoCategory,
  addVideoPost,
  updateVideoPost,
  updateGalleryPost,
  addGalleryPost,
  addVideoEmbedPost,
  updateVideoEmbedPost,
  addNormalPost,
  updateNormalPost,
  updateChannelVisible,
} from 'src/api/blog-post';

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
    row: {},
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
  /* 悬浮post图集新增编辑 */
  public allValidAuthorGallery: any[] = [];
  public allCategoryGallery: any[] = [];
  public allChannelGallery: any[] = [];
  public disableSelectCategoryGallery = false;
  public blogEditorPostVisiableGallery = false;
  public postDetailGallery = {
    row: {},
  };
  public postAddOrUpdateGallery = 'add';
  public addedPostIdGallery = '';
  public currentCategoryIdGallery = '';
  public updatePostSuccessFlagGallery = false;
  public addPostSuccessFlagGallery = false;
  /* 悬浮post调查问卷新增编辑 */
  public blogEditorPostVisiableQuestion = false;
  public postDetailQuestion = {
    row: {},
  };
  public postAddOrUpdateQuestion = 'add';
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
  /* 悬浮普通文章编辑器2新增编辑*/
  public allValidAuthorNormal: any[] = [];
  public allCategoryNormal: any[] = [];
  public allChannelNormal: any[] = [];
  public disableSelectCategoryNormal = false;
  public blogEditorPostVisiableNormal = false;
  public postDetailNormal = {
    row: {},
  };
  public postAddOrUpdateNormal = 'add';
  public addedPostIdNormal = '';
  public currentCategoryIdNormal = '';
  public updatePostSuccessFlagNormal = false;
  public addPostSuccessFlagNormal = false;

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

  /* 悬浮POST图片新增编辑 */
  @Mutation
  public SET_ALL_VALID_AUTHOR_GALLERY(allAuthor: any[]) {
    this.allValidAuthorGallery = allAuthor;
  }

  @Mutation
  public SET_ALL_CATEGORY_GALLERY(allCategory: any[]) {
    this.allCategoryGallery = allCategory;
  }

  @Mutation
  public SET_ALL_CHANNEL_GALLERY(allChannel: any[]) {
    this.allChannelGallery = allChannel;
  }

  @Mutation
  public SET_EDITOR_BLOG_POST_VISIABLE_GALLERY(blogEditorPostVisiable: boolean) {
    this.blogEditorPostVisiableGallery = blogEditorPostVisiable;
  }

  @Mutation
  public SET_DISABLE_SELECT_CATEGORY_GALLERY(disableSelectCategory: boolean) {
    this.disableSelectCategoryGallery = disableSelectCategory;
  }

  @Mutation
  public SET_POST_DETAIL_GALLERY(postDetail: any) {
    this.postDetailGallery = postDetail;
  }

  @Mutation
  public SET_POST_ADD_OR_UPDATE_GALLERY(postAddOrUpdate: string) {
    this.postAddOrUpdateGallery = postAddOrUpdate;
  }

  @Mutation
  public SET_ADDED_POST_ID_GALLERY(addedPostId: string) {
    this.addedPostIdGallery = addedPostId;
  }

  @Mutation
  public SET_UPDATE_POST_SUCCESS_FLAG_GALLERY(updatePostSuccessFlag: boolean) {
    this.updatePostSuccessFlagGallery = updatePostSuccessFlag;
  }

  @Mutation
  public SET_ADD_POST_SUCCESS_FLAG_GALLERY(addPostSuccessFlag: boolean) {
    this.addPostSuccessFlagGallery = addPostSuccessFlag;
  }

  @Mutation
  public SET_CURRENT_CATEGORY_ID_GALLERY(currentCategoryId: string) {
    this.currentCategoryIdGallery = currentCategoryId;
  }

  /* 悬浮POST调查问卷新增编辑 */
  @Mutation
  public SET_EDITOR_BLOG_POST_VISIABLE_QUESTION(blogEditorPostVisiable: boolean) {
    this.blogEditorPostVisiableQuestion = blogEditorPostVisiable;
  }

  @Mutation
  public SET_POST_DETAIL_QUESTION(postDetail: any) {
    this.postDetailQuestion = postDetail;
  }

  @Mutation
  public SET_POST_ADD_OR_UPDATE_QUESTION(postAddOrUpdate: string) {
    this.postAddOrUpdateQuestion = postAddOrUpdate;
  }

  @Mutation
  public SET_UPDATE_POST_SUCCESS_FLAG_QUESTION(updatePostSuccessFlag: boolean) {
    this.updatePostSuccessFlagQuestion = updatePostSuccessFlag;
  }

  @Mutation
  public SET_ADD_POST_SUCCESS_FLAG_QUESTION(addPostSuccessFlag: boolean) {
    this.addPostSuccessFlagQuestion = addPostSuccessFlag;
  }

  /* 悬浮POST内嵌视频新增编辑 */
  @Mutation
  public SET_ALL_VALID_AUTHOR_VIDEO_EMBED(allAuthor: any[]) {
    this.allValidAuthorVideoEmbed = allAuthor;
  }

  @Mutation
  public SET_ALL_CATEGORY_VIDEO_EMBED(allCategory: any[]) {
    this.allCategoryVideoEmbed = allCategory;
  }

  @Mutation
  public SET_ALL_CHANNEL_VIDEO_EMBED(allChannel: any[]) {
    this.allChannelVideoEmbed = allChannel;
  }

  @Mutation
  public SET_EDITOR_BLOG_POST_VISIABLE_VIDEO_EMBED(blogEditorPostVisiable: boolean) {
    this.blogEditorPostVisiableVideoEmbed = blogEditorPostVisiable;
  }

  @Mutation
  public SET_DISABLE_SELECT_CATEGORY_VIDEO_EMBED(disableSelectCategory: boolean) {
    this.disableSelectCategoryVideoEmbed = disableSelectCategory;
  }

  @Mutation
  public SET_POST_DETAIL_VIDEO_EMBED(postDetail: any) {
    this.postDetailVideoEmbed = postDetail;
  }

  @Mutation
  public SET_POST_ADD_OR_UPDATE_VIDEO_EMBED(postAddOrUpdate: string) {
    this.postAddOrUpdateVideoEmbed = postAddOrUpdate;
  }

  @Mutation
  public SET_ADDED_POST_ID_VIDEO_EMBED(addedPostId: string) {
    this.addedPostIdVideoEmbed = addedPostId;
  }

  @Mutation
  public SET_UPDATE_POST_SUCCESS_FLAG_VIDEO_EMBED(updatePostSuccessFlag: boolean) {
    this.updatePostSuccessFlagVideoEmbed = updatePostSuccessFlag;
  }

  @Mutation
  public SET_ADD_POST_SUCCESS_FLAG_VIDEO_EMBED(addPostSuccessFlag: boolean) {
    this.addPostSuccessFlagVideoEmbed = addPostSuccessFlag;
  }

  @Mutation
  public SET_CURRENT_CATEGORY_ID_VIDEO_EMBED(currentCategoryId: string) {
    this.currentCategoryIdVideoEmbed = currentCategoryId;
  }

  /* 悬浮普通文章编辑器2新增编辑 */
  @Mutation
  public SET_ALL_VALID_AUTHOR_NORMAL(allAuthor: any[]) {
    this.allValidAuthorNormal = allAuthor;
  }

  @Mutation
  public SET_ALL_CATEGORY_NORMAL(allCategory: any[]) {
    this.allCategoryNormal = allCategory;
  }

  @Mutation
  public SET_ALL_CHANNEL_NORMAL(allChannel: any[]) {
    this.allChannelNormal = allChannel;
  }

  @Mutation
  public SET_EDITOR_BLOG_POST_VISIABLE_NORMAL(blogEditorPostVisiable: boolean) {
    this.blogEditorPostVisiableNormal = blogEditorPostVisiable;
  }

  @Mutation
  public SET_DISABLE_SELECT_CATEGORY_NORMAL(disableSelectCategory: boolean) {
    this.disableSelectCategoryNormal = disableSelectCategory;
  }

  @Mutation
  public SET_POST_DETAIL_NORMAL(postDetail: any) {
    this.postDetailNormal = postDetail;
  }

  @Mutation
  public SET_POST_ADD_OR_UPDATE_NORMAL(postAddOrUpdate: string) {
    this.postAddOrUpdateNormal = postAddOrUpdate;
  }

  @Mutation
  public SET_ADDED_POST_ID_NORMAL(addedPostId: string) {
    this.addedPostIdNormal = addedPostId;
  }

  @Mutation
  public SET_UPDATE_POST_SUCCESS_FLAG_NORMAL(updatePostSuccessFlag: boolean) {
    this.updatePostSuccessFlagNormal = updatePostSuccessFlag;
  }

  @Mutation
  public SET_ADD_POST_SUCCESS_FLAG_NORMAL(addPostSuccessFlag: boolean) {
    this.addPostSuccessFlagNormal = addPostSuccessFlag;
  }

  @Mutation
  public SET_CURRENT_CATEGORY_ID_NORMAL(currentCategoryId: string) {
    this.currentCategoryIdNormal = currentCategoryId;
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
  public async addVideoPost(data: any) {
    const result = await addVideoPost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addGalleryPost(data: any) {
    const result = await addGalleryPost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addVideoEmbedPost(data: any) {
    const result = await addVideoEmbedPost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addNormalPost(data: any) {
    const result = await addNormalPost(data);
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
  public async updateVideoPost(data: any) {
    const result = await updateVideoPost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateGalleryPost(data: any) {
    const result = await updateGalleryPost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateVideoEmbedPost(data: any) {
    const result = await updateVideoEmbedPost(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateNormalPost(data: any) {
    const result = await updateNormalPost(data);
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
  public async updateChannelVisible(data: any) {
    const result = await updateChannelVisible(data);
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

  @Action({ rawError: true })
  public async getAllVideo(data: any) {
    const result = await getAllVideo(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addVideo(data: any) {
    const result = await addVideo(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async updateVideo(data: any) {
    const result = await updateVideo(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async deleteVideo(data: any) {
    const result = await deleteVideo(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async batchAddVideo(data: any) {
    const result = await batchAddVideo(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async batchDelteVideo(data: any) {
    const result = await batchDelteVideo(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async addVideoCategory(data: any) {
    const result = await addVideoCategory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async deleteVideoCategory(data: any) {
    const result = await deleteVideoCategory(data);
    return Promise.resolve(result);
  }

  @Action({ rawError: true })
  public async queryVideoCategory(data: any) {
    const result = await queryVideoCategory(data);
    return Promise.resolve(result);
  }
}

export const BlogPostModule = getModule(BlogPost);
