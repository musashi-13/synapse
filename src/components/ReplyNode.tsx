// src/components/ReplyNode.tsx

// IMPORTANT: Adjust this import path to where your Icons are located.
import { DiscussIcon, DebugIcon } from './Icons';

// --- TYPE DEFINITIONS ---

// This type now matches the full API response object for a node.
export type NodeData = {
    id: string;
    branch_id: string;
    parent_node_id: string | null;
    depth: number;
    user_content: string;
    ai_content: string;
    context_for_api: string;
    corrected_content: string | null;
    is_corrected: boolean;
    created_at: string;
    concise_context: string | null;
    conversation_id: string;
};

// The component now accepts a single `node` prop.
interface ReplyNodeProps {
    node: NodeData;
}

interface SummaryBoxProps {
    summary: string;
}


// --- COMPONENTS ---

// The detailed view of a node, updated to show the AI response.
export default function ReplyNode({ node }: ReplyNodeProps) {
    return (
        <div className="flex flex-col text-white w-full max-w-[800px]">
            <div className="flex flex-col gap-4 p-4 border-2 border-zinc-600/50 bg-zinc-900/50 backdrop-blur-sm rounded-xl w-full">
                {/* User's Prompt */}
                <p className="w-full p-3 rounded-xl bg-zinc-800/80">
                    {node.user_content}
                </p>

                {/* AI's Response */}
                <p className="w-full p-3 rounded-xl bg-zinc-700/60 whitespace-pre-wrap">
                    {node.ai_content}
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

// The compact view of a node for when zoomed out.
// This will likely use `node.concise_context` in the future.
function SummaryBox({ summary }: SummaryBoxProps) {
    return (
        <div className="p-3 border-2 text-white border-zinc-600/50 bg-zinc-900/80 backdrop-blur-sm rounded-lg max-w-[200px] w-full text-xs">
            {summary}
        </div>
    );
}