interface FilterSidebarProps {
  activeTags: string[];
  suggestedTags: string[];
  onRemoveTag: (tag: string) => void;
  onAddTag: (tag: string) => void;
}

/**
 * FilterSidebar - 筛选侧边栏
 * 
 * 特性:
 * - 显示当前激活的筛选标签（可移除）
 * - 显示推荐的相关标签（可添加）
 * - 系统健康状态指示器
 * - 仅在 xl 及以上屏幕显示
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */
export default function FilterSidebar({
  activeTags,
  suggestedTags,
  onRemoveTag,
  onAddTag,
}: FilterSidebarProps) {
  return (
    <aside className="
      hidden xl:flex w-80 flex-col p-6 
      border-l-4 border-border-light dark:border-zinc-500 
      bg-surface-light dark:bg-zinc-900
      font-mono
    ">
      {/* 当前激活的筛选标签 */}
      <div className="mb-8">
        <h3 className="text-xs font-bold tracking-[0.3em] mb-4 opacity-50 text-text-primary-light dark:text-zinc-400">
          当前筛选
        </h3>
        <div className="flex flex-col gap-2">
          {activeTags.map(tag => (
            <div
              key={tag}
              onClick={() => onRemoveTag(tag)}
              className="
                p-3 flex justify-between items-center 
                cursor-pointer
                border-l-4 border-border-light dark:border-zinc-500 
                bg-gray-100 dark:bg-zinc-800
                text-text-primary-light dark:text-zinc-300
                hover:bg-black dark:hover:bg-zinc-300 
                hover:text-white dark:hover:text-black
                transition-colors
              "
            >
              <span className="font-bold">#{tag.toUpperCase()}</span>
              <span className="text-sm">✕</span>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐标签 */}
      {suggestedTags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold tracking-[0.3em] mb-4 opacity-50 text-text-primary-light dark:text-zinc-400">
            推荐标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => onAddTag(tag)}
                className="
                  border border-border-light dark:border-zinc-500 px-2 py-1 
                  text-[10px] text-text-primary-light dark:text-zinc-300
                  hover:bg-black dark:hover:bg-zinc-300 
                  hover:text-white dark:hover:text-black
                  transition-colors cursor-pointer
                "
              >
                + #{tag.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto border-2 border-border-light dark:border-zinc-500 p-4 bg-gray-100 dark:bg-zinc-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-text-primary-light dark:text-zinc-300">💾</span>
          <span className="text-[10px] font-black uppercase text-text-primary-light dark:text-zinc-300">系统状态</span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-zinc-700 h-1 mb-2">
          <div className="bg-black dark:bg-zinc-300 h-full w-3/4" />
        </div>
        <div className="flex justify-between text-[8px] font-bold text-text-primary-light dark:text-zinc-400">
          <span>缓存: 0%</span>
          <span>同步正常</span>
        </div>
      </div>
    </aside>
  );
}
