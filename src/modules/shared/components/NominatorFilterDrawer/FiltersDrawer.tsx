import { useCallback } from 'react';

import { Box, Chip, styled } from '@mui/material';

import { Button, Typography } from '@futureverse/component-library';
import Drawer from 'components/Drawer';

import { useNominatorFilter } from './NominatorFilterProvider';

const StyledChip = styled(Chip)`
  padding: 10px;
  width: auto;
  max-height: 32px;
`;

const FiltersDrawer = () => {
  const { isActive, setIsActive, openFilters, setOpenFilters } = useNominatorFilter();

  const handleClose = useCallback(() => {
    setOpenFilters(false);
  }, [setOpenFilters]);

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
              setIsActive(false);
            }}
            disabled={!isActive}
          >
            Clear all filters
          </Button>
        </Box>
      }
    >
      <Box display="flex" flexDirection="column" sx={{ px: 9 }}>
        <Typography variant="h5" fontWeight={700}>
          Include Only
        </Typography>
        <Box display="flex" flexDirection="row" gap={1} pt={3} pb={7}>
          <StyledChip
            label="Active and earning"
            size="medium"
            variant={isActive ? 'filled' : 'outlined'}
            onClick={() => setIsActive(!isActive)}
            onDelete={isActive ? () => setIsActive(false) : undefined}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default FiltersDrawer;
