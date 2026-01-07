import { useParams, Link } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Article } from '../data/mockData';
import { fetchArticleById, fetchArticles } from '../services/api';
import { Calendar, Clock, Bookmark, Share2 } from 'lucide-react';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop';

// 生成 slug（用于 id）
function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// 从 Markdown 内容提取标题
function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
    const headings: Array<{ id: string; text: string; level: number }> = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
        const match = line.match(/^(#{2,3})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].replace(/[*_`#]/g, '').trim();
            headings.push({
                id: generateSlug(text),
                text,
                level,
            });
        }
    }
    
    return headings;
}

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [activeHeading, setActiveHeading] = useState<string>('');
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

    useEffect(() => {
        if (id) {
            fetchArticleById(Number(id)).then(data => {
                setArticle(data);
                setLoading(false);
            });
        }
    }, [id]);

    // 获取相关文章（分类相同的其他文章）
    useEffect(() => {
        if (article?.categories && article.categories.length > 0) {
            fetchArticles().then(({ articles }) => {
                const related = articles
                    .filter(a => 
                        a.id !== article.id && 
                        a.categories?.some(cat => article.categories?.includes(cat))
                    )
                    .slice(0, 3);
                setRelatedArticles(related);
            });
        }
    }, [article]);

    // 提取文章标题
    const headings = useMemo(() => {
        if (!article?.content) return [];
        return extractHeadings(article.content);
    }, [article?.content]);

    // 监听滚动，更新当前激活的标题
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id);
                        break;
                    }
                }
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        // 观察所有标题元素
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    // 点击导航滚动到对应位置
    const scrollToHeading = (headingId: string) => {
        const element = document.getElementById(headingId);
        if (element) {
            const offset = 100;
            const top = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl px-4 sm:px-10 py-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="w-full max-w-7xl px-4 sm:px-10 py-20 text-center">
                <h2 className="text-2xl font-bold">文章不存在</h2>
                <Link to="/" className="text-primary hover:underline mt-4 inline-block">
                    返回首页
                </Link>
            </div>
        );
    }

    const publishDate = article.date;

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-10 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <article className="lg:col-span-8 flex flex-col gap-8 bg-surface-light dark:bg-surface-dark rounded-2xl p-6 md:p-10 border border-gray-100 dark:border-border-dark">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-[-0.02em] text-text-primary-light dark:text-white">
                            {article.title}
                        </h1>

                        <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                            {article.description}
                        </p>

                        <div className="flex items-center justify-between border-y border-gray-200 dark:border-border-dark py-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="size-12 rounded-full bg-center bg-cover shadow-sm ring-2 ring-gray-100 dark:ring-border-dark"
                                    style={{
                                        backgroundImage: `url(${article.author.avatar})`,
                                    }}
                                ></div>
                                <div className="flex flex-col">
                                    <span className="text-text-primary-light dark:text-white font-bold text-base hover:text-primary cursor-pointer transition-colors">
                                        {article.author.name}
                                    </span>
                                    <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {publishDate}
                                        </span>
                                        <span className="opacity-30">|</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {article.readTime}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20">
                                    <Bookmark size={20} />
                                </button>
                                <button className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden bg-gray-200 dark:bg-surface-dark shadow-xl">
                        <div
                            className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-1000"
                            style={{
                                backgroundImage: `url(${article.coverImage || DEFAULT_COVER})`,
                            }}
                        ></div>
                    </div>

                    {/* 使用 ReactMarkdown 解析内容并支持代码高亮 */}
                    <div className="article-content prose prose-lg dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-xl !my-6 shadow-2xl"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code
                                            className={`${className} bg-gray-100 dark:bg-surface-dark px-1.5 py-0.5 rounded text-primary font-medium`}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },
                                // 自定义渲染其他 Markdown 元素以匹配样式
                                h2: ({ children }) => {
                                    const text = String(children).replace(/[*_`#]/g, '').trim();
                                    const id = generateSlug(text);
                                    return (
                                        <h2 id={id} className="text-3xl font-bold text-text-primary-light dark:text-white mt-12 mb-6 pb-2 border-b border-gray-100 dark:border-border-dark scroll-mt-24">
                                            {children}
                                        </h2>
                                    );
                                },
                                h3: ({ children }) => {
                                    const text = String(children).replace(/[*_`#]/g, '').trim();
                                    const id = generateSlug(text);
                                    return (
                                        <h3 id={id} className="text-2xl font-bold text-text-primary-light dark:text-white mt-8 mb-4 scroll-mt-24">
                                            {children}
                                        </h3>
                                    );
                                },
                                p: ({ children }) => (
                                    <p className="text-lg leading-relaxed text-gray-700 dark:text-[#c4cfde] mb-6">
                                        {children}
                                    </p>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-primary bg-primary/5 px-4 py-3 rounded-r-lg my-6 not-italic text-text-primary-light dark:text-white [&>p]:mb-0">
                                        {children}
                                    </blockquote>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700 dark:text-[#c4cfde]">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700 dark:text-[#c4cfde]">
                                        {children}
                                    </ol>
                                ),
                                table: ({ children }) => (
                                    <div className="overflow-x-auto my-6">
                                        <table className="min-w-full border-collapse border border-gray-200 dark:border-border-dark rounded-lg overflow-hidden">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                thead: ({ children }) => (
                                    <thead className="bg-gray-100 dark:bg-surface-dark">
                                        {children}
                                    </thead>
                                ),
                                tbody: ({ children }) => (
                                    <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
                                        {children}
                                    </tbody>
                                ),
                                tr: ({ children }) => (
                                    <tr className="hover:bg-gray-50 dark:hover:bg-surface-dark/50 transition-colors">
                                        {children}
                                    </tr>
                                ),
                                th: ({ children }) => (
                                    <th className="px-4 py-3 text-left text-sm font-bold text-text-primary-light dark:text-white border-b border-gray-200 dark:border-border-dark">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-[#c4cfde]">
                                        {children}
                                    </td>
                                ),
                            }}
                        >
                            {article.content || ''}
                        </ReactMarkdown>
                    </div>

                    {/* 标签区域 - 只在有标签时显示 */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-border-dark">
                            {article.tags.map(tag => (
                                <Link
                                    key={tag}
                                    to={`/tag/${tag}`}
                                    className="flex h-9 items-center justify-center rounded-full bg-gray-100 dark:bg-surface-dark px-5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-all border border-transparent hover:border-primary/20"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* 评论区 */}
                    <section className="flex flex-col gap-6 pt-6 border-t border-gray-100 dark:border-border-dark">
                        <h3 className="text-2xl font-bold text-text-primary-light dark:text-white">评论 (12)</h3>

                        <div className="flex gap-4">
                            <div
                                className="size-10 rounded-full bg-center bg-cover shrink-0"
                                style={{ backgroundImage: 'url(https://api.dicebear.com/7.x/avataaars/svg?seed=User)' }}
                            ></div>
                            <div className="flex flex-col flex-1 gap-3">
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="w-full min-h-[100px] rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark p-4 text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-0 resize-y"
                                    placeholder="分享您的想法..."
                                ></textarea>
                                <div className="flex justify-end">
                                    <button className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                        发表评论
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mt-4">
                            {[
                                {
                                    name: 'Sarah Jenkins',
                                    time: '2 小时前',
                                    text: '很好的解释！我一直在努力理解客户端和服务器组件之间的界限。代码片段让我明白了。',
                                    likes: 14,
                                },
                                {
                                    name: 'Marcus Dev',
                                    time: '5 小时前',
                                    text: '一个问题 - 这如何处理身份验证？我们是向下传递会话还是直接在组件中访问它？',
                                    likes: 5,
                                },
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div
                                        className="size-10 rounded-full bg-center bg-cover shrink-0"
                                        style={{
                                            backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name})`,
                                        }}
                                    ></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-text-primary-light dark:text-white">
                                                {item.name}
                                            </span>
                                            <span className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                                • {item.time}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-[#c4cfde] leading-relaxed">{item.text}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <button className="flex items-center gap-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium">
                                                <span className="material-symbols-outlined text-[18px]">thumb_up</span>{' '}
                                                {item.likes}
                                            </button>
                                            <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium">
                                                回复
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </article>

                <aside className="lg:col-span-4 flex flex-col gap-6">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-border-dark shadow-sm">
                            <h4 className="text-sm font-bold text-text-primary-light dark:text-white mb-3">本页内容</h4>
                            {headings.length > 0 ? (
                                <ul className="flex flex-col gap-1">
                                    {headings.map(({ id, text, level }) => (
                                        <li key={id}>
                                            <button
                                                onClick={() => scrollToHeading(id)}
                                                className={`block text-left w-full text-xs leading-tight transition-colors ${
                                                    level === 3 ? 'pl-4' : 'pl-2'
                                                } border-l-2 py-0.5 ${
                                                    activeHeading === id
                                                        ? 'text-primary font-medium border-primary'
                                                        : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white border-transparent'
                                                }`}
                                            >
                                                {text}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                                    暂无目录
                                </p>
                            )}
                        </div>

                        <div className="bg-gradient-to-br from-[#1e2329] to-[#10151a] rounded-2xl p-6 border border-border-dark relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 size-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
                            <h4 className="text-lg font-bold text-white mb-2 relative z-10">每周精选</h4>
                            <p className="text-sm text-text-secondary-dark mb-4 relative z-10">
                                获取最新的前端工程文章，直接送到您的收件箱。
                            </p>
                            <div className="flex flex-col gap-3 relative z-10">
                                <input
                                    type="email"
                                    className="bg-background-dark/50 border border-border-dark rounded-lg px-4 py-2 text-sm text-white placeholder:text-text-secondary-dark focus:border-primary focus:ring-0"
                                    placeholder="your@email.com"
                                />
                                <button className="bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                                    订阅
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="text-lg font-bold text-text-primary-light dark:text-white">相关文章</h4>
                            {relatedArticles.length > 0 ? (
                                relatedArticles.map((item) => (
                                    <Link key={item.id} to={`/article/${item.id}`} className="group flex gap-3 items-start">
                                        <div
                                            className="w-20 h-14 rounded-lg bg-cover bg-center shrink-0 group-hover:opacity-80 transition-opacity bg-gray-300 dark:bg-surface-dark"
                                            style={{
                                                backgroundImage: `url(${item.coverImage || DEFAULT_COVER})`,
                                            }}
                                        ></div>
                                        <div className="flex flex-col">
                                            <h5 className="text-sm font-bold text-text-primary-light dark:text-white group-hover:text-primary transition-colors leading-snug">
                                                {item.title}
                                            </h5>
                                            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                                {item.readTime}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">暂无相关文章</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
