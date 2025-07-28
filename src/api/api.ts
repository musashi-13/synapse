import ky from 'ky';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const Ky = ky.create({
    prefixUrl: API_BASE_URL,
    hooks: {
        beforeRequest: [],
        beforeError: [],
    },
    headers: {
        'ngrok-skip-browser-warning': import.meta.env.DEV ? 'true' : 'any',
        'Content-Type': 'application/json',
    },
    throwHttpErrors: true,
});

