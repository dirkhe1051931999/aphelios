/* eslint-disable */

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module 'js-cookie';
declare module 'path-to-regexp';
declare module 'vue3-count-to';
declare module 'marked';
declare module 'sass.js';
declare module 'vue3-photo-preview';
declare module 'prismjs';
declare module 'less';
declare module 'uuid';
declare module 'sha256';
declare module 'jsencrypt';
declare module 'vue-shepherd';
declare module 'crypto-js/md5';
declare module 'prettier/standalone';
declare module 'prettier/parser-babel';
declare module 'prettier/parser-typescript';
declare module 'prettier/parser-html';
declare module 'prettier/parser-postcss';
declare module 'prettier/parser-markdown';
declare module 'prettier/parser-yaml';
declare module 'prettier/parser-json';
declare module 'prettier/parser-graphql';
declare module 'prettier/parser-vue';
declare module 'prettier/parser-babylon';
declare module 'prettier/parser-angular';
declare module 'prettier/parser-java';
declare module 'prettier-plugin-java';
declare module 'sortablejs';
declare module 'jsencrypt/bin/jsencrypt.min.js';
declare module 'he';
declare module '@sipec/vue3-tags-input';
