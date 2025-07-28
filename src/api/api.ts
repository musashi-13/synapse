// api.ts
import ky from 'ky';


export const Ky = ky.create({
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

