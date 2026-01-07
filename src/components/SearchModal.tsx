import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js';
import { Article } from '../data/mockData';
import { fetchArticles } from '../services/api';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // 加载文章数据
    useEffect(() => {
        fetchArticles().then(data => {
            setArticles(data.articles);
        });
    }, []);

    // 创建 Fuse 实例
    const fuse = useMemo(() => {
        return new Fuse(articles, {
            keys: [
                { name: 'title', weight: 0.4 },
                { name: 'description', weight: 0.3 },
                { name: 'categories', weight: 0.2 },
                { name: 'content', weight: 0.1 },
            ],
            threshold: 0.4,
            includeScore: true,
            minMatchCharLength: 1,
        });
    }, [articles]);

    // 搜索结果
    const results = useMemo(() => {
        if (!query.trim()) return [];
        return fuse.search(query).slice(0, 8);
    }, [fuse, query]);

    // 打开时聚焦输入框
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // 键盘导航
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(i => Math.min(i + 1, results.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(i => Math.max(i - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        navigate(`/article/${results[selectedIndex].item.id}`);
                        onClose();
                    }
                    break;
                case 'Escape':
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, navigate, onClose]);

    // 重置选中索引
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* 背景遮罩 */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* 搜索框 */}
            <div className="relative w-full max-w-xl mx-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-border-dark">
                {/* 输入区域 */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-border-dark">
                    <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                        search
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark text-base focus:ring-0 focus:outline-none"
                        placeholder="搜索文章..."
                    />
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark bg-gray-100 dark:bg-border-dark rounded">
                        ESC
                    </kbd>
                </div>

                {/* 搜索结果 */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query.trim() === '' ? (
                        <div className="px-4 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark text-sm">
                            输入关键词搜索文章
                        </div>
                    ) : results.length === 0 ? (
                        <div className="px-4 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark text-sm">
                            未找到相关文章
                        </div>
                    ) : (
                        <ul className="py-2">
                            {results.map((result, index) => (
                                <li key={result.item.id}>
                                    <button
                                        onClick={() => {
                                            navigate(`/article/${result.item.id}`);
                                            onClose();
                                        }}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                                            index === selectedIndex
                                                ? 'bg-primary/10'
                                                : 'hover:bg-gray-100 dark:hover:bg-border-dark'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined mt-0.5 ${
                                            index === selectedIndex ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'
                                        }`}>
                                            article
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-medium truncate ${
                                                index === selectedIndex 
                                                    ? 'text-primary' 
                                                    : 'text-text-primary-light dark:text-white'
                                            }`}>
                                                {result.item.title}
                                            </h4>
                                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate mt-0.5">
                                                {result.item.description}
                                            </p>
                                            {result.item.categories && result.item.categories.length > 0 && (
                                                <div className="flex gap-1.5 mt-1.5">
                                                    {result.item.categories.slice(0, 3).map(cat => (
                                                        <span 
                                                            key={cat}
                                                            className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded"
                                                        >
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {index === selectedIndex && (
                                            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-text-secondary-light dark:text-text-secondary-dark bg-gray-100 dark:bg-border-dark rounded">
                                                Enter
                                            </kbd>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 底部提示 */}
                <div className="px-4 py-2 border-t border-gray-200 dark:border-border-dark flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-border-dark rounded">↑</kbd>
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-border-dark rounded">↓</kbd>
                            导航
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-border-dark rounded">Enter</kbd>
                            打开
                        </span>
                    </div>
                    <span>共 {articles.length} 篇文章</span>
                </div>
            </div>
        </div>
    );
}
