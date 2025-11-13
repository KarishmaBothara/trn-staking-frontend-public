import { useTrnApi } from '@futureverse/transact-react';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { createNamedHook } from './createNamedHook';
import { useCall } from './useCall';

/**
 * Gets the account full balance information
 *
 * @param accountAddress The account address of which balance is to be returned
 * @returns full information about account's balances
 */
function useBalancesAllImpl(accountAddress: string | null): DeriveBalancesAll | undefined {
  const { trnApi } = useTrnApi();
  return useCall<DeriveBalancesAll>(trnApi && !!accountAddress && trnApi.derive.balances?.all, [
    accountAddress,
  ]);
}

export const useBalancesAll = createNamedHook('useBalancesAll', useBalancesAllImpl);
