
import { ChatMessage, QuickReply, UserInfo } from '../types/chatTypes';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

export const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    }).format(date);
  }
};

export const getInitialMessages = (): ChatMessage[] => {
  return [
    {
      id: generateId(),
      content: "Hello! I'm your AI assistant. How can I help you today?",
      type: 'bot',
      timestamp: new Date()
    }
  ];
};

// Get user information
export const getUserInfo = (): UserInfo => {
  return {
    name: 'User',
    avatar: '/user-avatar.png',
    status: 'online'
  };
};

// Get bot information
export const getBotInfo = (): UserInfo => {
  return {
    name: 'AI Assistant',
    avatar: '/logo.svg',
    status: 'online'
  };
};

// Get suggested quick replies
export const getQuickReplies = (): QuickReply[] => {
  return [
    { id: generateId(), text: 'Tell me a joke' },
    { id: generateId(), text: 'What can you do?' },
    { id: generateId(), text: 'How does this work?' },
    { id: generateId(), text: 'Help me with a task' }
  ];
};

// Simulates fetching older messages
export const fetchOlderMessages = async (): Promise<ChatMessage[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const oldDate = new Date();
  oldDate.setDate(oldDate.getDate() - 1);
  
  return [
    {
      id: generateId(),
      content: "Here are some older messages from yesterday.",
      type: 'system',
      timestamp: oldDate
    },
    {
      id: generateId(),
      content: "Is there anything specific you'd like to learn about today?",
      type: 'bot',
      timestamp: oldDate
    }
  ];
};

// Simulates a bot response - in a real app, this would call an API
export const getBotResponse = async (message: string): Promise<string> => {
  // Simulate network delay with variable timing for more realistic typing
  const responseTime = 1500 + Math.random() * 2000;
  await new Promise(resolve => setTimeout(resolve, responseTime));
  
  const responses = [
    "I understand your question. Let me think about how best to help you with that.",
    "That's an interesting point. Here's what I think...",
    "Thanks for sharing that. I'd like to offer some thoughts on the matter.",
    "I appreciate your question. Here's what I can tell you based on my knowledge.",
    "That's a great question. Let me provide some information that might help."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};
