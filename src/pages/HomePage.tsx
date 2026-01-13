import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Article } from '../data/mockData';
import { fetchArticles } from '../services/api';
import HorizontalScrollContainer from '../components/HorizontalScrollContainer';
import ArticleCard from '../components/ArticleCard';

/**
 * HomePage - Brutalist horizontal scroll layout
 * Features:
 * - Full viewport horizontal scroll
 * - Article cards with duotone images
 * - Tag filtering via URL parameter
 * Requirements: 3.1, 4.4
 */
export default function HomePage() {
    const [searchParams] = useSearchParams();
    const tagFilter = searchParams.get('tag');
    
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles().then(data => {
            setArticles(data.articles);
            setLoading(false);
        });
    }, []);

    // 根据 tag 参数筛选文章
    // 同时检查 tags 和 categories 字段，因为标签云中的标签可能来自分类
    useEffect(() => {
        if (tagFilter) {
            const filtered = articles.filter(article => {
                const tagMatch = article.tags?.some(tag => 
                    tag.toLowerCase() === tagFilter.toLowerCase()
                );
                const categoryMatch = article.categories?.some(cat => 
                    cat.toLowerCase() === tagFilter.toLowerCase()
                );
                // 兼容旧的 category 字段
                const oldCategoryMatch = article.category?.toLowerCase() === tagFilter.toLowerCase();
                return tagMatch || categoryMatch || oldCategoryMatch;
            });
            setFilteredArticles(filtered);
        } else {
            setFilteredArticles(articles);
        }
    }, [articles, tagFilter]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="font-mono text-primary animate-pulse">加载中...</div>
            </div>
        );
    }

    return (
        <main className="relative h-screen flex items-center pt-20">
            {/* 标签筛选提示 - 绝对定位在顶部 */}
            {tagFilter && (
                <div className="
                    absolute top-24 left-1/2 -translate-x-1/2 z-10
                    px-4 py-2 font-mono text-sm
                    bg-black text-[#00FF41]
                    border-2 border-[#00FF41]
                    dark:bg-black dark:text-[#00FF41] dark:border-[#00FF41]
                ">
                    筛选标签: #{tagFilter}
                    {filteredArticles.length === 0 && ' (无匹配文章)'}
                </div>
            )}
            <HorizontalScrollContainer>
                {filteredArticles.map((article, index) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        index={index}
                    />
                ))}
            </HorizontalScrollContainer>
        </main>
    );
}
