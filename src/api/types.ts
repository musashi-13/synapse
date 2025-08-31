export namespace ApiTypes {
    export type CreateNodeRequest = {
        user_content: string;
        user_email: string;
        conversation_id?: string;
        branch_id?: string;
        parent_node_id?: string;    
    }

    export type CreateNodeResponse = {
        id: string;
        branch_id: string;
        parent_node_id: string | null;
        depth: number;
        user_content: string;
        ai_content: string;
        context_for_api: string;
        corrected_content: string | null;
        is_corrected: boolean;
        created_at: string;
        concise_context: string | null;
        conversation_id: string;
        
    };
    export type Conversation = {
        id: string;
        title: string;
        user_email_id: string;
        created_at: string;
        updated_at: string;
    };
    export type Node = {
        id: string;
        branch_id: string;
        parent_node_id: string | null;
        depth: number;
        user_content: string;
        ai_content: string;
        context_for_api: string;
        corrected_content: string | null;
        is_corrected: boolean;
        created_at: string;
        concise_context: string | null;
        conversation_id: string | null;
    }
}