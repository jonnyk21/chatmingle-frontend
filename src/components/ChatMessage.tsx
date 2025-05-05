
import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../types/chatTypes';
import { formatTimestamp } from '../utils/chatUtils';
import { cn } from '@/lib/utils';
import { Heart, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<string | null>(message.reaction || null);
  const [isCopied, setIsCopied] = useState(false);

  const handleReaction = (newReaction: string) => {
    if (reaction === newReaction) {
      setReaction(null);
    } else {
      setReaction(newReaction);
    }
    setShowReactions(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Message content copied to clipboard",
        });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Could not copy message to clipboard",
          variant: "destructive"
        });
      });
  };

  if (message.isTyping) {
    return (
      <div 
        className={cn(
          "flex items-start mb-4 sm:mb-6",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div 
          className={cn(
            "px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-[85%] sm:max-w-[80%] shadow-sm",
            isUser 
              ? "message-user ml-8 sm:ml-12 rounded-tr-sm" 
              : "message-bot rounded-tl-sm mr-8 sm:mr-12",
            "animate-pulse-subtle glass"
          )}
        >
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 sm:my-6 animate-fade-in px-4">
        <div className="px-4 sm:px-6 py-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm text-xs sm:text-sm font-medium shadow-sm border border-primary/10">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-start mb-4 sm:mb-6 group/message",
        isUser 
          ? "justify-end animate-slide-in-left" 
          : "justify-start animate-slide-in-right"
      )}
    >
      <div 
        className={cn(
          "relative px-4 sm:px-6 py-3 sm:py-4 rounded-2xl max-w-[85%] sm:max-w-[80%]",
          "transition-all duration-300 ease-in-out",
          isUser 
            ? "message-user ml-8 sm:ml-12 rounded-tr-sm hover:shadow-md transform hover:-translate-y-0.5" 
            : "message-bot rounded-tl-sm mr-8 sm:mr-12 hover:shadow-md transform hover:-translate-y-0.5"
        )}
        onMouseEnter={() => !isUser && setShowReactions(true)}
        onMouseLeave={() => !isUser && setShowReactions(false)}
      >
        <p className="text-sm sm:text-base text-balance leading-relaxed whitespace-pre-line">{message.content}</p>
        
        <div className={cn(
          "text-[10px] sm:text-xs mt-2 sm:mt-2.5 opacity-70 font-medium flex items-center gap-2",
          isUser ? "justify-end" : "justify-start"
        )}>
          {formatTimestamp(message.timestamp)}
          {isUser && message.status && (
            <span className="flex items-center gap-0.5">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && (
                <span className="text-primary">✓✓</span>
              )}
            </span>
          )}
        </div>

        {reaction && (
          <div className={cn(
            "absolute -bottom-3 p-1 rounded-full bg-background/95 shadow-lg backdrop-blur-sm",
            "transition-all duration-300 ease-in-out transform hover:scale-110",
            isUser ? "left-2" : "right-2"
          )}>
            {reaction === 'like' && <ThumbsUp size={16} className="text-primary fill-primary" />}
            {reaction === 'dislike' && <ThumbsDown size={16} className="text-destructive fill-destructive" />}
            {reaction === 'love' && <Heart size={16} className="text-primary fill-primary" />}
          </div>
        )}

        {/* Copy button that appears on hover */}
        <div className={cn(
          "absolute bottom-2 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity",
        )}>
          <button 
            onClick={copyToClipboard}
            className={cn(
              "p-1.5 rounded-full bg-background/80 hover:bg-background shadow-sm",
              "transition-all duration-200 hover:scale-110"
            )}
            title="Copy message"
          >
            {isCopied ? (
              <Check size={14} className="text-primary" />
            ) : (
              <Copy size={14} className="text-muted-foreground" />
            )}
          </button>
        </div>

        {!isUser && showReactions && (
          <div className="absolute -bottom-12 right-0 flex bg-card/95 shadow-sm rounded-full p-1.5 space-x-1 animate-fade-in backdrop-blur-sm border border-border/40">
            <button 
              onClick={() => handleReaction('like')} 
              className="hover:bg-primary/10 p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110"
              title="Like"
            >
              <ThumbsUp size={12} className={reaction === 'like' ? "text-primary fill-primary" : ""} />
            </button>
            <button 
              onClick={() => handleReaction('dislike')} 
              className="hover:bg-primary/10 p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110"
              title="Dislike"
            >
              <ThumbsDown size={12} className={reaction === 'dislike' ? "text-destructive fill-destructive" : ""} />
            </button>
            <button 
              onClick={() => handleReaction('love')} 
              className="hover:bg-primary/10 p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110"
              title="Love"
            >
              <Heart size={12} className={reaction === 'love' ? "text-primary fill-primary" : ""} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
