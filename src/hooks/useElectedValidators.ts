import { useMemo } from 'react';

import type { StorageKey, u32 } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import { SessionInfo } from 'common/types';

import { createNamedHook } from './createNamedHook';
import { useCacheValue } from './useCacheValue';
import { useMapKeys } from './useMapKeys';
import { useTrnApi } from '@futureverse/transact-react';

const OPT_ELECTED = {
  transform: (keys: StorageKey<[u32, AccountId32]>[]): string[] =>
    keys.map(({ args: [, stashId] }) => stashId.toString()),
};

function useElectedValidatorsImpl({ currentEra }: SessionInfo): string[] | undefined {
  const { trnApi } = useTrnApi();

  const electedParams = useMemo(() => currentEra && [currentEra], [currentEra]);

  const elected = useMapKeys(
    electedParams && trnApi?.query.staking.erasStakers,
    electedParams,
    OPT_ELECTED
  );

  return useCacheValue('useElectedValidators', elected);
}

export default createNamedHook('useElectedValidators', useElectedValidatorsImpl);
