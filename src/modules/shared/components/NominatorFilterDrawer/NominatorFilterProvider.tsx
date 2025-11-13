import { ReactNode, createContext, useContext, useState } from 'react';

import { useNomination } from 'providers/NominationProvider';
import { SortedBy } from 'providers/ValidatorsProvider';

interface NominatorFilterContext {
  openFilters: boolean;
  setOpenFilters: (open: boolean) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  sortedBy: string;
  setSortedBy: (sortedBy: SortedBy) => void;
}

const NominatorFilterContext = createContext<NominatorFilterContext>({} as NominatorFilterContext);

const NominatorFilterProvider = ({ children }: { children: ReactNode }) => {
  const [openFilters, setOpenFilters] = useState(false);
  const { isActive, setIsActive, sortedBy, setSortedBy } = useNomination();

  return (
    <NominatorFilterContext.Provider
      value={{
        openFilters,
        setOpenFilters,
        isActive,
        setIsActive,
        sortedBy,
        setSortedBy,
      }}
    >
      {children}
    </NominatorFilterContext.Provider>
  );
};

const useNominatorFilter = () => {
  const context = useContext(NominatorFilterContext);
  if (context === null) {
    throw new Error('useNominatorFilter must be used within a NominatorFilterProvider');
  }
  return context;
};

export { NominatorFilterProvider, useNominatorFilter };
