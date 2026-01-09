import DuotoneImage from './DuotoneImage';

interface ArticleSidebarProps {
    article: {
        title: string;
        coverImage?: string;
        date: string;
        author: { name: string };
        categories?: string[];
        tags?: string[];
    };
}

/**
 * ArticleSidebar - Dark sidebar for article detail page
 * Features:
 * - Cover image with duotone filter (2/3 height)
 * - Gradient overlay fading to dark
 * - Metadata grid with Matrix Green text
 * - Security status footer
 * Requirements: 5.2, 5.3, 5.4, 5.5, 5.6
 */
export default function ArticleSidebar({ article }: ArticleSidebarProps) {
    // Format date: 2026.01.06
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    const allTags = [...(article.categories || []), ...(article.tags || [])];

    return (
        <>
            {/* Cover Image Section - 2/3 height */}
            <div className="relative h-1/2 lg:h-2/3 overflow-hidden">
                <DuotoneImage
                    src={article.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            </div>

            {/* Metadata Section */}
            <div className="p-6 lg:p-10 flex-1 flex flex-col justify-end">
                <div className="font-mono text-primary mb-6">
                    <div className="text-xs uppercase tracking-[0.2em] mb-2 opacity-60">
                        // 元数据
                    </div>
                    <div className="grid grid-cols-2 gap-y-4" data-testid="sidebar-metadata">
                        <div>
                            <span className="block text-[10px] opacity-50">发布日期</span>
                            <span className="text-sm font-bold">{formatDate(article.date)}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] opacity-50">作者</span>
                            <span className="text-sm font-bold">{article.author.name}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-[10px] opacity-50">标签分类</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {allTags.length > 0 ? (
                                    allTags.slice(0, 5).map(tag => (
                                        <span
                                            key={tag}
                                            className="text-[10px] border border-primary px-2 py-0.5"
                                        >
                                            #{tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] opacity-50">暂无标签</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Status Footer */}
                <div className="font-mono text-[10px] text-white/30 border-t border-white/10 pt-4">
                    安全连接: TLS_1.3_AES_256
                </div>
            </div>
        </>
    );
}
