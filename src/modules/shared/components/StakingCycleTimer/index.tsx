import { FC, useEffect, useState } from 'react';
import { LinearProgress, Stack } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import Timer from 'components/Timer';

import useNextCycleCountdown from 'hooks/useNextCycleCountdown';
import appConfig from 'utils/appConfig';

const StakingCycleTimer: FC = () => {
  const cycleCountdown = useNextCycleCountdown();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stakingDuration = appConfig().stakingDuration;
    setProgress(Math.floor(((stakingDuration - cycleCountdown.time.days) / stakingDuration) * 100));
  }, [cycleCountdown.time.days]);

  return (
    <Stack direction={'column'} alignItems={'flex-start'} spacing={1}>
      <Typography
        variant="subtitle1"
        color="primary.main"
        sx={{ fontWeight: 700, textTransform: 'capitalize' }}
      >
        Cycle Ends in <Timer countdown={cycleCountdown} />
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ width: '100%' }} />
    </Stack>
  );
};

export default StakingCycleTimer;
