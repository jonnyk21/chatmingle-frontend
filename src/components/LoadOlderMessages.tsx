
import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface LoadOlderMessagesProps {
  isLoading: boolean;
  onLoad: () => void;
}

const LoadOlderMessages: React.FC<LoadOlderMessagesProps> = ({ isLoading, onLoad }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="flex items-center space-x-2">
          <RefreshCcw size={16} className="animate-spin" />
          <span className="text-sm">Loading older messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex justify-center py-4 cursor-pointer hover:bg-muted/30 rounded-full transition-colors mx-auto w-fit px-4"
      onClick={onLoad}
    >
      <div className="flex items-center space-x-2">
        <RefreshCcw size={16} />
        <span className="text-sm">Load older messages</span>
      </div>
    </div>
  );
};

export default LoadOlderMessages;
