// routes.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const routes = {
    CREATE_NODE: `${BASE_URL}/nodes`
};

export default routes;