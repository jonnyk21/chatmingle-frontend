
export type MessageType = 'user' | 'bot' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type UserStatus = 'online' | 'away' | 'offline';

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  isTyping?: boolean;
  reaction?: string;
  status?: MessageStatus;
}

export interface UserInfo {
  name: string;
  avatar?: string;
  status: UserStatus;
  lastSeen?: Date;
}

export interface QuickReply {
  id: string;
  text: string;
}
