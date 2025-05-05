
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
import { HelpCircle } from 'lucide-react';
import KeyboardShortcut from '@/components/ui/KeyboardShortcut';

interface ShortcutCategoryProps {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

const ShortcutCategory: React.FC<ShortcutCategoryProps> = ({ title, shortcuts }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold">{title}</h3>
    <div className="space-y-2">
      {shortcuts.map((shortcut, index) => (
        <div key={index} className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{shortcut.description}</span>
          <KeyboardShortcut keys={shortcut.keys} />
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
  ];

  const navigationShortcuts = [
    { keys: ["/"], description: "Focus search" },
    { keys: ["Ctrl", "K"], description: "Open command menu" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle size={18} />
          <span className="sr-only">Keyboard Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>⌨️</span> Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Boost your productivity with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 my-4 max-h-[60vh] overflow-y-auto pr-2">
          <ShortcutCategory title="General" shortcuts={generalShortcuts} />
          <ShortcutCategory title="Messaging" shortcuts={messagingShortcuts} />
          <ShortcutCategory title="Navigation" shortcuts={navigationShortcuts} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" size="sm" className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;
