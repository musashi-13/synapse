// test._$convid.tsx
import { useEffect, useMemo } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { userPromptAtom } from '@/atoms';
import Sidebar from '@/components/Sidebar';
import PromptBox from '@/components/PromptBox';
import ReplyNode from '@/components/ReplyFlowNode';
import { useConversationNodesQuery, useCreateNodeMutation } from '@/api/queries';
import type { ApiTypes } from '@/api/types';
import { ReactFlow, ReactFlowProvider, useNodesState, useEdgesState, Controls, type Node as FlowNode, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type AppNode = FlowNode<ApiTypes.Node>;

const initialNodes: AppNode[] = [];
const initialEdges: Edge[] = [];

function FlowComponent({ conversationId }: { conversationId: string }) {
  const { data: apiNodes, isLoading, isError, error } = useConversationNodesQuery(conversationId);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // This effect transforms the fetched API data into React Flow nodes and edges
  useEffect(() => {
    if (apiNodes) {
      const flowNodes: AppNode[] = [];
      const flowEdges: Edge[] = [];

      apiNodes.forEach((apiNode, index) => {
        // Create a node for React Flow, assigning a position
        flowNodes.push({
          id: apiNode.id,
          position: { x: 0, y: index * 450 }, // Stack them vertically for simplicity (can be improved for branching)
          data: apiNode,
          type: 'replyNode', // The custom node type
        });

        // If the node has a parent, create an edge to connect them
        if (apiNode.parent_node_id) {
          flowEdges.push({
            id: `e-${apiNode.parent_node_id}-${apiNode.id}`,
            source: apiNode.parent_node_id,
            target: apiNode.id,
            animated: true,
            style: { stroke: '#6b7280', strokeWidth: 2 },
          });
        }
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [apiNodes, setNodes, setEdges]);

  // Define our custom node type
  const nodeTypes = useMemo(() => ({ replyNode: ReplyNode }), []);

  if (isLoading) return <div className="text-white w-full h-full flex items-center justify-center">Loading Flow...</div>;
  if (isError) return <div className="text-red-400 w-full h-full flex items-center justify-center">Error: {(error as Error).message}</div>;

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
    >
      <Controls />
    </ReactFlow>
  );
}

// This is the main route component that handles layout and user input
function RouteComponent() {
  const { convid } = useParams({ from: '/test/$convid' });
  const [prompt, setPrompt] = useAtom(userPromptAtom);
  const { data: nodes } = useConversationNodesQuery(convid); // Also needed here for the payload
  const createNodeMutation = useCreateNodeMutation();

  const handleSubmit = async (submittedPrompt: string) => {
    const latestNode = nodes && nodes.length > 0 ? nodes[nodes.length - 1] : null;

    const payload: ApiTypes.CreateNodeRequest = {
      user_content: submittedPrompt,
      user_email: "test@example.com", // This should come from Clerk's useUser hook
      conversation_id: convid,
      branch_id: latestNode ? latestNode.branch_id : undefined,
      parent_node_id: latestNode ? latestNode.id : undefined,
    };
    createNodeMutation.mutate(payload);
    setPrompt("");
  };

  return (
    <div className='flex relative h-screen'>
      <Sidebar />
      <div className='relative flex flex-col w-full items-center'>
        {/* The ReactFlowProvider is essential for the hooks to work */}
        <ReactFlowProvider>
          <FlowComponent conversationId={convid} />
        </ReactFlowProvider>

        <div className='absolute bottom-4 w-full flex justify-center'>
          <PromptBox
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={handleSubmit}
            disabled={createNodeMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/test/$convid')({
  component: RouteComponent,
});