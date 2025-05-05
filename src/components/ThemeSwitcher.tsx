
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import KeyboardShortcut from '@/components/ui/KeyboardShortcut';

interface ThemeSwitcherProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme, className }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={className}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Sun size={18} className="transition-transform hover:rotate-45 duration-300" />
          ) : (
            <Moon size={18} className="transition-transform hover:rotate-12 duration-300" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" side="bottom">
        <DropdownMenuItem 
          onClick={() => setTheme('light')} 
          className="flex justify-between"
        >
          <div className="flex items-center gap-2">
            <Sun size={16} />
            <span>Light</span>
          </div>
          {theme === 'light' && <span className="text-primary text-xs">Active</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme('dark')} 
          className="flex justify-between"
        >
          <div className="flex items-center gap-2">
            <Moon size={16} />
            <span>Dark</span>
          </div>
          {theme === 'dark' && <span className="text-primary text-xs">Active</span>}
        </DropdownMenuItem>

        <div className="px-2 py-1 border-t border-border/40 mt-1">
          <KeyboardShortcut keys={["Alt", "T"]} description="Toggle theme" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
