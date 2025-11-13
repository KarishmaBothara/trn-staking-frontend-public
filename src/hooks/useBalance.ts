// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import type { Option } from '@polkadot/types-codec';
import type { AssetId, Balance, TAssetBalance } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

import { useBalancesAll } from './useBalancesAll';
import { useCall } from './useCall';
import { useTrnApi } from '@futureverse/transact-react';

export interface BalanceResult {
  assetId: string;
  accountId: string;
  balance: TAssetBalance | Balance;
}

export interface DecodeAssetBalance extends Codec {
  balance: TAssetBalance | Balance;
  isFrozen: boolean;
}

interface Result {
  balances: BalanceResult[];
}

function isOptional(
  value: DecodeAssetBalance | Option<DecodeAssetBalance>
): value is Option<DecodeAssetBalance> {
  return (
    (value as Option<DecodeAssetBalance>).isSome || (value as Option<DecodeAssetBalance>).isNone
  );
}

const queryOptions = {
  transform: ([[params], accounts]: [
    [[AssetId, string][]],
    (DecodeAssetBalance | Option<DecodeAssetBalance>)[]
  ]): Result => {
    return {
      balances: params.map((param, index): BalanceResult => {
        const o = accounts[index];
        const balance = isOptional(o) ? o.unwrapOr(undefined)?.balance : o?.balance;
        return {
          assetId: param[0].toString(),
          accountId: param[1],
          balance: balance as TAssetBalance | Balance,
        };
      }),
    };
  },
  withParamsTransform: true,
};

export default function useBalance(
  account: string | null,
  assetIds: string[]
): BalanceResult[] | [] {
  const [coinBalance, setCoinBalance] = useState<BalanceResult[]>([]);
  const rootBalance = useBalancesAll(account);
  const { trnApi } = useTrnApi();
  const query = useCall(
    !!account && trnApi?.query.assets.account.multi,
    [assetIds.map((id) => [id, account])],
    queryOptions
  );

  useEffect(() => {
    if (rootBalance && query && account && query.balances) {
      setCoinBalance((prev) => {
        const prevBalances = prev.filter((p) => p.accountId === account);

        const newBalances = query.balances.filter((b) => {
          const prevBalance = prevBalances.find(
            (p) => p.assetId === b.assetId && p.accountId === b.accountId
          );
          return !prevBalance || (prevBalance?.balance && prevBalance?.balance !== b.balance);
        });
        const filteredPrevBalances = prevBalances.filter(
          (p) => newBalances.findIndex((n) => n.assetId === p.assetId) === -1
        );

        const newBalancesWithRoot = newBalances.map((b) => {
          if (b.assetId === '1') {
            const root = {
              ...b,
              balance: rootBalance?.availableBalance as TAssetBalance,
            };
            return root;
          }
          return b;
        });

        return [...newBalancesWithRoot, ...filteredPrevBalances];
      });
    }
  }, [query, account, rootBalance]);

  return coinBalance;
}
