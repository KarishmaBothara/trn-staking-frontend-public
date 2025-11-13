import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

import useValidators, { SortedBy } from 'providers/ValidatorsProvider';

import { IFilter } from './types';

interface IValidatorFilterContext {
  openFilters: boolean;
  setOpenFilters: (open: boolean) => void;
  applyFilter: (selectedFilter: IFilter) => void;
  selectedFilter: IFilter;
  clearFilter: () => void;
  sortedBy: string;
  setSortedBy: (sortedBy: SortedBy) => void;
}

const ValidatorFilterContext = createContext<IValidatorFilterContext>(
  {} as IValidatorFilterContext
);

const ValidatorFilterProvider = ({ children }: { children: ReactNode }) => {
  const [openFilters, setOpenFilters] = useState(false);
  const { filter, setFilter, clearFilter, sortedBy, setSortedBy } = useValidators();

  const applyFilter = useCallback(
    async (selectedFilter: IFilter) => {
      setFilter(selectedFilter);
    },
    [setFilter]
  );

  return (
    <ValidatorFilterContext.Provider
      value={{
        openFilters,
        setOpenFilters,
        applyFilter,
        selectedFilter: filter,
        clearFilter,
        sortedBy,
        setSortedBy,
      }}
    >
      {children}
    </ValidatorFilterContext.Provider>
  );
};

const useValidatorFilter = () => {
  const context = useContext(ValidatorFilterContext);
  if (context === null) {
    throw new Error('useValidatorFilter must be used within a ValidatorFilterProvider');
  }
  return context;
};

export { ValidatorFilterProvider, useValidatorFilter };
