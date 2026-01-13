import { useParams, Link } from 'react-router';
import { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Article } from '../data/mockData';
import { fetchArticleById, fetchArticles } from '../services/api';
import SplitLayout from '../components/SplitLayout';
import ArticleSidebar from '../components/ArticleSidebar';
import ReadingProgressBar from '../components/ReadingProgressBar';
import MindMapOverlay from '../components/MindMapOverlay';
import BrutalistCodeBlock from '../components/BrutalistCodeBlock';
import RadialMenu from '../components/RadialMenu';
import Comments from '../components/Comments';

// ============ Utility Functions ============

function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
    const headings: Array<{ id: string; text: string; level: number }> = [];
    const lines = content.split('\n');
    let h2Counter = 0;

    for (const line of lines) {
        // 只提取 h2 用于思维导图导航
        const match = line.match(/^(#{2})\s+(.+)$/);
        if (match) {
            h2Counter++;
            const text = match[2].replace(/[*_`#]/g, '').trim();
            headings.push({
                id: `section-${String(h2Counter).padStart(2, '0')}`,
                text,
                level: 2,
            });
        }
    }

    return headings;
}

// ============ Markdown Components (GitHub Style) ============

const createMarkdownComponents = (sectionCounter: { current: number }) => ({
    code({ inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        const code = String(children).replace(/\n$/, '');
        
        if (!inline && match) {
            return (
                <BrutalistCodeBlock
                    code={code}
                    language={match[1]}
                />
            );
        }
        
        // GitHub 风格的行内代码
        return (
            <code
                className="font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 text-[85%] rounded-md"
                {...props}
            >
                {children}
            </code>
        );
    },
    h1: ({ children }: any) => (
        <h1 className="text-[2em] font-semibold mt-6 mb-4 pb-[0.3em] border-b border-zinc-300 dark:border-zinc-700 text-black dark:text-white leading-[1.25]">
            {children}
        </h1>
    ),
    h2: ({ children }: any) => {
        sectionCounter.current++;
        const sectionNum = String(sectionCounter.current).padStart(2, '0');
        const id = `section-${sectionNum}`;
        
        return (
            <h2
                id={id}
                className="text-[1.5em] font-semibold mt-6 mb-4 pb-[0.3em] border-b border-zinc-300 dark:border-zinc-700 scroll-mt-16 text-black dark:text-white leading-[1.25]"
            >
                {children}
            </h2>
        );
    },
    h3: ({ children }: any) => (
        <h3 className="text-[1.25em] font-semibold mt-6 mb-4 text-black dark:text-white leading-[1.25]">{children}</h3>
    ),
    h4: ({ children }: any) => (
        <h4 className="text-[1em] font-semibold mt-6 mb-4 text-black dark:text-white leading-[1.25]">{children}</h4>
    ),
    h5: ({ children }: any) => (
        <h5 className="text-[0.875em] font-semibold mt-6 mb-4 text-black dark:text-white leading-[1.25]">{children}</h5>
    ),
    h6: ({ children }: any) => (
        <h6 className="text-[0.85em] font-semibold mt-6 mb-4 text-zinc-600 dark:text-zinc-400 leading-[1.25]">{children}</h6>
    ),
    p: ({ children }: any) => (
        <p className="text-base text-zinc-800 dark:text-zinc-200 mb-4 mt-0 leading-[1.6]">{children}</p>
    ),
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-[0.25em] border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 px-4 my-4 [&>p]:mb-0 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {children}
        </blockquote>
    ),
    ul: ({ children }: any) => (
        <ul className="list-disc pl-[2em] mb-4 mt-0 text-zinc-800 dark:text-zinc-200">{children}</ul>
    ),
    ol: ({ children }: any) => (
        <ol className="list-decimal pl-[2em] mb-4 mt-0 text-zinc-800 dark:text-zinc-200">{children}</ol>
    ),
    li: ({ children }: any) => (
        <li className="text-base leading-[1.6] text-zinc-800 dark:text-zinc-200 mt-1">{children}</li>
    ),
    table: ({ children }: any) => (
        <div className="overflow-x-auto my-4">
            <table className="border-collapse border-spacing-0 w-full text-sm">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }: any) => (
        <thead className="text-zinc-800 dark:text-zinc-200">{children}</thead>
    ),
    tbody: ({ children }: any) => (
        <tbody className="text-zinc-800 dark:text-zinc-200">{children}</tbody>
    ),
    tr: ({ children }: any) => (
        <tr className="border-t border-zinc-300 dark:border-zinc-700 even:bg-zinc-50 dark:even:bg-zinc-800/50">{children}</tr>
    ),
    th: ({ children }: any) => (
        <th className="px-3 py-2 text-left font-semibold border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">{children}</th>
    ),
    td: ({ children }: any) => (
        <td className="px-3 py-2 border border-zinc-300 dark:border-zinc-700">{children}</td>
    ),
    a: ({ href, children }: any) => (
        <a 
            href={href} 
            className="text-[#0969da] dark:text-[#58a6ff] no-underline hover:underline"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),
    hr: () => (
        <hr className="my-6 h-[0.25em] p-0 bg-zinc-300 dark:bg-zinc-700 border-0" />
    ),
    img: ({ src, alt }: any) => (
        <img 
            src={src} 
            alt={alt || ''} 
            className="max-w-full box-border bg-white dark:bg-zinc-900" 
            style={{ maxWidth: '100%' }}
        />
    ),
    strong: ({ children }: any) => (
        <strong className="font-semibold text-black dark:text-white">{children}</strong>
    ),
    em: ({ children }: any) => (
        <em className="italic">{children}</em>
    ),
    del: ({ children }: any) => (
        <del className="line-through">{children}</del>
    ),
    // GitHub 风格的任务列表
    input: ({ type, checked, ...props }: any) => {
        if (type === 'checkbox') {
            return (
                <input 
                    type="checkbox" 
                    checked={checked} 
                    disabled 
                    className="mr-2 align-middle"
                    {...props}
                />
            );
        }
        return <input type={type} {...props} />;
    },
});

// ============ Sub Components ============

function LoadingState() {
    return (
        <div className="h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="font-mono text-primary animate-pulse">加载中...</div>
        </div>
    );
}

function NotFoundState() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark">
            <h2 className="font-mono text-2xl font-bold mb-4 text-black dark:text-white">错误_404: 文章未找到</h2>
            <Link to="/" className="font-mono text-primary hover:underline">
                返回首页
            </Link>
        </div>
    );
}

function ArticleHeader({ article }: { article: Article }) {
    return (
        <header className="mb-16">
            <div className="font-mono inline-block bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 mb-6">
                类型: 技术文章
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-black dark:text-white mb-8">
                {article.title}
            </h1>
            <div className="w-24 h-4 bg-black dark:bg-primary"></div>
        </header>
    );
}

function ArticleIntro({ description }: { description: string }) {
    return (
        <p className="text-xl font-medium leading-relaxed mb-8 border-l-8 border-black dark:border-primary pl-8 italic text-zinc-800 dark:text-zinc-200">
            {description}
        </p>
    );
}

function ArticleContent({ content }: { content: string }) {
    const sectionCounter = useRef({ current: 0 });
    sectionCounter.current.current = 0; // Reset on each render
    
    const components = useMemo(
        () => createMarkdownComponents(sectionCounter.current),
        []
    );

    return (
        <div className="prose prose-zinc max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content || ''}
            </ReactMarkdown>
        </div>
    );
}

function BackButton() {
    return (
        <Link
            to="/"
            className="fixed top-[120px] right-10 z-[60] w-10 h-10 font-mono bg-primary text-black font-extrabold text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center"
            title="返回首页"
        >
            <span className="material-symbols-outlined font-black text-lg">arrow_back</span>
        </Link>
    );
}

function MindMapToggle({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="fixed top-[120px] right-[90px] z-[60] w-10 h-10 cursor-pointer hidden lg:flex font-mono bg-white dark:bg-zinc-800 text-black dark:text-white font-extrabold text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all items-center justify-center group"
            title="思维导图"
        >
            <span className="material-symbols-outlined font-black text-lg group-hover:text-blue-500 transition-colors">
                hub
            </span>
        </button>
    );
}

function ArticleNavigation({ prevArticle, nextArticle }: { prevArticle: Article | null; nextArticle: Article | null }) {
    if (!prevArticle && !nextArticle) return null;
    
    return (
        <nav className="mt-12 pt-8 border-t border-zinc-300 dark:border-zinc-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {/* 上一篇 */}
                {prevArticle ? (
                    <Link
                        to={`/article/${prevArticle.id}`}
                        className="group flex-1 p-4 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors"
                    >
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            上一篇
                        </div>
                        <div className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
                            {prevArticle.title}
                        </div>
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}
                
                {/* 下一篇 */}
                {nextArticle ? (
                    <Link
                        to={`/article/${nextArticle.id}`}
                        className="group flex-1 p-4 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors text-right"
                    >
                        <div className="flex items-center justify-end gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                            下一篇
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </div>
                        <div className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
                            {nextArticle.title}
                        </div>
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}
            </div>
        </nav>
    );
}

// ============ Main Component ============

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMindMapOpen, setIsMindMapOpen] = useState(false);
    const contentRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (id) {
            Promise.all([
                fetchArticleById(Number(id)),
                fetchArticles()
            ]).then(([articleData, articlesResponse]) => {
                setArticle(articleData);
                setAllArticles(articlesResponse.articles);
                setLoading(false);
            });
        }
    }, [id]);

    // 计算上一篇和下一篇
    const { prevArticle, nextArticle } = useMemo(() => {
        if (!article || allArticles.length === 0) {
            return { prevArticle: null, nextArticle: null };
        }
        const currentIndex = allArticles.findIndex(a => a.id === article.id);
        return {
            prevArticle: currentIndex > 0 ? allArticles[currentIndex - 1] : null,
            nextArticle: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null,
        };
    }, [article, allArticles]);

    const headings = useMemo(() => {
        if (!article?.content) return [];
        return extractHeadings(article.content);
    }, [article?.content]);

    const mindMapNodes = useMemo(() => {
        return headings.map(h => ({
            id: h.id,
            label: h.text,
            type: 'satellite' as const,
            targetId: h.id,
        }));
    }, [headings]);

    const scrollToSection = (targetId: string) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        // 滚动内容区域到顶部
        const mainContent = document.querySelector('main.overflow-y-auto');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const scrollToComments = () => {
        const commentsSection = document.getElementById('comments-section');
        const mainContent = document.querySelector('main.overflow-y-auto');
        if (commentsSection && mainContent) {
            // 计算评论区相对于滚动容器的位置
            const offsetTop = commentsSection.offsetTop - 100;
            mainContent.scrollTo({ top: offsetTop, behavior: 'smooth' });
        } else if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const radialMenuItems = [
        { icon: 'home', label: '返回首页', onClick: () => window.location.href = '/' },
        { icon: 'chat', label: '跳转评论', onClick: scrollToComments },
        { icon: 'arrow_upward', label: '回到顶部', onClick: scrollToTop },
    ];

    if (loading) return <LoadingState />;
    if (!article) return <NotFoundState />;

    return (
        <>
            {/* Reading Progress Bar */}
            <ReadingProgressBar contentRef={contentRef} />

            {/* Mind Map Overlay */}
            <MindMapOverlay
                isOpen={isMindMapOpen}
                onClose={() => setIsMindMapOpen(false)}
                nodes={mindMapNodes}
                centerLabel={article.title.split(' ').slice(0, 3).join(' ')}
                onNodeClick={scrollToSection}
            />

            {/* Split Layout */}
            <SplitLayout
                sidebar={<ArticleSidebar article={article} />}
                content={
                    <article
                        ref={contentRef as React.RefObject<HTMLElement>}
                        className="max-w-7xl mx-auto py-24 px-8 lg:px-24"
                    >
                        <ArticleHeader article={article} />
                        <ArticleIntro description={article.description} />
                        <ArticleContent content={article.content || ''} />
                        
                        {/* 上一篇/下一篇导航 */}
                        <ArticleNavigation prevArticle={prevArticle} nextArticle={nextArticle} />
                        
                        {/* Comments Section */}
                        <section id="comments-section" className="mt-12 pt-8 border-t-4 border-black dark:border-white">
                            <Comments issueNumber={article.number || article.id} />
                        </section>
                    </article>
                }
            />

            {/* Fixed UI Elements */}
            <BackButton />
            <MindMapToggle onClick={() => setIsMindMapOpen(true)} />
            <RadialMenu items={radialMenuItems} />
        </>
    );
}
