interface ResultsStatusBarProps {
  articleCount: number;
}

/**
 * ResultsStatusBar - 底部状态栏
 * 
 * 特性:
 * - 状态信息（STATUS: STREAMING_ACTIVE）
 * - 连接数和加密状态
 * - Matrix 绿色边框和黑色背景
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export default function ResultsStatusBar({ articleCount }: ResultsStatusBarProps) {
  return (
    <footer className="
      w-full p-4 
      border-t-4 border-border-light dark:border-primary 
      bg-surface-light dark:bg-black 
      flex justify-between items-center 
      text-[10px] font-bold z-50
      font-mono text-text-primary-light dark:text-primary
    ">
      {/* 左侧状态信息 */}
      <div className="flex gap-4">
        <span>状态: 正常</span>
        <span>连接数: {(articleCount * 100 + 29).toLocaleString()}</span>
        <span className="bg-black dark:bg-primary text-white dark:text-black px-1">已加密</span>
      </div>

      {/* 右侧版本和版权 */}
      <div className="flex gap-6 uppercase">
        <span className="opacity-50">V_2.0.48</span>
        <span>© 2026 CY77 实验室</span>
      </div>
    </footer>
  );
}
