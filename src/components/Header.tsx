import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import SearchModal from './SearchModal';

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // 全局快捷键 Ctrl+K 或 /
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-background-light dark:bg-background-dark">
                <div className="mx-auto max-w-7xl px-4 sm:px-10">
                    <div className="flex items-center justify-between py-3 px-4 sm:px-6 bg-surface-light dark:bg-surface-dark rounded-b-2xl shadow-md">
                        <div className="flex items-center gap-8">
                            <Link
                                to="/"
                                className="flex items-center gap-3 text-text-primary-light dark:text-white hover:opacity-80 transition-opacity"
                            >
                                <div className="size-8 text-primary">
                                    <span className="material-symbols-outlined !text-[32px]">terminal</span>
                                </div>
                                <h2 className="font-display text-xl font-bold leading-tight tracking-[-0.015em]">
                                    Cyclone77
                                </h2>
                            </Link>
                        </div>

                        <div className="flex flex-1 justify-end gap-4 sm:gap-8">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden sm:flex items-center gap-2 min-w-40 h-10 max-w-64 px-4 rounded-lg bg-background-light dark:bg-border-dark text-text-secondary-light dark:text-text-secondary-dark text-sm hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined !text-[20px]">search</span>
                                <span className="flex-1 text-left">搜索...</span>
                                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-gray-200 dark:bg-surface-dark rounded">
                                    ⌘K
                                </kbd>
                            </button>

                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-border-dark text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                                aria-label="切换主题"
                            >
                                <span className="material-symbols-outlined">
                                    {theme === 'light' ? 'dark_mode' : 'light_mode'}
                                </span>
                            </button>

                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="sm:hidden flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-border-dark text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                            >
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
