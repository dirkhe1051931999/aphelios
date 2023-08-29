// This is just an example,
// so you can safely delete all default props below

export default {
  routes: {
    dashboard: '运行面板',
    'blog-post': '博文文章管理',
    'blog-post-list': '博文列表',
    'blog-post-channel': '博文频道',
    'blog-post-directory': '博文目录',
    'blog-post-author': '博文作者',
    'blog-post-user': '博文用户',
    'blog-post-cover-lib': '博文背景图',
    'blog-post-video-lib': '博文视频库',
    audit: '审核管理',
    'audit-author-approval': '作者审核',
    'audit-comment-approval': '评论审核',
    account: '账号管理',
    'account-role': '角色',
    'account-user': '用户',
    link: '外链',
    profile: '个人中心',
    largeDisplay: '大屏展示',
  },
  layouts: {
    profile: '个人中心',
    logout: '退出登录',
  },
  account: {},
  login: {
    signIn: '登录',
    signInSub: '输入您的邮箱和密码',
    doyouhave: '还没有账号？',
    forgotPassword: '忘记密码？',
    email: '邮箱',
    password: '密码',
    signUp: '注册',
    signUpSub: '请输入下列信息完成注册',
    firstName: '名',
    lastName: '姓',
    companyName: '公司',
    country: '国家',
    haved: '已经有账号了？',
    resetPassword: '重置密码',
    resetPasswordSub: '请重置您的密码',
    forgotPasswordSub: '请输入电子邮箱以重置密码',
    confirmPassword: '确认密码',
    changePassword: '修改密码',
    forgotPassword2: '忘记密码',
    illustrationDescription: 'Quasar admin Vue3',
    illustrationaDescriptionSub: '这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述',
    rules: '规则',
    resetToLogin: '修改成功，请重新登录',
    forgotPasswordSuccess: '请检查您的电子邮件以重置您的密码',
    passwordRules: "包含10 - 20个字符{'{}'}包含大小写字母{'{}'}包含数字和特殊字符（{'#?!@+.$%^&*-'}）{'{}' }不能包含空格、中文和中文特殊字符",
  },
  charts: {},
  components: {},
  copy: {},
  i18n: {},
  icon: {},
  dashboard: {},
  auth: {},
  tip: {
    refreshCurPage: '刷新当前页',
    toggleTheme: '黑夜或白天模式',
    cancelFullscreen: '取消全屏',
    fullscreen: '全屏',
    noData: '暂无数据',
  },
  table: {
    detail: '详情',
    action: '操作',
    index: '序号',
    id: 'ID',
    id2: '编号',
    msisdn: 'MSISDN',
    iccid: 'ICCID',
    imsi: 'IMSI',
    eid: 'EID',
    primaryImsi: '主IMSI',
    primaryMsisdn: '主MSISDN',
    primaryIccid: '主ICCID',
    primaryEID: '主EID',
    secondaryMsisdn: '副MSISDN',
    secondaryImsi: '副IMSI',
    secondaryEid: '副EID',
    secondaryIccid: '副ICCID',
    description: '描述',
    province: '省份',
    remark: '备注',
    createTime: '创建时间',
    updateTime: '更新时间',
    endTime: '结束时间',
    createBy: '创建人',
    status: '状态',
    service: '业务',
    device: '设备',
    level: '级别',
    date: '时间',
    serviceType: '业务类型',
    acCode: 'AC',
    confirmCode: '确认码',
    log: '日志',
    option: '操作',
    percent: '%',
    lastModify: '最近修改',
    role: '角色',
    username: '用户名',
    nickname: '昵称',
    realName: '真实姓名',
    tel: '手机号',
    phone: '电话',
    landline: '座机',
    email: '邮箱',
    address: '地址',
    password: '密码',
    passwordConformation: '确认密码',
    setting: '设置',
    ip: 'IP',
    per: '个',
    pieces_page: '每页展示数',
    total: '共计',
  },
  messages: {
    failed: '😔😔😔 真不幸，失败了!',
    success: '🎉🎉🎉 恭喜，成功了!',
    tishi: '友情提示',
    addConfirm: '确定要新增吗？',
    deleteConfirm: '确定要删除吗？',
    updateConfirm: '确定要更新吗？',
    bindConfirm: '确定要绑定吗？',
    areYouSure: '确定吗？',
    required: '必填',
    pleaseEnter: '请输入',
    pleaseSelect: '请选择',
    pleaseSelectDate: '请点击右侧图标选择日期或时间',
    // success: {
    //   login: '登录成功',
    //   logout: '退出成功',
    //   toggle: '切换成功',
    //   action: '操作成功',
    //   delete: '删除成功',
    //   add: '新增成功',
    //   update: '更新成功',
    //   upload: '上传成功',
    // },
    // failed: {
    //   login: '登录失败',
    //   logout: '退出失败',
    //   toggle: '切换失败',
    //   action: '操作失败',
    //   delete: '删除失败',
    //   add: '新增失败',
    //   update: '更新失败',
    //   upload: '上传失败',
    // },
  },
  action: {
    yes: '确定',
    add: '新增',
    more: '更多',
    delete: '删除',
    update: '编辑',
    search: '搜索',
    reset: '重置',
    confirm: '确定',
    cancel: '取消',
    detail: '详情',
    disable: '禁用',
    enable: '启用',
    active: '激活',
    deactive: '取消激活',
    download: '下载',
    download_template: '下载模板',
    upload: '上传',
    loading: '加载中...',
    start: '启动',
    stop: '停止',
    export: '导出',
    refresh: '刷新',
    push: '推送',
    back: '返回',
    login: '登录',
    logout: '登出',
    changePassword: '修改密码',
    resetPassword: '重置密码',
    look: '查看',
    look_more: '查看更多',
    close: '关闭',
    closeOther: '关闭其它',
    closeAll: '关闭所有',
    submit: '提交',
  },
};
