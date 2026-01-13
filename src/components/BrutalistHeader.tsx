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
                        <span className="text-xl md:text-2xl font-extrabold bg-primary text-black px-3 py-1 border-2 border-black">
                            Cyclone77
                        </span>
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="hover:text-primary transition-colors flex items-center"
                        aria-label="切换主题"
                    >
                        <span className="material-symbols-outlined text-[22px] leading-none">
                            {theme === 'light' ? 'dark_mode' : 'light_mode'}
                        </span>
                    </button>

                    {/* Search Icon */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hover:text-primary transition-colors cursor-pointer flex items-center"
                        aria-label="搜索"
                    >
                        <span className="material-symbols-outlined text-[22px] leading-none">search</span>
                    </button>
                </div>
            </nav>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
