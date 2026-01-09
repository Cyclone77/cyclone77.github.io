import { Link } from 'react-router';

interface ArticleCardProps {
    article: {
        id: number;
        title: string;
        description: string;
        coverImage?: string;
        date: string;
        readTime: string;
        categories?: string[];
        displays?: string[];
    };
    index: number;
    accentColor?: string;
}

// Category to color mapping
const categoryColors: Record<string, { bg: string; text: string; overlay: string }> = {
    Performance: { bg: 'bg-primary', text: 'text-black', overlay: 'bg-primary/20' },
    React: { bg: 'bg-blue-500', text: 'text-white', overlay: 'bg-blue-500/20' },
    CSS: { bg: 'bg-red-500', text: 'text-white', overlay: 'bg-red-500/20' },
    JavaScript: { bg: 'bg-yellow-500', text: 'text-black', overlay: 'bg-yellow-500/20' },
    TypeScript: { bg: 'bg-blue-600', text: 'text-white', overlay: 'bg-blue-600/20' },
    Node: { bg: 'bg-green-600', text: 'text-white', overlay: 'bg-green-600/20' },
    default: { bg: 'bg-primary', text: 'text-black', overlay: 'bg-primary/20' },
};

/**
 * ArticleCard - Brutalist article card for horizontal scroll
 * Features:
 * - 85vw width with 5vw right margin
 * - Two-column grid (image | content) on desktop
 * - 4px border with brutal shadow
 * - Scroll snap alignment
 * Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12
 */
export default function ArticleCard({ article, index, accentColor }: ArticleCardProps) {
    const primaryCategory = article.categories?.[0] || 'default';
    const colors = categoryColors[primaryCategory] || categoryColors.default;
    const isFeatured = article.displays?.includes('置顶') || article.displays?.includes('精选');
    const idLabel = `编号: ${String(index + 1).padStart(3, '0')}${isFeatured ? ' // 精选' : ''}`;

    // Format date: 2026.01.06
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // Format read time: 11分钟阅读
    const formatReadTime = (readTime: string) => {
        const match = readTime.match(/(\d+)/);
        return match ? `${match[1]}分钟阅读` : readTime;
    };

    return (
        <article className="article-card group" data-testid="article-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white shadow-brutal dark:shadow-brutal-white h-full overflow-hidden">
                {/* Image Section - use padding-bottom trick for aspect ratio */}
                <div className="relative overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black dark:border-white bg-primary/30" style={{ paddingBottom: '65%' }}>
                    <img
                        src={article.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop'}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover duotone-img group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 ${colors.overlay} mix-blend-multiply pointer-events-none`}></div>
                    <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-xs font-mono">
                        {idLabel}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 lg:p-10 flex flex-col justify-between">
                    <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {article.categories?.slice(0, 1).map(cat => (
                                <span
                                    key={cat}
                                    className={`${colors.bg} ${colors.text} px-2 py-0.5 text-xs font-bold uppercase`}
                                >
                                    #{cat}
                                </span>
                            ))}
                            {article.categories?.slice(1, 2).map(cat => (
                                <span
                                    key={cat}
                                    className="border border-black dark:border-white px-2 py-0.5 text-xs font-bold uppercase italic"
                                >
                                    #{cat}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl lg:text-5xl font-black leading-none mb-4 uppercase font-mono">
                            {article.title}
                        </h2>

                        {/* Description */}
                        <p
                            className="text-base opacity-80 mb-6 border-l-4 pl-4"
                            style={{ borderColor: accentColor || (colors.bg === 'bg-primary' ? '#00FF41' : undefined) }}
                        >
                            {article.description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <Link
                            to={`/article/${article.id}`}
                            className={`${colors.bg} ${colors.text} px-6 py-3 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all tracking-tighter font-mono`}
                        >
                            阅读文章
                        </Link>
                        <span className="text-xs font-mono opacity-50">
                            发布: {formatDate(article.date)} // {formatReadTime(article.readTime)}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}
