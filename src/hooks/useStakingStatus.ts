import { useTrnApi } from '@futureverse/transact-react';

import { useCall } from './useCall';

export default function useStakingStatus(account: any) {
  const { trnApi } = useTrnApi();
  const ledger: any = useCall(account && trnApi?.query.staking.ledger, account && [account]);

  const stakingStatus = ledger?.toJSON() as any;
  if (stakingStatus) {
    return {
      total: stakingStatus?.total,
      active: stakingStatus?.active,
      unlocking: stakingStatus?.unlocking,
      stash: stakingStatus?.stash,
    };
  }

  return null;
}
