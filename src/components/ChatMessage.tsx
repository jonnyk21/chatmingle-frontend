
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage as ChatMessageType } from '../types/chatTypes';
import { formatTimestamp } from '../utils/chatUtils';
import { cn } from '@/lib/utils';
import { Heart, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<string | null>(message.reaction || null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message]);

  const handleReaction = (newReaction: string) => {
    if (reaction === newReaction) {
      setReaction(null);
    } else {
      setReaction(newReaction);
    }
    setShowReactions(false);
  };

  if (message.isTyping) {
    return (
      <div 
        ref={messageRef}
        className={cn(
          "flex items-start mb-6",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div 
          className={cn(
            "px-4 py-3 rounded-2xl max-w-[80%] shadow-lg transition-all duration-300",
            isUser 
              ? "message-user ml-12 rounded-tr-sm" 
              : "message-bot rounded-tl-sm mr-12",
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
      <div ref={messageRef} className="flex justify-center my-6 animate-fade-in">
        <div className="px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium shadow-lg">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={messageRef}
      className={cn(
        "flex items-start mb-6 group",
        isUser 
          ? "justify-end animate-slide-in-left" 
          : "justify-start animate-slide-in-right"
      )}
    >
      <div 
        className={cn(
          "relative px-6 py-4 rounded-2xl max-w-[80%] shadow-md",
          "transition-all duration-300 ease-in-out",
          isUser 
            ? "message-user ml-12 rounded-tr-sm hover:shadow-lg transform hover:-translate-y-0.5" 
            : "message-bot rounded-tl-sm mr-12 hover:shadow-lg transform hover:-translate-y-0.5"
        )}
        onMouseEnter={() => !isUser && setShowReactions(true)}
        onMouseLeave={() => !isUser && setShowReactions(false)}
      >
        <p className="text-balance leading-relaxed">{message.content}</p>
        <div className={cn(
          "text-xs mt-2.5 opacity-70 font-medium flex items-center gap-2",
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

        {!isUser && showReactions && (
          <div className="absolute -bottom-12 right-0 flex bg-card/95 shadow-lg rounded-full p-1.5 space-x-1 animate-fade-in backdrop-blur-sm">
            <button 
              onClick={() => handleReaction('like')} 
              className="hover:bg-primary/10 p-2 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ThumbsUp size={14} className={reaction === 'like' ? "text-primary fill-primary" : ""} />
            </button>
            <button 
              onClick={() => handleReaction('dislike')} 
              className="hover:bg-primary/10 p-2 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ThumbsDown size={14} className={reaction === 'dislike' ? "text-destructive fill-destructive" : ""} />
            </button>
            <button 
              onClick={() => handleReaction('love')} 
              className="hover:bg-primary/10 p-2 rounded-full transition-all duration-200 hover:scale-110"
            >
              <Heart size={14} className={reaction === 'love' ? "text-primary fill-primary" : ""} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
