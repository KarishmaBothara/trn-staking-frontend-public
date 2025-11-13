import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Chip, styled } from '@mui/material';

import Drawer from 'components/Drawer';
import { NominationInfo } from 'common/types';
import { ExcludeFilters, IncludeFilters } from './types';
import { useNomination } from 'providers/NominationProvider';
import { useValidatorFilter } from './ValidatorFilterProvider';
import { Button, Typography } from '@futureverse/component-library';
import useValidators, { DEFAULT_FILTERS } from 'providers/ValidatorsProvider';

const StyledChip = styled(Chip)`
  padding: 10px;
  width: auto;
  max-height: 32px;
`;

const excludeFilters = [{ id: ExcludeFilters.Oversubscribed, name: 'Oversubscribed' }];

const FiltersDrawer = () => {
  const { activeValidators } = useValidators();

  let filteredNominations: NominationInfo[] = [];
  let totalNominations = 0;
  let hasNominationProvider = false;
  try {
    const nominationData = useNomination();
    filteredNominations = nominationData.filteredNominations;
    totalNominations = nominationData.total;
    hasNominationProvider = true;
  } catch (error) {
    // NominationProvider is not available in this context
    hasNominationProvider = false;
  }

  const { openFilters, selectedFilter, setOpenFilters, clearFilter, applyFilter } =
    useValidatorFilter();

  const includeFilters = useMemo(() => {
    const filters = [
      { id: IncludeFilters.Active, name: `Active Validators (${activeValidators})` },
    ];

    // Only add My Nominations filter if NominationProvider is available
    if (hasNominationProvider) {
      filters.push({
        id: IncludeFilters.MyNominations,
        name: `My Nominations (${totalNominations})`,
      });
    }

    return filters;
  }, [activeValidators, totalNominations, hasNominationProvider]);

  const [innerSelectedFilter, setInnerSelectedFilter] = useState(DEFAULT_FILTERS);

  const handleChangeFilter = useCallback(
    (filterName: IncludeFilters | ExcludeFilters, value: boolean) => {
      setInnerSelectedFilter((pre) => ({ ...pre, [filterName]: value }));
    },
    []
  );

  const handleClose = useCallback(() => {
    setOpenFilters(false);
  }, [setOpenFilters]);

  const handleApplySelection = useCallback(() => {
    applyFilter(innerSelectedFilter);
    handleClose();
  }, [innerSelectedFilter, applyFilter, handleClose]);

  useEffect(() => {
    if (openFilters) {
      setInnerSelectedFilter(selectedFilter);
    }
  }, [openFilters, selectedFilter]);

  const noFilterSelected = selectedFilter
    ? Object.values(selectedFilter).every((value) => !value)
    : false;
  const noInnerFilterSelected = selectedFilter
    ? Object.values(innerSelectedFilter).every((value) => !value)
    : false;

  return (
    <Drawer
      open={openFilters}
      onClose={handleClose}
      HeaderContents={
        <Typography variant="h3" fontWeight={700}>
          Validators Filters
        </Typography>
      }
      buttonsBar={
        <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1} width="320px">
          <Button
            variant="text"
            sx={{ width: '100%' }}
            onClick={() => {
              setInnerSelectedFilter(DEFAULT_FILTERS);
              clearFilter();
            }}
            disabled={noFilterSelected && noInnerFilterSelected}
          >
            Clear all filters
          </Button>
          <Button variant="contained" sx={{ width: '100%' }} onClick={handleApplySelection}>
            Apply filters
          </Button>
        </Box>
      }
    >
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          px: { xs: 3, md: 9 },
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Include Only
        </Typography>
        {/* Note the functionality here is to support more filters in the future */}
        <Box display="flex" flexDirection="row" gap={1} pt={3} pb={7}>
          {includeFilters.map(({ id, name }) => {
            const isSelected = innerSelectedFilter[id];
            return (
              <StyledChip
                key={id}
                label={name}
                size="medium"
                variant={isSelected ? 'filled' : 'outlined'}
                onClick={() => handleChangeFilter(id, true)}
                onDelete={isSelected ? () => handleChangeFilter(id, false) : undefined}
              />
            );
          })}
        </Box>

        <Typography variant="h5" fontWeight={700}>
          Exclude
        </Typography>
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1} pt={3} pb={7}>
          {excludeFilters.map(({ id, name }) => {
            const isSelected = innerSelectedFilter[id];
            return (
              <StyledChip
                key={id}
                label={name}
                size="medium"
                variant={isSelected ? 'filled' : 'outlined'}
                onClick={() => handleChangeFilter(id, true)}
                onDelete={isSelected ? () => handleChangeFilter(id, false) : undefined}
              />
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
};

export default FiltersDrawer;
