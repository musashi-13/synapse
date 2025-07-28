import { useState, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import type { ApiTypes } from '../api/types';
import { createNode } from '@/api/client';
import { FilePlus, Send } from 'lucide-react';

interface PromptBoxProps {
  onSubmit: (prompt: string) => void;
}

export default function PromptBox({ onSubmit }: PromptBoxProps) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = 128; // 8rem or max-h-32
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    
    setPrompt(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      setPrompt(""); // Clear prompt after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  };
  const { getToken } = useAuth();
  const { user } = useUser();

  const handleTest = async () => {
    console.log("Test button clicked");

    if (!user) {
      console.error("User not available");
      return;
    }

    const token = await getToken();
    if (!token) {
      console.error("Token not available");
      return;
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.error("Email not available");
      return;
    }

    const payload: ApiTypes.CreateNodeRequest = {
      user_content: "Tell me the capital of France",
      user_email: 'kaushik.bhat@test.dev',
    };

    try {
        console.log(payload)
      const response = await createNode(token, payload);
      console.log("createNode response:", response);
    } catch (error) {
      console.error("createNode error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-1  w-[800px] bg-zinc-900/30 border-2 border-zinc-600/50 rounded-xl p-2">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          placeholder="Ask away..."
          className="grow p-1.5 w-full resize-none outline-none text-left text-white rounded-md bg-transparent max-h-32"
          rows={1}
          aria-label="Enter your prompt"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-center w-full text-white">
          <button type="button" onClick={handleTest} className="p-1">
            <FilePlus size={20}/>
          </button>
          <div className="flex-grow text-sm text-right flex-shrink-0 p-1 mr-4">
            Gemini 2.5 pro
          </div>
          <button type="submit" className="p-2 rounded-full ">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

