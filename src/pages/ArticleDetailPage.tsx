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
                className="font-mono bg-zinc-200 px-1"
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
        const text = String(children).replace(/[*_`#]/g, '').trim().toUpperCase().replace(/\s+/g, '_');
        
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
    p: ({ children }: any) => (
        <p className="text-lg text-zinc-800 mb-6 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: any) => (
        <div className="p-8 bg-zinc-200 border-2 border-black italic mb-12">
            {children}
        </div>
    ),
    ul: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-2 mb-6 text-zinc-800">{children}</ul>
    ),
    ol: ({ children }: any) => (
        <ol className="list-decimal list-inside space-y-2 mb-6 text-zinc-800">{children}</ol>
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
            className="fixed top-[120px] right-10 z-[60] font-mono bg-primary text-black font-extrabold px-4 py-2 text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
        >
            <span className="material-symbols-outlined font-black text-sm">arrow_back</span>
            返回首页
        </Link>
    );
}

function MindMapToggle({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="fixed top-[120px] left-1/2 -translate-x-1/2 z-[60] cursor-pointer"
        >
            <div className="font-mono bg-white text-black font-extrabold px-4 py-2 text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 group">
                <span className="material-symbols-outlined font-black text-sm group-hover:text-blue-500 transition-colors">
                    hub
                </span>
                思维导图
            </div>
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
                        className="max-w-4xl mx-auto py-24 px-8 lg:px-24"
                    >
                        <ArticleHeader article={article} />
                        <ArticleIntro description={article.description} />
                        <ArticleContent content={article.content || ''} />
                        
                        {/* Footer */}
                        <p className="text-lg text-zinc-800 mt-12 mb-20">
                            继续探索我们的文章库，了解更多关于性能优化和现代前端开发的技术文章。
                        </p>
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
