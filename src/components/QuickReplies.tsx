
import React from 'react';
import { QuickReply } from '../types/chatTypes';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onSelect }) => {
  if (replies.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {replies.map((reply) => (
        <button
          key={reply.id}
          onClick={() => onSelect(reply.text)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
            "bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
            "border border-primary/20 shadow-sm hover:shadow-md",
            "transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          )}
        >
          <Sparkles size={12} className="text-primary" />
          {reply.text}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
