
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

  // For typing animation
  if (message.isTyping) {
    return (
      <div 
        ref={messageRef}
        className={cn(
          "flex items-start mb-4 animate-fade-in",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div 
          className={cn(
            "px-4 py-3 rounded-2xl max-w-[80%] shadow-md",
            isUser 
              ? "message-user ml-12 rounded-tr-none" 
              : "message-bot rounded-tl-none mr-12",
            "animate-pulse-subtle"
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

  // System message (centered, informational)
  if (isSystem) {
    return (
      <div ref={messageRef} className="flex justify-center my-4 animate-fade-in">
        <div className="px-5 py-2.5 rounded-full bg-gradient-accent text-white text-sm font-medium shadow-md">
          {message.content}
        </div>
      </div>
    );
  }

  // Regular message (user or bot)
  return (
    <div 
      ref={messageRef}
      className={cn(
        "flex items-start mb-4 group",
        isUser 
          ? "justify-end animate-slide-in-left" 
          : "justify-start animate-slide-in-right"
      )}
    >
      <div 
        className={cn(
          "relative px-5 py-3.5 rounded-2xl max-w-[80%] shadow-md transition-all duration-300",
          isUser 
            ? "message-user ml-12 rounded-tr-none hover:shadow-lg transform hover:-translate-y-0.5" 
            : "message-bot rounded-tl-none mr-12 hover:shadow-lg transform hover:-translate-y-0.5"
        )}
        onMouseEnter={() => !isUser && setShowReactions(true)}
        onMouseLeave={() => !isUser && setShowReactions(false)}
      >
        <p className="text-balance leading-relaxed">{message.content}</p>
        <div className={cn(
          "text-xs mt-1.5 opacity-70 font-medium",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTimestamp(message.timestamp)}
          {isUser && message.status && (
            <span className="ml-2">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && (
                <span className="text-primary">✓✓</span>
              )}
            </span>
          )}
        </div>
        
        {/* Reaction display */}
        {reaction && (
          <div className={cn(
            "absolute -bottom-3 p-0.5 rounded-full bg-background shadow-sm",
            isUser ? "left-2" : "right-2"
          )}>
            {reaction === 'like' && <ThumbsUp size={16} className="text-primary fill-primary" />}
            {reaction === 'dislike' && <ThumbsDown size={16} className="text-destructive fill-destructive" />}
            {reaction === 'love' && <Heart size={16} className="text-primary fill-primary" />}
          </div>
        )}
        
        {/* Reaction buttons (only show for bot messages) */}
        {!isUser && showReactions && (
          <div className="absolute -bottom-9 right-0 flex bg-card shadow-md rounded-full p-1 space-x-1 animate-fade-in">
            <button 
              onClick={() => handleReaction('like')} 
              className="hover:bg-primary/10 p-1.5 rounded-full transition-colors"
            >
              <ThumbsUp size={14} className={reaction === 'like' ? "text-primary fill-primary" : ""} />
            </button>
            <button 
              onClick={() => handleReaction('dislike')} 
              className="hover:bg-primary/10 p-1.5 rounded-full transition-colors"
            >
              <ThumbsDown size={14} className={reaction === 'dislike' ? "text-destructive fill-destructive" : ""} />
            </button>
            <button 
              onClick={() => handleReaction('love')} 
              className="hover:bg-primary/10 p-1.5 rounded-full transition-colors"
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
