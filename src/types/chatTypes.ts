
export type MessageType = 'user' | 'bot' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  isTyping?: boolean;
  reaction?: string;
  status?: MessageStatus;
}
