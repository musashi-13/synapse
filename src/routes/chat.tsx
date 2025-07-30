// src/routes/test/chat.tsx

import Conversations from '@/components/Conversations';
import PromptBox from '@/components/PromptBox';
import ReplyNode, { type NodeData } from '@/components/ReplyNode';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import type { ApiTypes } from '@/api/types';
import { createNode } from '@/api/client';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { addToastAtom, toastsAtom, userPromptAtom } from '@/atoms';
import Toast from '@/components/Toast';

export const Route = createFileRoute('/chat')({
    component: RouteComponent,
});

function RouteComponent() {
    // 1. State for the prompt is now held in the parent.
    const [prompt, setPrompt] = useAtom(userPromptAtom);
    const toasts = useAtomValue(toastsAtom);
    const addToast = useSetAtom(addToastAtom);

    const [nodes, setNodes] = useState<NodeData[]>([]);

    const { getToken } = useAuth();
    const { user } = useUser();

    // 2. The API submission logic now lives in the parent.
    const handleSubmit = async (submittedPrompt: string) => {
        if (!user || !getToken) {
            console.error("User or auth not available.");
            return;
        }
        addToast({
            message: 'Please Try again later',
            type: 'error',
        });

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
            console.log("Submitting payload from parent:", payload);
            console.log("Submitting payload from parent:", payload);
            const newNode = await createNode(token, payload);
            console.log("createNode response:", newNode);

            setNodes(prevNodes => [...prevNodes, newNode]);
        } catch (error) {
            console.error("createNode error:", error);
        } finally {
            // 3. Clear the prompt after submission.
            setPrompt("");
        }
    };

    return (
        <div className='flex relative'>
            <Conversations />
            <div className='relative flex flex-col w-full items-center justify-center'>
                <div className='relative flex flex-col items-center gap-6 p-4'>
                        {/* 3. This section now maps over the `nodes` state. */}
                        {nodes.length === 0 ? (
                            // If there are no nodes, show the welcome message.
                            (<div className="text-center text-white">
                                <h1 className="text-3xl font-bold">Good Evening, {user?.firstName}</h1>
                                <h2 className="text-xl text-zinc-400 mt-2">Elevate your project with Synapse!</h2>
                            </div>)
                        ) : (
                            // Otherwise, render a ReplyNode for each node in the state.
                            (nodes.map((node) => (
                                <ReplyNode key={node.id} node={node} />
                            )))
                        )}
                    </div>
                <div className='absolute bottom-4 w-full flex justify-center'>
                    {/* 4. Pass the state and handlers down to PromptBox */}
                    <PromptBox
                        prompt={prompt}
                        onPromptChange={setPrompt}
                        onSubmit={handleSubmit}
                    />
                </div>
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
    )
}