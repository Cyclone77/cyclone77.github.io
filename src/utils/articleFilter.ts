import { Article } from '../data/mockData';

/**
 * 检查文章是否包含指定标签
 * 在 categories、tags、displays 三个字段中查找（不区分大小写）
 */
function articleHasTag(article: Article, tag: string): boolean {
  const tagLower = tag.toLowerCase();
  
  // 检查 categories
  const inCategories = article.categories?.some(
    c => c.toLowerCase() === tagLower
  ) || false;
  
  // 检查 tags
  const inTags = article.tags?.some(
    t => t.toLowerCase() === tagLower
  ) || false;
  
  // 检查 displays
  const inDisplays = article.displays?.some(
    d => d.toLowerCase() === tagLower
  ) || false;
  
  // 兼容旧的 category 字段
  const inOldCategory = article.category?.toLowerCase() === tagLower;
  
  return inCategories || inTags || inDisplays || inOldCategory;
}

/**
 * 根据标签筛选文章
 * 使用 AND 逻辑：文章必须包含所有筛选标签
 * 
 * @param articles - 文章列表
 * @param tags - 筛选标签数组
 * @returns 筛选后的文章列表
 * 
 * Requirements: 5.2, 5.5
 */
export function filterArticlesByTags(articles: Article[], tags: string[]): Article[] {
  // 空标签数组返回所有文章
  if (!tags || tags.length === 0) {
    return articles;
  }
  
  return articles.filter(article => {
    // 文章必须包含所有筛选标签（AND 逻辑）
    return tags.every(tag => articleHasTag(article, tag));
  });
}

/**
 * 从文章列表中提取所有标签
 * 用于生成推荐标签
 * 
 * @param articles - 文章列表
 * @param excludeTags - 要排除的标签（已激活的筛选标签）
 * @returns 标签数组（去重）
 */
export function extractTagsFromArticles(
  articles: Article[], 
  excludeTags: string[] = []
): string[] {
  const tagSet = new Set<string>();
  const excludeSet = new Set(excludeTags.map(t => t.toLowerCase()));
  
  articles.forEach(article => {
    // 添加 categories
    article.categories?.forEach(c => {
      if (!excludeSet.has(c.toLowerCase())) {
        tagSet.add(c);
      }
    });
    
    // 添加 tags
    article.tags?.forEach(t => {
      if (!excludeSet.has(t.toLowerCase())) {
        tagSet.add(t);
      }
    });
    
    // 添加 displays
    article.displays?.forEach(d => {
      if (!excludeSet.has(d.toLowerCase())) {
        tagSet.add(d);
      }
    });
  });
  
  return Array.from(tagSet);
}
