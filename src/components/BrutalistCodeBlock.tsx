import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface BrutalistCodeBlockProps {
    code: string;
    language: string;
    filename?: string;
}

/**
 * BrutalistCodeBlock - Brutalist styled code block
 * Features:
 * - Dark background (#1E1E1E)
 * - 2px black border with brutal shadow
 * - Header with window dots and filename
 * - Footer with copy button
 * - Syntax highlighting
 * Requirements: 7.5, 7.6, 7.7
 */
export default function BrutalistCodeBlock({ code, language, filename }: BrutalistCodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    return (
        <div className="my-5 border-2 border-black bg-[#1E1E1E] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            {/* Header */}
            <div className="bg-black px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                    {filename || `code.${language}`}
                </span>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto">
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    customStyle={{
                        background: 'transparent',
                        padding: 0,
                        margin: 0,
                        fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                        fontSize: '14px',
                        lineHeight: '1.6',
                    }}
                    codeTagProps={{
                        style: {
                            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                        },
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>

            {/* Footer */}
            <div className="bg-black/50 px-4 py-2 border-t border-zinc-800">
                <button
                    onClick={handleCopy}
                    className="font-mono text-[10px] text-white font-bold hover:text-primary transition-colors"
                >
                    {copied ? '✓ 已复制' : '复制代码'}
                </button>
            </div>
        </div>
    );
}
