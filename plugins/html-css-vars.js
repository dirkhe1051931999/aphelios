// plugins/html-css-vars.js
function setCssVariables(variables) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value);
  }
}

export default () => {
  if (process.client) {
    window.onNuxtReady(() => {
      const cssVars = {
        '--plyr-color-main': '#5469d4',
        // 添加更多变量
        // '--another-var': 'value',
      };
      setCssVariables(cssVars);
    });
  }
};
