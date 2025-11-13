import { useMemo } from 'react';

import type { BN } from '@polkadot/util';
import { BN_MAX_INTEGER, BN_ONE, bnMin, bnToBn, extractTime } from '@polkadot/util';
import type { Time } from '@polkadot/util/types';

import { createNamedHook } from './createNamedHook';
import { useBlockInterval } from './useBlockInterval';

type Result = [blockInterval: number, timeStr: string, time: Time];

export function calcBlockTime(blockTime: BN, blocks: BN): Result {
  // in the case of excessively large locks, limit to the max JS integer value
  const value = bnMin(BN_MAX_INTEGER, blockTime.mul(blocks)).toNumber();

  // time calculations are using the absolute value (< 0 detection only on strings)
  const time = extractTime(Math.abs(value));
  const { days, hours, minutes, seconds } = time;

  return [
    blockTime.toNumber(),
    `${value < 0 ? '+' : ''}${[
      days ? (days > 1 ? `${days} days` : '1 day') : null,
      hours ? (hours > 1 ? `${hours} hrs` : '1 hr') : null,
      minutes ? (minutes > 1 ? `${minutes} mins` : '1 min') : null,
      seconds ? (seconds > 1 ? `${seconds} s` : '1 s') : null,
    ]
      .filter((s): s is string => !!s)
      .slice(0, 2)
      .join(' ')}`,
    time,
  ];
}

function useBlockTimeImpl(blocks: number | BN = BN_ONE): Result | undefined {
  const blockTime = useBlockInterval();

  return useMemo(() => {
    if (blockTime) {
      return calcBlockTime(blockTime, bnToBn(blocks));
    }
  }, [blockTime, blocks]);
}

export const useBlockTime = createNamedHook('useBlockTime', useBlockTimeImpl);
