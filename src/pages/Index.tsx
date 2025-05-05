
import React, { useEffect, useRef } from 'react';
import ChatContainer from '../components/ChatContainer';
import ChatSearch from '../components/ChatSearch';
import UserAvatar from '../components/UserAvatar';
import { cn } from '@/lib/utils';
import { Menu, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserInfo, getBotInfo } from '../utils/chatUtils';
import { toast } from '@/components/ui/use-toast';
import { SidebarProvider, SidebarTrigger, SidebarRail, SidebarInset } from '@/components/ui/sidebar';
import ChatSidebar from '../components/ChatSidebar';
import { ModelProvider } from '../contexts/ModelContext';
import Header from '../components/Header';
import useTheme from '../hooks/useTheme';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { theme, setTheme, toggleTheme } = useTheme();
  const [botInfo] = React.useState(getBotInfo());
  const [userInfo] = React.useState(getUserInfo());

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const vh = window.innerHeight * 0.01;
        containerRef.current.style.setProperty('--vh', `${vh}px`);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearch = (query: string) => {
    toast({
      title: "Search",
      description: `Searching for "${query}"...`
    });
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onThemeToggle: toggleTheme,
    onFocusInput: focusInput,
    onScrollToBottom: scrollToBottom
  });

  return (
    <ModelProvider>
      <SidebarProvider>
        <div 
          ref={containerRef} 
          className={cn(
            "min-h-screen h-screen flex w-full", 
            "bg-background text-foreground overflow-hidden", 
            "transition-colors duration-300 ease-in-out", 
            "sm:overflow-auto"
          )} 
          style={{
            height: 'calc(var(--vh, 1vh) * 100)',
            backgroundImage: 'radial-gradient(circle at 100% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%), radial-gradient(circle at 0% 100%, hsl(var(--chatbot-accent) / 0.06) 0%, transparent 70%)'
          }}
        >
          <ChatSidebar />
          <SidebarRail className="bg-border/10 dark:bg-border/20" />
          <SidebarInset className="px-0 w-full">
            <Header 
              theme={theme}
              setTheme={setTheme}
              onSearch={handleSearch}
              userInfo={userInfo}
            />
            
            <main className="flex-1 overflow-hidden">
              <div className="sm:hidden p-2 border-b border-border/40">
                <ModelSelector className="w-full" />
              </div>
              <ChatContainer inputRef={inputRef} />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ModelProvider>
  );
};

export default Index;
