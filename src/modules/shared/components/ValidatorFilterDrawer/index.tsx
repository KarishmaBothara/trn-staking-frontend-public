import { Box } from '@mui/material';

import FiltersDrawer from './FiltersDrawer';
import { ValidatorFilterProvider } from './ValidatorFilterProvider';

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

const ValidatorFilterDrawer = ({ children }: IProps) => {
  return (
    <ValidatorFilterProvider>
      <Box>
        {children}
        <FiltersDrawer />
      </Box>
    </ValidatorFilterProvider>
  );
};

export default ValidatorFilterDrawer;
