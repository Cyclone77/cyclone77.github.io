import { useState } from 'react';

interface RadialMenuItem {
    icon: string;
    label: string;
    onClick: () => void;
}

interface RadialMenuProps {
    items: RadialMenuItem[];
    position?: 'bottom-right' | 'bottom-left';
}

const POSITION_STYLES = {
    'bottom-right': 'bottom-10 right-10',
    'bottom-left': 'bottom-10 left-10',
};

// Radial positions for up to 3 items
const ITEM_TRANSFORMS = [
    'translate(-80px, -20px)',
    'translate(-60px, -70px)',
    'translate(-10px, -80px)',
];

export default function RadialMenu({ items, position = 'bottom-right' }: RadialMenuProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`fixed ${POSITION_STYLES[position]} z-[60] flex flex-col items-end group`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Expandable menu items */}
            <div className="absolute bottom-full right-full">
                {items.map((item, index) => (
                    <button
                        key={item.label}
                        onClick={item.onClick}
                        className={`
                            radial-item absolute bottom-0 right-0
                            w-12 h-12 rounded-full
                            bg-white dark:bg-zinc-800
                            border-2 border-black dark:border-white
                            flex items-center justify-center
                            shadow-brutal dark:shadow-brutal-white
                            hover:bg-primary hover:text-black
                            transition-all duration-300
                        `}
                        style={{
                            transform: isExpanded ? ITEM_TRANSFORMS[index] : 'translate(0, 0)',
                            opacity: isExpanded ? 1 : 0,
                            pointerEvents: isExpanded ? 'auto' : 'none',
                        }}
                        title={item.label}
                    >
                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                    </button>
                ))}
            </div>

            {/* Main FAB button */}
            <button
                className={`
                    w-16 h-16 rounded-full
                    bg-primary text-black
                    border-4 border-black dark:border-white
                    shadow-brutal dark:shadow-brutal-white
                    flex items-center justify-center
                    transition-transform duration-300
                    ${isExpanded ? 'rotate-45' : 'rotate-0'}
                `}
            >
                <span className="material-symbols-outlined text-3xl font-black">add</span>
            </button>
        </div>
    );
}
