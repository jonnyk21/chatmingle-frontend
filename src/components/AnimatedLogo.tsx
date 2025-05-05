
import React from 'react';
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
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8 md:h-10 md:w-10',
    lg: 'h-12 w-12 md:h-14 md:w-14',
  };
  
  return (
    <div className={cn(
      "relative transform transition-all duration-500 hover:scale-110",
      "after:absolute after:inset-0 after:rounded-full after:shadow-md",
      "after:opacity-0 hover:after:opacity-100 after:transition-opacity",
      "group"
    )}>
      <img 
        src={src}
        alt={alt}
        className={cn(
          "object-contain transition-all", 
          "animate-float filter group-hover:brightness-110",
          sizeClasses[size],
          className
        )}
      />
      <div className={cn(
        "absolute inset-0 bg-primary/10 blur-xl rounded-full",
        "opacity-0 group-hover:opacity-70 transition-opacity",
        "scale-75"
      )} />
    </div>
  );
};

export default AnimatedLogo;
