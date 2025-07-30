import { CircleCheck, InfoIcon } from 'lucide-react'; // Assuming you use lucide-react

interface AlertProps {
    message: string;
    type: 'info' | 'success' | 'error';
}

export default function Alert({ message, type }: AlertProps) {
    const icon = {
        info: <InfoIcon className="bg-zinc-800 text-zinc-300 p-2 rounded-lg w-9 h-9 shrink-0" />,
        success: <CircleCheck className="bg-zinc-800 text-green-400 p-2 rounded-lg w-9 h-9 shrink-0" />,
        error: <InfoIcon className="bg-zinc-800 text-red-400 p-2 rounded-lg w-9 h-9 shrink-0" />,
    }[type];


    return (
        <div className="bg-zinc-900/30 border-2 border-zinc-600/50 rounded-xl p-2 w-full">
            <div className="flex items-center gap-2">
                {icon}
                <p className={`text-sm`}>
                    {message}
                </p>
            </div>
        </div>
    );
}