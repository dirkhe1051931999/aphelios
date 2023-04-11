import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import { getAuthor, getCategories, getPostById, getPostList, uploadPostImgs } from 'src/api/blog-post';

interface IBlogPost {}
@Module({ dynamic: true, namespaced: true, store, name: 'BlogPost' })
class BlogPost extends VuexModule implements IBlogPost {
  @Action({ rawError: true })
  public async getPostList(data: any) {
    const result = await getPostList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getAuthor(data: any) {
    const result = await getAuthor(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCategories(data: any) {
    const result = await getCategories(data);
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
}

export const BlogPostModule = getModule(BlogPost);
