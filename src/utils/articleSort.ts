import { Article } from '../data/mockData';

/**
 * 排序模式类型
 * - chrono: 按时间排序（最新在前）
 * - weight: 按权重排序（displays + categories 数量）
 * - size: 按内容大小排序（description 长度）
 */
export type SortMode = 'chrono' | 'weight' | 'size';

/**
 * 解析日期字符串为时间戳
 * 支持 ISO 格式和中文日期格式
 */
function parseDate(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  
  // 尝试 ISO 格式
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) {
    return isoDate.getTime();
  }
  
  // 尝试中文日期格式 "2026年1月6日"
  const chineseMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
  if (chineseMatch) {
    const [, year, month, day] = chineseMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
  }
  
  return 0;
}

/**
 * 计算文章权重
 * 权重 = displays 数量 + categories 数量
 */
function calculateWeight(article: Article): number {
  const displaysCount = article.displays?.length || 0;
  const categoriesCount = article.categories?.length || 0;
  return displaysCount + categoriesCount;
}

/**
 * 对文章列表进行排序
 * 
 * @param articles - 文章列表
 * @param mode - 排序模式
 * @returns 排序后的新数组（不修改原数组）
 * 
 * Requirements: 3.4
 */
export function sortArticles(articles: Article[], mode: SortMode): Article[] {
  // 创建副本，避免修改原数组
  const sorted = [...articles];
  
  switch (mode) {
    case 'chrono':
      // 按时间倒序（最新在前）
      return sorted.sort((a, b) => {
        const timeA = parseDate(a.createdAt) || parseDate(a.date);
        const timeB = parseDate(b.createdAt) || parseDate(b.date);
        return timeB - timeA;
      });
      
    case 'weight':
      // 按权重倒序（权重高在前）
      return sorted.sort((a, b) => {
        return calculateWeight(b) - calculateWeight(a);
      });
      
    case 'size':
      // 按内容大小倒序（内容多在前）
      return sorted.sort((a, b) => {
        const sizeA = a.description?.length || 0;
        const sizeB = b.description?.length || 0;
        return sizeB - sizeA;
      });
      
    default:
      return sorted;
  }
}
