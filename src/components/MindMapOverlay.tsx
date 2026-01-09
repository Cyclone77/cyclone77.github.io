import { useEffect, useCallback } from 'react';

interface MindMapNode {
    id: string;
    label: string;
    type: 'center' | 'satellite';
    targetId?: string;
}

interface MindMapOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: MindMapNode[];
    centerLabel: string;
    onNodeClick: (targetId: string) => void;
}

/**
 * MindMapOverlay - Full-screen mind map visualization
 * Features:
 * - Full-screen overlay with blur backdrop
 * - Central node with glass-morphism effect
 * - Satellite nodes positioned radially
 * - SVG connection lines
 * - Click to navigate to section
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8
 */
export default function MindMapOverlay({
    isOpen,
    onClose,
    nodes,
    centerLabel,
    onNodeClick,
}: MindMapOverlayProps) {
    // Handle ESC key to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const handleNodeClick = (targetId?: string) => {
        if (targetId) {
            onNodeClick(targetId);
            onClose();
        }
    };

    // Calculate satellite positions in a radial pattern
    const getSatellitePosition = (index: number, total: number) => {
        const angleStep = (2 * Math.PI) / Math.max(total, 1);
        const angle = angleStep * index - Math.PI / 2; // Start from top
        const radius = 200; // Distance from center
        
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        };
    };

    if (!isOpen) return null;

    const satelliteNodes = nodes.filter(n => n.type === 'satellite');

    return (
        <div
            className="fixed inset-0 z-[150] flex items-center justify-center transition-all duration-700"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Mind Map"
        >
            <div 
                className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center"
                onClick={e => e.stopPropagation()}
            >
                {/* SVG Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {/* Decorative circles */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="120"
                        className="fill-none stroke-blue-500 opacity-10"
                        strokeWidth="0.5"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r="220"
                        className="fill-none stroke-blue-500 opacity-5"
                        strokeWidth="0.5"
                    />
                    
                    {/* Connection lines to satellites */}
                    {satelliteNodes.map((node, index) => {
                        const pos = getSatellitePosition(index, satelliteNodes.length);
                        return (
                            <line
                                key={node.id}
                                x1="50%"
                                y1="50%"
                                x2={`calc(50% + ${pos.x}px)`}
                                y2={`calc(50% + ${pos.y}px)`}
                                className="stroke-blue-500 opacity-30"
                                strokeWidth="0.5"
                            />
                        );
                    })}
                </svg>

                {/* Central Node */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="glass-node w-48 h-48 rounded-full flex flex-col items-center justify-center p-6 text-center border-2 border-blue-500 shadow-[0_0_30px_rgba(0,112,255,0.15)]">
                        <span className="font-mono text-[10px] text-blue-500 font-bold mb-2 uppercase tracking-widest">
                            Core Topic
                        </span>
                        <span className="text-sm font-black text-black leading-tight uppercase">
                            {centerLabel}
                        </span>
                    </div>
                </div>

                {/* Satellite Nodes */}
                {satelliteNodes.map((node, index) => {
                    const pos = getSatellitePosition(index, satelliteNodes.length);
                    return (
                        <button
                            key={node.id}
                            className="absolute left-1/2 top-1/2 z-10 group"
                            style={{
                                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                            }}
                            onClick={() => handleNodeClick(node.targetId)}
                        >
                            <div className="glass-node w-32 h-32 lg:w-36 lg:h-36 rounded-full flex flex-col items-center justify-center p-4 text-center hover:scale-110 transition-transform duration-500 cursor-pointer border border-white/50">
                                <span className="font-mono text-[10px] text-zinc-400 font-bold mb-1">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="text-[11px] font-bold text-black uppercase tracking-tighter leading-tight">
                                    {node.label}
                                </span>
                                <div className="mt-2 w-4 h-[1px] bg-blue-500 opacity-0 group-hover:opacity-100 group-hover:w-8 transition-all"></div>
                            </div>
                        </button>
                    );
                })}

                {/* Close Button */}
                <button
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer"
                    onClick={onClose}
                >
                    <div className="bg-black text-white px-8 py-3 font-mono text-xs font-bold tracking-widest hover:bg-blue-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,112,255,0.3)]">
                        CLOSE_MAP // ESC
                    </div>
                </button>
            </div>
        </div>
    );
}
