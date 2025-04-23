
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
          <SidebarRail />
          <SidebarInset className="px-0 w-full">
            <header className="py-2 sm:py-3 px-3 sm:px-6 border-b border-border/40 backdrop-blur-md bg-background/80 glass sticky top-0 z-50">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center space-x-3">
                  <SidebarTrigger className="md:mr-2" />
                  <div className="flex items-center">
                    <img 
                      src="/lovable-uploads/92658e59-6697-4cd8-bed2-9b9236c0d427.png" 
                      alt="SPL Logo" 
                      className="h-8 w-8 md:h-10 md:w-10 object-contain"
                    />
                    <div className="ml-3">
                      <h1 className={cn(
                        "text-base md:text-lg font-bold",
                        "bg-gradient-to-r from-primary to-primary/80",
                        "bg-clip-text text-transparent",
                        "tracking-tight leading-tight"
                      )}>
                        Smart Production and Logistics
                      </h1>
                      <div className="text-xs text-muted-foreground font-medium hidden sm:block">AI Assistant</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="hidden sm:block">
                    <ModelSelector />
                  </div>
                  
                  <ChatSearch onSearch={handleSearch} className="hidden sm:flex" />
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleTheme}
                    className="rounded-full hover:bg-accent/80"
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-accent/80 hidden sm:flex"
                  >
                    <Info size={18} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-accent/80 sm:hidden"
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
              <div className="sm:hidden p-2 border-b border-border/40">
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
