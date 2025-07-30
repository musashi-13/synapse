import Sidebar from '@/components/Sidebar';
import PromptBox from '@/components/PromptBox';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ApiTypes } from '@/api/types';
import { createNode } from '@/api/client';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { addToastAtom, toastsAtom, userPromptAtom } from '@/atoms';
import { conversationsAtom, type ConversationInfo } from '@/atoms';
import Toast from '@/components/Toast';

export const Route = createFileRoute('/chat')({
    component: NewChatComponent,
});

function NewChatComponent() {
    const [prompt, setPrompt] = useAtom(userPromptAtom);
    const setConversations = useSetAtom(conversationsAtom);
    const navigate = useNavigate(); // Hook for navigation

    const { getToken } = useAuth();
    const { user } = useUser();

    // Your existing toast implementation
    const toasts = useAtomValue(toastsAtom);
    const addToast = useSetAtom(addToastAtom);

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

        const payload: ApiTypes.CreateNodeRequest = {
            user_content: submittedPrompt,
            user_email: email,
        };

        try {
            const newNode = await createNode(token, payload);

            // Create a new conversation object for the sidebar
            const newConversation: ConversationInfo = {
                id: newNode.conversation_id,
                title: submittedPrompt.substring(0, 40) + (submittedPrompt.length > 40 ? '...' : ''),
            };

            // Add the new conversation to the global list
            setConversations(prev => [newConversation, ...prev]);

            // Navigate to the new dynamic page for this conversation
            navigate({ to: `/chat/${newNode.conversation_id}` });

        } catch (error) {
            console.error("createNode error:", error);
            addToast({ message: 'Failed to start new chat.', type: 'error' });
        } finally {
            setPrompt("");
        }
    };

    return (
        <div className='flex relative h-screen'>
            <Sidebar />
            <div className='relative flex flex-col gap-8 w-full items-center justify-center'>
                {/* This page no longer displays nodes, only the welcome message */}
                <div className="text-center text-white">
                    <h1 className="text-3xl font-bold">Good Evening, {user?.firstName}</h1>
                    <h2 className="text-xl text-zinc-400 mt-2">Elevate your project with Synapse!</h2>
                </div>
                <PromptBox
                        prompt={prompt}
                        onPromptChange={setPrompt}
                        onSubmit={handleSubmit}
                    />

                
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                    />
                ))}
            </div>
        </div>
    );
}