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
