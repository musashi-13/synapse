import React from 'react';
import type { TreeNode } from '@/types/types';

interface ButtonProps {
  label: string;
  color: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, color, onClick }) => {
  return (
    <button
      className={`${color} text-white text-xs font-medium rounded-sm w-[35px] h-[20px] flex items-center justify-center`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
interface NodeProps {
  node: TreeNode;
  onAddNode: (type: 'followup' | 'error' | 'sibling') => void;
}

const Node: React.FC<NodeProps> = ({ node, onAddNode }) => {
  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      <rect
        width="120"
        height="60"
        rx="5"
        className={
          node.type === 'root'
            ? 'fill-blue-200 stroke-blue-500'
            : node.type === 'error'
            ? 'fill-red-200 stroke-red-500'
            : 'fill-gray-200 stroke-gray-500'
        }
        strokeWidth="2"
      />
      <foreignObject x="0" y="0" width="120" height="100">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center px-2">
            <span className="text-sm text-black">{node.prompt}</span>
          </div>
          <div className="flex gap-1 px-1 pb-1">
            <Button
              label="Follow"
              color="bg-green-500"
              onClick={() => {
                console.log(`PNode: Follow button clicked for node ${node.id}`);
                onAddNode('followup');
              }}
            />
            <Button
              label="Error"
              color="bg-red-500"
              onClick={() => {
                console.log(`PNode: Error button clicked for node ${node.id}`);
                onAddNode('error');
              }}
            />
            <Button
              label="Sibling"
              color="bg-yellow-500"
              onClick={() => {
                console.log(`PNode: Sibling button clicked for node ${node.id}`);
                onAddNode('sibling');
              }}
            />
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default Node;