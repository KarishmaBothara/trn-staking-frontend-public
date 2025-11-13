// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import type { ApiPromise } from '@polkadot/api';
import { BN, BN_THOUSAND, BN_TWO, bnMin } from '@polkadot/util';
import { A_DAY } from 'common/types';

import { createNamedHook } from './createNamedHook';
import { useTrnApi } from '@futureverse/transact-react';

// Some chains incorrectly use these, i.e. it is set to values such as 0 or even 2
// Use a low minimum validity threshold to check these against
const THRESHOLD = BN_THOUSAND.div(BN_TWO);
const DEFAULT_TIME = new BN(4_000);

function calcInterval(api: ApiPromise): BN {
  const time =
    api.consts.babe?.expectedBlockTime ||
    // POW, eg. Kulupu
    api.consts.difficulty?.targetBlockTime ||
    // Subspace
    api.consts.subspace?.expectedBlockTime ||
    // Check against threshold to determine value validity
    (new BN(api.consts.timestamp?.minimumPeriod.toString()).gte(THRESHOLD)
      ? // Default minimum period config
        new BN(api.consts.timestamp.minimumPeriod.toString()).mul(BN_TWO)
      : api.query.parachainSystem
      ? // default guess for a parachain
        DEFAULT_TIME.mul(BN_TWO)
      : // default guess for others
        DEFAULT_TIME);
  return bnMin(A_DAY, new BN(time.toString()));
}

function useBlockIntervalImpl(): BN | undefined {
  const { trnApi } = useTrnApi();

  return useMemo(() => {
    if (trnApi) {
      return calcInterval(trnApi);
    }
  }, [trnApi]);
}

export const useBlockInterval = createNamedHook('useBlockInterval', useBlockIntervalImpl);
