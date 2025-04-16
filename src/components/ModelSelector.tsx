
import React from 'react';
import { ChevronDown, Sparkles, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModel, ModelType } from '@/contexts/ModelContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

interface ModelSelectorProps {
  className?: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ className }) => {
  const { models, selectedModel, setSelectedModel, isModelSelectorOpen, setModelSelectorOpen } = useModel();

  return (
    <Popover open={isModelSelectorOpen} onOpenChange={setModelSelectorOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between px-3 py-2 h-auto w-full sm:w-52 text-left font-normal border-border/50",
            "hover:bg-background/80 hover:border-primary/30",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedModel.isPremium && (
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
            )}
            <span className="truncate">{selectedModel.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-0 border-border/50 shadow-lg"
        align="end"
      >
        <Command className="rounded-lg border-none bg-popover">
          <CommandList>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  onSelect={() => setSelectedModel(model)}
                  className={cn(
                    "flex items-start px-4 py-3 gap-3 cursor-pointer",
                    "hover:bg-accent data-[selected=true]:bg-accent/30"
                  )}
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      {model.isPremium && (
                        <Sparkles className="h-4 w-4 text-primary shrink-0" />
                      )}
                      <span className="font-medium">{model.name}</span>
                      {model.version && (
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                          {model.version}
                        </span>
                      )}
                      {model.size && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {model.size}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {model.description}
                    </p>
                  </div>
                  {model.id === selectedModel.id && (
                    <Check className="h-5 w-5 text-primary shrink-0" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ModelSelector;
