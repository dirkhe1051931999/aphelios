import { POST_RADIO_OPTIONS, POST_STATUS, POST_TYPE_SVG_NAME } from 'src/pages/blog-post/utils';
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Vue, Watch } from 'vue-facing-decorator';

export class commonPost extends Vue {
  /* 获取值 */
  get channelOptions() {
    return BlogPostModule.allChannel;
  }
  get authorOptions() {
    return BlogPostModule.allValidAuthor;
  }
  get categoryOptions() {
    return BlogPostModule.allCategory;
  }
  get postStatus() {
    return (row: any) => {
      const selectOption: any = POST_STATUS;
      const item: any = selectOption.find((item: any) => item.value === row.status);
      return item ? item.label : '--';
    };
  }
  get postCategory() {
    return (row: any) => {
      if (!row.categoryId) return '--';
      function findItemById(arr: any, id: any): any {
        for (let item of arr) {
          if (item.id === id) {
            return item;
          }
          if (item.children) {
            let foundItem = findItemById(item.children, id);
            if (foundItem) {
              return foundItem;
            }
          }
        }
        return null;
      }
      const item = findItemById(this.categoryOptions, row.categoryId);
      if (item) {
        return item.name;
      } else {
        return '--';
      }
    };
  }
  get postAuthor() {
    return (row: any) => {
      if (!row.authorId) return '--';
      const selectOption = this.authorOptions;
      const item = selectOption.find((item: any) => item.value === row.authorId);
      if (item) {
        return item.label;
      } else {
        return '--';
      }
    };
  }
  get postAuthorImg() {
    return (row: any) => {
      if (!row.authorId) return '--';
      const selectOption = this.authorOptions;
      const item = selectOption.find((item: any) => item.value === row.authorId);
      console.log(item);
      if (item) {
        return item.avatarUrl;
      } else {
        return '';
      }
    };
  }
  get postChannel() {
    return (row: any) => {
      if (!row.channelId) return '--';
      const selectOption = this.channelOptions;
      const item = selectOption.find((item: any) => item.value === row.channelId);
      if (item) {
        return item.label;
      } else {
        return '--';
      }
    };
  }
  get postTypeSvgName() {
    return (item: any) => {
      return POST_TYPE_SVG_NAME[item.postType] || '普通文章';
    };
  }
  /* 是否可以做某件事 */
  get canOnline() {
    return (row: any) => {
      return row.status === 'OFFLINE';
    };
  }
  get canOffline() {
    return (row: any) => {
      return row.status === 'PUBLISHED' || row.status === 'DRAFT';
    };
  }
}
