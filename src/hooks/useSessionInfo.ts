// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import type { Option, u32 } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import { SessionInfo } from 'common/types';

import { createNamedHook } from './createNamedHook';
import { useCall } from './useCall';
import { useTrnApi } from '@futureverse/transact-react';

const OPT_ACTIVEERA = {
  transform: (activeEra: any): BN | null => (activeEra.isSome ? activeEra.unwrap().index : null),
};

const OPT_CURRENTERA = {
  transform: (currentEra: Option<u32>): BN | null => currentEra.unwrapOr(null),
};

function useSessionInfoImpl(): SessionInfo {
  const { trnApi } = useTrnApi();
  const activeEra = useCall(trnApi && trnApi.query.staking.activeEra, null, OPT_ACTIVEERA);
  const currentEra = useCall(trnApi && trnApi.query.staking.currentEra, null, OPT_CURRENTERA);
  const currentSession = useCall<u32>(trnApi && trnApi.query.session.currentIndex);

  return useMemo(
    () => ({ activeEra, currentEra, currentSession }),
    [activeEra, currentEra, currentSession]
  );
}

export default createNamedHook('useSessionInfo', useSessionInfoImpl);
