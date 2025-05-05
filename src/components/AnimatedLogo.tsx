
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  src, 
  alt,
  className,
  size = 'md'
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8 md:h-10 md:w-10',
    lg: 'h-12 w-12 md:h-14 md:w-14',
  };
  
  return (
    <div 
      className={cn(
        "relative transform transition-all duration-500",
        "group cursor-pointer"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img 
        src={src}
        alt={alt}
        className={cn(
          "object-contain transition-all duration-500", 
          "filter group-hover:brightness-110 z-10 relative",
          isHovering ? "scale-110" : "scale-100",
          sizeClasses[size],
          className
        )}
      />
      <div className={cn(
        "absolute inset-0 bg-primary/20 blur-xl rounded-full",
        "transition-all duration-500 z-0",
        isHovering ? "opacity-100 scale-110" : "opacity-0 scale-75"
      )} />
    </div>
  );
};

export default AnimatedLogo;
