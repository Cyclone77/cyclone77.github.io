import { SortMode } from '../utils/articleSort';

interface SortingMatrixProps {
  currentSort: SortMode;
  onSortChange: (mode: SortMode) => void;
}

const SORT_OPTIONS: { mode: SortMode; label: string }[] = [
  { mode: 'chrono', label: '时间' },
  { mode: 'weight', label: '权重' },
  { mode: 'size', label: '大小' },
];

/**
 * SortingMatrix - 排序控制面板
 * 
 * 特性:
 * - 三种排序选项：CHRONO、WEIGHT、SIZE
 * - 高亮当前选中的排序方式
 * - Brutalist 风格（粗边框、硬阴影）
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.5
 */
export default function SortingMatrix({ currentSort, onSortChange }: SortingMatrixProps) {
  return (
    <div className="
      w-full p-4 mb-8 
      flex flex-wrap items-center justify-between gap-4
      border-4 border-border-light dark:border-primary 
      bg-surface-light dark:bg-black
      shadow-brutal dark:shadow-[8px_8px_0px_0px_#00FF41]
      font-mono
    ">
      {/* 左侧：排序选项 */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[8px] opacity-60 text-text-primary-light dark:text-primary">排序方式</span>
          <div className="flex gap-2 mt-1">
            {SORT_OPTIONS.map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => onSortChange(mode)}
                className={`
                  px-3 py-1 text-xs font-bold
                  transition-colors cursor-pointer
                  ${currentSort === mode
                    ? 'bg-black dark:bg-primary text-white dark:text-black'
                    : 'border border-border-light dark:border-primary text-text-primary-light dark:text-primary hover:bg-gray-100 dark:hover:bg-primary/20'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-10 w-px bg-border-light/30 dark:bg-primary/30 hidden md:block" />
        
        <div className="flex flex-col">
          <span className="text-[8px] opacity-60 text-text-primary-light dark:text-primary">数据模式</span>
          <span className="text-xs font-bold text-text-primary-light dark:text-white">[原始数据]</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-text-primary-light dark:text-primary">
        <span className="text-[10px] animate-pulse">● 信号良好</span>
        <span className="text-lg">📊</span>
      </div>
    </div>
  );
}
