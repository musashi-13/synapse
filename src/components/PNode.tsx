import React, { useRef } from 'react';
import type { TreeNode } from '@/types/types';
import { AskIcon, RepairIcon } from './Icons'; // Removed SendIcon since no textarea

interface NodeProps {
  node: TreeNode;
  onAddNode: (type: 'followup' | 'error' | 'sibling') => void;
}

const Node: React.FC<NodeProps> = ({ node, onAddNode }) => {
  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      <foreignObject x="0" y="0" width="800" height={node.height || 200}>
        <div className="flex flex-col gap-2 h-full w-full bg-zinc-900/20 border-2 border-zinc-600/50 rounded-xl p-4">
          <div className="flex flex-col gap-4">
            <p className="text-zinc-200 text-sm">{node.prompt}</p>
            {node.answer && <p className="text-zinc-400 text-sm">{node.answer}</p>}
          </div>
          <div className="flex gap-1 px-1 pb-1">
            <button
              className="font-semibold rounded-full bg-zinc-900/20 border-2 border-zinc-600/50 p-2"
              onClick={() => onAddNode('error')}
            >
              <RepairIcon />
            </button>
            <button
              className="font-semibold rounded-full bg-zinc-900/20 border-2 border-zinc-600/50 p-2"
              onClick={() => onAddNode('sibling')}
            >
              <AskIcon />
            </button>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default Node;