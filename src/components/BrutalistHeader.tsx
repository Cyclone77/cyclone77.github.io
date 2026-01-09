import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import SearchModal from './SearchModal';

export default function BrutalistHeader() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // Global keyboard shortcut Ctrl+K or /
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
            <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 flex justify-between items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b-4 border-black dark:border-white">
                {/* Logo and Status */}
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <span className="text-xl md:text-2xl font-mono font-extrabold bg-primary text-black px-3 py-1 border-2 border-black">
                            CY-77_LAB
                        </span>
                    </Link>
                    <span className="hidden md:inline-block font-mono text-xs uppercase tracking-widest opacity-60">
                        系统状态: 运行中
                    </span>
                </div>

                {/* Navigation and Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="hover:text-primary transition-colors"
                        aria-label="切换主题"
                    >
                        <span className="material-symbols-outlined">
                            {theme === 'light' ? 'dark_mode' : 'light_mode'}
                        </span>
                    </button>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex gap-8 font-mono font-bold text-sm uppercase">
                        <Link
                            to="/"
                            className="hover:underline decoration-primary decoration-4 underline-offset-4"
                        >
                            文章归档
                        </Link>
                        <a
                            href="#"
                            className="hover:underline decoration-primary decoration-4 underline-offset-4"
                        >
                            技术专题
                        </a>
                        <a
                            href="#"
                            className="hover:underline decoration-primary decoration-4 underline-offset-4"
                        >
                            关于我
                        </a>
                    </div>

                    {/* Search Icon */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hover:text-primary transition-colors cursor-pointer"
                        aria-label="搜索"
                    >
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </div>
            </nav>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
