<template>
  <div @click="removePlugins">
    <div class="q-pb-sm row items-center">
      <div id="emoji" class="emoji"></div>
      <q-icon name="mood" size="28px" color="grey" class="cursor-pointer" @click.stop.prevent="showEmoji"> </q-icon>
      <q-icon name="o_image" size="28px" color="grey" class="q-ml-sm cursor-pointe"></q-icon>
      <q-btn color="primary" outline size="small" dense label="确定" class="q-ml-auto" @click.stop.prevent="submitRich"></q-btn>
    </div>
    <div placeholder="和谐发言你我他，健康生活靠大家~" :contenteditable="true" id="input-rich" @input="richInput" class="input-rich" @click="richClick" />
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Vue } from 'vue-facing-decorator';
import he from 'he';
@Component({ name: 'SimpleRichTextInput', emits: ['submit'] })
export default class SimpleRichTextInput extends Vue {
  $refs: any;
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public pickerOptions = {
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
        '1': '默认',
        '2': '白色',
        '3': '偏白',
        '4': '中等',
        '5': '偏黑',
        '6': '黑色',
        choose: '选择默认肤色',
      },
    },
    previewPosition: 'none',
    onEmojiSelect: this.onEmojiSelect.bind(this),
  };
  public inputParams = {
    curIndex: -1,
  };
  /* event */
  public showEmoji($event: any) {
    const $emoji: any = document.querySelector('#emoji');
    const x = $event.x;
    const y = $event.y;
    if ($emoji.innerHTML) {
      $emoji.innerHTML = '';
    } else {
      $emoji.appendChild(new window.EmojiMart.Picker(this.pickerOptions));
      this.$nextTick(() => {
        const height = $emoji?.offsetHeight;
        $emoji?.classList.add(`left-${x - 14}`);
        if (y > height) {
          $emoji?.classList.add(`top-${y - height - 20}`);
        } else {
          $emoji?.classList.add(`top-${y + 20}`);
        }
      });
    }
  }
  public onEmojiSelect($event: any) {
    const $input: any = document.querySelector('#input-rich');
    const $emoji: any = document.querySelector('#emoji');
    function insertTextAtCursor(text: any) {
      var sel: any, range;
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        var el = document.createElement('div');
        el.innerHTML = text;
        var frag = document.createDocumentFragment(),
          node,
          lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
    $input.focus();
    insertTextAtCursor($event.native);
    $emoji.innerHTML = '';
  }
  public removePlugins($event: any) {
    if ($event.target.nodeName === 'EM-EMOJI-PICKER') {
      return;
    }
    const $emoji: any = document.querySelector('#emoji');
    $emoji.innerHTML = '';
  }
  public richInput() {}
  public richClick() {}
  public hideComment() {
    const $emoji: any = document.querySelector('#emoji');
    $emoji.innerHTML = '';
  }
  public submitRich() {
    function decodeHtml(html: string) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.documentElement.textContent;
    }
    const $input: any = document.querySelector('#input-rich');
    let html = $input.innerHTML;
    html = html.replace(/<br>/g, ' '); // 替换 <br> 标签为一个空格
    html = html.replace(/<div><\/div>/g, ' '); // 替换空的 <div></div> 为一个空格
    html = html.replace(/<div>(.*?)<\/div>/g, '$1 '); // 替换包含内容的 <div></div>，只留下内容，并在后面添加一个空格
    html = decodeHtml(html);
    var escapedHtml = he.encode(html);
    var decodedHtml = he.decode(escapedHtml);
    if (decodedHtml.replace(/\s/g, '') === '') {
      this.$globalMessage.show({
        type: 'error',
        content: '输入点东西吧~',
      });
      return;
    }
    this.$emit('submit', decodedHtml);
  }
}
</script>

<style scoped lang="scss">
.emoji {
  position: fixed;
  z-index: 10000;
}
[contenteditable='true']:empty::before {
  content: attr(placeholder);
  color: #adadad;
}
[contenteditable='true']:focus {
  outline-color: $primary;
}
.input-rich {
  width: 100%;
  height: 200px;
  height: 200px;
  overflow: auto;
  padding: 8px;
  box-sizing: border-box;
  border: solid 2px #eeeeee;
  border-radius: 8px;
  font-size: 16px;
}
</style>
