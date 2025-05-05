
import React from 'react';
import { cn } from "@/lib/utils";

interface KeyboardShortcutProps {
  keys: string[];
  description?: string;
  className?: string;
  keyClassName?: string;
}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({
  keys,
  description,
  className,
  keyClassName,
}) => {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      {description && <span className="text-muted-foreground mr-1">{description}</span>}
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-muted-foreground">+</span>}
          <kbd
            className={cn(
              "rounded px-1.5 py-0.5 font-mono text-[10px] font-medium",
              "border border-border bg-muted/50 shadow-sm",
              "transition-all duration-200 hover:bg-muted/80",
              keyClassName
            )}
          >
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  );
};

export default KeyboardShortcut;
