import React from 'react';
import type { TreeNode } from '@/types/types';

interface NodeLinkProps {
  source: TreeNode;
  target: TreeNode;
  type: string;
}

const NodeLink: React.FC<NodeLinkProps> = ({ source, target, type }) => {
  const path = `M${source.x + 60},${source.y + 60} L${target.x + 60},${target.y}`;
  return (
    <path
      d={path}
      className={
        type === 'error' ? 'stroke-red-500' : 'stroke-gray-500'
      }
      strokeWidth="2"
      fill="none"
    />
  );
};

export default NodeLink;