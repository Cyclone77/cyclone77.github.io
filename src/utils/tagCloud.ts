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
 * 生成标签位置数组
 * 使用确定性随机（基于标签名的哈希），避免每次渲染位置变化
 * 预留中央区域给搜索框，避免重叠
 * 
 * @param tags - 标签数组
 * @returns 标签位置数组
 */
export function generateTagPositions(tags: Tag[]): TagPosition[] {
  if (tags.length === 0) return [];
  
  const maxCount = Math.max(...tags.map(t => t.count), 1);
  
  // 定义安全区域边界（百分比）
  const margin = 10; // 边缘留白
  const centerX = 50;
  const centerY = 50;
  const centerExclusionRadius = 15; // 中央搜索框区域半径
  
  const positions: TagPosition[] = [];
  
  tags.forEach((tag) => {
    const hash = hashString(tag.name);
    
    // 使用多个种子生成不同的随机值
    let x = margin + seededRandom(hash) * (100 - 2 * margin);
    let y = margin + seededRandom(hash + 1) * (100 - 2 * margin);
    
    // 检查是否在中央排除区域内
    const distFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    // 如果在中央区域，将位置推到外围
    if (distFromCenter < centerExclusionRadius) {
      const angle = Math.atan2(y - centerY, x - centerX);
      x = centerX + Math.cos(angle) * (centerExclusionRadius + 5);
      y = centerY + Math.sin(angle) * (centerExclusionRadius + 5);
      
      // 确保在边界内
      x = Math.max(margin, Math.min(100 - margin, x));
      y = Math.max(margin, Math.min(100 - margin, y));
    }
    
    const fontSize = calculateFontSize(tag.count, maxCount);
    
    // zIndex 基于 count，count 越大层级越高
    const zIndex = 10 + Math.floor((tag.count / maxCount) * 10);
    
    positions.push({
      x,
      y,
      fontSize,
      zIndex,
    });
  });
  
  return positions;
}
