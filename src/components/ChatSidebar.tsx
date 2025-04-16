
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { HelpCircle, Info, Settings } from 'lucide-react';
import ChatHistory, { ChatHistoryItem } from './ChatHistory';

// Mock chat history data (in a real app, this would come from a state or API)
const mockChats: ChatHistoryItem[] = [
  { id: '1', title: 'Getting started with AI', date: '2025-04-16', isActive: true },
  { id: '2', title: 'Project ideas', date: '2025-04-15' },
  { id: '3', title: 'Code review help', date: '2025-04-14' },
  { id: '4', title: 'Machine learning concepts', date: '2025-04-13' },
  { id: '5', title: 'React component design', date: '2025-04-12' },
];

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

  return (
    <Sidebar className="bg-background border-r border-border/40 shadow-sm">
      <SidebarHeader className="bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="p-3">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent tracking-tight">ChatBot</h1>
          <p className="text-xs text-muted-foreground">AI Assistant</p>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent>
        <ChatHistory 
          chats={mockChats} 
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
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
    </Sidebar>
  );
};

export default ChatSidebar;
