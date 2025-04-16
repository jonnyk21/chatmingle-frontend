
import React, { useEffect, useRef, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import ChatSearch from '../components/ChatSearch';
import UserAvatar from '../components/UserAvatar';
import { cn } from '@/lib/utils';
import { Moon, Sun, Menu, Info, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserInfo, getBotInfo } from '../utils/chatUtils';
import { toast } from '@/components/ui/use-toast';
import { SidebarProvider, SidebarTrigger, SidebarRail, SidebarInset } from '@/components/ui/sidebar';
import ChatSidebar from '../components/ChatSidebar';
import ModelSelector from '../components/ModelSelector';
import { ModelProvider } from '../contexts/ModelContext';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [botInfo] = useState(getBotInfo());
  const [userInfo] = useState(getUserInfo());
  
  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? 'dark' : 'light');
    
    // Handle resize for mobile vh
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

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSearch = (query: string) => {
    // In a real app, this would search through messages
    toast({
      title: "Search",
      description: `Searching for "${query}"...`,
    });
  };

  return (
    <ModelProvider>
      <SidebarProvider defaultOpen={false}>
        <div 
          ref={containerRef}
          className={cn(
            "min-h-screen h-screen flex w-full",
            "bg-background text-foreground overflow-hidden",
            "transition-colors duration-300 ease-in-out"
          )}
          style={{ 
            height: 'calc(var(--vh, 1vh) * 100)',
            backgroundImage: 'radial-gradient(circle at 100% 0%, hsl(var(--primary) / 0.07) 0%, transparent 70%), radial-gradient(circle at 0% 100%, hsl(var(--chatbot-accent) / 0.05) 0%, transparent 70%)'
          }}
        >
          <ChatSidebar />
          <SidebarRail />
          <SidebarInset className="px-0">
            <header className="py-3 px-4 sm:px-6 border-b border-border/40 backdrop-blur-md bg-background/80 glass">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center space-x-3">
                  <SidebarTrigger className="md:mr-2" />
                  <div className="flex items-center">
                    <UserAvatar user={botInfo} size="md" />
                    <div className="ml-3">
                      <h1 className={cn(
                        "text-lg font-bold",
                        "bg-gradient-to-r from-primary to-primary-foreground",
                        "bg-clip-text text-transparent",
                        "tracking-tight leading-tight"
                      )}>
                        ChatBot
                      </h1>
                      <div className="text-xs text-muted-foreground font-medium">AI Assistant</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:block">
                    <ModelSelector />
                  </div>
                  
                  <ChatSearch onSearch={handleSearch} />
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleTheme}
                    className="rounded-full hover:bg-background/80"
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-background/80"
                  >
                    <Info size={18} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-background/80"
                  >
                    <Menu size={18} />
                  </Button>
                  
                  <div className="hidden sm:block">
                    <UserAvatar user={userInfo} size="sm" />
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-1 overflow-hidden">
              <div className="sm:hidden p-3 border-b border-border/40">
                <ModelSelector className="w-full" />
              </div>
              <ChatContainer />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ModelProvider>
  );
};

export default Index;
