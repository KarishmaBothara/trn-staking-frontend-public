// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import type { DeriveSessionInfo } from '@polkadot/api-derive/types';
import { BN } from '@polkadot/util';
import { BN_ONE } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useCall } from './useCall';
import { useTrnApi } from '@futureverse/transact-react';

function useUnbondDurationImpl(): BN | undefined {
  const { trnApi } = useTrnApi();
  const sessionInfo = useCall<DeriveSessionInfo>(trnApi && trnApi.derive?.session.info);

  return useMemo(
    () =>
      trnApi?.isReady && sessionInfo && sessionInfo.sessionLength.gt(BN_ONE)
        ? sessionInfo.eraLength.mul(new BN(trnApi.consts?.staking?.bondingDuration.toString()))
        : undefined,
    [trnApi, sessionInfo]
  );
}

export default createNamedHook('useUnbondDuration', useUnbondDurationImpl);
