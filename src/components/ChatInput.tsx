
import React, { useState, useEffect } from 'react';
import { SendHorizontal, Paperclip, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useModel } from '@/contexts/ModelContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled, inputRef }) => {
  const [message, setMessage] = useState('');
  const localInputRef = React.useRef<HTMLTextAreaElement>(null);
  const { selectedModel } = useModel();
  
  // Use provided ref or fall back to local ref
  const textareaRef = inputRef || localInputRef;
  
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
  }, [message, textareaRef]);

  return (
    <div className="relative">
      <div 
        className={cn(
          "relative flex flex-col rounded-lg", 
          "border border-border/60 shadow-sm",
          "bg-background transition-shadow",
          "focus-within:shadow-md focus-within:border-primary/40"
        )}
      >
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
            "scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-border/60",
            "placeholder:text-muted-foreground/70 transition-colors",
          )}
        />
        
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 transition-all duration-200"
          >
            <Paperclip size={18} className="transition-transform hover:rotate-15 duration-200" />
            <span className="sr-only">Attach a file</span>
          </Button>
          
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled}
            onClick={handleSend}
            className={cn(
              "h-8 w-8 rounded-full bg-primary text-primary-foreground",
              "hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground",
              "transition-all duration-200 hover:scale-105 active:scale-95",
            )}
          >
            <SendHorizontal size={16} className={cn(
              "transition-transform",
              message.trim() && !disabled ? "group-hover:translate-x-1" : ""
            )} />
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
