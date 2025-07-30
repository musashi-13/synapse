// src/components/Toast.tsx

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { removeToastAtom, type ToastInfo } from '@/atoms';
import { CircleCheck, InfoIcon } from 'lucide-react';


export default function Toast({ id, message, type }: ToastInfo) {
    const removeToast = useSetAtom(removeToastAtom);

    // Set up the self-destruction timer when the component mounts.
    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(id);
        }, 3000); // 5 seconds

        // Cleanup function to clear the timer if the component is unmounted early
        return () => {
            clearTimeout(timer);
        };
    }, [id, removeToast]);



    return (
        <div className={`absolute right-4 bottom-4 w-56 overflow-hidden bg-zinc-900/30 backdrop-blur-sm border-2 pb-2 border-zinc-600/50 rounded-xl p-1 shadow-lg`}>
            <div className="text-sm flex gap-1.5 items-center">
                
                {type==="info" && <InfoIcon className="bg-zinc-800 text-zinc-300 p-2 rounded-lg w-9 h-9" />}
                {type==="success" && <CircleCheck className="bg-zinc-800 text-green-300 p-2 rounded-lg w-9 h-9"/>}
                {type==="error" && <InfoIcon className="bg-zinc-800 text-red-300 p-2 rounded-lg w-9 h-9"/>}

                <span>{message}</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-zinc-600 w-full">
                {/* The timer bar that animates */}
                <div className="h-full bg-zinc-400 animate-shrink"></div>
            </div>
        </div>
    );
}