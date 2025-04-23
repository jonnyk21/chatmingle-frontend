import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarSeparator, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { HelpCircle, Info, MessageSquare, Plus, Settings, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatHistory, { ChatHistoryItem } from './ChatHistory';

// Mock chat history data (in a real app, this would come from a state or API)
const mockChats: ChatHistoryItem[] = [{
  id: '1',
  title: 'Getting started with AI',
  date: '2025-04-16',
  isActive: true
}, {
  id: '2',
  title: 'Project ideas',
  date: '2025-04-15'
}, {
  id: '3',
  title: 'Code review help',
  date: '2025-04-14'
}, {
  id: '4',
  title: 'Machine learning concepts',
  date: '2025-04-13'
}, {
  id: '5',
  title: 'React component design',
  date: '2025-04-12'
}];
const ChatSidebar: React.FC = () => {
  const handleSelectChat = (id: string) => {
    console.log(`Selected chat ${id}`);
    // In a real app, this would change the current chat context
  };
  const handleNewChat = () => {
    console.log('Creating new chat');
    // In a real app, this would create a new chat
  };
  const handleDeleteChat = (id: string) => {
    console.log(`Deleting chat ${id}`);
    // In a real app, this would delete the chat
  };
  return <Sidebar className="bg-background/95 backdrop-blur-sm border-r border-border/40 shadow-md">
      <SidebarHeader className="bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="p-4 pb-3">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/6b6875ce-964d-43a1-a7db-270e29e5bb55.png" alt="Jarvis Logo" className="h-6 w-6 object-contain" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent tracking-tight">Jarvis</h1>
          </div>
          <p className="text-xs text-muted-foreground">
        </p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <div className="flex items-center justify-between p-3">
          <h2 className="text-sm font-semibold text-foreground">Chat History</h2>
          <Button size="sm" variant="outline" className="h-8 px-2 bg-primary/10 hover:bg-primary/20 text-primary-foreground" onClick={handleNewChat}>
            <Plus size={16} className="mr-1" /> New Chat
          </Button>
        </div>
        
        <div className="overflow-y-auto px-2 pb-4">
          <SidebarMenu>
            {mockChats.map(chat => <SidebarMenuItem key={chat.id} className="mb-1">
                <SidebarMenuButton isActive={chat.isActive} onClick={() => handleSelectChat(chat.id)} className={cn("w-full transition-all gap-3 rounded-md", chat.isActive ? "bg-primary/15 text-primary-foreground" : "hover:bg-background/80 hover:bg-primary/10")}>
                  <MessageSquare size={16} />
                  <span className="truncate">{chat.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarSeparator />
      
      <SidebarFooter className="border-t border-border/40 bg-background/80 backdrop-blur-md">
        <div className="p-3 grid grid-cols-3 gap-2">
          <Button variant="ghost" size="sm" className="flex flex-col items-center h-auto py-2 text-xs">
            <Settings size={18} className="mb-1" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center h-auto py-2 text-xs">
            <HelpCircle size={18} className="mb-1" />
            Help
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center h-auto py-2 text-xs">
            <Info size={18} className="mb-1" />
            About
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>;
};
export default ChatSidebar;