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
