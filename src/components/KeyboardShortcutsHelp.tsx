
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard, HelpCircle } from 'lucide-react';
import KeyboardShortcut from '@/components/ui/KeyboardShortcut';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ShortcutCategoryProps {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

const ShortcutCategory: React.FC<ShortcutCategoryProps> = ({ title, shortcuts }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold text-foreground/90">{title}</h3>
    <div className="space-y-2.5 pl-1">
      {shortcuts.map((shortcut, index) => (
        <div key={index} className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{shortcut.description}</span>
          <KeyboardShortcut keys={shortcut.keys} keyClassName="bg-primary/5 hover:bg-primary/10 border-primary/10" />
        </div>
      ))}
    </div>
  </div>
);

const KeyboardShortcutsHelp = () => {
  const generalShortcuts = [
    { keys: ["Alt", "S"], description: "Scroll to bottom of chat" },
    { keys: ["Alt", "N"], description: "Focus chat input" },
    { keys: ["Alt", "T"], description: "Toggle theme" },
    { keys: ["Ctrl", "B"], description: "Toggle sidebar" },
    { keys: ["Esc"], description: "Close dialogs" },
  ];
  
  const messagingShortcuts = [
    { keys: ["Enter"], description: "Send message" },
    { keys: ["Shift", "Enter"], description: "New line" },
    { keys: ["⬆️"], description: "Edit last message" },
    { keys: ["Tab"], description: "Navigate between inputs" },
  ];

  const navigationShortcuts = [
    { keys: ["/"], description: "Focus search" },
    { keys: ["Ctrl", "K"], description: "Open command menu" },
    { keys: ["Ctrl", "/"], description: "Show keyboard shortcuts" },
    { keys: ["Ctrl", "Home"], description: "Go to first message" },
    { keys: ["Ctrl", "End"], description: "Go to latest message" },
  ];
  
  const accessibilityShortcuts = [
    { keys: ["Alt", "1"], description: "High contrast mode" },
    { keys: ["Alt", "2"], description: "Increase font size" },
    { keys: ["Alt", "3"], description: "Decrease font size" },
    { keys: ["F11"], description: "Full screen mode" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full group relative overflow-hidden"
        >
          <Keyboard size={18} className="transition-transform group-hover:scale-110" />
          <span className="sr-only">Keyboard Shortcuts</span>
          <span className="absolute inset-0 w-full h-full bg-primary/10 scale-0 rounded-full opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Keyboard className="h-5 w-5" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
          <DialogDescription>
            Boost your productivity with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-2 -mr-2">
          <div className="space-y-6 my-4 pr-4">
            <ShortcutCategory title="General" shortcuts={generalShortcuts} />
            <ShortcutCategory title="Messaging" shortcuts={messagingShortcuts} />
            <ShortcutCategory title="Navigation" shortcuts={navigationShortcuts} />
            <ShortcutCategory title="Accessibility" shortcuts={accessibilityShortcuts} />
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;
