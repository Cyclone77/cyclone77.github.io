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
      border-4 border-black dark:border-zinc-500 
      bg-white dark:bg-zinc-900
      shadow-brutal dark:shadow-[4px_4px_0px_0px_rgba(113,113,122,1)]
      font-mono
    ">
      {/* 左侧：排序选项 */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[8px] opacity-60 text-black dark:text-zinc-400">排序方式</span>
          <div className="flex gap-2 mt-1">
            {SORT_OPTIONS.map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => onSortChange(mode)}
                className={`
                  px-3 py-1 text-xs font-bold
                  transition-colors cursor-pointer
                  ${currentSort === mode
                    ? 'bg-black dark:bg-zinc-300 text-white dark:text-black'
                    : 'border border-black dark:border-zinc-500 text-black dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-10 w-px bg-black/30 dark:bg-zinc-600 hidden md:block" />
        
        <div className="flex flex-col">
          <span className="text-[8px] opacity-60 text-black dark:text-zinc-400">数据模式</span>
          <span className="text-xs font-bold text-black dark:text-zinc-300">[原始数据]</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-black dark:text-zinc-300">
        <span className="text-[10px] animate-pulse">● 信号良好</span>
        <span className="text-lg">📊</span>
      </div>
    </div>
  );
}
