import { ReactNode } from 'react';

interface SplitLayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
}

/**
 * SplitLayout - Article detail page split layout
 * Features:
 * - Sidebar: 1/3 width, dark background
 * - Content: 2/3 width, light background
 * - 4px border between sections
 * - Stacks vertically on mobile
 * Requirements: 5.1, 11.5
 */
export default function SplitLayout({ sidebar, content }: SplitLayoutProps) {
    return (
        <div className="flex flex-col lg:flex-row h-screen pt-20">
            {/* Sidebar - 1/3 width on desktop */}
            <aside className="w-full lg:w-1/3 h-auto lg:h-full bg-background-dark border-b-4 lg:border-b-0 lg:border-r-4 border-black dark:border-white relative overflow-hidden flex flex-col">
                {sidebar}
            </aside>

            {/* Content - 2/3 width on desktop */}
            <main className="flex-1 h-full overflow-y-auto terminal-scroll bg-background-light dark:bg-zinc-800 pt-8">
                {content}
            </main>
        </div>
    );
}
