export const monacoConfig: any = {
  theme: 'vs-dark',
  fontSize: '14px',
  lineNumbers: true,
  wordWrap: 'off',
  wordWrapColumn: 80,
  wordWrapMinified: true,
  scrollBeyondLastLine: true,
  contextmenu: true,
  readOnly: false,
  automaticLayout: true,
  minimap: {
    enabled: true,
    renderCharacters: true,
    maxColumn: 80,
    showSlider: 'mouseover',
  },
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
    useShadows: true,
    verticalHasArrows: false,
    horizontalHasArrows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
    arrowSize: 7,
  },
  folding: true,
  glyphMargin: true,
  lightbulbEnabled: true,
  codeLens: true,
  renderLineHighlight: 'all',
  renderIndentGuides: true,
  renderControlCharacters: false,
  renderWhitespace: 'none',
  snippetSuggestions: 'inline',
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
  suggestOnTriggerCharactersOnly: false,
  acceptSuggestionOnEnter: 'on',
  acceptSuggestionOnCommitCharacter: true,
  suggestSelection: 'recentlyUsed',
  tabCompletion: 'on',
  tabSize: 2,
  insertSpaces: true,
  autoIndent: 'none',
  formatOnPaste: false,
  formatOnType: false,
  formatOnSave: false,
  codeActionsOnSave: {
    'source.fixAll': true,
    'source.organizeImports': true,
  },
  codeActionsOnType: {
    'editor.unfoldAll': true,
    'editor.inlineSuggest.showNext': true,
    'editor.inlineSuggest.showPrevious': true,
  },
  suggest: {
    showWords: true,
    showVariables: true,
    showColors: true,
    showConstants: true,
    showConstructors: true,
    showFields: true,
    showFunctions: true,
    showModules: true,
    showOperators: true,
    showReferences: true,
    showStructs: true,
    showUnits: true,
    showValues: true,
  },
  hover: {
    enabled: true,
    delay: 300,
    sticky: true,
  },
  links: true,
  goToLocation: true,
  renaming: true,
  referenceInfos: true,
  suggestFontSize: 12,
  suggestLineHeight: 16,
  suggestSelectionBackgroundColor: '#0A78C3',
  suggestSelectionHighlightColor: '#A0A0A0',
  suggestWidgetBackground: '#1E1E1E',
  suggestWidgetBorder: '#555555',
  suggestWidgetForeground: '#CCCCCC',
  suggestWidgetHighlightForeground: '#ffffff',
  suggestWidgetSelectedBackground: '#0A78C3',
  suggestWidgetSelectedForeground: '#ffffff',
};