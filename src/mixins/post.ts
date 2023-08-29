import { POST_STATUS, POST_TYPE_NAME, POST_TYPE_SVG_NAME } from 'src/pages/blog-post/utils';
import { BlogPostModule } from 'src/store/modules/blog-post';
import { Vue, Watch } from 'vue-facing-decorator';
interface Validation {
  key: string;
  message: string;
  check: (value: any) => boolean;
}
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
  get postTypeName() {
    return (item: any) => {
      return POST_TYPE_NAME[item.postType] || '普通文章';
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
  /* 多条件验证 */
  public commonValidations: Validation[] = [
    { key: 'title', message: '请输入标题', check: (value) => !!value },
    { key: 'content', message: '请输入文章内容', check: (value) => !!value },
    { key: 'directoryId', message: '请选择主题', check: (value) => !!value },
    { key: 'authorId', message: '请选择作者', check: (value) => !!value },
    { key: 'channelId', message: '请选择频道', check: (value) => !!value },
    { key: 'tags', message: '请输入标签', check: (value) => Array.isArray(value) && value.length > 0 },
  ];
  public validateParams(params: Record<string, any>, validations: Validation[]): boolean {
    for (const validation of validations) {
      const { key, message, check } = validation;
      const value = params[key];
      if (!check(value)) {
        this.$globalMessage.show({
          type: 'error',
          content: message,
        });
        return false;
      }
    }
    return true;
  }
}
