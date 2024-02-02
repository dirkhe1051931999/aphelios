import NodeRSA from 'node-rsa';
import Config from '~/utils/config';

export function timeAgo(timestamp) {
  const now = Date.now(); // 当前时间的时间戳（单位：毫秒）
  const diff = Math.floor((now - timestamp) / 1000); // 差异时间（单位：秒）
  if (diff < 30) {
    return '刚刚';
  }
  if (diff < 60) {
    return `${diff} 秒前`;
  }

  const diffMinutes = Math.floor(diff / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} 小时前`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 3) {
    return `${diffDays} 天前`;
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const rsaEncrypt = (data) => {
  const pk = Config.rsaPublicKey;
  const encrypt = new NodeRSA(pk);
  encrypt.setOptions({ encryptionScheme: 'pkcs1' });
  return encrypt.encrypt(data, 'base64');
};

export function getAuthorLevelName(score) {
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

export function getAuthorLevel(score) {
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

export function enRegionToZhRegion(region) {
  const obj = {
    Shaanxi: '陕西',
    Shanxi: '山西',
    Beijing: '北京',
    Tianjin: '天津',
    Hebei: '河北',
    Heilongjiang: '黑龙江',
    Jilin: '吉林',
    Liaoning: '辽宁',
    InnerMongolia: '内蒙古',
    Ningxia: '宁夏',
    Xinjiang: '新疆',
    Tibet: '西藏',
    Qinghai: '青海',
    Gansu: '甘肃',
    Sichuan: '四川',
    Yunnan: '云南',
    Guizhou: '贵州',
    Chongqing: '重庆',
    Hubei: '湖北',
    Hunan: '湖南',
    Jiangxi: '江西',
    Anhui: '安徽',
    Zhejiang: '浙江',
    Jiangsu: '江苏',
    Shanghai: '上海',
    Fujian: '福建',
    Taiwan: '台湾',
    Guangdong: '广东',
    Hainan: '海南',
    Guangxi: '广西',
    HongKong: '香港',
    Macau: '澳门',
  };
  return obj[region];
}

export function isCdnUrl(url) {
  return url.indexOf('/cdn/') === 0;
}

export function removeKeywordStyle(str) {
  const reg = /<span style="color: #e93030">/gi;
  const reg2 = /<\/span>/gi;
  return str.replace(reg, '').replace(reg2, '');
}
