// D:/Synapse/src/lib/api.ts
import axios from 'axios';

// Read the base URL from the Vite environment variable we created
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!VITE_API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in your .env.local file");
}

// Create a central Axios instance for all frontend API calls
export const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
});

// --- Example API Function ---
// It's good practice to define your API calls here
// This is the function you'll use in your TanStack Query mutation

interface NewNodePayload {
    user_content: string;
    conversation_id?: string;
    branch_id?: string;
    parent_node_id?: string;
}

export const postNewNode = async (payload: NewNodePayload) => {
    const { data } = await apiClient.post('/nodes', payload);
    return data; // This will be the new node object
};