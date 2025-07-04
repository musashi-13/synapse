import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import NodeLink from './PLink';
import type { TreeNode } from '@/types/types';
import RootNode from './RootNode';
import Node from './PNode';
import { bottomPromptBox } from '../atoms';
import PromptBox from './PromptBox';
import { useAtom } from 'jotai';
import { dummyData } from '@/dummy-data'; // Keeping as dummyData

const PTree: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null); // Store zoom object

  const initialNode: TreeNode = {
    id: 'root',
    prompt: '',
    type: 'root',
    children: [],
    x: 0,
    y: 0,
    height: 200,
  };

  const [nodes, setNodes] = React.useState<TreeNode[]>([initialNode]);
  const [links, setLinks] = React.useState<{ source: string; target: string; type: string }[]>([]);
  const [showBottomPrompt, setShowBottomPrompt] = useAtom(bottomPromptBox);
  const [newNodeId, setNewNodeId] = useState<string | null>(null); // Track the latest node ID for animation

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    svg.attr('width', width).attr('height', height);

    const g = svg.select('g');
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    // Center the root node (width 800px, height 200px) at (0, 0)
    const nodeWidth = 800;
    const nodeHeight = 200;
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(width / 2 - nodeWidth / 2, height / 2 - nodeHeight / 2));

    zoomRef.current = zoom; // Store the zoom object in the ref
  }, []);

  const addNode = useCallback((parentId: string, type: 'followup' | 'error' | 'sibling', prompt: string, answer: string) => {
    const newNodeId = `${parentId}-${Date.now()}`;
    setNewNodeId(newNodeId); // Set the new node ID for animation

    setNodes((prevNodes) => {
      const parentNode = prevNodes.find((n) => n.id === parentId);
      if (!parentNode) return prevNodes;

      const nodeHeight = 200; // Fixed height for new nodes
      const newNode: TreeNode = {
        id: newNodeId,
        prompt,
        answer,
        type,
        children: [],
        x: type === 'sibling' ? parentNode.x + 200 : type === 'error' ? parentNode.x + 200 : parentNode.x,
        y: type === 'sibling' ? parentNode.y : parentNode.y + 200 + nodeHeight, // Adjust for center anchor
        height: nodeHeight,
      };

      const updatedNodes = prevNodes.map((node) =>
        node.id === parentId ? { ...node, children: [...node.children, newNodeId] } : node
      );

      // Move view to new node's top edge after state update
      if (svgRef.current && zoomRef.current) {
        const svg = d3.select(svgRef.current);
        const topEdgeY = newNode.y - newNode.height / 2; // Top edge of new node
        svg.transition().duration(500).call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(0, -topEdgeY) // Align top edge with viewport top
        );
      }

      return [...updatedNodes, newNode];
    });

    setLinks((prevLinks) => [...prevLinks, { source: parentId, target: newNodeId, type }]);
  }, []);

  const updateNode = (updatedNode: TreeNode) => {
    setNodes((prevNodes) => prevNodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  // Clean up newNodeId after animation
  useEffect(() => {
    if (newNodeId) {
      const timer = setTimeout(() => setNewNodeId(null), 600); // Clear after transition
      return () => clearTimeout(timer);
    }
  }, [newNodeId]);

  return (
    <div ref={containerRef} className="w-full h-screen bg-transparent relative">
      <svg ref={svgRef} className="w-full h-full">
        <g>
          {links.map((link) => {
            const sourceNode = nodes.find((n) => n.id === link.source);
            const targetNode = nodes.find((n) => n.id === link.target);
            if (!sourceNode || !targetNode) return null;
            return (
              <NodeLink
                key={`${link.source}-${link.target}`}
                source={sourceNode}
                target={targetNode}
                type={link.type}
              />
            );
          })}
          {nodes.map((node) =>
            node.id === 'root' ? (
              <RootNode
                key={node.id}
                node={node}
                onAddNode={() => {}}
                onUpdateNode={updateNode}
              />
            ) : (
              <Node
                key={node.id}
                node={node}
                onAddNode={(type) => addNode(node.id, type, '', '')}
              />
            )
          )}
        </g>
      </svg>
      {showBottomPrompt && (
        <div className="fixed bottom-0 left-0 w-3/5 bg-zinc-800/50 p-4 flex items-center justify-center">
          <PromptBox
            onSubmit={(prompt) => {
              const parentId = nodes[nodes.length - 1].id;
              const dummyAnswer = dummyData[Math.floor(Math.random() * dummyData.length)];
              addNode(parentId, 'followup', prompt, `${dummyAnswer} for: ${prompt}`);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PTree;