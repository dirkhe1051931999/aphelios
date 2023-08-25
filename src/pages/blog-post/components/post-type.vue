<template>
  <div>
    <q-dialog v-model="postTypeParams.model" transition-show="jump-up" transition-hide="jump-down">
      <q-card style="max-width: 50vw; width: 20vw">
        <q-card-actions align="left" class="q-pa-md fs-20"> 选择文章类型 </q-card-actions>
        <q-card-section class="scroll" style="max-height: 50vh">
          <q-list class="row column">
            <li v-for="(item, index) in postTypeParams.data" :key="item.id" @click="pick(item)" class="q-mb-md">
              <q-item clickable class="thin-shadow">
                <q-item-section class="text-weight-bold">{{ index + 1 }}. {{ item.name }}</q-item-section>
                <q-item-section side>
                  <q-icon :name="item.svg" size="40px" />
                </q-item-section>
              </q-item>
            </li>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

@Component({ name: 'myPostTypePage', emits: ['pick'] })
export default class myPostTypePage extends Vue {
  public postTypeParams = {
    model: false,
    // 1普通文章，2纯视频，3纯图片，4调查问卷，5内嵌视频，6时政
    data: [
      {
        id: 1,
        name: '普通文章',
        svg: 'app:post-normal',
      },
      {
        id: 2,
        name: '纯视频',
        svg: 'app:post-video',
      },
      {
        id: 3,
        name: '纯图片',
        svg: 'app:post-image',
      },
      {
        id: 4,
        name: '调查问卷',
        svg: 'app:post-survey',
      },
      {
        id: 5,
        name: '内嵌视频',
        svg: 'app:post-embed',
      },
      {
        id: 6,
        name: '时政',
        svg: 'app:post-politics',
      },
    ],
  };
  /* event */
  public hide() {
    this.postTypeParams.model = false;
  }
  public show() {
    this.postTypeParams.model = true;
  }
  public pick(item: any) {
    this.$emit('pick', item);
    this.hide();
  }
  /* http */
}
</script>

<style scoped lang="scss"></style>
