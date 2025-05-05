
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Info, Menu } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import ChatSearch from '../components/ChatSearch';
import AnimatedLogo from './AnimatedLogo';
import ThemeSwitcher from './ThemeSwitcher';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import ModelSelector from './ModelSelector';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onSearch: (query: string) => void;
  userInfo: any;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  onSearch,
  userInfo,
}) => {
  return (
    <header className="py-2 sm:py-3 px-2 border-b border-border/40 backdrop-blur-md bg-background/80 glass sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          <SidebarTrigger className="mr-0" />
        </div>
        
        <div className="flex items-center gap-2 hover:gap-3 transition-all duration-300">
          <AnimatedLogo 
            src="/lovable-uploads/6b6875ce-964d-43a1-a7db-270e29e5bb55.png" 
            alt="Jarvis Logo"
          />
          <h1 className={cn(
            "text-base md:text-lg font-bold", 
            "bg-gradient-to-r from-primary to-primary/80", 
            "bg-clip-text text-transparent", 
            "tracking-tight leading-tight"
          )}>
            Jarvis
          </h1>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 pr-1">
          <div className="hidden sm:block">
            <ModelSelector />
          </div>
          
          <ChatSearch onSearch={onSearch} className="hidden sm:flex" />
          
          <ThemeSwitcher 
            theme={theme} 
            setTheme={setTheme}
            className="rounded-full hover:bg-accent/80"
          />
          
          <KeyboardShortcutsHelp />
          
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/80 sm:hidden">
            <Menu size={18} />
          </Button>
          
          <div className="hidden sm:block">
            <UserAvatar user={userInfo} size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
