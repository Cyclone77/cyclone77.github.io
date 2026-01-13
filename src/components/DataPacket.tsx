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
 * - 文章标题和简介
 * - 元信息：时间戳、作者、相关标签
 * - 简洁的悬停效果
 * - Brutalist 风格
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
 */
export default function DataPacket({ article, onClick }: DataPacketProps) {
  // 格式化时间戳
  const formatTimestamp = (date: string) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      return d.toISOString().slice(0, 10).replace(/-/g, '.');
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
        border-4 border-black dark:border-zinc-600 
        bg-white dark:bg-zinc-900
        shadow-brutal dark:shadow-[4px_4px_0px_0px_rgba(82,82,91,1)]
        transition-all duration-200
        group
        hover:shadow-brutal-hover dark:hover:shadow-[8px_8px_0px_0px_rgba(82,82,91,1)]
        hover:-translate-x-1 hover:-translate-y-1
        font-mono
      "
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* 缩略图 */}
        <div className="
          w-full md:w-48 h-32 flex-shrink-0 
          border border-black/30 dark:border-zinc-600
          bg-gray-100 dark:bg-zinc-800 overflow-hidden relative
        ">
          <img
            src={article.coverImage}
            alt={article.title}
            className="
              w-full h-full object-cover
              grayscale opacity-60
              group-hover:opacity-100 group-hover:grayscale-0
              transition-all duration-200
            "
          />
        </div>

        {/* 内容区 */}
        <div className="flex-1 flex flex-col">
          {/* 标题 */}
          <h2 className="
            text-xl md:text-2xl font-black mb-2 
            leading-tight tracking-tight
            text-black dark:text-zinc-200 
            group-hover:text-primary dark:group-hover:text-primary
          ">
            {article.title}
          </h2>

          {/* 简介 - 始终显示 */}
          <p className="
            text-sm leading-relaxed mb-3
            text-gray-600 dark:text-zinc-400
            line-clamp-2
          ">
            {article.description}
          </p>

          {/* 底部元信息 */}
          <div className="
            flex flex-wrap items-center gap-3 mt-auto 
            text-[11px] text-gray-500 dark:text-zinc-500
          ">
            <span>{formatTimestamp(article.createdAt || article.date)}</span>
            <span>·</span>
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{article.readTime}</span>
            {relatedTags.length > 0 && (
              <>
                <span>·</span>
                <span className="text-primary dark:text-primary/80">
                  {relatedTags.map(t => `#${t}`).join(' ')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
