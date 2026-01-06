import { useState } from 'react';
import { Link } from 'react-router';
import { mockArticles, featuredArticle } from '../data/mockData';

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const categories = ['全部', '前端开发', '后端开发', 'DevOps', 'AI/ML'];

    return (
        <div className="w-full max-w-7xl px-4 sm:px-10 py-8 flex flex-col gap-10">
            <section className="@container">
                <div className="flex flex-col gap-6 rounded-2xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm border border-gray-100 dark:border-border-dark md:flex-row md:items-center md:gap-10 md:p-10">
                    <div
                        className="w-full md:w-1/2 aspect-video rounded-xl bg-center bg-cover bg-no-repeat shadow-md overflow-hidden relative group"
                        style={{ backgroundImage: `url(${featuredArticle.coverImage})` }}
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>

                    <div className="flex flex-col gap-6 md:w-1/2 justify-center">
                        <div className="flex flex-col gap-3 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold uppercase tracking-wide">
                                    精选
                                </span>
                                <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                                    {featuredArticle.readTime}
                                </span>
                            </div>

                            <h1 className="font-display text-text-primary-light dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                                {featuredArticle.title}
                            </h1>

                            <h2 className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-relaxed">
                                {featuredArticle.description}
                            </h2>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Link
                                to={`/article/${featuredArticle.id}`}
                                className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-lg shadow-primary/25"
                            >
                                <span>阅读文章</span>
                            </Link>

                            <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-transparent border border-gray-300 dark:border-[#3e4851] hover:bg-gray-100 dark:hover:bg-border-dark text-text-primary-light dark:text-white text-base font-medium transition-all">
                                <span>收藏</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-border-dark mb-6 gap-4">
                        <h1 className="font-display text-text-primary-light dark:text-white text-2xl md:text-3xl font-bold leading-tight">
                            最新文章
                        </h1>

                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`whitespace-nowrap flex h-8 items-center px-4 rounded-full text-sm font-medium transition-colors ${
                                        selectedCategory === category
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-border-dark hover:bg-gray-200 dark:hover:bg-[#323b46] text-text-secondary-light dark:text-text-secondary-dark'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {mockArticles.map(article => (
                            <Link
                                key={article.id}
                                to={`/article/${article.id}`}
                                className="group relative flex flex-col sm:flex-row gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-border-dark transition-all hover:shadow-md cursor-pointer"
                            >
                                <div
                                    className="sm:w-48 h-48 sm:h-auto shrink-0 rounded-lg bg-cover bg-center overflow-hidden"
                                    style={{ backgroundImage: `url(${article.coverImage})` }}
                                >
                                    <div className="w-full h-full bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                </div>

                                <div className="flex flex-1 flex-col justify-between py-1">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`${article.categoryColor} text-xs font-bold uppercase tracking-wider`}
                                            >
                                                {article.category}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                            <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                                                {article.date}
                                            </span>
                                        </div>

                                        <h3 className="font-display text-text-primary-light dark:text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>

                                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm line-clamp-2">
                                            {article.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full bg-gray-600 bg-center bg-cover"
                                                style={{ backgroundImage: `url(${article.author.avatar})` }}
                                            ></div>
                                            <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium">
                                                {article.author.name}
                                            </span>
                                        </div>

                                        <span className="flex items-center text-primary text-xs font-bold group-hover:translate-x-1 transition-transform">
                                            阅读更多{' '}
                                            <span className="material-symbols-outlined !text-[16px] ml-1">
                                                arrow_forward
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 flex justify-center">
                        <nav className="flex items-center gap-2">
                            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-border-dark disabled:opacity-50">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold">
                                1
                            </button>
                            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-border-dark text-text-primary-light dark:text-white hover:bg-gray-100 dark:hover:bg-border-dark">
                                2
                            </button>
                            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-border-dark text-text-primary-light dark:text-white hover:bg-gray-100 dark:hover:bg-border-dark">
                                3
                            </button>
                            <span className="text-text-secondary-light dark:text-text-secondary-dark px-2">...</span>
                            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-border-dark">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </nav>
                    </div>
                </div>

                <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-8">
                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-border-dark">
                        <h3 className="font-display text-text-primary-light dark:text-white text-lg font-bold mb-4">
                            热门标签
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {['ReactJS', 'Python', '云原生', '安全', 'TypeScript', 'GraphQL'].map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 rounded-lg bg-background-light dark:bg-[#111418] border border-gray-200 dark:border-[#323b46] text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary cursor-pointer transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                        <div className="flex items-center gap-2 mb-3 text-primary">
                            <span className="material-symbols-outlined">mail</span>
                            <h3 className="font-display text-lg font-bold">每周精选</h3>
                        </div>

                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4">
                            每周一将最佳技术文章送到您的收件箱。无垃圾邮件，只有代码。
                        </p>

                        <input
                            type="email"
                            className="w-full rounded-lg bg-white dark:bg-[#111418] border-none text-sm px-4 py-2.5 mb-3 focus:ring-2 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-gray-600 text-text-primary-light dark:text-white"
                            placeholder="your@example.com"
                        />

                        <button className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors">
                            订阅
                        </button>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-border-dark">
                        <h3 className="font-display text-text-primary-light dark:text-white text-lg font-bold mb-4">
                            热门文章
                        </h3>

                        <div className="flex flex-col gap-4">
                            {[
                                { title: '2024 年 WebAssembly 的未来', date: '1月12日', readTime: '4 分钟阅读' },
                                { title: '从 AWS 迁移到 GCP：经验教训', date: '1月8日', readTime: '8 分钟阅读' },
                                { title: '理解 Rust 所有权', date: '1月5日', readTime: '10 分钟阅读' },
                            ].map((item, index) => (
                                <a key={index} href="#" className="group flex gap-3 items-start">
                                    <span className="text-gray-300 dark:text-gray-600 font-display font-bold text-xl leading-none">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex flex-col">
                                        <p className="text-text-primary-light dark:text-white text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                                            {item.title}
                                        </p>
                                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                            {item.date} • {item.readTime}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
