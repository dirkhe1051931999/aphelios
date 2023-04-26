<template>
  <div id="monaco-editor-box">
    <div id="monaco-editor" ref="monacoEditor" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import * as monaco from 'monaco-editor';
import { monacoConfig } from './config';
@Component({ name: 'MonacoEditorComponent' })
export default class MonacoEditorComponent extends Vue {
  $refs: any;
  public editor: any;
  public code: any;
  public initEditor(data: { language: string; value: '' }) {
    this.$refs.monacoEditor.style.height = '100%';
    this.editor = monaco.editor.create(
      this.$refs.monacoEditor,
      Object.assign(monacoConfig, {
        value: data.value,
        language: data.language,
      })
    );
    this.editor.getModel().onDidChangeContent(() => {
      this.code = this.editor.getValue();
    });
  }
  public validateCode(lang: string) {
    const model = this.editor.getModel();
    const code = model.getValue();
    let result;
    try {
      result = eval(code);
    } catch (e) {
      result = e;
    }
    return !(result instanceof Error);
  }
  public formatCode() {
    this.editor.getAction('editor.action.formatDocument').run();
    // this.editor.getAction('editor.action.formatDocument').run();
  }
}
</script>

<style lang="scss" scoped>
#monaco-editor {
  width: 100%;
}
</style>
