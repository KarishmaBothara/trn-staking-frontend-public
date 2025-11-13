import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isEmpty } from 'lodash';
import { DECIMALS, TransactionStatus, VORTEX_ASSET_ID } from 'common/types';
import { AssetInfo } from 'hooks/useAssets';
import useBalance from 'hooks/useBalance';
import { useCall } from 'hooks/useCall';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';
import { useRootTransaction } from 'providers/RootTransactionProvider';
import { IExtrinsicInfo } from 'utils/chainHelper';
import { PAGE_SIZE } from 'utils/fetchRequest';
import { scaleBy } from 'utils/polkadotBN';

import { IRewardRedeemHistory, RedeemAsset, RedeemStage } from '../type';
import { useApiAt } from './useApiAt';
import { useQueryVaultData } from './useQueryVaultData';

import useRewardRedeemInfo from 'hooks/useRewardRedeemInfo';

export enum RedeemErrorFields {
  AMOUNT = 'amount',
}

interface IRedeemContext {
  vortex: number | null;
  totalSupply: number;
  stage: RedeemStage;
  setStage: (stage: RedeemStage) => void;
  amount: string;
  handleAmount: (amount: string) => void;
  error: Record<string, string>;
  clearError: (fieldName: RedeemErrorFields) => void;
  clearAllError: () => void;
  txInfo?: IExtrinsicInfo;
  status: TransactionStatus;
  txError?: string | null;
  clearStatus: (restart?: boolean) => void;
  reset: () => void;
  rewardRedeemHistory: IRewardRedeemHistory[];
  rewardRedeemHistoryLoading: boolean;
  rewardRedeemHistoryError: boolean;
  refetchHistory: () => void;
  total: number;
  page: number;
  setPage: (page: number) => void;
  redeemAssets: RedeemAsset[];
  assetsPage: number;
  setAssetsPage: (page: number) => void;
  handleGetGasToken: (TokenInfo: AssetInfo) => void;
}

const RedeemContext = createContext<IRedeemContext>({} as IRedeemContext);

const RedeemProvider = ({ children }: { children: ReactNode }) => {
  const { api, isApiReady } = useApiAt();
  const [stage, setStage] = useState<RedeemStage>(RedeemStage.START);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [rewardRedeemHistory, setRewardRedeemHistory] = useState<IRewardRedeemHistory[]>([]);
  const [assetsPage, setAssetsPage] = useState(1);

  const { data: vaultData } = useQueryVaultData(api);

  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<Record<string, string>>({});
  const { data: futurePassAddress } = useFuturePassAccountAddress();

  const { status, setStatus, error: txError, txInfo, handleSetGasToken } = useRootTransaction();

  const {
    history,
    loading,
    error: rewardRedeemError,
    refetchHistory,
  } = useRewardRedeemInfo(futurePassAddress);

  useEffect(() => {
    if (!history || rewardRedeemError) {
      return;
    }
    if (history.data) {
      const skip = (page - 1) * PAGE_SIZE;
      const data = history.data.slice(skip, skip + PAGE_SIZE);
      setRewardRedeemHistory(data);
      setTotal(history.totalCount);
    }
  }, [history, page, rewardRedeemError]);

  const vortex = useBalance(futurePassAddress, [VORTEX_ASSET_ID]);
  const totalSupply = useCall(isApiReady && api.query.assets.asset, [3]) as any;

  const vortexBalance = useMemo(() => {
    if (!vortex || !vortex[0]) return null;

    return Number(vortex[0].balance ?? 0);
  }, [vortex]);

  const totalSupplyAmount = useMemo(() => {
    const data = totalSupply?.toJSON();
    if (data) {
      return data.supply as number;
    }
    return 0;
  }, [totalSupply]);

  const redeemAssets = useMemo(() => {
    if (!vortexBalance) {
      return [];
    }

    // Not excess the balance amount
    const vortexAmount = Math.min(Number(amount), vortexBalance / Math.pow(10, DECIMALS));
    if (vaultData && totalSupplyAmount > 0) {
      const precentage =
        vortexAmount > 0 ? (vortexAmount / totalSupplyAmount) * Math.pow(10, DECIMALS) : 0;
      const tokens = vaultData.map(({ composition, symbol, value }) => {
        return {
          composition: Number(composition),
          asset: String(symbol),
          amount: Number(value) * (precentage > 1 ? 1 : precentage),
        };
      });

      return tokens;
    }
    return [];
  }, [vortexBalance, amount, totalSupplyAmount, vaultData]);

  const validateAmount = useCallback(
    (amount: string) => {
      const vortexBalance = vortex?.[0];
      const errorFields: Record<string, string> = {};
      if (!vortexBalance?.balance) {
        errorFields[RedeemErrorFields.AMOUNT] = 'Balance is too low';
      } else if (Number(amount) <= 0) {
        errorFields[RedeemErrorFields.AMOUNT] = 'Amount to redeem required';
      } else {
        const amountBN = scaleBy(Number(amount), DECIMALS);
        if (vortexBalance?.balance.lt(amountBN)) {
          errorFields[RedeemErrorFields.AMOUNT] = 'Balance is too low';
        }
      }
      return errorFields;
    },
    [vortex]
  );

  const handleAmount = useCallback(
    async (amount: string) => {
      const errorFields = validateAmount(amount);
      if (!isEmpty(errorFields)) {
        setError(errorFields);
      }
      setAmount(amount);
    },
    [validateAmount]
  );

  const clearError = (fieldName: RedeemErrorFields) => {
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

  const reset = () => {
    setAmount('');
    setError({});
  };

  const handleGetGasToken = useCallback(
    (tokenInfo: AssetInfo) => {
      handleSetGasToken(tokenInfo);
    },
    [handleSetGasToken]
  );

  return (
    <RedeemContext.Provider
      value={{
        vortex: vortexBalance,
        totalSupply: totalSupplyAmount,
        stage,
        setStage,
        amount,
        handleAmount,
        error,
        clearAllError,
        clearError,
        clearStatus,
        status,
        txError,
        txInfo,
        reset,
        page,
        setPage,
        rewardRedeemHistory,
        rewardRedeemHistoryLoading: loading,
        rewardRedeemHistoryError: rewardRedeemError,
        refetchHistory,
        total,
        redeemAssets,
        assetsPage,
        setAssetsPage,
        handleGetGasToken,
      }}
    >
      {children}
    </RedeemContext.Provider>
  );
};

export const useRedeem = () => {
  const context = useContext(RedeemContext);
  if (!context) {
    throw new Error('must be used in RedeemProvider');
  }
  return context;
};

export default RedeemProvider;
