import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';

import { isEmpty, set } from 'lodash';

import { BN } from '@polkadot/util';
import { DECIMALS, TransactionStatus } from 'common/types';
import { useCall } from 'hooks/useCall';
import useNominator from 'hooks/useNominator';
import useStakingStatus from 'hooks/useStakingStatus';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';
import { useRootTransaction } from 'providers/RootTransactionProvider';
import { IExtrinsicInfo } from 'utils/chainHelper';
import { scaleBy, unscaleBy } from 'utils/polkadotBN';
import { useTrnApi } from '@futureverse/transact-react';

//Use regular expression to allow digits and at most one dot
export function formatInputValue(value: string): string {
  return value.replace(/[^\d.]/g, '').replace(/(\..*?)\..*/g, '$1');
}
export enum StakeErrorFields {
  AMOUNT = 'amount',
}

interface IProps {
  error: Record<string, string>;
  amount: string;
  txInfo?: IExtrinsicInfo;
  status: TransactionStatus;
  txError?: string | null;
  handleAmount: (amount: string) => void;
  clearError: (fieldName: StakeErrorFields) => void;
  clearAllError: () => void;
  clearStatus: (restart?: boolean) => void;
  remove: () => Promise<boolean>;
  confirmToRemove: () => Promise<void>;
  reset: () => void;
}

const StakePositionContext = createContext<IProps>({} as IProps);

export const useStakePosition = () => {
  const context = useContext(StakePositionContext);
  if (!context) {
    throw new Error('must be used in StakePositionProvider');
  }
  return context;
};

const StakeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { trnApi } = useTrnApi();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<Record<string, string>>({});
  const {
    status,
    setStatus,
    error: txError,
    txInfo,
    handleUnbond,
    confirmToUnbond,
  } = useRootTransaction();
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const stakingStatus = useStakingStatus(futurePassAddress || '');
  const minNominatorBond = useCall(trnApi && trnApi.query.staking.minNominatorBond);
  const nominator = useNominator(futurePassAddress || '');

  const clearStatus = (restart = false) => {
    setStatus(restart ? TransactionStatus.START : TransactionStatus.NONE);
  };

  const validateRemove = useCallback(
    async (amount: string) => {
      const errorFields: Record<string, string> = {};
      if (!stakingStatus?.active) {
        errorFields[StakeErrorFields.AMOUNT] = 'Has no stake to remove';
      } else if (Number(amount) <= 0) {
        errorFields[StakeErrorFields.AMOUNT] = 'Amount to stake required';
      } else {
        amount = amount.replaceAll(',', '');
        const amountBN = scaleBy(Number(amount), DECIMALS);
        const totalStakeBN = new BN(stakingStatus?.active);
        const minNominatorBondBN = new BN(Number(minNominatorBond));
        if (totalStakeBN.lt(amountBN)) {
          errorFields[StakeErrorFields.AMOUNT] = 'Staked balance is too low';
        }
        if (nominator && totalStakeBN.sub(amountBN).lt(minNominatorBondBN)) {
          const unscaledValue = Number(unscaleBy(minNominatorBondBN, DECIMALS).join(''));
          // only show the floating value if the decimal part is more than 0
          const displayAmount = unscaledValue % 1 > 0 ? unscaledValue : Math.trunc(unscaledValue);
          errorFields[
            StakeErrorFields.AMOUNT
          ] = `To unstake all ROOT, first remove any node nominations, as nominating requires at least ${displayAmount} ROOT staked`;
        }
      }
      return errorFields;
    },
    [minNominatorBond, nominator, stakingStatus?.active]
  );

  const confirmToRemove = useCallback(async () => {
    setError({});
    const errorFields = await validateRemove(amount);
    if (!isEmpty(errorFields)) {
      setError(errorFields);
      return;
    }
    await confirmToUnbond(Number(amount));
  }, [amount, confirmToUnbond, validateRemove]);

  const remove = useCallback(async () => {
    const errorFields = await validateRemove(amount);
    if (!isEmpty(errorFields)) {
      setError(errorFields);
      return false;
    }
    await handleUnbond(Number(amount));
    return true;
  }, [amount, handleUnbond, validateRemove]);

  const clearError = (fieldName: StakeErrorFields) => {
    setError((error) => {
      delete error[fieldName];
      return error;
    });
  };

  const clearAllError = () => {
    setError({});
  };

  const reset = () => {
    setAmount('');
    clearAllError();
    clearStatus();
  };

  const handleAmount = useCallback(
    async (amountValue: string) => {
      setError({});
      const amount = formatInputValue(amountValue);
      const errorFields = await validateRemove(amount);
      if (!isEmpty(errorFields)) {
        setError(errorFields);
      }
      setAmount(amount);
    },
    [validateRemove]
  );

  return (
    <StakePositionContext.Provider
      value={{
        error,
        amount,
        txInfo,
        status,
        txError,
        handleAmount,
        clearError,
        clearAllError,
        clearStatus,
        remove,
        reset,
        confirmToRemove,
      }}
    >
      {children}
    </StakePositionContext.Provider>
  );
};

export default StakeProvider;
