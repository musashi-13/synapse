import { Settings, SquarePen } from "lucide-react";

export default function Conversations() {
    return (
        <div className="min-h-screen w-56 pt-20 flex flex-col shrink-0 p-1.5 bg-zinc-900/30 border-r-2 border-zinc-600/50">
            
            <div className="flex flex-col gap-2 py-2">
                <button className="w-full text-sm flex items-center gap-2.5 ">
                    <SquarePen className="bg-zinc-800 text-zinc-300 p-2 rounded-lg w-9 h-9"/>
                    New Chat
                </button>
                <button className="w-full text-sm flex items-center gap-2.5 ">
                    <Settings className="bg-zinc-800 text-zinc-300 p-2 rounded-lg w-9 h-9"/>
                    Settings
                </button>
            </div>
            <h2 className="mt-4 font-bold text-sm p-1">Recents</h2>

        </div>
    );
    }