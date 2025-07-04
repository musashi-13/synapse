import { useRef } from "react";
import { SendIcon } from "./Icons";

interface PromptBoxProps {
  onSubmit: (prompt: string) => void;
}

export default function PromptBox({ onSubmit }: PromptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to shrink if needed
    textarea.style.height = "auto";

    // Calculate new height but cap it at max height (e.g., 16rem = 256px)
    const maxHeight = 128; // 64 * 4px (Tailwind's unit)
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;

    // If content exceeds max height, enable scroll
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (textarea && textarea.value.trim()) {
      onSubmit(textarea.value.trim());
      textarea.value = ''; // Clear the textarea after submission
      textarea.style.height = "auto"; // Reset height
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center justify-center w-full p-2">
      <textarea
        ref={textareaRef}
        onInput={handleInput}
        placeholder="Ask away!"
        className="grow p-4 resize-none text-sm outline-none text-left text-white bg-zinc-900 rounded-md h-12 max-h-64 overflow-hidden"
        rows={1}
      />
      <button type="submit" className="p-2">
        <SendIcon />
      </button>
    </form>
  );
}