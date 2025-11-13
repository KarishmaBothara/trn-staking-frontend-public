import { Stack } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import { Countdown } from 'hooks/useNextCycleCountdown';

interface IProps {
  countdown: Countdown;
}

const Timer = ({ countdown }: IProps) => {
  const { days, hours: hrs, minutes: mins, seconds: sec } = countdown.time;

  return (
    <Stack direction="row" spacing={2} display="inline-block" ml={3}>
      <Stack direction="row" spacing={1}>
        <>
          {days > 0 && (
            <>
              <Typography variant="body1" color="primary.main">
                {days}
              </Typography>
              <Typography
                variant="body1"
                color="secondary.dark"
                sx={{ textTransform: 'uppercase' }}
              >
                {days <= 1 ? 'day' : 'days'}
              </Typography>
            </>
          )}
          <>
            <Typography variant="body1" color="primary.main">
              {hrs}
            </Typography>
            <Typography variant="body1" color="secondary.dark" sx={{ textTransform: 'uppercase' }}>
              Hr
            </Typography>
          </>
          <>
            <Typography variant="body1" color="primary.main">
              {mins}
            </Typography>
            <Typography variant="body1" color="secondary.dark" sx={{ textTransform: 'uppercase' }}>
              min
            </Typography>
          </>
          <>
            <Typography variant="body1" color="primary.main">
              {sec}
            </Typography>
            <Typography variant="body1" color="secondary.dark" sx={{ textTransform: 'uppercase' }}>
              s
            </Typography>
          </>
        </>
      </Stack>
    </Stack>
  );
};

export default Timer;
