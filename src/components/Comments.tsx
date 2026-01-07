import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CommentsProps {
    issueNumber: number;
}

export default function Comments({ issueNumber }: CommentsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 清除之前的 utterances
        container.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        // 配置 utterances
        script.setAttribute('repo', 'Cyclone77/cyclone77.github.io');
        script.setAttribute('issue-number', String(issueNumber));
        script.setAttribute('theme', theme === 'dark' ? 'github-dark' : 'github-light');
        script.setAttribute('label', '💬评论');

        container.appendChild(script);

        // 清理函数
        return () => {
            container.innerHTML = '';
        };
    }, [issueNumber, theme]);

    return (
        <section className="pt-6 border-t border-gray-100 dark:border-border-dark">
            <h3 className="text-2xl font-bold text-text-primary-light dark:text-white mb-6">评论</h3>
            <div ref={containerRef} className="utterances-container" />
        </section>
    );
}
