
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define model types
export type ModelType = {
  id: string;
  name: string;
  description: string;
  version?: string;
  size?: string;
  isPremium?: boolean;
  isSelected?: boolean;
};

// Predefined models
export const availableModels: ModelType[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Our most capable model for complex tasks',
    isPremium: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient for everyday tasks',
    isSelected: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Great balance of speed and capabilities',
  },
  {
    id: 'llama3-8b',
    name: 'Llama 3',
    version: '8B',
    size: '8.0B',
    description: 'Open source model for various tasks',
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Advanced reasoning and understanding',
    isPremium: true,
  },
];

type ModelContextType = {
  models: ModelType[];
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  isModelSelectorOpen: boolean;
  setModelSelectorOpen: (isOpen: boolean) => void;
};

// Create the context with default values
export const ModelContext = createContext<ModelContextType>({
  models: availableModels,
  selectedModel: availableModels.find(model => model.isSelected) || availableModels[0],
  setSelectedModel: () => {},
  isModelSelectorOpen: false,
  setModelSelectorOpen: () => {},
});

// Custom hook to use the model context
export const useModel = () => useContext(ModelContext);

// Provider component
interface ModelProviderProps {
  children: ReactNode;
}

export const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
  const [models, setModels] = useState<ModelType[]>(availableModels);
  const [isModelSelectorOpen, setModelSelectorOpen] = useState(false);
  
  // Find the initially selected model or default to the first one
  const initialModel = models.find(model => model.isSelected) || models[0];
  const [selectedModel, setSelectedModel] = useState<ModelType>(initialModel);

  const handleSelectModel = (model: ModelType) => {
    setSelectedModel(model);
    
    // Update the models array to reflect the new selection
    setModels(prevModels => 
      prevModels.map(m => ({
        ...m,
        isSelected: m.id === model.id
      }))
    );
    
    // Close the selector after selection
    setModelSelectorOpen(false);
  };

  return (
    <ModelContext.Provider
      value={{
        models,
        selectedModel,
        setSelectedModel: handleSelectModel,
        isModelSelectorOpen,
        setModelSelectorOpen,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};
