import { useTrnApi } from '@futureverse/transact-react';
import type { AccountInfoWithProviders, AccountInfoWithRefCount } from '@polkadot/types/interfaces';
import { BalanceResult, ROOT_ASSET_ID } from 'common/types';

import { useCall } from './useCall';

export default function useAccountInfo(account: any): BalanceResult | null {
  const { trnApi } = useTrnApi();
  const accountInfo = useCall<AccountInfoWithProviders | AccountInfoWithRefCount>(
    account && trnApi?.query.system.account,
    account && [account]
  );

  if (accountInfo) {
    return {
      assetId: ROOT_ASSET_ID,
      accountId: account,
      balance: accountInfo?.data.free,
    };
  }

  return null;
}
