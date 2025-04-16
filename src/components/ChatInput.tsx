
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useModel } from '@/contexts/ModelContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedModel } = useModel();
  
  // Handle sending a message
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  // Handle pressing Enter (without shift) to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="relative">
      <div className="relative flex flex-col rounded-lg border border-border/60 bg-background shadow-sm">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${selectedModel.name}...`}
          disabled={disabled}
          className={cn(
            "min-h-[60px] max-h-[200px] resize-none border-0 p-4 pr-16",
            "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            "scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-border/60"
          )}
        />
        
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
          >
            <Paperclip size={18} />
            <span className="sr-only">Attach a file</span>
          </Button>
          
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled}
            onClick={handleSend}
            className={cn(
              "h-8 w-8 rounded-full bg-primary text-primary-foreground",
              "hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            )}
          >
            <SendHorizontal size={16} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      
      {selectedModel.isPremium && (
        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>Using {selectedModel.name} - Premium model</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
