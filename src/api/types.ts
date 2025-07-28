export namespace ApiTypes {
    export type CreateNodeRequest = {
        user_content: string;
        user_email: string;
    }

    export type CreateNodeResponse = {
        id: string;
        branch_id: string;
        parent_node_id: string;
        depth: number;
        user_content: string;
        ai_content: string;
        conversation_id: string;
    };
        
}