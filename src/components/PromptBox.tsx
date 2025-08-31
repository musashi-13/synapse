// src/components/PromptBox.tsx

import { useRef } from 'react';
import { FilePlus, Send } from 'lucide-react';

// 1. Update the props interface to receive state and handlers from the parent.
interface PromptBoxProps {
    prompt: string;
    disabled?: boolean;
    onPromptChange: (newPrompt: string) => void;
    onSubmit: (prompt: string) => void;
}

export default function PromptBox({ prompt, onPromptChange, onSubmit, disabled = false }: PromptBoxProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 2. The local `useState` for the prompt is removed.

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Auto-resize logic remains the same.
        textarea.style.height = "auto";
        const maxHeight = 128;
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";

        // 3. Instead of calling a local `setPrompt`, call the handler from the parent.
        onPromptChange(e.target.value);
    };

    // 4. The local handleSubmit is now much simpler.
    // It just prevents the default behavior and calls the parent's `onSubmit` function.
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt.trim());
            // Clear height logic can remain if needed, but clearing the prompt
            // itself is now handled by the parent.
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.overflowY = "hidden";
            }
        }
    };

    // 5. All `useAuth`, `useUser`, and API logic is removed from this component.

    return (
        <div>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-1 w-[800px] bg-zinc-900/30 border-2 border-zinc-600/50 rounded-xl p-2">
                <textarea
                    ref={textareaRef}
                    value={prompt} // Use the `prompt` from props
                    onChange={handleInput}
                    placeholder="Ask away..."
                    className="grow p-1.5 mt-1 w-full resize-none outline-none text-left text-white rounded-md bg-transparent max-h-32"
                    rows={1}
                    aria-label="Enter your prompt"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleFormSubmit(e);
                        }
                    }}
                />
                <div className="flex items-center w-full text-white ">
                    <button type="button" className="p-1 active:scale-90 duration-200">
                        <FilePlus size={20} />
                    </button>
                    <div className="flex-grow text-sm text-right flex-shrink-0 p-1 mr-4">
                        Gemini 2.5 pro
                    </div>
                    <button type="submit" disabled={disabled} className="p-2 rounded-full active:scale-90 duration-200">
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}