

// IMPORTANT: Adjust this import path to where your Icons are located.
import { DiscussIcon, DebugIcon } from './Icons'; 

// --- TYPE DEFINITIONS ---

// This is the shape of the `data` object for our custom node.
export type ReplyNodeData = {
  prompt: string;
  response: string;
  summary: string;
};

// Props for the summary view component
interface SummaryBoxProps {
    summary: string;
}


// --- COMPONENTS ---

// The detailed view of a node
export default function ReplyBox({prompt, response, summary}: ReplyNodeData) {
  return (
    <div className="flex flex-col text-white w-full max-w-[800px] ">
      <div className="flex flex-col gap-4 p-4 border-2 border-zinc-600/50 bg-zinc-900/50 backdrop-blur-sm rounded-xl w-full">
        <p className="w-full p-3 rounded-xl rounded-br-none bg-zinc-700/80">{prompt}</p>
      </div>
      <div className="flex gap-2 my-2">
        <button className="flex items-center gap-1 px-4 py-2 border-2 border-zinc-600/50 bg-zinc-900/50 backdrop-blur-sm rounded-full text-sm hover:bg-zinc-800 transition-colors">
          Discuss <DiscussIcon />
        </button>
        <button className="flex items-center gap-1 px-4 py-2 border-2 border-zinc-600/50 bg-zinc-900/50 backdrop-blur-sm rounded-full text-sm hover:bg-zinc-800 transition-colors">
          Debug <DebugIcon />
        </button>
      </div>
    </div>
  );
}

// The compact view of a node for when zoomed out
function SummaryBox({ summary }: SummaryBoxProps) {
    return (
        <div className="p-3 border-2 text-white border-zinc-600/50 bg-zinc-900/80 backdrop-blur-sm rounded-lg max-w-[200px] w-full text-xs">
            {summary}
        </div>
    );
}
