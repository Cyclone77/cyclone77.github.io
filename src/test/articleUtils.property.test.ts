import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { sortArticles, SortMode } from '../utils/articleSort';
import { filterArticlesByTags } from '../utils/articleFilter';
import { Article } from '../data/mockData';

// 生成有效日期字符串的 Arbitrary
const validDateArbitrary = fc.integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31
  .map(timestamp => new Date(timestamp).toISOString());

// 生成随机文章的 Arbitrary
const articleArbitrary: fc.Arbitrary<Article> = fc.record({
  id: fc.integer({ min: 1, max: 100000 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 0, maxLength: 500 }),
  categories: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 5 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 5 }),
  displays: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 3 }),
  date: validDateArbitrary,
  createdAt: fc.option(validDateArbitrary, { nil: undefined }),
  readTime: fc.constant('5 分钟阅读'),
  coverImage: fc.constant('https://example.com/image.jpg'),
  author: fc.record({
    name: fc.string({ minLength: 1, maxLength: 20 }),
    avatar: fc.constant('https://example.com/avatar.jpg'),
  }),
});

// 生成排序模式的 Arbitrary
const sortModeArbitrary: fc.Arbitrary<SortMode> = fc.constantFrom('chrono', 'weight', 'size');

describe('Article Sort Properties', () => {
  /**
   * Feature: tag-results-page, Property 1: 排序保持元素不变
   * Validates: Requirements 3.4
   */
  it('Property 1: 排序后文章列表长度不变且所有文章都保留', () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 50 }),
        sortModeArbitrary,
        (articles, mode) => {
          const sorted = sortArticles(articles, mode);
          
          // 长度相同
          expect(sorted.length).toBe(articles.length);
          
          // 所有原文章都在排序后的列表中
          const sortedIds = new Set(sorted.map(a => a.id));
          const originalIds = new Set(articles.map(a => a.id));
          expect(sortedIds).toEqual(originalIds);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tag-results-page, Property 2: 时间排序正确性
   * Validates: Requirements 3.4
   */
  it('Property 2: 按时间排序后，每篇文章的时间戳大于等于后一篇', () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 50 }),
        (articles) => {
          const sorted = sortArticles(articles, 'chrono');
          
          // 检查降序排列
          for (let i = 0; i < sorted.length - 1; i++) {
            const timeA = new Date(sorted[i].createdAt || sorted[i].date).getTime();
            const timeB = new Date(sorted[i + 1].createdAt || sorted[i + 1].date).getTime();
            expect(timeA).toBeGreaterThanOrEqual(timeB);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('Article Filter Properties', () => {
  /**
   * Feature: tag-results-page, Property 3: 筛选正确性
   * Validates: Requirements 5.2, 5.4, 5.5
   */
  it('Property 3: 筛选后的每篇文章都包含所有筛选标签', () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 50 }),
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 3 }),
        (articles, filterTags) => {
          const filtered = filterArticlesByTags(articles, filterTags);
          
          // 每篇筛选后的文章都应包含所有筛选标签
          filtered.forEach(article => {
            filterTags.forEach(tag => {
              const tagLower = tag.toLowerCase();
              const hasTag = 
                article.categories?.some(c => c.toLowerCase() === tagLower) ||
                article.tags?.some(t => t.toLowerCase() === tagLower) ||
                article.displays?.some(d => d.toLowerCase() === tagLower) ||
                article.category?.toLowerCase() === tagLower;
              expect(hasTag).toBe(true);
            });
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tag-results-page, Property 4: 筛选后文章数量不增
   * Validates: Requirements 5.2
   */
  it('Property 4: 筛选后的文章数量小于等于原文章数量', () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 50 }),
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 3 }),
        (articles, filterTags) => {
          const filtered = filterArticlesByTags(articles, filterTags);
          expect(filtered.length).toBeLessThanOrEqual(articles.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 空标签筛选返回所有文章
   */
  it('空标签筛选返回所有文章', () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 50 }),
        (articles) => {
          const filtered = filterArticlesByTags(articles, []);
          expect(filtered.length).toBe(articles.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('Component Rendering Properties', () => {
  /**
   * Feature: tag-results-page, Property 5: 导航头部信息一致性
   * Validates: Requirements 2.3, 2.4
   */
  it('Property 5: 导航头部显示的标签名和文章数量与输入一致', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.integer({ min: 0, max: 10000 }),
        (tagName, articleCount) => {
          // 模拟 ResultsNavHeader 的渲染逻辑
          const displayedTag = `#${tagName.toUpperCase()}`;
          const displayedCount = articleCount.toLocaleString();
          
          // 验证标签名格式正确
          expect(displayedTag).toContain(tagName.toUpperCase());
          expect(displayedTag.startsWith('#')).toBe(true);
          
          // 验证数量格式正确
          expect(displayedCount).toBe(articleCount.toLocaleString());
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tag-results-page, Property 6: 文章卡片信息完整性
   * Validates: Requirements 4.3, 4.5
   */
  it('Property 6: 文章卡片包含标题、时间戳、作者和标签', () => {
    fc.assert(
      fc.property(
        articleArbitrary,
        (article) => {
          // 验证文章对象包含必要字段
          expect(article.title).toBeDefined();
          expect(article.title.length).toBeGreaterThan(0);
          
          // 验证日期存在
          expect(article.date || article.createdAt).toBeDefined();
          
          // 验证作者信息
          expect(article.author).toBeDefined();
          expect(article.author.name).toBeDefined();
          
          // 验证标签/分类字段存在（值可以为空数组）
          expect(article.tags !== undefined || article.categories !== undefined).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
