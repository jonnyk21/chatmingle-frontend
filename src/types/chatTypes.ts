
export type MessageType = 'user' | 'bot' | 'system';

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  isTyping?: boolean;
}
