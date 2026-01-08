import { useParams, Link } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Article } from '../data/mockData';
import { fetchArticleById, fetchArticles } from '../services/api';
import { Calendar, Clock, MessageCircle } from 'lucide-react';
import Comments from '../components/Comments';
import LazyImage from '../components/LazyImage';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop';
const MONO_FONT = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

// ============ 工具函数 ============

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
    const headings: Array<{ id: string; text: string; level: number }> = [];
    const lines = content.split('\n');

    for (const line of lines) {
        const match = line.match(/^(#{2,3})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].replace(/[*_`#]/g, '').trim();
            headings.push({ id: generateSlug(text), text, level });
        }
    }

    return headings;
}

// ============ 子组件 ============

/** 加载状态 */
function LoadingSpinner() {
    return (
        <div className="w-full max-w-7xl px-4 sm:px-10 py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
}

/** 文章不存在 */
function ArticleNotFound() {
    return (
        <div className="w-full max-w-7xl px-4 sm:px-10 py-20 text-center">
            <h2 className="text-2xl font-bold">文章不存在</h2>
            <Link to="/" className="text-primary hover:underline mt-4 inline-block">
                返回首页
            </Link>
        </div>
    );
}

/** 文章头部信息 */
function ArticleHeader({ article, onCommentClick }: { article: Article; onCommentClick: () => void }) {
    return (
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
                        style={{ backgroundImage: `url(${article.author.avatar})` }}
                    ></div>
                    <div className="flex flex-col">
                        <span className="text-text-primary-light dark:text-white font-bold text-base hover:text-primary cursor-pointer transition-colors">
                            {article.author.name}
                        </span>
                        <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark text-sm">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {article.date}
                            </span>
                            <span className="opacity-30">|</span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {article.readTime}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onCommentClick}
                    className="flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-gray-100 dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 text-sm font-medium"
                >
                    <MessageCircle size={18} />
                    <span>评论</span>
                </button>
            </div>
        </div>
    );
}

/** 文章封面图 */
function ArticleCover({ article }: { article: Article }) {
    return (
        <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden bg-gray-200 dark:bg-surface-dark shadow-xl">
            <LazyImage
                src={article.coverImage || DEFAULT_COVER}
                alt={article.title}
                fallback={DEFAULT_COVER}
                className="w-full h-full hover:scale-105 transition-transform duration-1000"
            />
        </div>
    );
}


/** Markdown 渲染组件配置 */
const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-xl !my-6 shadow-2xl"
                customStyle={{ fontFamily: MONO_FONT }}
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code
                className={`${className} bg-gray-100 dark:bg-surface-dark px-1.5 py-0.5 rounded text-primary font-medium`}
                style={{ fontFamily: MONO_FONT }}
                {...props}
            >
                {children}
            </code>
        );
    },
    h2: ({ children }: any) => {
        const text = String(children).replace(/[*_`#]/g, '').trim();
        const id = generateSlug(text);
        return (
            <h2 id={id} className="text-3xl font-bold text-text-primary-light dark:text-white mt-12 mb-6 pb-2 border-b border-gray-100 dark:border-border-dark scroll-mt-24">
                {children}
            </h2>
        );
    },
    h3: ({ children }: any) => {
        const text = String(children).replace(/[*_`#]/g, '').trim();
        const id = generateSlug(text);
        return (
            <h3 id={id} className="text-2xl font-bold text-text-primary-light dark:text-white mt-8 mb-4 scroll-mt-24">
                {children}
            </h3>
        );
    },
    p: ({ children }: any) => (
        <p className="text-lg leading-relaxed text-gray-700 dark:text-[#c4cfde] mb-6">{children}</p>
    ),
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary bg-primary/5 px-4 py-3 rounded-r-lg my-6 not-italic text-text-primary-light dark:text-white [&>p]:mb-0">
            {children}
        </blockquote>
    ),
    ul: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700 dark:text-[#c4cfde]">{children}</ul>
    ),
    ol: ({ children }: any) => (
        <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700 dark:text-[#c4cfde]">{children}</ol>
    ),
    table: ({ children }: any) => (
        <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-200 dark:border-border-dark rounded-lg overflow-hidden">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }: any) => <thead className="bg-gray-100 dark:bg-surface-dark">{children}</thead>,
    tbody: ({ children }: any) => <tbody className="divide-y divide-gray-200 dark:divide-border-dark">{children}</tbody>,
    tr: ({ children }: any) => <tr className="hover:bg-gray-50 dark:hover:bg-surface-dark/50 transition-colors">{children}</tr>,
    th: ({ children }: any) => (
        <th className="px-4 py-3 text-left text-sm font-bold text-text-primary-light dark:text-white border-b border-gray-200 dark:border-border-dark">
            {children}
        </th>
    ),
    td: ({ children }: any) => <td className="px-4 py-3 text-sm text-gray-700 dark:text-[#c4cfde]">{children}</td>,
};

/** 文章内容 */
function ArticleContent({ content }: { content: string }) {
    return (
        <div className="article-content prose prose-lg dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content || ''}
            </ReactMarkdown>
        </div>
    );
}

/** 文章标签 */
function ArticleTags({ tags }: { tags?: string[] }) {
    if (!tags?.length) return null;

    return (
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-border-dark">
            {tags.map(tag => (
                <Link
                    key={tag}
                    to={`/tag/${tag}`}
                    className="flex h-9 items-center justify-center rounded-full bg-gray-100 dark:bg-surface-dark px-5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-all border border-transparent hover:border-primary/20"
                >
                    #{tag}
                </Link>
            ))}
        </div>
    );
}

/** 上一篇/下一篇导航 */
function ArticleNavigation({ prevArticle, nextArticle }: { prevArticle: Article | null; nextArticle: Article | null }) {
    if (!prevArticle && !nextArticle) return null;

    return (
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-border-dark">
            {prevArticle ? (
                <Link
                    to={`/article/${prevArticle.id}`}
                    className="flex-1 group p-4 rounded-xl bg-gray-50 dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-border-dark transition-colors"
                >
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined !text-[16px]">arrow_back</span>
                        上一篇
                    </span>
                    <p className="text-sm font-medium text-text-primary-light dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                        {prevArticle.title}
                    </p>
                </Link>
            ) : (
                <div className="flex-1" />
            )}
            {nextArticle ? (
                <Link
                    to={`/article/${nextArticle.id}`}
                    className="flex-1 group p-4 rounded-xl bg-gray-50 dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-border-dark transition-colors text-right"
                >
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center justify-end gap-1 mb-2">
                        下一篇
                        <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                    </span>
                    <p className="text-sm font-medium text-text-primary-light dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                        {nextArticle.title}
                    </p>
                </Link>
            ) : (
                <div className="flex-1" />
            )}
        </div>
    );
}


/** 目录导航 */
function TableOfContents({
    headings,
    activeHeading,
    onHeadingClick,
}: {
    headings: Array<{ id: string; text: string; level: number }>;
    activeHeading: string;
    onHeadingClick: (id: string) => void;
}) {
    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-border-dark shadow-sm">
            <h4 className="text-sm font-bold text-text-primary-light dark:text-white mb-3">本页内容</h4>
            {headings.length > 0 ? (
                <ul className="flex flex-col gap-1">
                    {headings.map(({ id, text, level }) => (
                        <li key={id}>
                            <button
                                onClick={() => onHeadingClick(id)}
                                className={`block text-left w-full text-xs leading-tight transition-colors ${
                                    level === 3 ? 'pl-6 ml-2' : 'pl-2'
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
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">暂无目录</p>
            )}
        </div>
    );
}

/** 订阅卡片 */
function SubscribeCard() {
    return (
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
    );
}

/** 相关文章 */
function RelatedArticles({ articles }: { articles: Article[] }) {
    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-text-primary-light dark:text-white">相关文章</h4>
            {articles.length > 0 ? (
                articles.map(item => (
                    <Link key={item.id} to={`/article/${item.id}`} className="group flex gap-3 items-start">
                        <div
                            className="w-20 h-14 rounded-lg bg-cover bg-center shrink-0 group-hover:opacity-80 transition-opacity bg-gray-300 dark:bg-surface-dark"
                            style={{ backgroundImage: `url(${item.coverImage || DEFAULT_COVER})` }}
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
    );
}

/** 侧边栏 */
function Sidebar({
    headings,
    activeHeading,
    relatedArticles,
    onHeadingClick,
}: {
    headings: Array<{ id: string; text: string; level: number }>;
    activeHeading: string;
    relatedArticles: Article[];
    onHeadingClick: (id: string) => void;
}) {
    return (
        <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-24 flex flex-col gap-6">
                <TableOfContents headings={headings} activeHeading={activeHeading} onHeadingClick={onHeadingClick} />
                <SubscribeCard />
                <RelatedArticles articles={relatedArticles} />
            </div>
        </aside>
    );
}


// ============ 主组件 ============

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeHeading, setActiveHeading] = useState<string>('');
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [prevArticle, setPrevArticle] = useState<Article | null>(null);
    const [nextArticle, setNextArticle] = useState<Article | null>(null);

    // 获取文章数据
    useEffect(() => {
        if (id) {
            fetchArticleById(Number(id)).then(data => {
                setArticle(data);
                setLoading(false);
            });
        }
    }, [id]);

    // 获取相关文章和上下篇
    useEffect(() => {
        if (!article) return;

        fetchArticles().then(({ articles }) => {
            const sortedArticles = [...articles].sort(
                (a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
            );

            const currentIndex = sortedArticles.findIndex(a => a.id === article.id);

            setPrevArticle(currentIndex > 0 ? sortedArticles[currentIndex - 1] : null);
            setNextArticle(currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null);

            if (article.categories?.length) {
                const related = articles
                    .filter(a => a.id !== article.id && a.categories?.some(cat => article.categories?.includes(cat)))
                    .slice(0, 3);
                setRelatedArticles(related);
            }
        });
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
            entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id);
                        break;
                    }
                }
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (headingId: string) => {
        const element = document.getElementById(headingId);
        if (element) {
            const offset = 100;
            const top = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    const scrollToComments = () => {
        document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return <LoadingSpinner />;
    if (!article) return <ArticleNotFound />;

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-10 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* 文章主体 */}
                <article className="lg:col-span-8 flex flex-col gap-8 bg-surface-light dark:bg-surface-dark rounded-2xl p-6 md:p-10 border border-gray-100 dark:border-border-dark">
                    <ArticleHeader article={article} onCommentClick={scrollToComments} />
                    <ArticleCover article={article} />
                    <ArticleContent content={article.content || ''} />
                    <ArticleTags tags={article.tags} />
                    <ArticleNavigation prevArticle={prevArticle} nextArticle={nextArticle} />

                    {/* 评论区 */}
                    <div id="comments-section">
                        {article.number && <Comments issueNumber={article.number} issueUrl={article.url} />}
                    </div>
                </article>

                {/* 侧边栏 */}
                <Sidebar
                    headings={headings}
                    activeHeading={activeHeading}
                    relatedArticles={relatedArticles}
                    onHeadingClick={scrollToHeading}
                />
            </div>
        </div>
    );
}
