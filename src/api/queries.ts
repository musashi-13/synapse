import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { fetchConversations } from "./client";


export function useConversationsQuery() {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) {
                throw new Error("User is not authenticated.");
            }
            const conversations = await fetchConversations(token);
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