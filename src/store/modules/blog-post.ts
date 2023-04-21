import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import {
  addChannel,
  addChildDirectory,
  addDirectory,
  addPost,
  addPostAuthor,
  addSheet,
  deletePost,
  getAllChannel,
  getAllChildDirectory,
  getAllDirectory,
  getAllPostAuthor,
  getAllSheet,
  getCompanyAuthorVerifyInfo,
  getPostById,
  getPostList,
  getPostListByCategoryId,
  offlinePost,
  publishPost,
  removeChannel,
  removeChildDirectory,
  removeCompanyAuthorVerify,
  removeDirectory,
  removePostAuthor,
  removeSheet,
  updateChannelName,
  updateChannelPos,
  updateChildDirectory,
  updateDirectory,
  updatePost,
  updatePostAuthor,
  updateSheet,
  uploadPostImgs,
  verifyCompanyAuthor,
} from 'src/api/blog-post';

interface IBlogPost {}
@Module({ dynamic: true, namespaced: true, store, name: 'BlogPost' })
class BlogPost extends VuexModule implements IBlogPost {
  public scrollTop = 0;
  public fixedDirectoryRightChannel = false;
  @Mutation
  public SET_SCROLL_TOP(scrollTop: number) {
    this.scrollTop = scrollTop;
  }
  @Mutation
  public SET_FIXED_DIRECTORY_RIGHT_CHANNEL(fixedDirectoryRightChannel: boolean) {
    this.fixedDirectoryRightChannel = fixedDirectoryRightChannel;
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
  public async getPostById(data: any) {
    const result = await getPostById(data);
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
}

export const BlogPostModule = getModule(BlogPost);
