import { BlogPostModule } from 'src/store/modules/blog-post';
import { date } from 'quasar';
import setting from 'src/setting.json';

export function getAuthorLevelName(score: number) {
  if (score < 1000) {
    return '县令';
  } else if (score < 3000) {
    return '知府';
  } else if (score < 5000) {
    return '刺史';
  } else if (score < 20000) {
    return '太尉';
  } else {
    return '丞相';
  }
}

export function getAuthorLevel(score: number) {
  if (score < 1000) {
    return '1';
  } else if (score < 3000) {
    return '2';
  } else if (score < 5000) {
    return '3';
  } else if (score < 20000) {
    return '4';
  } else {
    return '5';
  }
}

export const companyType = [
  { label: 'IT/互联网/通信', value: 'IT/互联网/通信' },
  { label: '金融/银行/保险', value: '金融/银行/保险' },
  { label: '房地产/建筑/装修/物业', value: '房地产/建筑/装修/物业' },
  { label: '医疗/医药/生物工程', value: '医疗/医药/生物工程' },
  { label: '教育/培训', value: '教育/培训' },
  { label: '广告/媒体/艺术/文化传播', value: '广告/媒体/艺术/文化传播' },
  { label: '旅游/酒店/餐饮', value: '旅游/酒店/餐饮' },
  { label: '能源/化工/矿产/环保', value: '能源/化工/矿产/环保' },
  { label: '汽车/机械/制造', value: '汽车/机械/制造' },
  { label: '零售/贸易/消费品', value: '零售/贸易/消费品' },
  { label: '快消品', value: '快消品' },
  { label: '政府/非盈利机构/其他', value: '政府/非盈利机构/其他' },
  { label: '其他', value: '其他' },
];
export const TEST_ACCOUNT = {
  id: '3a4d1e4777c34b328eb46b0a701e0d08',
  ip: '103.126.24.17',
  type: 1,
  email: '1051931999@qq.com',
  score: 0,
  gender: 1,
  region: 'Hong Kong;Wanchai',
  address: '陕西省;西安市;鄠邑区;草堂街道&宋西村479号',
  nickname: '何健的账号',
  username: 'hejian_test',
  avatarUrl: `${process.env.NODE_ENV === 'production' ? setting.pro : setting.ip}/cdn/avatar/Malphite.png`,
  fansCount: 0,
  loginTime: null,
  createTime: 1686205313376,
  description: '误删',
  friendCount: 0,
  articleCount: 0,
};
export const POST_TYPE_NAME: any = {
  '1': '普通文章',
  '6': '普通文章（编辑器2）',
  '2': '视频',
  '3': '图集',
  '5': '内嵌视频',
};
export const POST_TYPE_SVG_NAME: any = {
  '1': 'app:post-normal',
  '6': 'app:post-normal2',
  '2': 'app:post-video',
  '3': 'app:post-gallery',
  '5': 'app:post-embed',
};
export const POST_TYPE_OPTION = [
  { label: '普通文章', value: '1' },
  { label: '普通文章（编辑器2）', value: '6' },
  { label: '视频', value: '2' },
  { label: '图集', value: '3' },
  { label: '内嵌视频', value: '5' },
];
export const POST_STATUS = [
  {
    label: '草稿',
    value: 'DRAFT',
  },
  {
    label: '已发布',
    value: 'PUBLISHED',
  },
  {
    label: '已下线',
    value: 'OFFLINE',
  },
];
export const POST_CHECKBOX_OPTIONS = [
  { label: '置顶', value: 'pinned', description: '置顶新闻，通常是头条或核心新闻', color: 'red' },
  { label: '推荐', value: 'recommended', description: '推荐新闻，通常是首页推荐', color: 'yellow' },
  { label: '精选', value: 'featured', description: '精选新闻，通常是首页精选', color: 'pink' },
  { label: '热门', value: 'hot', description: '热门新闻，通常是实时的热门新闻', color: 'teal' },
  { label: '原创', value: 'original', description: '原创新闻，通常是原创作者发布的新闻', color: 'brown' },
  {
    label: '政治',
    value: 'political',
    description: '政治新闻，通常是政治敏感的新闻',
    color: 'purple',
  },
  {
    label: '轮播',
    value: 'carousel',
    description: '轮播新闻，通常是首页轮播的新闻',
    color: 'orange',
  },
];
export const POST_RADIO_OPTIONS = [
  {
    model: 'paidOrFree',
    option: [
      { label: '付费', value: 'paid', description: '付费文章，通常是需要付费才能阅读的文章', color: 'yellow' },
      { label: '免费', value: 'free', description: '免费文章，通常是免费阅读的文章', color: 'green' },
    ],
  },
  {
    model: 'privateOrPublic',
    option: [
      { label: '私密', value: 'privated', description: '私密文章，通常是指定人才能看到的文章', color: 'orange' },
      { label: '公开', value: 'publiced', description: '公开文章，通常是所有人都能看到的文章', color: 'purple' },
    ],
  },
];
export const COMMON_POST_PARAMS = {
  id: '',
  authorId: '',
  directoryId: '',
  channelId: '',
  title: '',
  content: '',
  tag: '',
  postTags: [],
  checked: [],
  status: '',
  time: [],
  paidOrFree: 'free',
  privateOrPublic: 'publiced',
};
export const onEditorVisiableShow = (context: any, row: any, type: string) => {
  if (context.dialogEditorParams.params.poster !== undefined) context.dialogEditorParams.params.poster = row.poster;
  if (context.dialogEditorParams.params.videoUrl !== undefined) context.dialogEditorParams.params.videoUrl = row.videoUrl;
  if (context.dialogEditorParams.params.videoPoster !== undefined) context.dialogEditorParams.params.videoPoster = row.videoPoster;
  if (context.dialogEditorParams.params.galleries !== undefined) {
    context.dialogEditorParams.params.galleries = row.galleries.map((item: any) => {
      return {
        source: item,
      };
    });
  }
  context.dialogEditorParams.title = '编辑';
  context.dialogEditorParams.params.id = row.id;
  context.dialogEditorParams.params.authorId = row.authorId;
  context.dialogEditorParams.params.directoryId = row.directoryId;
  context.dialogEditorParams.params.channelId = row.channelId;
  context.dialogEditorParams.params.title = row.title;
  context.dialogEditorParams.params.status = row.status;
  context.dialogEditorParams.params.time =
    row.shelveTimeEnd && row.shelveTimeStart ? [date.formatDate(row.shelveTimeStart, 'YYYY/MM/DD hh:mm:ss'), date.formatDate(row.shelveTimeEnd, 'YYYY/MM/DD hh:mm:ss')] : [];
  const checkedOptions = context.dialogEditorParams.checkedOptions;
  for (let item of checkedOptions) {
    if (row[item.value] && row[item.value] === '1') {
      context.dialogEditorParams.params.checked.push(item.value);
    }
  }
  context.dialogEditorParams.params.paidOrFree = row.paid === '1' ? 'paid' : 'free';
  context.dialogEditorParams.params.privateOrPublic = row.privated === '1' ? 'privated' : 'publiced';
  context.getContent(row.id).then((data: any) => {
    context.dialogEditorParams.params.content = data;
  });
  if (row.postTags && row.postTags.length) {
    context.dialogEditorParams.params.postTags = row.postTags.map((item: any) => {
      return {
        text: item,
      };
    });
  }
};
export const onBeforeEditorDone = (context: any, type: string) => {
  const content = context.dialogEditorParams.params.content.replace(/src='([^']*)'/g, (match: any, p1: any) => {
    return `src="${p1}"`;
  });
  const params: any = {
    authorId: context.dialogEditorParams.params.authorId,
    shelveTimeStart: new Date(context.dialogEditorParams.params.time[0]).getTime(),
    shelveTimeEnd: new Date(context.dialogEditorParams.params.time[1]).getTime(),
    channelId: context.dialogEditorParams.params.channelId,
    content: content,
    directoryId: context.dialogEditorParams.params.directoryId,
    title: context.dialogEditorParams.params.title,
    postTags: context.dialogEditorParams.params.postTags.map((item: any) => item.text),
  };
  if (context.dialogEditorParams.params.poster !== undefined) params.poster = context.dialogEditorParams.params.poster;
  if (context.dialogEditorParams.params.videoUrl !== undefined) params.videoUrl = context.dialogEditorParams.params.videoUrl;
  if (context.dialogEditorParams.params.videoPoster !== undefined) params.videoPoster = context.dialogEditorParams.params.videoPoster;
  if (context.dialogEditorParams.params.galleries !== undefined) {
    params.galleries = context.dialogEditorParams.params.galleries.map((item: any) => item.source);
  }
  for (let item of context.dialogEditorParams.checkedOptions) {
    params[item.value] = '0';
  }
  for (let item of context.dialogEditorParams.radioOptions) {
    for (let option of item.option) {
      params[option.value] = '0';
    }
  }
  for (let item of context.dialogEditorParams.params.checked) {
    params[item] = '1';
  }
  params[context.dialogEditorParams.params.paidOrFree] = '1';
  params[context.dialogEditorParams.params.privateOrPublic] = '1';
  return params;
};
export const updatePost = (row: any) => {
  const postType = row.postType;
  let checked: any = {};
  POST_CHECKBOX_OPTIONS.forEach((item: any) => {
    checked[item.value] = row[item.value];
  });
  let radio: any = {};
  POST_RADIO_OPTIONS.forEach((item: any) => {
    item.option.forEach((option: any) => {
      radio[option.value] = row[option.value];
    });
  });
  const commonData = {
    authorId: row.authorId,
    status: row.status,
    directoryId: row.directoryId,
    channelId: row.channelId,
    shelveTimeEnd: row.shelveTimeEnd,
    shelveTimeStart: row.shelveTimeStart,
    title: row.title,
    id: row.id,
    postTags: row.postTags,
    ...checked,
    ...radio,
  };
  switch (postType) {
    case '1':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_NORMAL('update');
      BlogPostModule.SET_POST_DETAIL_NORMAL({
        row: {
          poster: row.poster,
          ...commonData,
        },
      });
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_NORMAL(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_NORMAL(true);
      break;
    case '2':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_VIDEO('update');
      BlogPostModule.SET_POST_DETAIL_VIDEO({
        row: {
          poster: row.poster,
          videoUrl: row.videoUrl,
          videoPoster: row.videoPoster,
          ...commonData,
        },
      });
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_VIDEO(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_VIDEO(true);
      break;
    case '3':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_GALLERY('update');
      BlogPostModule.SET_POST_DETAIL_GALLERY({
        row: {
          galleries: row.galleries,
          ...commonData,
        },
      });
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_GALLERY(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_GALLERY(true);
      break;
    case '5':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_VIDEO_EMBED('update');
      BlogPostModule.SET_POST_DETAIL_VIDEO_EMBED({
        row: {
          poster: row.poster,
          ...commonData,
        },
      });
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_VIDEO_EMBED(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_VIDEO_EMBED(true);
      break;
    case '6':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_NORMAL('update');
      BlogPostModule.SET_POST_DETAIL_NORMAL({
        row: {
          poster: row.poster,
          ...commonData,
        },
      });
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_NORMAL(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_NORMAL(true);
      break;
    default:
      break;
  }
};
export const addWhatPost = (id: string) => {
  // 1普通文章，2视频，3图集，5内嵌视频，6普通文章（编辑器2）
  switch (id) {
    case '1':
      BlogPostModule.SET_POST_ADD_OR_UPDATE('add');
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(true);
      break;
    case '2':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_VIDEO('add');
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_VIDEO(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_VIDEO(true);
      break;
    case '3':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_GALLERY('add');
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_GALLERY(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_GALLERY(true);
      break;
    case '5':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_VIDEO_EMBED('add');
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_VIDEO_EMBED(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_VIDEO_EMBED(true);
      break;
    case '6':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_NORMAL('add');
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_NORMAL(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_NORMAL(true);
      break;
    default:
      break;
  }
};
