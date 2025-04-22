
import React, { useRef, useEffect, useState } from 'react';
import ChatInput from './ChatInput';
import QuickReplies from './QuickReplies';
import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from './FileUpload';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MessageGroups from './MessageGroups';
import LoadOlderMessages from './LoadOlderMessages';
import { useChat } from '../hooks/useChat';

const ChatContainer: React.FC = () => {
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, isLoadingOlder, quickReplies, handleSendMessage, loadOlderMessages } = useChat();
  
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

  const handleFileUpload = (files: File[], collectionData: { name: string; description?: string }) => {
    toast({
      title: "Files uploaded",
      description: `${files.length} files will be processed for context in collection "${collectionData.name}"`,
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
        <LoadOlderMessages isLoading={isLoadingOlder} onLoad={loadOlderMessages} />
        <MessageGroups messages={messages} messagesEndRef={messagesEndRef} />
        
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
          onSelect={handleSendMessage} 
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
