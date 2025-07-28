import { Ky } from "./api";

export async function fetchUserConversations(token: string): Promise<
  { id: string; title: string; lastMessage: string }[]
> {
  return Ky.get('api/conversations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    }).json();
}

        