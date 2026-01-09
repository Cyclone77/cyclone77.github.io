import { useState, useEffect } from 'react';
import { Article } from '../data/mockData';
import { fetchArticles } from '../services/api';
import HorizontalScrollContainer from '../components/HorizontalScrollContainer';
import ArticleCard from '../components/ArticleCard';
import RadialMenu from '../components/RadialMenu';

/**
 * HomePage - Brutalist horizontal scroll layout
 * Features:
 * - Full viewport horizontal scroll
 * - Article cards with duotone images
 * - Fixed radial menu
 * Requirements: 3.1, 4.4
 */
export default function HomePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles().then(data => {
            setArticles(data.articles);
            setLoading(false);
        });
    }, []);

    const radialMenuItems = [
        { icon: 'home', label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { icon: 'terminal', label: 'Terminal', onClick: () => console.log('Terminal') },
        { icon: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
    ];

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="font-mono text-primary animate-pulse">加载中...</div>
            </div>
        );
    }

    return (
        <>
            <main className="h-screen flex items-center pt-20">
                <HorizontalScrollContainer>
                    {articles.map((article, index) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            index={index}
                        />
                    ))}
                </HorizontalScrollContainer>
            </main>

            {/* Fixed widgets */}
            <RadialMenu items={radialMenuItems} />
        </>
    );
}
