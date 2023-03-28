/**
 * countModule
 */
import { getModule, VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import store from '../index';

@Module({ dynamic: true, namespaced: true, store, name: 'Count' })
class Count extends VuexModule {
  count: number = 0;

  @Mutation
  INCREMENT() {
    this.count++;
  }

  @Mutation
  DECREMENT() {
    this.count--;
  }

  @Action
  public async incrementAfterTime(payload: any) {}
}

export const countModule = getModule(Count);
