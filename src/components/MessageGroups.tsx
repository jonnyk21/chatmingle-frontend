
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chatTypes';
import { formatDate } from '../utils/chatUtils';
import ChatMessage from './ChatMessage';

interface MessageGroupsProps {
  messages: ChatMessageType[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageGroups: React.FC<MessageGroupsProps> = ({ messages, messagesEndRef }) => {
  const groupedMessages = messages.reduce<Record<string, ChatMessageType[]>>((groups, message) => {
    const dateKey = formatDate(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-2">
          <div className="flex justify-center my-4">
            <div className="px-4 py-1 rounded-full bg-muted text-xs font-medium">
              {date}
            </div>
          </div>
          {dateMessages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageGroups;
