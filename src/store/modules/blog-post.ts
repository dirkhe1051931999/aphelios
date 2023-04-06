import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '../index';
import { getPostList } from 'src/api/blog-post';

interface IBlogPost {}
@Module({ dynamic: true, namespaced: true, store, name: 'BlogPost' })
class BlogPost extends VuexModule implements IBlogPost {
  @Action({ rawError: true })
  public async getPostList(data: any) {
    const result = await getPostList({});
    return Promise.resolve(result);
  }
}

export const BlogPostModule = getModule(BlogPost);
