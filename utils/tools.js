export function timeAgo(timestamp) {
  const now = Date.now(); // 当前时间的时间戳（单位：毫秒）
  const diff = Math.floor((now - timestamp) / 1000); // 差异时间（单位：秒）

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
