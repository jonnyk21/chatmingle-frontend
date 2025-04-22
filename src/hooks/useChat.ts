
import { useState } from 'react';
import { ChatMessage } from '../types/chatTypes';
import { getBotResponse, getInitialMessages, getQuickReplies, fetchOlderMessages } from '../utils/chatUtils';
import { toast } from '@/components/ui/use-toast';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [quickReplies, setQuickReplies] = useState(getQuickReplies());

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      type: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuickReplies([]);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 500);
    
    const typingIndicatorId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: typingIndicatorId,
      content: '',
      type: 'bot',
      timestamp: new Date(),
      isTyping: true
    }]);
    
    setIsLoading(true);
    
    try {
      const responseText = await getBotResponse(content);
      
      setMessages(prev => 
        prev.filter(msg => msg.id !== typingIndicatorId).concat({
          id: crypto.randomUUID(),
          content: responseText,
          type: 'bot',
          timestamp: new Date()
        })
      );
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 1000);
      
      setQuickReplies(getQuickReplies());
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId));
      
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content: "There was an error processing your request.",
        type: 'system',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOlderMessages = async () => {
    if (isLoadingOlder) return;
    
    setIsLoadingOlder(true);
    try {
      const olderMessages = await fetchOlderMessages();
      setMessages(prev => [...olderMessages, ...prev]);
      toast({
        title: "Success",
        description: "Loaded older messages.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load older messages.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingOlder(false);
    }
  };

  return {
    messages,
    isLoading,
    isLoadingOlder,
    quickReplies,
    handleSendMessage,
    loadOlderMessages
  };
};
