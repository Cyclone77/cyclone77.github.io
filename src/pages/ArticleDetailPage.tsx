import { useParams, Link } from 'react-router';
import { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Article } from '../data/mockData';
import { fetchArticleById } from '../services/api';
import SplitLayout from '../components/SplitLayout';
import ArticleSidebar from '../components/ArticleSidebar';
import ReadingProgressBar from '../components/ReadingProgressBar';
import MindMapOverlay from '../components/MindMapOverlay';
import BrutalistCodeBlock from '../components/BrutalistCodeBlock';
import RadialMenu from '../components/RadialMenu';

// ============ Utility Functions ============

function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
    const headings: Array<{ id: string; text: string; level: number }> = [];
    const lines = content.split('\n');
    let sectionNumber = 0;

    for (const line of lines) {
        const match = line.match(/^(#{2})\s+(.+)$/);
        if (match) {
            sectionNumber++;
            const text = match[2].replace(/[*_`#]/g, '').trim();
            headings.push({
                id: `section-${String(sectionNumber).padStart(2, '0')}`,
                text,
                level: 2,
            });
        }
    }

    return headings;
}

// ============ Markdown Components ============

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
        
        return (
            <code
                className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 text-sm border border-black/20"
                {...props}
            >
                {children}
            </code>
        );
    },
    h2: ({ children }: any) => {
        sectionCounter.current++;
        const sectionNum = String(sectionCounter.current).padStart(2, '0');
        const id = `section-${sectionNum}`;
        const text = String(children).replace(/[*_`#]/g, '').trim();
        
        return (
            <h2
                id={id}
                className="font-mono font-black text-3xl uppercase mt-12 mb-6 tracking-tight flex items-center scroll-mt-16"
            >
                <span className="mr-4">{sectionNum}.</span>
                {text}
            </h2>
        );
    },
    h3: ({ children }: any) => (
        <h3 className="font-mono font-bold text-xl mt-8 mb-4 text-zinc-900">{children}</h3>
    ),
    h4: ({ children }: any) => (
        <h4 className="font-mono font-bold text-lg mt-6 mb-3 text-zinc-800">{children}</h4>
    ),
    p: ({ children }: any) => (
        <p className="text-lg text-zinc-800 mb-6 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-black bg-zinc-100 px-6 py-4 my-6 italic [&>p]:mb-0 [&>p:last-child]:mb-0">
            {children}
        </blockquote>
    ),
    ul: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-2 mb-6 text-zinc-800 pl-4">{children}</ul>
    ),
    ol: ({ children }: any) => (
        <ol className="list-decimal list-inside space-y-2 mb-6 text-zinc-800 pl-4">{children}</ol>
    ),
    li: ({ children }: any) => (
        <li className="text-lg leading-relaxed">{children}</li>
    ),
    table: ({ children }: any) => (
        <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse border-2 border-black font-mono text-sm">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }: any) => (
        <thead className="bg-black text-white">{children}</thead>
    ),
    tbody: ({ children }: any) => (
        <tbody>{children}</tbody>
    ),
    tr: ({ children }: any) => (
        <tr className="border-b border-black even:bg-zinc-100">{children}</tr>
    ),
    th: ({ children }: any) => (
        <th className="px-4 py-3 text-left font-bold uppercase border-r border-white/20 last:border-r-0">{children}</th>
    ),
    td: ({ children }: any) => (
        <td className="px-4 py-3 border-r border-black/20 last:border-r-0">{children}</td>
    ),
    a: ({ href, children }: any) => (
        <a 
            href={href} 
            className="text-primary underline decoration-2 underline-offset-2 hover:bg-primary hover:text-black transition-colors"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),
    hr: () => (
        <hr className="my-12 border-t-4 border-black" />
    ),
    img: ({ src, alt }: any) => (
        <figure className="my-8">
            <img 
                src={src} 
                alt={alt} 
                className="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            />
            {alt && <figcaption className="mt-2 text-sm text-zinc-600 font-mono text-center">{alt}</figcaption>}
        </figure>
    ),
    strong: ({ children }: any) => (
        <strong className="font-bold text-black">{children}</strong>
    ),
    em: ({ children }: any) => (
        <em className="italic">{children}</em>
    ),
    del: ({ children }: any) => (
        <del className="line-through text-zinc-500">{children}</del>
    ),
});

// ============ Sub Components ============

function LoadingState() {
    return (
        <div className="h-screen flex items-center justify-center bg-background-light">
            <div className="font-mono text-primary animate-pulse">加载中...</div>
        </div>
    );
}

function NotFoundState() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-background-light">
            <h2 className="font-mono text-2xl font-bold mb-4">错误_404: 文章未找到</h2>
            <Link to="/" className="font-mono text-primary hover:underline">
                返回首页
            </Link>
        </div>
    );
}

function ArticleHeader({ article }: { article: Article }) {
    return (
        <header className="mb-16">
            <div className="font-mono inline-block bg-black text-white text-xs px-2 py-1 mb-6">
                类型: 技术文章
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black uppercase leading-tight tracking-tight text-black mb-8">
                {article.title}
            </h1>
            <div className="w-24 h-4 bg-black"></div>
        </header>
    );
}

function ArticleIntro({ description }: { description: string }) {
    return (
        <p className="text-xl font-medium leading-relaxed mb-8 border-l-8 border-black pl-8 italic">
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
            className="fixed top-[120px] right-10 z-[60] w-10 h-10 font-mono bg-primary text-black font-extrabold text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
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
            className="fixed top-[120px] right-[90px] z-[60] w-10 h-10 cursor-pointer hidden lg:flex font-mono bg-white text-black font-extrabold text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all items-center justify-center group"
            title="思维导图"
        >
            <span className="material-symbols-outlined font-black text-lg group-hover:text-blue-500 transition-colors">
                hub
            </span>
        </button>
    );
}

// ============ Main Component ============

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMindMapOpen, setIsMindMapOpen] = useState(false);
    const contentRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (id) {
            fetchArticleById(Number(id)).then(data => {
                setArticle(data);
                setLoading(false);
            });
        }
    }, [id]);

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

    const radialMenuItems = [
        { icon: 'home', label: 'Home', onClick: () => window.location.href = '/' },
        { icon: 'terminal', label: 'Terminal', onClick: () => console.log('Terminal') },
        { icon: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
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
