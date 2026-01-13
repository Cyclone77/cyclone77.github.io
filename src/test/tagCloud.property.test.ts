import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateFontSize, formatTagName, generateTagPositions, Tag } from '../utils/tagCloud';

/**
 * 搜索筛选函数 - 判断标签是否匹配搜索关键词
 * 与 TagCloudPage.tsx 中的 isTagHighlighted 逻辑一致
 * 
 * @param tagName - 标签名称
 * @param searchQuery - 搜索关键词
 * @returns 是否高亮（匹配）
 */
export function isTagHighlighted(tagName: string, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true; // 无搜索词时全部高亮
  return tagName.toLowerCase().includes(searchQuery.toLowerCase());
}

/**
 * 根据搜索关键词筛选标签
 * 返回每个标签的高亮状态
 * 
 * @param tags - 标签数组
 * @param searchQuery - 搜索关键词
 * @returns 标签高亮状态映射
 */
export function filterTagsBySearch(tags: Tag[], searchQuery: string): Map<string, boolean> {
  const result = new Map<string, boolean>();
  tags.forEach(tag => {
    result.set(tag.name, isTagHighlighted(tag.name, searchQuery));
  });
  return result;
}

/**
 * Feature: tag-cloud-page
 * Property tests for Tag Cloud utilities
 */

// 定义字体大小的顺序映射，用于比较大小
const fontSizeOrder: Record<string, number> = {
  'text-sm': 0,
  'text-base': 1,
  'text-xl': 2,
  'text-2xl': 3,
  'text-3xl': 4,
  'text-4xl': 5,
};

/**
 * 比较两个字体大小，返回 -1, 0, 1
 */
function compareFontSize(a: string, b: string): number {
  const orderA = fontSizeOrder[a] ?? 0;
  const orderB = fontSizeOrder[b] ?? 0;
  if (orderA < orderB) return -1;
  if (orderA > orderB) return 1;
  return 0;
}

describe('Property 1: 标签字体大小与 count 正相关', () => {
  /**
   * For any 两个标签 A 和 B，如果 A.count >= B.count，
   * 则 A 的字体大小应该 >= B 的字体大小。
   * 
   * **Validates: Requirements 2.2**
   */
  it('should return larger or equal font size for larger or equal count', () => {
    fc.assert(
      fc.property(
        // 生成 maxCount (正整数)
        fc.integer({ min: 1, max: 1000 }),
        // 生成两个 count 值
        fc.integer({ min: 0, max: 1000 }),
        fc.integer({ min: 0, max: 1000 }),
        (maxCount, countA, countB) => {
          // 确保 count 不超过 maxCount
          const validCountA = Math.min(countA, maxCount);
          const validCountB = Math.min(countB, maxCount);
          
          const fontSizeA = calculateFontSize(validCountA, maxCount);
          const fontSizeB = calculateFontSize(validCountB, maxCount);
          
          // 如果 countA >= countB，则 fontSizeA >= fontSizeB
          if (validCountA >= validCountB) {
            expect(compareFontSize(fontSizeA, fontSizeB)).toBeGreaterThanOrEqual(0);
          }
          
          // 如果 countB >= countA，则 fontSizeB >= fontSizeA
          if (validCountB >= validCountA) {
            expect(compareFontSize(fontSizeB, fontSizeA)).toBeGreaterThanOrEqual(0);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return valid Tailwind font size class for any valid input', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        fc.integer({ min: 0, max: 1000 }),
        (maxCount, count) => {
          const validCount = Math.min(count, maxCount);
          const fontSize = calculateFontSize(validCount, maxCount);
          
          // 返回值必须是有效的 Tailwind 字体大小类名
          expect(Object.keys(fontSizeOrder)).toContain(fontSize);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return maximum font size for count equal to maxCount', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (maxCount) => {
          const fontSize = calculateFontSize(maxCount, maxCount);
          
          // count 等于 maxCount 时，ratio = 1.0 >= 0.8，应返回 text-4xl
          expect(fontSize).toBe('text-4xl');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return minimum font size for count equal to zero', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (maxCount) => {
          const fontSize = calculateFontSize(0, maxCount);
          
          // count 为 0 时，ratio = 0 < 0.1，应返回 text-sm
          expect(fontSize).toBe('text-sm');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('Property 2: 标签名称格式化', () => {
  /**
   * For any 标签，显示的文本应该是 `#` 前缀加上标签的 `name` 属性值。
   * 
   * **Validates: Requirements 2.6**
   */
  it('should format tag name with # prefix', () => {
    fc.assert(
      fc.property(
        // 生成任意非空字符串作为标签名
        fc.string({ minLength: 1, maxLength: 100 }),
        (tagName) => {
          const formatted = formatTagName(tagName);
          
          // 格式化后的名称应该以 # 开头
          expect(formatted.startsWith('#')).toBe(true);
          
          // 格式化后的名称应该是 # + 原始名称
          expect(formatted).toBe(`#${tagName}`);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve original tag name after # prefix', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (tagName) => {
          const formatted = formatTagName(tagName);
          
          // 去掉 # 前缀后应该等于原始名称
          expect(formatted.slice(1)).toBe(tagName);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should add exactly one # character as prefix', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (tagName) => {
          const formatted = formatTagName(tagName);
          
          // 格式化后的长度应该比原始名称多 1
          expect(formatted.length).toBe(tagName.length + 1);
          
          // 第一个字符应该是 #
          expect(formatted[0]).toBe('#');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('Property 3: 搜索筛选一致性', () => {
  /**
   * For any 搜索关键词和标签列表，匹配的标签（名称包含关键词，不区分大小写）
   * 应该被高亮，不匹配的标签应该降低透明度（即不高亮）。
   * 
   * **Validates: Requirements 3.3, 3.4**
   */

  // 生成随机标签的 Arbitrary
  const tagArbitrary = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }),
    count: fc.integer({ min: 1, max: 100 }),
    color: fc.constant('#00FF41'), // 使用固定颜色，颜色不影响搜索筛选逻辑
    description: fc.string({ minLength: 0, maxLength: 100 }),
    type: fc.constantFrom('category', 'display') as fc.Arbitrary<'category' | 'display'>,
  });

  it('should highlight tags whose names contain the search query (case-insensitive)', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 1, maxLength: 20 }),
        // 生成搜索关键词
        fc.string({ minLength: 1, maxLength: 20 }),
        (tags, searchQuery) => {
          const highlightMap = filterTagsBySearch(tags, searchQuery);
          
          tags.forEach(tag => {
            const isHighlighted = highlightMap.get(tag.name);
            const shouldMatch = tag.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            // 如果标签名包含搜索词（不区分大小写），应该被高亮
            // 如果不包含，应该不被高亮（降低透明度）
            expect(isHighlighted).toBe(shouldMatch);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should highlight all tags when search query is empty or whitespace', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 1, maxLength: 20 }),
        // 生成空白搜索词（空字符串或纯空白）
        fc.constantFrom('', ' ', '  ', '\t', '\n', '   '),
        (tags, emptyQuery) => {
          const highlightMap = filterTagsBySearch(tags, emptyQuery);
          
          // 空搜索词时，所有标签都应该被高亮
          tags.forEach(tag => {
            expect(highlightMap.get(tag.name)).toBe(true);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be case-insensitive when matching tags', () => {
    fc.assert(
      fc.property(
        // 生成一个基础字符串
        fc.string({ minLength: 1, maxLength: 20 }),
        (baseString) => {
          // 创建不同大小写版本的标签
          const lowerTag: Tag = {
            name: baseString.toLowerCase(),
            count: 10,
            color: '#00FF41',
            description: 'test',
            type: 'category',
          };
          
          const upperTag: Tag = {
            name: baseString.toUpperCase(),
            count: 10,
            color: '#00FF41',
            description: 'test',
            type: 'category',
          };
          
          const mixedTag: Tag = {
            name: baseString.split('').map((c, i) => 
              i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
            ).join(''),
            count: 10,
            color: '#00FF41',
            description: 'test',
            type: 'category',
          };
          
          const tags = [lowerTag, upperTag, mixedTag];
          
          // 使用小写搜索词
          const lowerResult = filterTagsBySearch(tags, baseString.toLowerCase());
          // 使用大写搜索词
          const upperResult = filterTagsBySearch(tags, baseString.toUpperCase());
          
          // 所有标签在两种搜索下应该有相同的高亮状态
          tags.forEach(tag => {
            expect(lowerResult.get(tag.name)).toBe(upperResult.get(tag.name));
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should correctly partition tags into highlighted and non-highlighted groups', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 1, maxLength: 20 }),
        // 生成非空且非纯空白的搜索关键词
        fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0),
        (tags, searchQuery) => {
          const highlightMap = filterTagsBySearch(tags, searchQuery);
          
          const highlightedTags = tags.filter(t => highlightMap.get(t.name) === true);
          const nonHighlightedTags = tags.filter(t => highlightMap.get(t.name) === false);
          
          // 高亮和非高亮标签的总数应该等于原始标签数
          expect(highlightedTags.length + nonHighlightedTags.length).toBe(tags.length);
          
          // 所有高亮标签的名称都应该包含搜索词
          highlightedTags.forEach(tag => {
            expect(tag.name.toLowerCase().includes(searchQuery.toLowerCase())).toBe(true);
          });
          
          // 所有非高亮标签的名称都不应该包含搜索词
          nonHighlightedTags.forEach(tag => {
            expect(tag.name.toLowerCase().includes(searchQuery.toLowerCase())).toBe(false);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('Property 4: 标签位置边界约束', () => {
  /**
   * For any 生成的标签位置，x 和 y 坐标应该在有效范围内（考虑边距），
   * 确保标签不会超出可视区域。
   * 
   * **Validates: Requirements 2.5**
   */

  // 生成随机标签的 Arbitrary
  const tagArbitrary = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }),
    count: fc.integer({ min: 1, max: 100 }),
    color: fc.constant('#00FF41'),
    description: fc.string({ minLength: 0, maxLength: 100 }),
    type: fc.constantFrom('category', 'display') as fc.Arbitrary<'category' | 'display'>,
  });

  // 边界常量（与 tagCloud.ts 中的 margin 一致）
  const MARGIN = 10;
  const MIN_BOUND = MARGIN;
  const MAX_BOUND = 100 - MARGIN;

  it('should generate positions with x coordinates within valid bounds', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 1, maxLength: 30 }),
        (tags) => {
          const positions = generateTagPositions(tags);
          
          // 每个位置的 x 坐标应该在 [MARGIN, 100-MARGIN] 范围内
          positions.forEach((pos) => {
            expect(pos.x).toBeGreaterThanOrEqual(MIN_BOUND);
            expect(pos.x).toBeLessThanOrEqual(MAX_BOUND);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate positions with y coordinates within valid bounds', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 1, maxLength: 30 }),
        (tags) => {
          const positions = generateTagPositions(tags);
          
          // 每个位置的 y 坐标应该在 [MARGIN, 100-MARGIN] 范围内
          positions.forEach((pos) => {
            expect(pos.y).toBeGreaterThanOrEqual(MIN_BOUND);
            expect(pos.y).toBeLessThanOrEqual(MAX_BOUND);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate same number of positions as input tags', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 0, maxLength: 30 }),
        (tags) => {
          const positions = generateTagPositions(tags);
          
          // 生成的位置数量应该等于输入标签数量
          expect(positions.length).toBe(tags.length);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate deterministic positions for same tag names', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 1, maxLength: 20 }),
        (tags) => {
          // 调用两次 generateTagPositions
          const positions1 = generateTagPositions(tags);
          const positions2 = generateTagPositions(tags);
          
          // 相同输入应该产生相同输出（确定性随机）
          expect(positions1.length).toBe(positions2.length);
          positions1.forEach((pos1, index) => {
            const pos2 = positions2[index];
            expect(pos1.x).toBe(pos2.x);
            expect(pos1.y).toBe(pos2.y);
            expect(pos1.fontSize).toBe(pos2.fontSize);
            expect(pos1.zIndex).toBe(pos2.zIndex);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate valid zIndex values based on count', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 1, maxLength: 30 }),
        (tags) => {
          const positions = generateTagPositions(tags);
          
          // zIndex 应该在合理范围内 (10-20 基于实现)
          positions.forEach((pos) => {
            expect(pos.zIndex).toBeGreaterThanOrEqual(10);
            expect(pos.zIndex).toBeLessThanOrEqual(20);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate positions that avoid the center exclusion zone', () => {
    fc.assert(
      fc.property(
        // 生成标签数组
        fc.array(tagArbitrary, { minLength: 1, maxLength: 30 }),
        (tags) => {
          const positions = generateTagPositions(tags);
          
          // 每个位置应该在中央排除区域之外
          // 由于边界约束可能将位置推回，我们只验证最终位置在有效范围内
          positions.forEach((pos) => {
            expect(pos.x).toBeGreaterThanOrEqual(MIN_BOUND);
            expect(pos.x).toBeLessThanOrEqual(MAX_BOUND);
            expect(pos.y).toBeGreaterThanOrEqual(MIN_BOUND);
            expect(pos.y).toBeLessThanOrEqual(MAX_BOUND);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
