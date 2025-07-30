import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// under the key 'userPrompt' and retrieve it on page load.
export const userPromptAtom = atomWithStorage<string>('userPrompt', '');


export interface ToastInfo {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

// This atom holds the array of all active toasts
export const toastsAtom = atom<ToastInfo[]>([]);

// A "write-only" atom to add a new toast to the list.
// We use a random ID for the key and to trigger re-renders.
export const addToastAtom = atom(
    null,
    (get, set, { message, type }: Omit<ToastInfo, 'id'>) => {
        const newToast: ToastInfo = {
            id: Date.now() + Math.random(),
            message,
            type,
        };
        set(toastsAtom, [...get(toastsAtom), newToast]);
    }
);

// A "write-only" atom to remove a toast by its ID.
export const removeToastAtom = atom(
    null,
    (get, set, toastId: number) => {
        set(
            toastsAtom,
            get(toastsAtom).filter((t) => t.id !== toastId)
        );
    }
);