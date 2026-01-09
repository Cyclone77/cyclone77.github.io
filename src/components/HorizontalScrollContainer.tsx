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
 * - Mouse wheel converts to horizontal scroll with CSS smooth scrolling
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
            const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
            
            // Apply horizontal scroll with smooth behavior
            container.scrollBy({
                left: delta,
                behavior: 'smooth'
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
            style={{ height: 'calc(100vh - 80px)', scrollBehavior: 'smooth' }}
        >
            {children}
            {/* End spacer for last card visibility */}
            <div className="flex-none w-[10vw]" aria-hidden="true"></div>
        </div>
    );
}
