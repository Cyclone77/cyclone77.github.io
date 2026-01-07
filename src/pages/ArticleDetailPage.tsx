import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Article } from '../data/mockData';
import { fetchArticleById } from '../services/api';
import { Calendar, Clock, Bookmark, Share2 } from 'lucide-react';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop';

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (id) {
            fetchArticleById(Number(id)).then(data => {
                setArticle(data);
                setLoading(false);
            });
        }
    }, [id]);

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
                <article className="lg:col-span-8 flex flex-col gap-8">
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
                                h2: ({ children }) => (
                                    <h2 className="text-3xl font-bold text-text-primary-light dark:text-white mt-12 mb-6 pb-2 border-b border-gray-100 dark:border-border-dark">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-2xl font-bold text-text-primary-light dark:text-white mt-8 mb-4">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-lg leading-relaxed text-gray-700 dark:text-[#c4cfde] mb-6">
                                        {children}
                                    </p>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-primary bg-primary/5 p-8 rounded-r-2xl my-8 not-italic italic font-medium text-text-primary-light dark:text-white">
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
                            }}
                        >
                            {article.content || ''}
                        </ReactMarkdown>
                    </div>

                    <div className="flex flex-wrap gap-3 py-10 border-t border-gray-100 dark:border-border-dark mt-10">
                        {article.tags?.map(tag => (
                            <Link
                                key={tag}
                                to={`/tag/${tag}`}
                                className="flex h-9 items-center justify-center rounded-full bg-gray-100 dark:bg-surface-dark px-5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-all border border-transparent hover:border-primary/20"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>

                    <div className="h-px w-full bg-gray-200 dark:bg-border-dark my-4"></div>

                    <section className="flex flex-col gap-8">
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

                <aside className="lg:col-span-4 flex flex-col gap-8">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-border-dark shadow-sm">
                            <h4 className="text-lg font-bold text-text-primary-light dark:text-white mb-4">本页内容</h4>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <a
                                        href="#"
                                        className="block text-primary font-medium pl-3 border-l-2 border-primary"
                                    >
                                        介绍
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors pl-3 border-l-2 border-transparent"
                                    >
                                        为什么需要服务器组件？
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors pl-3 border-l-2 border-transparent"
                                    >
                                        实现示例
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors pl-3 border-l-2 border-transparent"
                                    >
                                        结论
                                    </a>
                                </li>
                            </ul>
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
                            {[
                                { title: 'React 18 并发性解释', readTime: '5 分钟阅读' },
                                { title: '精通 Next.js 中间件', readTime: '12 分钟阅读' },
                                { title: 'CSS Grid vs Flexbox：何时使用？', readTime: '7 分钟阅读' },
                            ].map((item, index) => (
                                <a key={index} href="#" className="group flex gap-3 items-start">
                                    <div
                                        className="w-20 h-14 rounded-lg bg-cover bg-center shrink-0 group-hover:opacity-80 transition-opacity bg-gray-300 dark:bg-surface-dark"
                                        style={{
                                            backgroundImage: `url(https://images.unsplash.com/photo-${1633356122544 + index}?w=200&auto=format&fit=crop)`,
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
                                </a>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
