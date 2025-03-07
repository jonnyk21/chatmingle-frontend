
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Placeholder for actual voice recording functionality
  };

  // Reset textarea height when message is cleared
  useEffect(() => {
    if (message === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message]);

  return (
    <div className="relative">
      <div className={cn(
        "relative flex items-end rounded-2xl p-2",
        "glass transition-all duration-300 border-2 border-primary/10",
        disabled ? "opacity-70" : "glass-hover"
      )}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent border-0 outline-none resize-none py-3 px-3 max-h-[150px]",
            "placeholder:text-muted-foreground focus:ring-0 text-base rounded-xl"
          )}
          rows={1}
        />
        <div className="flex items-center space-x-2 px-2">
          <Button 
            variant="ghost" 
            size="icon" 
            type="button" 
            onClick={toggleRecording}
            className={cn(
              "rounded-full transition-all duration-300",
              isRecording ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
            )}
            disabled={disabled}
          >
            {isRecording ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
          </Button>
          
          <Button 
            onClick={handleSendMessage}
            size="icon"
            className={cn(
              "rounded-full transition-all duration-300",
              "bg-gradient-primary hover:shadow-md text-white",
              !message.trim() && "opacity-70 pointer-events-none"
            )}
            disabled={!message.trim() || disabled}
          >
            <SendHorizontal size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
