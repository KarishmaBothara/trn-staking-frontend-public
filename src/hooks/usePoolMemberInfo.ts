import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types';
import { BN } from '@polkadot/util';
import { PoolMemberInfo } from 'common/types';

import { createNamedHook } from './createNamedHook';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';
import { useTrnApi } from '@futureverse/transact-react';

const OPT_DEL = {
  transform: (opt: any) => opt.unwrapOr(null),
};

function usePoolMemberInfoImpl(accountId: string): PoolMemberInfo | null {
  const { trnApi } = useTrnApi();
  const isMountedRef = useIsMountedRef();
  const [state, setState] = useState<PoolMemberInfo | null>(null);
  const member = useCall(trnApi && trnApi.query.nominationPools.poolMembers, [accountId], OPT_DEL);

  useEffect((): void => {
    member &&
      trnApi &&
      trnApi.call.nominationPoolsApi &&
      trnApi.call.nominationPoolsApi
        .pendingRewards(accountId)
        .then(
          (claimable) =>
            isMountedRef.current && setState({ claimable: new BN(claimable.toString()), member })
        )
        .catch(console.error);
  }, [accountId, member, trnApi, isMountedRef]);

  return state;
}

export default createNamedHook('usePoolMemberInfo', usePoolMemberInfoImpl);
