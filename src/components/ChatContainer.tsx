
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatContainerProps {
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ inputRef }) => {
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, isLoadingOlder, quickReplies, handleSendMessage, loadOlderMessages } = useChat();
  
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const checkScroll = () => {
      const scrollEl = scrollableRef.current;
      if (scrollEl) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollBottom(!isNearBottom);
      }
    };
    
    const scrollEl = scrollableRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
      };
    }
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
            <Button variant="outline" className="gap-2 rounded-full shadow-sm hover:shadow-md group transition-all">
              <Upload className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
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

      <ScrollArea 
        ref={scrollableRef}
        className="flex-1 py-4 scroll-smooth relative"
        viewportRef={scrollableRef}
        viewportClassName="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border/60"
      >
        <LoadOlderMessages isLoading={isLoadingOlder} onLoad={loadOlderMessages} />
        <MessageGroups messages={messages} messagesEndRef={messagesEndRef} />
        
        {showScrollBottom && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-4 right-4 rounded-full shadow-lg animate-bounce-subtle"
            onClick={() => scrollToBottom()}
          >
            <ArrowDown size={18} />
          </Button>
        )}
      </ScrollArea>
      
      <div className="pt-4 pb-2">
        <QuickReplies 
          replies={quickReplies} 
          onSelect={handleSendMessage} 
        />
        <ChatInput 
          inputRef={inputRef}
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
        />
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Keyboard shortcuts: 
          <span className="px-1 font-medium text-primary">Alt+N</span> 
          to focus input, 
          <span className="px-1 font-medium text-primary">Alt+S</span> 
          to scroll to bottom, 
          <span className="px-1 font-medium text-primary">Alt+T</span> 
          to toggle theme
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
