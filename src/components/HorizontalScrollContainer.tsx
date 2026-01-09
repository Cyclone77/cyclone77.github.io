import { ReactNode, useRef, useEffect } from 'react';

interface HorizontalScrollContainerProps {
    children: ReactNode;
    className?: string;
}

/**
 * HorizontalScrollContainer - Full viewport horizontal scroll container
 * Features:
 * - Full viewport height (minus header)
 * - Horizontal scroll with visible scrollbar
 * - Scroll snap for card alignment
 * - Mouse wheel converts to horizontal scroll (both normal and shift+wheel)
 * Requirements: 3.1, 3.2
 */
export default function HorizontalScrollContainer({ children, className = '' }: HorizontalScrollContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Convert vertical mouse wheel to horizontal scroll
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // Prevent default vertical scroll
            e.preventDefault();
            
            // Get scroll amount - prioritize deltaX, fallback to deltaY
            // Shift+wheel also uses deltaY but we want horizontal scroll
            const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
            
            // Apply smooth horizontal scroll
            container.scrollBy({
                left: delta,
                behavior: 'auto'
            });
        };

        // Use passive: false to allow preventDefault
        container.addEventListener('wheel', handleWheel, { passive: false });
        
        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`horizontal-scroll-container flex items-center px-[7.5vw] py-10 ${className}`}
            style={{ height: 'calc(100vh - 80px)' }}
        >
            {children}
            {/* End spacer for last card visibility */}
            <div className="flex-none w-[10vw]" aria-hidden="true"></div>
        </div>
    );
}
