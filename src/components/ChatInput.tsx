
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Mic, MicOff, Paperclip, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const EMOJI_LIST = ['👋', '😊', '👍', '❤️', '🎉', '🙌', '👏', '🤔', '😂', '🥳'];

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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

  const handleFileUpload = () => {
    // Placeholder for file upload functionality
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Here you would typically upload the file to a server
        // For now we'll just add a message saying the file was attached
        const fileName = file.name;
        setMessage(prev => prev + ` [File attached: ${fileName}]`);
      }
    };
    input.click();
  };

  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset textarea height when message is cleared
  useEffect(() => {
    if (message === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message]);

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-full mb-2 right-0 bg-card rounded-lg shadow-lg p-2 border border-border z-10 animate-fade-in"
        >
          <div className="flex flex-wrap gap-1.5 max-w-[240px]">
            {EMOJI_LIST.map(emoji => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="w-8 h-8 text-lg flex items-center justify-center hover:bg-primary/10 rounded-md transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={cn(
        "relative flex items-end rounded-2xl p-2",
        "glass transition-all duration-300 border-2 border-primary/10",
        disabled ? "opacity-70" : "glass-hover"
      )}>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full"
          disabled={disabled}
          onClick={handleFileUpload}
        >
          <Paperclip size={20} />
        </Button>
        
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
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="rounded-full"
            disabled={disabled}
          >
            <Smile size={20} />
          </Button>
          
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
