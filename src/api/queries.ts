// src/api/queries.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { createNode, fetchConversations, getConversationNodes } from "./client";
import { getContext } from "@/integrations/tanstack-query/root-provider";
import type { ApiTypes } from "./types";


export function useConversationsQuery() {
    const { getToken } = useAuth();
    const { user } = useUser();

    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const token = await getToken();
            
            if (!token || !user) {
                throw new Error("User is not authenticated.");
            }
            const email = user.primaryEmailAddress?.emailAddress;
            if (!email) {
                throw new Error("User email address is not available.");
            }
            const conversations = await fetchConversations(token, email);
            return conversations.sort((a, b) => 
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
        },
        // This option is important: it ensures the query will only run
        // when the `getToken` function from Clerk is available.
        enabled: !!getToken,
        retry: 3,
        refetchOnWindowFocus: false,
    });
}

export function useConversationNodesQuery(conversationId: string) {
    const { getToken } = useAuth();
    const { user } = useUser();

    return useQuery({
        queryKey: ['conversationNodes', conversationId],
        queryFn: async () => {
            const token = await getToken();
            
            if (!token || !user) {
                throw new Error("User is not authenticated.");
            }
            const email = user.primaryEmailAddress?.emailAddress;
            if (!email) {
                throw new Error("User email address is not available.");
            }
            const nodes = await getConversationNodes(token, email, conversationId);
            return nodes;
        },
        // This option is important: it ensures the query will only run
        // when the `getToken` function from Clerk is available.
        enabled: !!getToken && !!conversationId,
        retry: 3,
        refetchOnWindowFocus: false,
    });
}


export function useCreateNodeMutation() {
    const queryClient = getContext().queryClient;
    const { getToken } = useAuth();

    return useMutation({
        // The mutation function defines the async work to be done.
        mutationFn: async (payload: ApiTypes.CreateNodeRequest) => {
            const token = await getToken();
            if (!token) {
                throw new Error("User is not authenticated.");
            }
            return createNode(token, payload);
        },

        // The onSuccess callback is the magic. It runs after the mutation succeeds.
        onSuccess: (newNode, variables) => {
            console.log("Mutation successful, new node:", newNode);
            queryClient.setQueryData(
                ['conversationNodes', variables.conversation_id], 
                (oldData: ApiTypes.Node[] | undefined) => {
                    // If there's no old data, just return an array with the new node.
                    if (!oldData) return [newNode];
                    // Otherwise, append the new node to the existing array.
                    return [...oldData, newNode];
                }
            );
            
            // OPTIONAL but recommended: You can also invalidate the query to ensure the data is perfectly in sync with the backend eventually.
            // queryClient.invalidateQueries({ queryKey: ['conversationNodes', variables.conversation_id] });
        },

        onError: (error) => {
            console.error("Error creating node:", error);
        }
    });
}