
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserInfo } from '../types/chatTypes';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: UserInfo;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const statusSizeClasses = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5'
  };

  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn("ring-2 ring-background", sizeClasses[size])}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span 
        className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-background",
          getStatusColor(user.status),
          statusSizeClasses[size]
        )}
      />
    </div>
  );
};

export default UserAvatar;
