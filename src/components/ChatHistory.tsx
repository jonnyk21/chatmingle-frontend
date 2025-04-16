
import React from 'react';
import { Clock, MessageSquare, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuAction
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export type ChatHistoryItem = {
  id: string;
  title: string;
  date: string;
  isActive?: boolean;
};

interface ChatHistoryProps {
  chats: ChatHistoryItem[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  onSelectChat,
  onNewChat,
  onDeleteChat
}) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteChat(id);
    toast({
      title: "Chat deleted",
      description: "Your chat has been deleted."
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-sm font-semibold text-sidebar-foreground">Chat History</h2>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 px-2 bg-sidebar-accent" 
          onClick={onNewChat}
        >
          <Plus size={16} className="mr-1" /> New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
            <Clock size={40} className="mb-2 opacity-20" />
            <p className="text-sm">No chat history yet</p>
            <p className="text-xs">Start a new conversation</p>
          </div>
        ) : (
          <SidebarMenu>
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  isActive={chat.isActive}
                  onClick={() => onSelectChat(chat.id)}
                  tooltip="Open chat"
                  className="w-full"
                >
                  <MessageSquare size={16} />
                  <span>{chat.title}</span>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={(e) => handleDelete(e, chat.id)}
                  showOnHover
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
