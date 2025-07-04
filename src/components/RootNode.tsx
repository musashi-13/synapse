import React, { useRef, useState, useEffect } from 'react';
import type { TreeNode } from '@/types/types';
import { AskIcon, RepairIcon, SendIcon } from './Icons';
import { dummyData } from '@/dummy-data';
import { bottomPromptBox } from '../atoms'; // Updated to use your atom
import { useSetAtom } from 'jotai';

interface NodeProps {
  node: TreeNode;
  onAddNode: (type: 'followup' | 'error' | 'sibling') => void;
  onUpdateNode?: (updatedNode: TreeNode) => void;
}

const RootNode: React.FC<NodeProps> = ({ node, onAddNode, onUpdateNode }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPromptBox, setShowPromptBox] = useState(true);
  const [prompt, setPrompt] = useState(node.prompt || '');
  const [answer, setAnswer] = useState(node.answer || '');
    const setShowBottomPrompt = useSetAtom(bottomPromptBox); // Use useSetAtom

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const maxHeight = 128;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  const fetchAnswer = (userPrompt: string) => {
    const randomAnswer = dummyData[Math.floor(Math.random() * dummyData.length)];
    return `${randomAnswer} for: ${userPrompt}`;
  };

  const handleSubmitPrompt = () => {
    const textarea = textareaRef.current;
    if (!textarea || !textarea.value.trim()) return;

    const userPrompt = textarea.value.trim();
    setPrompt(userPrompt);
    setShowPromptBox(false);

    const fetchedAnswer = fetchAnswer(userPrompt);
    setAnswer(fetchedAnswer);

    const updatedNode = {
      ...node,
      prompt: userPrompt,
      answer: fetchedAnswer,
      height: node.height + (fetchedAnswer ? 100 : 0),
    };
    if (onUpdateNode) onUpdateNode(updatedNode);

    setShowBottomPrompt(true);
    textarea.value = '';
    textarea.style.height = 'auto';
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, [prompt, answer]);

  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      <foreignObject x="0" y="0" width="800" height={node.height || 200}>
        <div className="flex flex-col gap-2 h-full w-full bg-zinc-900/20 border-2 border-zinc-600/50 rounded-xl p-4">
          {showPromptBox ? (
            <div className="flex gap-2 items-center justify-center w-full">
              <textarea
                ref={textareaRef}
                onInput={handleInput}
                placeholder="Ask away!"
                className="grow p-4 resize-none text-sm outline-none text-left text-white bg-zinc-900 rounded-md h-12 max-h-64 overflow-hidden"
                rows={1}
              />
              <button onClick={handleSubmitPrompt} className="p-2">
                <SendIcon />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-zinc-200 text-sm">{prompt}</p>
              {answer && <p className="text-zinc-400 text-sm">{answer}</p>}
            </div>
          )}
          <div className="flex gap-1 px-1 pb-1">
            <button
              className="font-semibold rounded-full bg-zinc-900/20 border-2 border-zinc-600/50 p-2"
              onClick={() => onAddNode('error')}
            >
              <RepairIcon />
            </button>
            <button
              className="font-semibold rounded-full bg-zinc-900/20 border-2 border-zinc-600/50 p-2"
              onClick={() => onAddNode('sibling')}
            >
              <AskIcon />
            </button>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default RootNode;