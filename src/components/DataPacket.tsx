import { Article } from '../data/mockData';

interface DataPacketProps {
  article: Article;
  onClick: (articleId: number) => void;
}

/**
 * DataPacket - 文章卡片组件
 * 
 * 特性:
 * - 文章缩略图（灰度效果，悬停时彩色）
 * - 文章标题（大写、粗体）
 * - 元信息：时间戳、作者、相关标签
 * - 悬停效果（背景变白、文字变黑）
 * - Brutalist 风格
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
 */
export default function DataPacket({ article, onClick }: DataPacketProps) {
  // 生成随机 PID
  const pid = `${Math.floor(article.id % 10000)}-${Math.floor(Math.random() * 100)}`;
  
  // 格式化时间戳
  const formatTimestamp = (date: string) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      return d.toISOString().slice(0, 10).replace(/-/g, '.') + '_' + 
             d.toISOString().slice(11, 16).replace(':', ':');
    } catch {
      return date;
    }
  };

  // 获取相关标签
  const relatedTags = [
    ...(article.categories || []),
    ...(article.tags || []),
  ].slice(0, 3);

  return (
    <article
      onClick={() => onClick(article.id)}
      className="
        w-full p-6 cursor-pointer
        border-2 border-border-light dark:border-primary 
        bg-surface-light dark:bg-black
        transition-all duration-200
        group
        hover:bg-black dark:hover:bg-white 
        hover:border-black dark:hover:border-white
        font-mono
      "
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* 缩略图 */}
        <div className="
          w-full md:w-48 h-32 flex-shrink-0 
          border border-border-light/30 dark:border-primary/30
          bg-gray-100 dark:bg-[#111] overflow-hidden relative
        ">
          <img
            src={article.coverImage}
            alt={article.title}
            className="
              w-full h-full object-cover
              grayscale opacity-50
              group-hover:opacity-100 group-hover:grayscale-0
              transition-all duration-200
            "
          />
          {/* 扫描线效果 */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)',
            }}
          />
        </div>

        {/* 内容区 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部元信息 */}
          <div className="flex justify-between items-start mb-2">
            <span className="
              text-[10px] px-2 py-0.5 
              bg-gray-200 dark:bg-primary/20 
              border border-border-light/40 dark:border-primary/40
              text-text-primary-light dark:text-primary 
              group-hover:text-white dark:group-hover:text-black 
              group-hover:bg-white/20 dark:group-hover:bg-black/20 
              group-hover:border-white/40 dark:group-hover:border-black/40
            ">
              编号: {pid}
            </span>
            <span className="
              text-[10px] font-bold opacity-60 
              text-text-primary-light dark:text-primary 
              group-hover:text-white dark:group-hover:text-black
            ">
              阅读时间: {article.readTime}
            </span>
          </div>

          {/* 标题 */}
          <h2 className="
            text-2xl md:text-3xl font-black mb-3 
            leading-tight tracking-tighter uppercase
            text-text-primary-light dark:text-primary 
            group-hover:text-white dark:group-hover:text-black
          ">
            {article.title}
          </h2>

          {/* 摘要（悬停显示） */}
          <div className="
            hidden group-hover:block
            text-sm leading-relaxed mb-4
            text-white dark:text-black
          ">
            {article.description}
          </div>

          <div className="
            flex flex-wrap gap-4 mt-auto 
            text-text-primary-light dark:text-primary 
            group-hover:text-white dark:group-hover:text-black
          ">
            <span className="text-[10px] font-bold">
              [ 时间: {formatTimestamp(article.createdAt || article.date)} ]
            </span>
            <span className="text-[10px] font-bold">
              [ 作者: {article.author.name} ]
            </span>
            {relatedTags.length > 0 && (
              <span className="text-[10px] font-bold">
                [ 标签: {relatedTags.map(t => `#${t}`).join(', ')} ]
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
