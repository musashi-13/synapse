// IMPORTANT: Adjust this import path to where your Icons are located.
import type { ApiTypes } from '@/api/types';
import { DiscussIcon, DebugIcon } from './Icons';
import ReactMarkdown from 'react-markdown';
// --- TYPE DEFINITIONS ---
import { Handle, Position, type NodeProps } from '@xyflow/react';


interface ReplyNodeProps {
  node: ApiTypes.Node;
}

// --- COMPONENTS ---

// 2. The function signature is updated to destructure `data` instead of `node`.
export default function ReplyNode({ node }: ReplyNodeProps) {
    return (
        <div className="flex flex-col text-white w-full max-w-[800px]">
            <div className="flex flex-col gap-4 p-4 border-2 border-zinc-600/50 bg-zinc-900/50 backdrop-blur-sm rounded-xl w-full">
                {/* User's Prompt */}
                <p className="w-full p-3 rounded-xl bg-zinc-800/80">
                    {/* 3. Use `data` to access the properties */}
                    {node.user_content}
                </p>

                {/* AI's Response */}
                <p className="w-full p-3 rounded-xl bg-zinc-700/60 whitespace-pre-wrap">
                    <ReactMarkdown>
                        {node.ai_content}
                    </ReactMarkdown>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 my-2">
                <button className="flex items-center gap-1 px-4 py-2 border-2 border-zinc-600/50 bg-zinc-900/50 backdrop-blur-sm rounded-full text-sm hover:bg-zinc-800 transition-colors">
                    Discuss <DiscussIcon />
                </button>
                <button className="flex items-center gap-1 px-4 py-2 border-2 border-zinc-600/50 bg-zinc-900/50 backdrop-blur-sm rounded-full text-sm hover:bg-zinc-800 transition-colors">
                    Debug <DebugIcon />
                </button>
            </div>
        </div>
    );
}

// The SummaryBox component remains unchanged.
function SummaryBox({ summary }: { summary: string }) {
    return (
        <div className="p-3 border-2 text-white border-zinc-600/50 bg-zinc-900/80 backdrop-blur-sm rounded-lg max-w-[200px] w-full text-xs">
            {summary}
        </div>
    );
}