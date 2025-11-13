import { FC } from 'react';

import { Box, Chip } from '@mui/material';

import { numericLocalize } from 'common';

import { Typography } from '@futureverse/component-library';

export interface VortexInfoProps {
  token: string;
  percentage: string;
  amount: string;
  cycle: string;
}

const VortexInfo: FC<VortexInfoProps> = ({ token, percentage, amount, cycle }) => {
  return (
    <Box display="flex" flexDirection="column" gap={1} py={4} mb={{ xs: 2, lg: 5 }}>
      <Box display="flex" flexDirection="row" alignItems={'center'} gap={3}>
        <Typography variant="overline" fontSize={16} fontWeight={700} color="secondary.light">
          {token}
        </Typography>
      </Box>

      <Typography variant="h2" fontWeight={700}>
        {numericLocalize(amount, {
          maximumFractionDigits: 6,
          minimumFractionDigits: 6,
        })}
      </Typography>

      <Typography variant="overline" fontSize={16} fontWeight={700} color="#008936">
        {`(+${numericLocalize(cycle, {
          maximumFractionDigits: 6,
          minimumFractionDigits: 6,
        })} current cycle)`}
      </Typography>
    </Box>
  );
};

export default VortexInfo;
