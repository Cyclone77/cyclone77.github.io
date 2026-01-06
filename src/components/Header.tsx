import { Link } from 'react-router';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, toggleTheme } = useTheme();

    return (
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

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                to="/"
                                className="text-text-primary-light dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                文章
                            </Link>
                            <a
                                href="#"
                                className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                教程
                            </a>
                            <a
                                href="#"
                                className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                资源
                            </a>
                            <a
                                href="#"
                                className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                关于
                            </a>
                        </nav>
                    </div>

                    <div className="flex flex-1 justify-end gap-4 sm:gap-8">
                        <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg bg-background-light dark:bg-border-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                                <div className="text-text-secondary-light dark:text-text-secondary-dark flex items-center justify-center pl-4 pr-2">
                                    <span className="material-symbols-outlined !text-[20px]">search</span>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-none text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-2 text-sm font-normal focus:ring-0 focus:outline-none"
                                    placeholder="搜索..."
                                />
                            </div>
                        </label>

                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-border-dark text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                            aria-label="切换主题"
                        >
                            <span className="material-symbols-outlined">
                                {theme === 'light' ? 'dark_mode' : 'light_mode'}
                            </span>
                        </button>

                        <button className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-primary/20">
                            <span className="truncate">订阅</span>
                        </button>

                        <div className="sm:hidden flex items-center text-text-primary-light dark:text-white cursor-pointer">
                            <span className="material-symbols-outlined">menu</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
