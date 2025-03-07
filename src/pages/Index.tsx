
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
      style={{ 
        height: 'calc(var(--vh, 1vh) * 100)',
        backgroundImage: 'radial-gradient(circle at 100% 0%, hsl(var(--primary) / 0.07) 0%, transparent 70%), radial-gradient(circle at 0% 100%, hsl(var(--chatbot-accent) / 0.05) 0%, transparent 70%)'
      }}
    >
      <header className="py-4 px-6 border-b border-border/40 backdrop-blur-md bg-background/80 glass">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.svg" 
              alt="Chat Logo" 
              className="w-10 h-10 animate-float" 
              loading="lazy"
            />
            <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">ChatBot</h1>
          </div>
          <div className="text-xs bg-gradient-primary text-white px-4 py-1.5 rounded-full font-medium">
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
