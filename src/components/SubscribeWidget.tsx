import { useState } from 'react';

interface SubscribeWidgetProps {
    position?: 'fixed' | 'inline';
}

export default function SubscribeWidget({ position = 'fixed' }: SubscribeWidgetProps) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement subscription logic
        console.log('Subscribe:', email);
        setEmail('');
    };

    const positionStyles = position === 'fixed'
        ? 'fixed bottom-6 left-6 z-50 pointer-events-auto'
        : '';

    return (
        <div
            className={`
                ${positionStyles}
                bg-black text-white p-4
                border-2 border-primary
                shadow-brutal
            `}
        >
            <h3 className="font-mono text-xs font-bold mb-2 uppercase tracking-widest text-primary border-b border-primary/30 pb-1">
                Weekly_Selection
            </h3>
            <p className="font-mono text-[10px] leading-tight opacity-80 mb-3">
                Subscribe to get the latest technical<br />
                logs directly in your terminal.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="USER@DOMAIN.COM"
                    className="
                        bg-zinc-800 border border-zinc-700
                        font-mono text-[10px] px-2 py-1 w-32
                        focus:ring-1 focus:ring-primary focus:outline-none
                        placeholder:text-zinc-500
                    "
                    required
                />
                <button
                    type="submit"
                    className="
                        bg-primary text-black px-2 py-1
                        font-mono text-[10px] font-bold uppercase
                        hover:bg-primary/90 transition-colors
                    "
                >
                    Join
                </button>
            </form>
        </div>
    );
}
