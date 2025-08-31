// client.ts
import { Ky } from "./api";
import routes from "./routes";
import type { ApiTypes } from "./types";

export async function createNode(token: string, props: ApiTypes.CreateNodeRequest): Promise<ApiTypes.CreateNodeResponse> {
  return Ky.post(routes.CREATE_NODE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({...props})
    }).json();
}


//change this to get request with token in header
export async function fetchConversations(token: string, user_email: string): Promise<ApiTypes.Conversation[]> {
    return Ky.post(routes.FETCH_CONVERSATIONS, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({user_email})
    }).json();
}

//change this to get request with token in header
export async function getConversationNodes(token: string, user_email: string, conversation_id: string): Promise<ApiTypes.Node[]> {
    return Ky.post(`${routes.FETCH_CONVERSATIONS}/${conversation_id}/nodes`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({user_email})
    }).json();
}