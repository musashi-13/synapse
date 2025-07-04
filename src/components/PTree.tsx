import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import Node from './PNode';
import NodeLink from './PLink';
import type { TreeNode } from '@/types/types';

const PTree: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialNode: TreeNode = {
    id: 'root',
    prompt: 'Enter your first prompt',
    type: 'root',
    children: [],
    x: 0,
    y: 0,
  };

  const [nodes, setNodes] = React.useState<TreeNode[]>([initialNode]);
  const [links, setLinks] = React.useState<{ source: string; target: string; type: string }[]>([]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    svg.attr('width', width).attr('height', height);

    const g = svg.select('g');
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));
  }, []);

  const addNode = useCallback((parentId: string, type: 'followup' | 'error' | 'sibling') => {
    console.log('addNode: Called with', { parentId, type });

    const newNodeId = `${parentId}-${Date.now()}`;
    console.log('addNode: Generated new node ID', newNodeId);

    setNodes((prevNodes) => {
      console.log('addNode: Current nodes', prevNodes);
      const parentNode = prevNodes.find((n) => n.id === parentId);
      if (!parentNode) {
        console.error('addNode: Parent node not found for ID', parentId);
        return prevNodes;
      }

      const newNode: TreeNode = {
        id: newNodeId,
        prompt: 'New prompt',
        type,
        children: [],
        x: type === 'sibling' ? parentNode.x + 200 : type === 'error' ? parentNode.x + 200 : parentNode.x,
        y: type === 'sibling' ? parentNode.y : parentNode.y + 200,
      };
      console.log('addNode: Created new node', newNode);

      let updatedNodes = prevNodes;
      if (type === 'sibling') {
        const grandParent = prevNodes.find((n) => n.children.includes(parentId));
        if (grandParent) {
          console.log('addNode: Found grandparent', grandParent.id);
          updatedNodes = prevNodes.map((node) =>
            node.id === grandParent.id
              ? { ...node, children: [...node.children, newNodeId] }
              : node
          );
        } else {
          console.log('addNode: No grandparent, attaching sibling to root');
          updatedNodes = prevNodes.map((node) =>
            node.id === 'root' ? { ...node, children: [...node.children, newNodeId] } : node
          );
        }
      } else {
        console.log('addNode: Adding child to parent', parentId);
        updatedNodes = prevNodes.map((node) =>
          node.id === parentId ? { ...node, children: [...node.children, newNodeId] } : node
        );
      }

      const newNodes = [...updatedNodes, newNode];
      console.log('addNode: Updated nodes', newNodes);
      return newNodes;
    });

    setLinks((prevLinks) => {
      const newLink = { source: parentId, target: newNodeId, type };
      console.log('addNode: Adding new link', newLink);
      return [...prevLinks, newLink];
    });
  }, []);

  console.log('PTree render: Current state', { nodes, links });

  return (
    <div ref={containerRef} className="w-full h-screen">
      <svg ref={svgRef}>
        <g>
          {links.map((link) => {
            const sourceNode = nodes.find((n) => n.id === link.source);
            const targetNode = nodes.find((n) => n.id === link.target);
            if (!sourceNode || !targetNode) {
              console.error('PTree render: Missing node for link', link);
              return null;
            }
            console.log('PTree render: Rendering link', link);
            return (
              <NodeLink
                key={`${link.source}-${link.target}`}
                source={sourceNode}
                target={targetNode}
                type={link.type}
              />
            );
          })}
          {nodes.map((node) => {
            console.log('PTree render: Rendering node', node);
            return (
              <Node
                key={node.id}
                node={node}
                onAddNode={(type) => {
                  console.log('PTree: Node onAddNode called', { nodeId: node.id, type });
                  addNode(node.id, type);
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default PTree;