
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatMessage as ChatMessageType } from '../types/chatTypes';
import { formatDate, formatTimestamp, generateId, getInitialMessages, getBotResponse } from '../utils/chatUtils';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>(getInitialMessages());
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    // Scroll to bottom on initial render
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;
    
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateId(),
      content,
      type: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Update message status to "delivered" after a short delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 500);
    
    // Add typing indicator
    const typingIndicatorId = generateId();
    setMessages(prev => [...prev, {
      id: typingIndicatorId,
      content: '',
      type: 'bot',
      timestamp: new Date(),
      isTyping: true
    }]);
    
    setIsLoading(true);
    
    try {
      // Get bot response
      const responseText = await getBotResponse(content);
      
      // Remove typing indicator and add bot response
      setMessages(prev => 
        prev.filter(msg => msg.id !== typingIndicatorId).concat({
          id: generateId(),
          content: responseText,
          type: 'bot',
          timestamp: new Date()
        })
      );
      
      // Mark user message as read
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 1000);
    } catch (error) {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId));
      
      // Add error message
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      
      // Add system message
      setMessages(prev => [...prev, {
        id: generateId(),
        content: "There was an error processing your request.",
        type: 'system',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Group messages by date for display
  const groupedMessages = messages.reduce<Record<string, ChatMessageType[]>>((groups, message) => {
    const dateKey = formatDate(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col h-full max-w-4xl mx-auto p-4",
        "chat-container"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 scroll-smooth">
        <div className="space-y-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-2">
              <div className="flex justify-center my-4">
                <div className="px-4 py-1 rounded-full bg-muted text-xs font-medium">
                  {date}
                </div>
              </div>
              {dateMessages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="pt-4 pb-2">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
        />
      </div>
    </div>
  );
};

export default ChatContainer;
