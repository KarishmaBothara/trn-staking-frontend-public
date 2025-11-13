import appConfig from 'utils/appConfig';
import { createNamedHook } from './createNamedHook';
import { useEffect, useState } from 'react';
import { extractTime } from '@polkadot/util';
import type { Time } from '@polkadot/util/types';

const STAKING_DURATION_MS = appConfig().stakingDuration * 24 * 60 * 60 * 1000;

export type Countdown = {
  time: Time;
};

/**
 * Calculates the remaining time until the next cycle starts. The calculation is
 * based upon knowing the timestamp of any previous cycle start, and also
 * assuming that the cycle duration is a fixed number of eras.
 *
 * To calculate, we find the difference between the current timestamp, and the
 * timestamp of any previous known cycle start. The difference is then used in a
 * modulo operation with the cycle duration to calculate the time left in the
 * current cycle.
 */
function useNextCycleCountdown() {
  const [cycleRemainingDurationMs, setCycleRemainingDurationMs] = useState(0);

  const [nextCycleCountdown, setNextCycleCountdown] = useState<Time>({
    days: 0,
    minutes: 0,
    hours: 0,
    seconds: 0,
    milliseconds: 0,
  });

  useEffect(() => {
    const { anyCycleStartDate } = appConfig();

    const cycleStartDate = new Date(anyCycleStartDate);

    const remainingTime =
      STAKING_DURATION_MS - ((Date.now() - cycleStartDate.valueOf()) % STAKING_DURATION_MS);
    setCycleRemainingDurationMs(remainingTime);

    const intervalId = setInterval(() => {
      setCycleRemainingDurationMs((r) => r - 1000);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const time = extractTime(cycleRemainingDurationMs);
    setNextCycleCountdown(time);
  }, [cycleRemainingDurationMs]);

  return { time: nextCycleCountdown };
}

export default createNamedHook('useNextCycleCountdown', useNextCycleCountdown);
