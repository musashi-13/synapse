// ReplyFlowNode.tsx
import type { ApiTypes } from '@/api/types';
import { DiscussIcon, DebugIcon } from './Icons'; // Adjust path if needed
import ReactMarkdown from 'react-markdown';
import { Handle, Position, type NodeProps, type Node as FlowNode } from '@xyflow/react';

type AppNode = FlowNode<ApiTypes.Node>;

export default function ReplyNode({ data }: NodeProps<AppNode>) {
  return (
    <div className="flex flex-col text-white max-w-[800px] min-w-[400px]">
      <Handle type="target" position={Position.Top} className="!bg-zinc-500" />

      <div className="flex flex-col gap-4 p-4 border-2 border-zinc-600/50 bg-zinc-900/50 backdrop-blur-sm rounded-xl">
        {/* User's Prompt */}
        <p className="w-full p-3 rounded-xl bg-zinc-800/80 whitespace-pre-wrap">
          {data.user_content}
        </p>

        {/* AI's Response (as Markdown) */}
        <div className="w-full p-3 rounded-xl bg-zinc-700/60 whitespace-pre-wrap markdown-content">
          <ReactMarkdown>{data.ai_content}</ReactMarkdown>
        </div>
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

      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500" />
    </div>
  );
}