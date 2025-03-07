
import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../types/chatTypes';
import { formatTimestamp } from '../utils/chatUtils';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message]);

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
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-200"></div>
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
        "flex items-start mb-4",
        isUser 
          ? "justify-end animate-slide-in-left" 
          : "justify-start animate-slide-in-right"
      )}
    >
      <div 
        className={cn(
          "px-5 py-3.5 rounded-2xl max-w-[80%] shadow-md transition-all duration-300",
          isUser 
            ? "message-user ml-12 rounded-tr-none" 
            : "message-bot rounded-tl-none mr-12"
        )}
      >
        <p className="text-balance leading-relaxed">{message.content}</p>
        <div className={cn(
          "text-xs mt-1.5 opacity-70 font-medium",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
