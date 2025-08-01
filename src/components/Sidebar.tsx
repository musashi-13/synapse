import { Settings, SquarePen } from "lucide-react";
import { useConversationsQuery } from "@/api/queries"; // 1. Import your new custom hook
import { Link } from "@tanstack/react-router";
import Loader from "./Loader";
import Alert from "./Alert";

export default function Sidebar() {

    const { data: conversations, isLoading, isError } = useConversationsQuery();

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
            <div className="flex flex-col gap-1 mt-2 overflow-y-auto p-1">
                {isLoading && <div className="w-full"><Loader/></div>}
                {isError && (
                    <Alert 
                        type="error" 
                        message="Failed to load conversations." 
                    />
                )}

                {conversations?.map(convo => (
                    <Link
                        key={convo.id}
                        to="/chat/$convid"
                        params={{ convid: convo.id }}
                        className="p-2 text-sm rounded-md hover:bg-zinc-700/50 truncate"
                        activeProps={{ className: 'bg-zinc-700 font-bold' }}
                    >
                        {convo.title}
                    </Link>
                ))}
            </div>
        </div>
    );
    }