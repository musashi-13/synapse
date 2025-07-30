import { useState, useEffect } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { userPromptAtom } from '@/atoms';
import Sidebar from '@/components/Sidebar';
import PromptBox from '@/components/PromptBox';
import ReplyNode, { type NodeData } from '@/components/ReplyNode';
// You will need these for making API calls on this page
// import { useAuth } from '@clerk/clerk-react';
// import { createNode, getNodesForConversation } from '@/api/client';

export const Route = createFileRoute('/chat_/$convid')({
    component: ConversationComponent,
});

function ConversationComponent() {
    // Get the dynamic conversationId from the URL
    const { convid } = useParams({ from: '/chat_/$convid' });
    const [prompt, setPrompt] = useAtom(userPromptAtom);
    const [nodes, setNodes] = useState<NodeData[]>([]);
    
    // This effect runs when the component loads to fetch the chat history
    useEffect(() => {
        const fetchHistory = async () => {
            console.log(`Fetching nodes for conversation: ${convid}`);
            // TODO: Create a new API endpoint and client function
            // to fetch all nodes for a given conversationId.
            // For example:
            // const token = await getToken();
            // const historyNodes = await getNodesForConversation(token, conversationId);
            // setNodes(historyNodes);
        };

        fetchHistory();
    }, [convid]); // It re-runs if the user navigates to a different conversation

    const handleSubmit = async (submittedPrompt: string) => {
        // console.log(`Adding prompt `${submittedPrompt}` to conversation ${conversationId}`);
        // TODO: Implement the API call to add a new node to this specific conversation.
        // The payload to your `createNode` function will need to include the
        // `conversation_id`, `branch_id`, and `parent_node_id`.
        // For example:
        // const latestNode = nodes[nodes.length - 1];
        // const newNode = await createNode(token, {
        //     user_content: submittedPrompt,
        //     user_email: email,
        //     conversation_id: conversationId,
        //     branch_id: latestNode.branch_id,
        //     parent_node_id: latestNode.id
        // });
        // setNodes(prev => [...prev, newNode]);
        setPrompt("");
    };

    return (
        <div className='flex relative h-screen'>
            <Sidebar />
            <div className='relative flex flex-col w-full items-center'>
                <div className='flex-grow w-full overflow-y-auto pb-24'>
                    <div className='relative flex flex-col items-center gap-6 p-4'>
                        {/* This page now maps over its own `nodes` state */}
                        {nodes.map((node) => (
                            <ReplyNode key={node.id} node={node} />
                        ))}
                    </div>
                </div>

                <div className='absolute bottom-4 w-full flex justify-center'>
                    <PromptBox
                        prompt={prompt}
                        onPromptChange={setPrompt}
                        onSubmit={handleSubmit}
                    />
                </div>
                {/* Your toast implementation would go here as well */}
            </div>
        </div>
    );
}