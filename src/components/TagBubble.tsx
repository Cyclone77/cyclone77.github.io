import { useState, useEffect } from 'react';
import { formatTagName, TagPosition, Tag } from '../utils/tagCloud';

interface TagBubbleProps {
  tag: Tag;
  position: TagPosition;
  isHighlighted: boolean;
  onClick: (tagName: string) => void;
}

/**
 * 字体大小映射 - 移动端、平板端和桌面端的像素值
 * 移动端字体更小，确保在小屏幕上可用性
 * Requirements: 8.2 - 移动端调整字体大小比例
 */
const fontSizeMap: Record<string, { mobile: string; tablet: string; desktop: string }> = {
  'text-4xl': { mobile: '0.875rem', tablet: '1.25rem', desktop: '2.25rem' },   // sm -> xl -> 4xl
  'text-3xl': { mobile: '0.75rem', tablet: '1rem', desktop: '1.875rem' },      // xs -> base -> 3xl
  'text-2xl': { mobile: '0.6875rem', tablet: '0.875rem', desktop: '1.5rem' },  // 11px -> sm -> 2xl
  'text-xl': { mobile: '0.625rem', tablet: '0.75rem', desktop: '1.25rem' },    // 10px -> xs -> xl
  'text-base': { mobile: '0.5625rem', tablet: '0.6875rem', desktop: '1rem' },  // 9px -> 11px -> base
  'text-sm': { mobile: '0.5rem', tablet: '0.625rem', desktop: '0.875rem' },    // 8px -> 10px -> sm
};

/**
 * TagBubble - Brutalist 风格的标签气泡组件
 * 
 * 特性:
 * - 黑色背景、Matrix 绿色边框、硬阴影
 * - 悬停效果：背景变绿、文字变黑、阴影增大
 * - 点击效果：下沉 + 阴影减小
 * - 支持深色/浅色主题
 * - 响应式字体大小（移动端缩小）
 * 
 * Requirements: 2.3, 2.4, 4.2, 4.3, 8.1, 8.2
 */
export default function TagBubble({ tag, position, isHighlighted, onClick }: TagBubbleProps) {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // 监听屏幕宽度变化，区分移动端（<640px）、平板端（640-768px）和桌面端（>=768px）
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const handleClick = () => {
    onClick(tag.name);
  };

  // 获取字体大小
  const sizes = fontSizeMap[position.fontSize] || fontSizeMap['text-sm'];
  const fontSize = sizes[screenSize];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        group
        absolute font-mono font-bold
        cursor-pointer select-none
        transition-all duration-200 ease-out
        
        /* 移动端样式 - 最紧凑，适配小屏幕 */
        px-1 py-0.5
        border
        shadow-[1px_1px_0px_0px_#0A5F2C]
        
        /* 平板端样式 */
        sm:px-1.5 sm:py-0.5
        sm:shadow-[2px_2px_0px_0px_#0A5F2C]
        
        /* 桌面端样式 */
        md:px-4 md:py-2
        md:border-2
        md:shadow-[4px_4px_0px_0px_#0A5F2C]
        
        /* 浅色模式 - 使用深绿色边框和阴影 */
        bg-white text-[#0A5F2C]
        border-[#0A5F2C]
        
        /* 浅色模式悬停 */
        hover:bg-[#0A5F2C] hover:text-white
        hover:shadow-[1.5px_1.5px_0px_0px_#0A5F2C] sm:hover:shadow-[3px_3px_0px_0px_#0A5F2C] md:hover:shadow-[6px_6px_0px_0px_#0A5F2C]
        hover:translate-x-[-0.25px] hover:translate-y-[-0.25px] sm:hover:translate-x-[-0.5px] sm:hover:translate-y-[-0.5px] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px]
        
        /* 点击效果 - 下沉 + 阴影减小 */
        active:translate-x-[0.25px] active:translate-y-[0.25px] sm:active:translate-x-[0.5px] sm:active:translate-y-[0.5px] md:active:translate-x-[2px] md:active:translate-y-[2px]
        active:shadow-[0px_0px_0px_0px_#0A5F2C] sm:active:shadow-[0.5px_0.5px_0px_0px_#0A5F2C] md:active:shadow-[2px_2px_0px_0px_#0A5F2C]
        
        /* 深色模式 - Matrix 绿色主题 */
        dark:bg-black dark:text-[#00FF41]
        dark:border-[#00FF41] 
        dark:shadow-[1px_1px_0px_0px_#00FF41] sm:dark:shadow-[2px_2px_0px_0px_#00FF41] md:dark:shadow-[4px_4px_0px_0px_#00FF41]
        dark:hover:bg-[#00FF41] dark:hover:text-black
        dark:hover:shadow-[1.5px_1.5px_0px_0px_#00FF41] sm:dark:hover:shadow-[3px_3px_0px_0px_#00FF41] md:dark:hover:shadow-[6px_6px_0px_0px_#00FF41]
        dark:active:shadow-[0px_0px_0px_0px_#00FF41] sm:dark:active:shadow-[0.5px_0.5px_0px_0px_#00FF41] md:dark:active:shadow-[2px_2px_0px_0px_#00FF41]
        
        ${isHighlighted ? 'opacity-100 scale-105' : 'opacity-40'}
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: position.zIndex,
        fontSize,
      }}
      data-testid="tag-bubble"
      aria-label={`标签: ${tag.name}, ${tag.count} 篇文章`}
    >
      {formatTagName(tag.name)}
      {/* 文章数量角标 */}
      <span
        className="
          absolute
          -top-1 -right-1
          sm:-top-1.5 sm:-right-1.5
          md:-top-2 md:-right-2
          
          min-w-[14px] h-[14px]
          sm:min-w-[16px] sm:h-[16px]
          md:min-w-[20px] md:h-[20px]
          
          flex items-center justify-center
          
          text-[8px] sm:text-[9px] md:text-[10px]
          font-bold font-mono
          
          rounded-full
          
          /* 浅色模式 */
          bg-[#0A5F2C] text-white
          border border-white
          
          /* 深色模式 */
          dark:bg-[#00FF41] dark:text-black
          dark:border-black
          
          /* 悬停时反转颜色 */
          group-hover:bg-white group-hover:text-[#0A5F2C]
          dark:group-hover:bg-black dark:group-hover:text-[#00FF41]
          
          transition-colors duration-200
        "
      >
        {tag.count}
      </span>
    </button>
  );
}
