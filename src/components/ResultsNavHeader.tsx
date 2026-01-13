import { useNavigate } from 'react-router';

interface ResultsNavHeaderProps {
  primaryTag: string;
  articleCount: number;
}

/**
 * ResultsNavHeader - 标签结果页面的导航头部
 * 
 * 特性:
 * - 返回按钮（RETURN_TO_CORE）
 * - 显示当前筛选标签
 * - 显示文章数量统计
 * - Brutalist 风格（黑色背景、Matrix 绿色边框）
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
export default function ResultsNavHeader({ primaryTag, articleCount }: ResultsNavHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/tags');
  };

  return (
    <nav className="
      w-full z-50 p-4 
      flex justify-between items-center 
      bg-surface-light dark:bg-black 
      border-b-4 border-border-light dark:border-primary
      font-mono
    ">
      {/* 左侧：返回按钮和筛选标签 */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleBack}
          className="
            group flex items-center gap-3 
            bg-black dark:bg-primary 
            text-white dark:text-black 
            px-4 py-2 font-black 
            hover:bg-gray-800 dark:hover:bg-white 
            transition-colors
            cursor-pointer
          "
        >
          <span className="font-black">←</span>
          <span>返回标签云</span>
        </button>
        
        <div className="hidden md:block">
          <span className="text-xs opacity-60 text-text-primary-light dark:text-primary">当前筛选:</span>
          <span className="text-xl font-bold ml-2 text-text-primary-light dark:text-primary">#{primaryTag.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-primary-light dark:text-primary">
        <div className="flex flex-col items-end">
          <span className="opacity-50 tracking-tighter">响应延迟: 0.002ms</span>
          <span>文章数量: {articleCount.toLocaleString()}</span>
        </div>
        <div className="w-10 h-10 border-2 border-border-light dark:border-primary flex items-center justify-center">
          <span className="text-lg">⚙</span>
        </div>
      </div>
    </nav>
  );
}
