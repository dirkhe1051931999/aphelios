<template>
  <div>
    <q-dialog v-model="postTypeParams.model" transition-show="jump-up" transition-hide="jump-down" position="top">
      <q-card style="max-width: 50vw; width: 50vw">
        <q-card-actions align="left" class="q-pa-md fs-20"> 选择新增类型 </q-card-actions>
        <q-card-section class="scroll" style="max-height: 50vh">
          <q-list class="grid columns-3 row-gap-10 col-gap-10">
            <li v-for="item in postTypeParams.data" :key="item.id" @click="pick(item)">
              <q-item clickable class="thin-shadow">
                <q-item-section>{{ item.name }}</q-item-section>
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
      },
      {
        id: 2,
        name: '纯视频',
      },
      {
        id: 3,
        name: '纯图片',
      },
      {
        id: 4,
        name: '调查问卷',
      },
      {
        id: 5,
        name: '内嵌视频',
      },
      {
        id: 6,
        name: '时政',
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
