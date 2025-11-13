import { useTrnApi } from '@futureverse/transact-react';
import { useCall } from './useCall';

interface Nominator {
  submittedIn: number;
  targets: string[];
  suppressed: boolean;
}

export default function useNominator(account: any): Nominator | undefined {
  const { trnApi } = useTrnApi();

  const nominator: any = useCall(
    account && trnApi && trnApi.query.staking.nominators,
    account && [account]
  );

  return nominator?.toJSON() as any;
}
