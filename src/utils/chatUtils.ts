
import { ChatMessage } from '../types/chatTypes';

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

// Simulates a bot response - in a real app, this would call an API
export const getBotResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const responses = [
    "I understand your question. Let me think about how best to help you with that.",
    "That's an interesting point. Here's what I think...",
    "Thanks for sharing that. I'd like to offer some thoughts on the matter.",
    "I appreciate your question. Here's what I can tell you based on my knowledge.",
    "That's a great question. Let me provide some information that might help."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};
