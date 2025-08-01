import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlateContextType {
  selectedPlateId: string | null;
  setSelectedPlateId: (plateId: string | null) => void;
}

const PlateContext = createContext<PlateContextType | undefined>(undefined);

export const usePlateContext = () => {
  const context = useContext(PlateContext);
  if (context === undefined) {
    throw new Error('usePlateContext must be used within a PlateProvider');
  }
  return context;
};

interface PlateProviderProps {
  children: ReactNode;
}

export const PlateProvider: React.FC<PlateProviderProps> = ({ children }) => {
  const [selectedPlateId, setSelectedPlateId] = useState<string | null>(null);

  return (
    <PlateContext.Provider value={{ selectedPlateId, setSelectedPlateId }}>
      {children}
    </PlateContext.Provider>
  );
};
