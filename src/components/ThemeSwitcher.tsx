
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
          className={cn(
            "relative overflow-hidden group",
            className
          )}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Sun size={18} className="transition-all duration-500 rotate-0 scale-100 group-hover:rotate-45" />
          ) : (
            <Moon size={18} className="transition-all duration-500 rotate-0 scale-100 group-hover:rotate-12" />
          )}
          <span className="sr-only">Toggle theme</span>
          <span className="absolute inset-0 w-full h-full bg-primary/10 scale-0 rounded-full opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" side="bottom" className="w-40 p-2">
        <DropdownMenuItem 
          onClick={() => setTheme('light')} 
          className="flex justify-between items-center cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-amber-500" />
            <span>Light</span>
          </div>
          {theme === 'light' && <span className="text-primary text-xs font-medium">Active</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme('dark')} 
          className="flex justify-between items-center cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-indigo-400" />
            <span>Dark</span>
          </div>
          {theme === 'dark' && <span className="text-primary text-xs font-medium">Active</span>}
        </DropdownMenuItem>

        <div className="px-2 py-1.5 border-t border-border/40 mt-1">
          <KeyboardShortcut keys={["Alt", "T"]} description="Toggle theme" className="justify-center w-full" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
