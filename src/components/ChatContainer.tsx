
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickReplies from './QuickReplies';
import { ChatMessage as ChatMessageType } from '../types/chatTypes';
import { formatDate, formatTimestamp, generateId, getInitialMessages, getBotResponse, getQuickReplies, fetchOlderMessages } from '../utils/chatUtils';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { ArrowDown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>(getInitialMessages());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [quickReplies, setQuickReplies] = useState(getQuickReplies());
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N for new message focus
      if (e.altKey && e.key === 'n') {
        const inputElement = document.querySelector('textarea') as HTMLTextAreaElement;
        if (inputElement) {
          e.preventDefault();
          inputElement.focus();
        }
      }
      
      // Alt+S for scroll to bottom
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        scrollToBottom();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Add scroll event listener to show/hide scroll to bottom button
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBottom(!isNearBottom);
    };
    
    messagesContainer.addEventListener('scroll', handleScroll);
    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    
    // Clear quick replies after user sends a message
    setQuickReplies([]);
    
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
      
      // Show new quick replies after bot response
      setQuickReplies(getQuickReplies());
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

  // Handle quick reply selection
  const handleQuickReplySelect = (text: string) => {
    handleSendMessage(text);
  };

  // Load older messages (pull-to-refresh)
  const loadOlderMessages = async () => {
    if (isLoadingOlder) return;
    
    setIsLoadingOlder(true);
    try {
      const olderMessages = await fetchOlderMessages();
      
      // Add system message to indicate loading older messages
      setMessages(prev => [...olderMessages, ...prev]);
      
      toast({
        title: "Success",
        description: "Loaded older messages.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load older messages.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingOlder(false);
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
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-4 scroll-smooth relative"
      >
        {isLoadingOlder ? (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <RefreshCcw size={16} className="animate-spin" />
              <span className="text-sm">Loading older messages...</span>
            </div>
          </div>
        ) : (
          <div 
            className="flex justify-center py-4 cursor-pointer hover:bg-muted/30 rounded-full transition-colors mx-auto w-fit px-4"
            onClick={loadOlderMessages}
          >
            <div className="flex items-center space-x-2">
              <RefreshCcw size={16} />
              <span className="text-sm">Load older messages</span>
            </div>
          </div>
        )}
        
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
        
        {showScrollBottom && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-4 right-4 rounded-full shadow-lg"
            onClick={() => scrollToBottom()}
          >
            <ArrowDown size={18} />
          </Button>
        )}
      </div>
      
      <div className="pt-4 pb-2">
        <QuickReplies 
          replies={quickReplies} 
          onSelect={handleQuickReplySelect} 
        />
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
        />
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Keyboard shortcuts: Alt+N to focus input, Alt+S to scroll to bottom
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
