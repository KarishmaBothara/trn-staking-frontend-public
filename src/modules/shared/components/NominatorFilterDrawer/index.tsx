import { Box } from '@mui/material';

import FiltersDrawer from './FiltersDrawer';
import { NominatorFilterProvider } from './NominatorFilterProvider';

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

const NominatorFilterDrawer = ({ children }: IProps) => {
  return (
    <NominatorFilterProvider>
      <Box>
        {children}
        <FiltersDrawer />
      </Box>
    </NominatorFilterProvider>
  );
};

export default NominatorFilterDrawer;
