import { useRef, useEffect } from 'react';

interface SearchInterfaceProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * SearchInterface - 终端风格的搜索框组件
 * 
 * 特性:
 * - 终端风格设计（粗边框、硬阴影、等宽字体）
 * - 显示 "ENTER_QUERY >" 提示文字
 * - 闪烁光标动画
 * - 支持输入事件
 * 
 * Requirements: 3.1, 3.2, 3.5
 */
export default function SearchInterface({ value, onChange }: SearchInterfaceProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 点击容器时聚焦输入框
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // 自动聚焦
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      onClick={handleContainerClick}
      className="
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        
        /* 移动端尺寸 - 更紧凑，适配小屏幕 */
        w-[85%] max-w-[240px]
        p-1.5 px-2
        border
        shadow-[2px_2px_0px_0px_#0A5F2C]
        
        /* 平板端尺寸 */
        sm:w-[80%] sm:max-w-[300px]
        sm:p-2 sm:px-3
        sm:border-2
        sm:shadow-[3px_3px_0px_0px_#0A5F2C]
        
        /* 桌面端尺寸 */
        md:w-auto md:min-w-[400px] md:max-w-md
        md:p-4
        md:border-4
        md:shadow-[8px_8px_0px_0px_#0A5F2C]
        
        /* 浅色模式 */
        bg-white
        border-[#0A5F2C]
        font-mono
        cursor-text
        z-50
        
        /* 深色模式 */
        dark:bg-black dark:border-[#00FF41]
        dark:shadow-[2px_2px_0px_0px_#00FF41]
        sm:dark:shadow-[3px_3px_0px_0px_#00FF41]
        md:dark:shadow-[8px_8px_0px_0px_#00FF41]
      "
      data-testid="search-interface"
    >
      {/* 终端标题栏 */}
      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 mb-1 sm:mb-1.5 md:mb-3 pb-0.5 sm:pb-1 md:pb-2 border-b border-[#0A5F2C]/30 dark:border-[#00FF41]/30">
        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
        <span className="ml-0.5 sm:ml-1 md:ml-2 text-[#0A5F2C]/60 dark:text-[#00FF41]/60 text-[7px] sm:text-[9px] md:text-xs truncate">SEARCH</span>
      </div>

      {/* 输入区域 */}
      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
        <span className="text-[#0A5F2C] dark:text-[#00FF41] text-[9px] sm:text-[10px] md:text-base whitespace-nowrap">
          &gt;
        </span>
        <div className="relative flex-1 min-w-0 flex items-center">
          {/* 显示文本 + 光标 */}
          <span className="text-[#0A5F2C] dark:text-[#00FF41] text-[9px] sm:text-[10px] md:text-base font-mono whitespace-pre">
            {value}
          </span>
          {/* 闪烁光标 - 紧跟在文字后面 */}
          <span
            className="
              inline-block h-[1em] w-[1px] sm:w-[2px] 
              bg-[#0A5F2C] dark:bg-[#00FF41]
              animate-blink
              ml-[1px]
            "
          ></span>
          {/* 隐藏的输入框 */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="
              absolute inset-0 w-full h-full
              bg-transparent
              text-transparent
              outline-none border-none
              font-mono
              caret-transparent
            "
            placeholder=""
            aria-label="搜索标签"
            data-testid="search-input"
          />
        </div>
      </div>

      {/* 底部提示 */}
      <div className="mt-1 sm:mt-1.5 md:mt-3 pt-0.5 sm:pt-1 md:pt-2 border-t border-[#0A5F2C]/30 dark:border-[#00FF41]/30 text-[#0A5F2C]/50 dark:text-[#00FF41]/50 text-[7px] sm:text-[9px] md:text-xs">
        <span className="hidden sm:inline">输入关键词筛选 | ESC 清除</span>
        <span className="sm:hidden">ESC 清除</span>
      </div>
    </div>
  );
}
