// chat_.$convid.tsx
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useAtom, useSetAtom } from 'jotai';
import { addToastAtom, userPromptAtom, type ConversationInfo } from '@/atoms';
import Sidebar from '@/components/Sidebar';
import PromptBox from '@/components/PromptBox';
import ReplyNode from '@/components/ReplyNode';
import { useConversationNodesQuery, useCreateNodeMutation } from '@/api/queries';
import { useAuth, useUser } from '@clerk/clerk-react';
import type { ApiTypes } from '@/api/types';
import { createNode } from '@/api/client';

export const Route = createFileRoute('/chat_/$convid')({
    component: ConversationComponent,
});


function ConversationComponent() {
    // Get the dynamic conversationId from the URL
    const { convid } = useParams({ from: '/chat_/$convid' });
    const [prompt, setPrompt] = useAtom(userPromptAtom);    
    const { data: nodes, isLoading, isError, error } = useConversationNodesQuery(convid);
    const { getToken } = useAuth();
    const { user } = useUser();
    const addToast = useSetAtom(addToastAtom);
    const createNodeMutation = useCreateNodeMutation();
    
    const handleSubmit = async (submittedPrompt: string) => {
        if (!user || !getToken) {
            console.error("User or auth not available.");
            return;
        }

        const token = await getToken();
        const email = user.primaryEmailAddress?.emailAddress;

        if (!token || !email) {
            console.error("Token or email not available.");
            return;
        }
        const latestNode = nodes && nodes.length > 0 ? nodes[nodes.length - 1] : null;

        const payload: ApiTypes.CreateNodeRequest = {
            user_content: submittedPrompt,
            user_email: email,
            conversation_id: convid,
            branch_id: latestNode ? latestNode.branch_id : undefined,
            parent_node_id: latestNode ? latestNode.id : undefined,
        };
        createNodeMutation.mutate(payload);
        setPrompt("");
    };

    function Nodes() {
        if (isLoading) {
            return <div>Loading...</div>;
        }
        if (isError) {
            return <div>Error: {(error as Error).message}</div>;
        }
        if (!nodes || nodes.length === 0) {
            return <div>No messages yet. Start the conversation!</div>;
        }
        return (
            <>
                {nodes.map((node) => (
                    <ReplyNode key={node.id} node={node} />
                ))}
            </>
        );
    }


    return (
        <div className='flex relative h-screen'>
            <Sidebar />
            <div className='relative flex flex-col w-full items-center'>
                <div className='flex-grow w-full overflow-y-auto pb-24'>
                    <div className='relative flex flex-col items-center gap-6 p-4'>
                        
                        <Nodes />
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