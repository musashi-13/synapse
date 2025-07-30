// routes.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const routes = {
    CREATE_NODE: `${BASE_URL}/nodes`,
    FETCH_CONVERSATIONS: `${BASE_URL}/conversations`
};

export default routes;