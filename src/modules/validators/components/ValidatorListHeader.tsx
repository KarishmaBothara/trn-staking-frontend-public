import { Stack } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import ValidatorFilterDrawer from 'modules/shared/components/ValidatorFilterDrawer';
import Actions from 'modules/shared/components/ValidatorFilterDrawer/Actions';

interface IProps {
  heading?: string;
}

const ValidatorListHeader = ({ heading = 'Validators' }: IProps) => {
  return (
    <>
      <Stack direction="column" alignItems="flex-start" spacing={2}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {heading}
        </Typography>

        <ValidatorFilterDrawer>
          <Actions />
        </ValidatorFilterDrawer>
      </Stack>
    </>
  );
};

export default ValidatorListHeader;
