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
import FileUpload from './FileUpload';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Upload } from 'lucide-react';

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
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'n') {
        const inputElement = document.querySelector('textarea') as HTMLTextAreaElement;
        if (inputElement) {
          e.preventDefault();
          inputElement.focus();
        }
      }
      
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
    
    const userMessage: ChatMessageType = {
      id: generateId(),
      content,
      type: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setQuickReplies([]);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 500);
    
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
      const responseText = await getBotResponse(content);
      
      setMessages(prev => 
        prev.filter(msg => msg.id !== typingIndicatorId).concat({
          id: generateId(),
          content: responseText,
          type: 'bot',
          timestamp: new Date()
        })
      );
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 1000);
      
      setQuickReplies(getQuickReplies());
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId));
      
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      
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

  const handleQuickReplySelect = (text: string) => {
    handleSendMessage(text);
  };

  const loadOlderMessages = async () => {
    if (isLoadingOlder) return;
    
    setIsLoadingOlder(true);
    try {
      const olderMessages = await fetchOlderMessages();
      
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

  const groupedMessages = messages.reduce<Record<string, ChatMessageType[]>>((groups, message) => {
    const dateKey = formatDate(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  const handleFileUpload = (files: File[]) => {
    toast({
      title: "Files uploaded",
      description: `${files.length} files will be processed for context`,
    });
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col h-full max-w-6xl mx-auto p-4",
        "chat-container"
      )}
    >
      <div className="flex items-center justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Upload Documents</h2>
                <p className="text-sm text-muted-foreground">
                  Upload documents to provide context for the AI responses. Supported formats: PDF, TXT, DOC, DOCX
                </p>
              </div>
              <FileUpload onUpload={handleFileUpload} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

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
