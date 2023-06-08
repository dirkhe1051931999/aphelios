import * as directives from 'src/directives/index';
import { boot } from 'quasar/wrappers';
import { type Directive } from 'vue';
import ElementPlus from 'element-plus';
import 'src/router/permission';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import vue3PhotoPreview from 'vue3-photo-preview';
import 'vue3-photo-preview/dist/index.css';
import globalMessage from 'src/utils/notify';
import globalConfirm from 'src/utils/dialogConfirm';
import 'src/utils/types';
import VueSidePanel from 'vue3-side-panel';
import 'vue3-side-panel/dist/vue3-side-panel.css';
import { defaultFill } from 'src/utils/tools';
import { date } from 'quasar';
import { Platform } from 'quasar';
export default boot(({ app }) => {
  // We globally register our directive with Vue;
  // Rememeber that all directives in Vue will start with 'v-'
  // but that should not be part of your directive name
  // https://vuejs.org/v2/guide/custom-directive.html
  // 'my-directive' will be used as 'v-my-directive'
  Object.keys(directives).forEach((key) => {
    app.directive(key, (directives as { [key: string]: Directive })[key]);
  });
  app.use(vue3PhotoPreview);
  app.use(VueSidePanel);
  app.use(ElementPlus);
  app.config.globalProperties.$globalMessage = globalMessage;
  app.config.globalProperties.$window = window;
  app.config.globalProperties.$globalConfirm = globalConfirm;
  app.config.globalProperties.defaultFill = defaultFill;
  app.config.globalProperties.parseTime = (time: number | string | null | undefined) => {
    let timeStamp = '';
    if (!time || String(time).length < 10) return '--';
    if (!/^\d+$/g.test(time.toString())) {
      if (String(time).indexOf('T') !== -1 && !Number.isNaN(new Date(time).getTimezoneOffset())) {
        const formattedString = date.formatDate(+new Date(time), 'YYYY-MM-DD HH:mm:ss');
        return formattedString;
      } else {
        return String(time);
      }
    } else {
      if (String(time).length === 10) timeStamp = time += '000';
      else timeStamp = String(time);
      const formattedString = date.formatDate(Number(timeStamp), 'YYYY-MM-DD HH:mm:ss');
      return formattedString;
    }
  };
  app.config.globalProperties.upToNowParseTime = (time: number | string | null | undefined) => {
    function getTimeDiffDescription(dateTime: string) {
      const currentDate = +new Date();
      const diffInMilliseconds = currentDate - +new Date(dateTime);

      const millisecondsPerSecond = 1000;
      const millisecondsPerMinute = millisecondsPerSecond * 60;
      const millisecondsPerHour = millisecondsPerMinute * 60;
      const millisecondsPerDay = millisecondsPerHour * 24;

      if (diffInMilliseconds < millisecondsPerDay) {
        let hours = Math.floor(diffInMilliseconds / millisecondsPerHour);
        return hours ? `${hours}小时前` : '刚刚';
      } else if (diffInMilliseconds < millisecondsPerDay * 7) {
        const days = Math.floor(diffInMilliseconds / millisecondsPerDay);
        return `${days}天前`;
      } else {
        const formattedDate = new Date(dateTime).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        return formattedDate;
      }
    }
    let timeStamp = '';
    if (!time || String(time).length < 10) return '--';
    if (!/^\d+$/g.test(time.toString())) {
      if (String(time).indexOf('T') !== -1 && !Number.isNaN(new Date(time).getTimezoneOffset())) {
        const formattedString = date.formatDate(+new Date(time), 'YYYY-MM-DD HH:mm:ss');
        return getTimeDiffDescription(formattedString);
      } else {
        return getTimeDiffDescription(String(time));
      }
    } else {
      if (String(time).length === 10) timeStamp = time += '000';
      else timeStamp = String(time);
      const formattedString = date.formatDate(Number(timeStamp), 'YYYY-MM-DD HH:mm:ss');
      return getTimeDiffDescription(formattedString);
    }
  };
  document.querySelector('body')?.classList.add(Platform.is.platform);
});
