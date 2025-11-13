import { Box } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import { BN, formatNumber } from '@polkadot/util';
import { useBlockTime } from 'hooks/useBlockTime';
import { useTrnApi } from '@futureverse/transact-react';

const UnbondTime = ({ eras, blocks }: { eras: BN; blocks: BN }) => {
  const { trnApi } = useTrnApi();
  const timeInfo = useBlockTime(blocks);

  return (
    <Box>
      {trnApi && trnApi.consts.babe.epochDuration && timeInfo ? (
        <Typography variant="subtitle1">{`${timeInfo[1]}`}</Typography>
      ) : (
        <Typography variant="subtitle1">{`${formatNumber(eras)} eras remaining`}</Typography>
      )}
    </Box>
  );
};

export default UnbondTime;
