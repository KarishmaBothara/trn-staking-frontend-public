import { Button, Stack } from '@mui/material';

// import DropdownButton from 'components/DropdownButton';
// import { SortOptions } from 'providers/ValidatorsProvider';
import { useValidatorFilter } from './ValidatorFilterProvider';

const Actions = () => {
  const { selectedFilter, clearFilter, setOpenFilters /*sortedBy, setSortedBy*/ } =
    useValidatorFilter();

  const noFilterSelected = selectedFilter
    ? Object.values(selectedFilter).every((value) => !value)
    : false;

  return (
    <Stack direction={'row'} spacing={2}>
      <Button variant="text" onClick={clearFilter} disabled={noFilterSelected}>
        clear filters
      </Button>
      <Button variant="outlined" onClick={() => setOpenFilters(true)}>
        filter
      </Button>
      {/* <DropdownButton
        text="sort"
        items={SortOptions}
        selectedId={sortedBy}
        onChange={(sortKey) => setSortedBy(sortKey)}
      /> */}
    </Stack>
  );
};

export default Actions;
