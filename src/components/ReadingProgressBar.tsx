import { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
    contentRef?: React.RefObject<HTMLElement | null>;
}

/**
 * ReadingProgressBar - Fixed progress bar below header
 * Features:
 * - Fixed below header (top: 80px), 32px height, black background
 * - Segmented progress blocks (4 segments)
 * - Matrix Green fill for completed segments
 * - Percentage text display
 * Requirements: 6.1, 6.2, 6.3, 10.6
 */
export default function ReadingProgressBar({ contentRef }: ReadingProgressBarProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            // Find the scrollable main element in SplitLayout
            const scrollContainer = document.querySelector('main.overflow-y-auto') as HTMLElement;
            
            if (scrollContainer) {
                const scrollTop = scrollContainer.scrollTop;
                const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                
                if (scrollHeight > 0) {
                    const percentage = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
                    setProgress(percentage);
                }
            }
        };

        // Debounce scroll handler
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    calculateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Find and attach to the scroll container
        const scrollContainer = document.querySelector('main.overflow-y-auto');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        }
        
        // Also listen to window scroll as fallback
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        calculateProgress(); // Initial calculation

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, [contentRef]);

    // Calculate segment fills (4 segments, each 25%)
    const getSegmentOpacity = (segmentIndex: number) => {
        const segmentStart = segmentIndex * 25;
        const segmentEnd = (segmentIndex + 1) * 25;
        
        if (progress >= segmentEnd) return 1;
        if (progress <= segmentStart) return 0;
        return (progress - segmentStart) / 25;
    };

    const formatProgress = () => {
        return `${Math.round(progress)}%_已读`;
    };

    return (
        <div 
            className="fixed top-[80px] left-0 w-full h-8 bg-black z-40 flex items-center px-4 border-b-2 border-black"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div className="font-mono text-[10px] text-primary mr-4 uppercase font-bold tracking-tighter">
                阅读进度:
            </div>
            
            <div className="flex-1 h-3 border border-primary p-[1px] flex gap-1">
                {[0, 1, 2, 3].map(index => (
                    <div
                        key={index}
                        className="w-1/4 h-full transition-opacity duration-300"
                        style={{
                            backgroundColor: getSegmentOpacity(index) > 0 ? '#00FF41' : 'transparent',
                            opacity: getSegmentOpacity(index) || 0.1,
                            border: getSegmentOpacity(index) === 0 ? '1px solid rgba(0, 255, 65, 0.3)' : 'none',
                        }}
                    />
                ))}
            </div>
            
            <div className="font-mono text-[10px] text-primary ml-4 uppercase font-bold tracking-tighter">
                {formatProgress()}
            </div>
        </div>
    );
}
