import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CommentsProps {
    issueNumber: number;
    issueUrl?: string;
}

export default function Comments({ issueNumber, issueUrl }: CommentsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const loadedRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 如果已经加载成功过，只更新主题
        if (loadedRef.current) {
            const iframe = container.querySelector('.utterances-frame') as HTMLIFrameElement;
            if (iframe?.contentWindow) {
                const message = {
                    type: 'set-theme',
                    theme: theme === 'dark' ? 'github-dark' : 'github-light'
                };
                iframe.contentWindow.postMessage(message, 'https://utteranc.es');
            }
            return;
        }

        setStatus('loading');
        container.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        script.setAttribute('repo', 'Cyclone77/cyclone77.github.io');
        script.setAttribute('issue-number', String(issueNumber));
        script.setAttribute('theme', theme === 'dark' ? 'github-dark' : 'github-light');
        script.setAttribute('label', '💬评论');

        let checkCount = 0;
        const maxChecks = 20; // 10秒超时

        // 监听 iframe 加载
        const checkLoaded = setInterval(() => {
            checkCount++;
            const iframe = container.querySelector('.utterances-frame') as HTMLIFrameElement;
            if (iframe && iframe.offsetHeight > 100) {
                setStatus('success');
                loadedRef.current = true;
                clearInterval(checkLoaded);
            } else if (checkCount >= maxChecks) {
                setStatus('error');
                clearInterval(checkLoaded);
            }
        }, 500);

        container.appendChild(script);

        return () => {
            clearInterval(checkLoaded);
        };
    }, [issueNumber, theme]);

    const githubUrl = issueUrl || `https://github.com/Cyclone77/cyclone77.github.io/issues/${issueNumber}`;

    return (
        <section className="pt-6 border-t border-gray-100 dark:border-border-dark">
            <h3 className="text-2xl font-bold text-text-primary-light dark:text-white mb-6">评论</h3>
            
            {/* Utterances 容器 */}
            <div ref={containerRef} className={`utterances-container ${status === 'error' ? 'hidden' : ''}`} />
            
            {/* 加载中 */}
            {status === 'loading' && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">加载评论中...</p>
                </div>
            )}
            
            {/* 加载失败 */}
            {status === 'error' && (
                <div className="text-center py-8 bg-gray-50 dark:bg-surface-dark rounded-lg">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                        评论加载中，点击下方按钮直接查看
                    </p>
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        在 GitHub 上查看评论
                    </a>
                </div>
            )}
        </section>
    );
}
