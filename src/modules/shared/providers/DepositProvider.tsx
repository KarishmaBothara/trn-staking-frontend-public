import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

import { isEmpty } from 'lodash';

import {
  ChangeNominationStage,
  DepositMoreStage,
  DepositStage,
  NominationStage,
  WithdrawStage,
} from '../../dashboard/type';
import { BN } from '@polkadot/util';
import { DECIMALS, TransactionStatus } from 'common/types';
import { AssetInfo } from 'hooks/useAssets';
import { useBalancesAll } from 'hooks/useBalancesAll';
import { useCall } from 'hooks/useCall';
import useStakingStatus from 'hooks/useStakingStatus';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';
import { useRootTransaction } from 'providers/RootTransactionProvider';
import { IExtrinsicInfo } from 'utils/chainHelper';
import { scaleBy, unscaleBy } from 'utils/polkadotBN';
import { useTrnApi } from '@futureverse/transact-react';
import { formatInputValue } from './StakeProvider';

export enum DepositErrorFields {
  AMOUNT = 'amount',
  NOMINATION = 'nomination',
}

interface IDepositContext {
  stage: DepositStage;
  setStage: (stage: DepositStage) => void;
  depositMoreStage: DepositMoreStage;
  setDepositMoreStage: (stage: DepositMoreStage) => void;
  nominationStage: NominationStage;
  setNominationStage: (stage: NominationStage) => void;
  withdrawStage: WithdrawStage;
  setWithdrawStage: (stage: WithdrawStage) => void;
  changeNominationStage: ChangeNominationStage;
  setChangeNominationStage: (stage: ChangeNominationStage) => void;
  amount: string;
  handleAmount: (amount: string) => void;
  isGasSufficient: boolean;
  gasToken: AssetInfo | null;
  handleGetGasToken: (TokenInfo: AssetInfo) => void;
  error: Record<string, string>;
  clearError: (fieldName: DepositErrorFields) => void;
  clearAllError: () => void;
  selectedValidators: string[];
  selectValidator: (validator: string) => void;
  setSelectedValidators: (validator: string[]) => void;
  clearSelection: () => void;
  txInfo?: IExtrinsicInfo;
  status: TransactionStatus;
  txError?: string | null;
  clearStatus: (restart?: boolean) => void;
  confirmBond: () => Promise<void>;
  bond: () => Promise<void>;
  confirmBondMore: () => Promise<void>;
  bondMore: () => Promise<void>;
  confirmBondAndNominate: (isBondMore: boolean) => Promise<void>;
  bondAndNominate: () => Promise<void>;
  confirmNominate: () => Promise<void>;
  nominate: () => Promise<void>;
  reset: () => void;
}

const DepositContext = createContext<IDepositContext>({} as IDepositContext);

const DepositProvider = ({ children }: { children: ReactNode }) => {
  const { trnApi } = useTrnApi();
  const [stage, setStage] = useState<DepositStage>(DepositStage.AMOUNT);
  const [depositMoreStage, setDepositMoreStage] = useState<DepositMoreStage>(
    DepositMoreStage.AMOUNT
  );
  const [nominationStage, setNominationStage] = useState<NominationStage>(
    NominationStage.NOMINATION
  );
  const [changeNominationStage, setChangeNominationStage] = useState<ChangeNominationStage>(
    ChangeNominationStage.NOMINATION
  );
  const [withdrawStage, setWithdrawStage] = useState<WithdrawStage>(WithdrawStage.START);

  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<Record<string, string>>({});

  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const balancesAll = useBalancesAll(futurePassAddress);
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const minNominatorBond = useCall(trnApi && trnApi.query.staking.minNominatorBond);
  const stakingStatus = useStakingStatus(futurePassAddress || '');
  const {
    status,
    setStatus,
    error: txError,
    txInfo,
    isGasSufficient,
    gasToken,
    confirmToBond,
    handleBond,
    confirmToBondMore,
    handleBondMore,
    confirmToBondAndNominate,
    handleBondAndNominate,
    confirmToNominate,
    handleNominate,
    handleSetGasToken,
  } = useRootTransaction();
  const maxNominations = Number(trnApi && trnApi.consts.staking.maxNominations.toString());

  const validateAmount = useCallback(
    (amount: string) => {
      const errorFields: Record<string, string> = {};
      if (!balancesAll?.availableBalance) {
        errorFields[DepositErrorFields.AMOUNT] = 'Balance is too low';
      } else if (Number(amount) <= 0) {
        errorFields[DepositErrorFields.AMOUNT] = 'Amount to stake required';
      } else {
        const amountBN = scaleBy(Number(amount), DECIMALS);
        const minNominatorBondBN = new BN(Number(minNominatorBond));
        if (balancesAll?.availableBalance.lt(amountBN)) {
          errorFields[DepositErrorFields.AMOUNT] = 'Balance is too low';
        }

        if ((!stakingStatus || stakingStatus?.active <= 0) && amountBN.lt(minNominatorBondBN)) {
          errorFields[DepositErrorFields.AMOUNT] = `The staked balance must exceed ${unscaleBy(
            minNominatorBondBN,
            DECIMALS
          )}. To withdraw all tokens, cancel the nomination.`;
        }

        if (selectedValidators.length >= maxNominations) {
          errorFields[DepositErrorFields.NOMINATION] =
            'The amount of nomination cannot exceed the allowed maximum nominations.';
        }
      }
      return errorFields;
    },
    [
      balancesAll?.availableBalance,
      maxNominations,
      minNominatorBond,
      selectedValidators.length,
      stakingStatus,
    ]
  );

  const validateNomination = useCallback(() => {
    const errorFields: Record<string, string> = {};
    if (selectedValidators.length >= maxNominations) {
      errorFields[DepositErrorFields.NOMINATION] =
        'The amount of nomination cannot exceed the allowed maximum nominations.';
    }
    return errorFields;
  }, [maxNominations, selectedValidators.length]);

  const handleAmount = useCallback(
    async (amountValue: string) => {
      const amount = formatInputValue(amountValue);
      const errorFields = validateAmount(amount);
      if (!isEmpty(errorFields)) {
        setError(errorFields);
      }
      setAmount(amount);
    },
    [validateAmount]
  );

  const handleGetGasToken = useCallback(
    (tokenInfo: AssetInfo) => {
      handleSetGasToken(tokenInfo);
    },
    [handleSetGasToken]
  );
  const confirmBond = useCallback(async () => {
    if (!isEmpty(error)) {
      return;
    }

    await confirmToBond(Number(amount));
  }, [amount, error, confirmToBond]);

  const bond = useCallback(async () => {
    if (!isEmpty(error)) {
      return;
    }

    await handleBond(Number(amount));
  }, [amount, error, handleBond]);

  const confirmBondMore = useCallback(async () => {
    if (!isEmpty(error)) {
      return;
    }

    await confirmToBondMore(Number(amount));
  }, [amount, error, confirmToBondMore]);

  const bondMore = useCallback(async () => {
    if (!isEmpty(error)) {
      return;
    }

    await handleBondMore(Number(amount));
  }, [amount, error, handleBondMore]);

  const confirmBondAndNominate = useCallback(
    async (isBondMore: boolean) => {
      if (!isEmpty(error) || selectedValidators.length <= 0) {
        return;
      }

      await confirmToBondAndNominate(Number(amount), selectedValidators, isBondMore);
    },
    [amount, error, confirmToBondAndNominate, selectedValidators]
  );

  const bondAndNominate = useCallback(async () => {
    if (!isEmpty(error) || selectedValidators.length <= 0) {
      return;
    }

    await handleBondAndNominate();
  }, [error, handleBondAndNominate, selectedValidators]);

  const confirmNominate = useCallback(async () => {
    if (selectedValidators.length <= 0) {
      return;
    }
    await confirmToNominate(selectedValidators);
  }, [confirmToNominate, selectedValidators]);

  const nominate = useCallback(async () => {
    if (selectedValidators.length <= 0) {
      return;
    }
    await handleNominate(selectedValidators);
  }, [handleNominate, selectedValidators]);

  const clearError = (fieldName: DepositErrorFields) => {
    setError((error) => {
      delete error[fieldName];
      return error;
    });
  };

  const clearStatus = (restart = false) => {
    setStatus(restart ? TransactionStatus.START : TransactionStatus.NONE);
  };

  const clearAllError = () => {
    setError({});
  };

  const selectValidator = useCallback(
    (validator: string) => {
      clearError(DepositErrorFields.NOMINATION);
      if (selectedValidators.includes(validator)) {
        setSelectedValidators(selectedValidators.filter((v) => v !== validator));
      } else {
        const errorFields = validateNomination();
        if (!isEmpty(errorFields)) {
          setError(errorFields);
          return;
        }
        setSelectedValidators([...selectedValidators, validator]);
      }
    },
    [selectedValidators, validateNomination]
  );

  const clearSelection = () => {
    setSelectedValidators([]);
  };

  const reset = () => {
    setAmount('');
    setError({});
    setSelectedValidators([]);
  };

  return (
    <DepositContext.Provider
      value={{
        stage,
        setStage,
        depositMoreStage,
        setDepositMoreStage,
        nominationStage,
        setNominationStage,
        withdrawStage,
        setWithdrawStage,
        changeNominationStage,
        setChangeNominationStage,
        amount,
        handleAmount,
        isGasSufficient,
        gasToken,
        handleGetGasToken,
        error,
        clearAllError,
        clearError,
        selectedValidators,
        selectValidator,
        setSelectedValidators,
        clearSelection,
        clearStatus,
        status,
        txError,
        txInfo,
        confirmBond,
        bond,
        confirmBondMore,
        bondMore,
        confirmBondAndNominate,
        bondAndNominate,
        confirmNominate,
        nominate,
        reset,
      }}
    >
      {children}
    </DepositContext.Provider>
  );
};

export const useDeposit = () => {
  const context = useContext(DepositContext);
  if (!context) {
    throw new Error('must be used in DepositProvider');
  }
  return context;
};

export default DepositProvider;
