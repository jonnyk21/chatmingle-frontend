
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSearchProps {
  onSearch: (query: string) => void;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {isOpen ? (
        <form onSubmit={handleSearch} className="flex items-center">
          <div className={cn(
            "relative flex items-center bg-background/90 rounded-full",
            "border border-primary/20 px-3 py-1.5 w-56 md:w-72"
          )}>
            <Search size={16} className="text-muted-foreground mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="bg-transparent border-none outline-none flex-1 text-sm"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full hover:bg-primary/10 transition-colors"
          aria-label="Search messages"
        >
          <Search size={18} />
        </button>
      )}
    </div>
  );
};

export default ChatSearch;
