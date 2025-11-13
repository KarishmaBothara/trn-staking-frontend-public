import { useMemo } from 'react';
import { createNamedHook } from './createNamedHook';
import { useCall } from './useCall';
import { useTrnApi } from '@futureverse/transact-react';
import { useFuturePassAccountAddress } from './useFuturePassAccountAddress';

const useLedgerImplement = () => {
  const { trnApi } = useTrnApi();
  const { data: fpWalletAddress } = useFuturePassAccountAddress();

  const ledger = useCall(trnApi && trnApi.query.staking.ledger, [fpWalletAddress || '']) as any;

  const data = useMemo(() => {
    if (!trnApi || !ledger) return null;

    if (ledger.isNone) {
      return {
        totalPosition: 0,
        activePosition: 0,
      };
    }

    const ledgerData = ledger.toJSON();

    if (ledgerData && ledgerData.total && ledgerData.active) {
      return {
        totalPosition: ledgerData.total as number,
        activePosition: ledgerData.active as number,
      };
    }

    return null;
  }, [trnApi, ledger]);

  return data;
};

export default createNamedHook('useLedger', useLedgerImplement);
