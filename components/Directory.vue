<template>
  <div class="directory-container">
    <div class="level-container">
      <van-sidebar v-model="directoryParams.activeId" class="left" @change="sidebarChange">
        <van-sidebar-item :title="item.name" v-for="(item, index) in directoryParams.list" :key="index" />
      </van-sidebar>
      <div class="right">
        <van-tabs @change="tabChange" class="tabs">
          <van-tab v-for="(item, index) in directoryParams.level1List" :title="item.name" :key="index">
            <template #title>
              <van-badge :content="item.children.length">
                {{ item.name }}
              </van-badge>
            </template>
            <van-empty image="error" description="没有东西，看JB呢？" v-if="!item.children.length" />
            <div class="level2">
              <ul v-for="(child, childIndex) in item.children" :key="childIndex">
                <li>
                  <p>{{ child.name }}</p>
                  <p class="subName">{{ child.subName }}</p>
                </li>
              </ul>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Directory-Component',
  data() {
    return {
      directoryParams: {
        activeId: 0,
        level1Id: 0,
        list: [],
        level1List: [],
      },
    };
  },
  methods: {
    async getDirectory() {
      try {
        const { data } = await this.$axios.get('/blog/getAllDirectory');
        console.log(data);
        this.directoryParams.list = data;
        this.directoryParams.level1List = data[0].children;
      } catch (e) {
        console.log(e);
      }
    },
    sidebarChange() {
      this.directoryParams.level1List = this.directoryParams.list[this.directoryParams.activeId].children;
    },
    tabChange() {},
  },
  mounted() {
    this.getDirectory();
  },
};
</script>

<style lang="scss" scoped>
.van-sidebar-item {
  background: $white-color;
}

.directory-container {
  .level-container {
    display: flex;

    .left {
      width: 30%;
      border-right: 1px solid $border-color;
    }

    .right {
      width: 70%;
      background: $white-color;

      .level2 {
        padding: 10px 12px 60px;

        ul {
          li {
            display: flex;
            flex-direction: column;
            padding: 10px 0;
            border-bottom: 1px solid $border-color;

            p {
              font-size: 14px;
            }
            .subName {
              margin-top: 12px;
              color: $subtle-body-color;
            }
          }
        }
      }
    }
  }
}
</style>
