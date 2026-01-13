/**
 * 标签云工具函数
 * 用于计算标签字体大小、格式化标签名称和生成标签位置
 */

export interface Tag {
  name: string;
  count: number;
  color: string;
  description: string;
  type: 'category' | 'display';
}

export interface TagPosition {
  x: number;        // 0-100 百分比
  y: number;        // 0-100 百分比
  fontSize: string; // Tailwind 字体大小类名
  zIndex: number;   // 层级
}

/**
 * 根据标签的 count 值计算字体大小
 * count 越大，字体越大
 * 
 * @param count - 标签的文章数量
 * @param maxCount - 所有标签中的最大 count 值
 * @returns Tailwind CSS 字体大小类名
 */
export function calculateFontSize(count: number, maxCount: number): string {
  // 处理边界情况
  if (maxCount <= 0 || count < 0) return 'text-sm';
  
  const ratio = count / maxCount;
  
  if (ratio >= 0.8) return 'text-4xl';
  if (ratio >= 0.6) return 'text-3xl';
  if (ratio >= 0.4) return 'text-2xl';
  if (ratio >= 0.2) return 'text-xl';
  if (ratio >= 0.1) return 'text-base';
  return 'text-sm';
}

/**
 * 格式化标签名称，添加 # 前缀
 * 
 * @param name - 标签原始名称
 * @returns 格式化后的标签名称，格式为 #标签名
 */
export function formatTagName(name: string): string {
  return `#${name}`;
}

/**
 * 简单的字符串哈希函数，用于生成确定性随机数
 * 
 * @param str - 输入字符串
 * @returns 哈希值
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
}

/**
 * 基于种子的伪随机数生成器
 * 
 * @param seed - 随机种子
 * @returns 0-1 之间的伪随机数
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * 估算标签的大致尺寸（基于字体大小和标签名长度）
 * 返回宽度和高度的百分比估算值
 */
function estimateTagSize(tagName: string, fontSize: string): { width: number; height: number } {
  // 基于字体大小的基础尺寸（百分比）
  const baseSizes: Record<string, { charWidth: number; height: number }> = {
    'text-4xl': { charWidth: 2.5, height: 5 },
    'text-3xl': { charWidth: 2, height: 4 },
    'text-2xl': { charWidth: 1.6, height: 3.5 },
    'text-xl': { charWidth: 1.3, height: 3 },
    'text-base': { charWidth: 1, height: 2.5 },
    'text-sm': { charWidth: 0.8, height: 2 },
  };
  
  const size = baseSizes[fontSize] || baseSizes['text-sm'];
  // 标签名长度 + # 前缀 + padding
  const width = (tagName.length + 1) * size.charWidth + 3;
  const height = size.height + 1;
  
  return { width, height };
}

/**
 * 检查两个标签是否重叠
 */
function checkOverlap(
  pos1: { x: number; y: number; width: number; height: number },
  pos2: { x: number; y: number; width: number; height: number },
  padding: number = 2
): boolean {
  const halfWidth1 = pos1.width / 2 + padding;
  const halfHeight1 = pos1.height / 2 + padding;
  const halfWidth2 = pos2.width / 2 + padding;
  const halfHeight2 = pos2.height / 2 + padding;
  
  return Math.abs(pos1.x - pos2.x) < (halfWidth1 + halfWidth2) &&
         Math.abs(pos1.y - pos2.y) < (halfHeight1 + halfHeight2);
}

/**
 * 生成标签位置数组
 * 使用确定性随机（基于标签名的哈希），避免每次渲染位置变化
 * 预留中央区域给搜索框，避免重叠
 * 添加碰撞检测，避免标签之间重叠
 * 
 * @param tags - 标签数组
 * @returns 标签位置数组
 */
export function generateTagPositions(tags: Tag[]): TagPosition[] {
  if (tags.length === 0) return [];
  
  const maxCount = Math.max(...tags.map(t => t.count), 1);
  
  // 定义安全区域边界（百分比）
  const margin = 8; // 边缘留白
  const centerX = 50;
  const centerY = 50;
  const centerExclusionRadius = 18; // 中央搜索框区域半径
  
  const positions: TagPosition[] = [];
  const placedTags: Array<{ x: number; y: number; width: number; height: number }> = [];
  
  // 按 count 降序排序，优先放置大标签
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  
  sortedTags.forEach((tag) => {
    const hash = hashString(tag.name);
    const fontSize = calculateFontSize(tag.count, maxCount);
    const tagSize = estimateTagSize(tag.name, fontSize);
    
    let bestX = 0;
    let bestY = 0;
    let found = false;
    
    // 尝试多个位置，找到不重叠的位置
    for (let attempt = 0; attempt < 50 && !found; attempt++) {
      // 使用不同的种子生成候选位置
      let x = margin + seededRandom(hash + attempt * 100) * (100 - 2 * margin);
      let y = margin + seededRandom(hash + attempt * 100 + 1) * (100 - 2 * margin);
      
      // 检查是否在中央排除区域内
      const distFromCenter = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      
      // 如果在中央区域，将位置推到外围
      if (distFromCenter < centerExclusionRadius) {
        const angle = Math.atan2(y - centerY, x - centerX);
        x = centerX + Math.cos(angle) * (centerExclusionRadius + 5);
        y = centerY + Math.sin(angle) * (centerExclusionRadius + 5);
      }
      
      // 确保在边界内
      x = Math.max(margin + tagSize.width / 2, Math.min(100 - margin - tagSize.width / 2, x));
      y = Math.max(margin + tagSize.height / 2, Math.min(100 - margin - tagSize.height / 2, y));
      
      // 检查与已放置标签的碰撞
      const currentTag = { x, y, width: tagSize.width, height: tagSize.height };
      const hasCollision = placedTags.some(placed => checkOverlap(currentTag, placed));
      
      if (!hasCollision) {
        bestX = x;
        bestY = y;
        found = true;
      } else if (attempt === 49) {
        // 最后一次尝试，使用当前位置（可能有轻微重叠）
        bestX = x;
        bestY = y;
      }
    }
    
    // zIndex 基于 count，count 越大层级越高
    const zIndex = 10 + Math.floor((tag.count / maxCount) * 10);
    
    placedTags.push({ x: bestX, y: bestY, width: tagSize.width, height: tagSize.height });
    
    positions.push({
      x: bestX,
      y: bestY,
      fontSize,
      zIndex,
    });
  });
  
  // 恢复原始顺序
  const originalOrderPositions: TagPosition[] = [];
  tags.forEach((tag) => {
    const sortedIndex = sortedTags.findIndex(t => t.name === tag.name);
    originalOrderPositions.push(positions[sortedIndex]);
  });
  
  return originalOrderPositions;
}
