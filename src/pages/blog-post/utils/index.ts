import { BlogPostModule } from 'src/store/modules/blog-post';

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
  avatarUrl: 'http://localhost:3000/cdn/avatar/Malphite.png',
  fansCount: 0,
  loginTime: null,
  createTime: 1686205313376,
  description: '误删',
  friendCount: 0,
  articleCount: 0,
};
export const POST_TYPE_NAME: any = {
  '1': '普通文章',
  '2': '纯视频',
  '3': '纯图片',
  '4': '调查问卷',
  '5': '内嵌视频',
  '6': '时政',
};
export const POST_TYPE_SVG_NAME: any = {
  '1': 'app:post-normal',
  '2': 'app:post-video',
  '3': 'app:post-image',
  '4': 'app:post-survey',
  '5': 'app:post-embed',
  '6': 'app:post-politics',
};
export const POST_TYPE_OPTION = [
  { label: '普通文章', value: '1' },
  { label: '纯视频', value: '2' },
  { label: '纯图片', value: '3' },
  { label: '调查问卷', value: '4' },
  { label: '内嵌视频', value: '5' },
  { label: '时政', value: '6' },
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
export const POST_RADIO_OPTIONS = [
  { label: '置顶', value: 'pinned' },
  { label: '推荐', value: 'recommended' },
  { label: '精选', value: 'featured' },
  { label: '热门', value: 'hot' },
  { label: '原创', value: 'original' },
  { label: '付费', value: 'paid' },
  { label: '免费', value: 'free' },
  { label: '私密', value: 'privated' },
  { label: '公开', value: 'publiced' },
];

export const updatePost = (row: any) => {
  const postType = row.postType;
  switch (postType) {
    case '1':
      BlogPostModule.SET_POST_ADD_OR_UPDATE('update');
      BlogPostModule.SET_POST_DETAIL({
        row: {
          authorId: row.authorId,
          status: row.status,
          categoryId: row.categoryId,
          channelId: row.channelId,
          title: row.title,
          tags: row.postTags,
          poster: row.poster,
          id: row.id,
          pinned: row.pinned,
          recommended: row.recommended,
          featured: row.featured,
          hot: row.hot,
          original: row.original,
          paid: row.paid,
          free: row.free,
          privated: row.private,
          publiced: row.public,
        },
      });
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(true);
      break;
    case '2':
      BlogPostModule.SET_POST_ADD_OR_UPDATE_VIDEO('update');
      BlogPostModule.SET_POST_DETAIL_VIDEO({
        row: {
          authorId: row.authorId,
          status: row.status,
          directoryId: row.categoryId,
          channelId: row.channelId,
          title: row.title,
          poster: row.poster,
          id: row.id,
          tags: row.postTags,
          videoUrl: row.videoUrl,
          videoPoster: row.videoPoster,
          pinned: row.pinned,
          recommended: row.recommended,
          featured: row.featured,
          hot: row.hot,
          original: row.original,
          paid: row.paid,
          free: row.free,
          privated: row.private,
          publiced: row.public,
        },
      });
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_VIDEO(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_VIDEO(true);
    default:
      break;
  }
};
export const addWhatPost = (id: number) => {
  // 1普通文章，2纯视频，3纯图片，4调查问卷，5内嵌视频，6时政
  switch (id) {
    case 1:
      BlogPostModule.SET_POST_ADD_OR_UPDATE('add');
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE(true);
      break;
    case 2:
      BlogPostModule.SET_POST_ADD_OR_UPDATE_VIDEO('add');
      BlogPostModule.SET_DISABLE_SELECT_CATEGORY_VIDEO(false);
      BlogPostModule.SET_EDITOR_BLOG_POST_VISIABLE_VIDEO(true);
      break;
    default:
      break;
  }
};
