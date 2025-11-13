import { Button, Stack } from '@mui/material';

// import DropdownButton from 'components/DropdownButton';
// import { SortOptions } from 'providers/ValidatorsProvider';
import { useNominatorFilter } from './NominatorFilterProvider';

const Actions = () => {
  const { isActive, setIsActive, setOpenFilters /*sortedBy, setSortedBy*/ } = useNominatorFilter();

  return (
    <Stack direction={'row'} spacing={2}>
      <Button variant="text" onClick={() => setIsActive(false)} disabled={!isActive}>
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
