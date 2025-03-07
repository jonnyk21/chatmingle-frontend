
import React, { useEffect, useRef } from 'react';
import ChatContainer from '../components/ChatContainer';
import { cn } from '@/lib/utils';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <div 
      ref={containerRef}
      className={cn(
        "min-h-screen h-screen flex flex-col",
        "bg-background text-foreground overflow-hidden"
      )}
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <header className="py-4 px-6 border-b border-border/40 backdrop-blur-md bg-background/80 glass">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.svg" 
              alt="Chat Logo" 
              className="w-8 h-8 animate-float" 
              loading="lazy"
            />
            <h1 className="text-xl font-medium">ChatBot</h1>
          </div>
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            AI Assistant
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
};

export default Index;
