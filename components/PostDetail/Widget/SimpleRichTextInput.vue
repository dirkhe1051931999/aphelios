<template>
  <div class="simple-rich-text-input">
    <div class="action-sheet-list">
      <div class="action-sheet-item">
        <van-icon name="smile-o" size="20px" @click.stop.prevent="showEmoji" />
      </div>
      <div class="action-sheet-item submit">
        <van-button plain hairline type="info" size="small" @click="onSubmit">确认</van-button>
      </div>
    </div>
    <div class="action-input">
      <van-field ref="textInputRef" show-word-limit maxlength="50" v-model="simpleRichTextInputParams.model" rows="2" type="textarea" placeholder="请输入内容" />
    </div>
    <div id="emoji" class="emoji"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      simpleRichTextInputParams: {
        model: '',
      },
      pickerOptions: {
        searchPosition: 'none',
        i18n: {
          search: '搜索',
          search_no_results_1: '哦不！',
          search_no_results_2: '没有找到相关表情',
          pick: '选择一个表情…',
          add_custom: '添加自定义表情',
          categories: {
            activity: '活动',
            custom: '自定义',
            flags: '旗帜',
            foods: '食物与饮品',
            frequent: '最近使用',
            nature: '动物与自然',
            objects: '物品',
            people: '表情与角色',
            places: '旅行与景点',
            search: '搜索结果',
            symbols: '符号',
          },
          skins: {
            1: '默认',
            2: '白色',
            3: '偏白',
            4: '中等',
            5: '偏黑',
            6: '黑色',
            choose: '选择默认肤色',
          },
        },
        previewPosition: 'none',
        onEmojiSelect: this.onEmojiSelect.bind(this),
      },
    };
  },
  methods: {
    showEmoji($event) {
      const $emoji = document.querySelector('#emoji');
      const x = $event.x;
      const y = $event.y;
      if ($emoji.innerHTML) {
        $emoji.innerHTML = '';
      } else {
        $emoji.appendChild(new window.EmojiMart.Picker(this.pickerOptions));
      }
    },
    clearData($event) {
      this.simpleRichTextInputParams.model = '';
      const $emoji = document.querySelector('#emoji');
      $emoji.innerHTML = '';
    },
    onEmojiSelect($event) {
      const $emoji = document.querySelector('#emoji');
      const selectionStart = this.$refs.textInputRef.$refs.input.selectionStart;
      const selectionEnd = this.$refs.textInputRef.$refs.input.selectionEnd;
      this.simpleRichTextInputParams.model = this.simpleRichTextInputParams.model.substring(0, selectionStart) + $event.native + this.simpleRichTextInputParams.model.substring(selectionEnd);
      this.$refs.textInputRef.focus();
      this.$refs.textInputRef.$refs.input.selectionStart = selectionStart + $event.native.length;
      $emoji.innerHTML = '';
    },
    onSubmit() {
      this.$emit('submit', this.simpleRichTextInputParams.model);
      this.clearData();
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-rich-text-input {
  position: relative;

  .action-sheet-list {
    display: flex;
    align-items: center;
    padding: 0 16px;

    .action-sheet-item {
      &.submit {
        margin-left: auto;
      }
    }
  }

  .action-input {
    :deep(.van-field__body) {
      padding: 4px;
      border-radius: 4px;
      border: 1px solid $border-color;
    }
  }

  #emoji {
    text-align: center;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
