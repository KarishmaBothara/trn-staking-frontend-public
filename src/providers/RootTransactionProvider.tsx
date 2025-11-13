import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import Link from 'next/link';
import { Stack } from '@mui/material';
import { Typography, ReverseColorModeProvider } from '@futureverse/component-library';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BN, BN_ZERO } from '@polkadot/util';
import { DECIMALS, TransactionStatus } from 'common/types';
import LoadingModal from 'components/GeneralModals/LoadingModal';
import { AssetInfo } from 'hooks/useAssets';
import useBalance from 'hooks/useBalance';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';
import appConfig from 'utils/appConfig';
import { IExtrinsicInfo, generateExtrinsicPayload, getExtrinsicId } from 'utils/chainHelper';
import { InvariantContext } from 'utils/context';
import { scaleBy, unscaleBy } from 'utils/polkadotBN';
import MessageProvider, { MessageKey, MessageType, useMessage } from './MessageProvider';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import { TransactionBuilder, CustomExtrinsicBuilder } from '@futureverse/transact';
import { useTrnApi } from '@futureverse/transact-react';
import { SubmittableResult } from '@polkadot/api';
import { ISubmittableResult } from '@polkadot/types/types';

export const DEFAULT_GAS_TOKEN: AssetInfo = {
  assetId: '2',
  symbol: 'XRP',
  name: 'XRP',
  decimals: '6',
};
enum Precision {
  FOUR = 10000,
  SIX = 1000000,
}
interface CalcResult {
  isGasSufficient: boolean;
  gasFeeActual: BN;
}

const SLIPPAGE = 5;

export interface IEncodedMessage {
  rawMessage?: Record<string, unknown>;
  encodedMessage?: string;
}

export interface TransactionContextType {
  confirmToBond: (amount: number) => Promise<void>;
  handleBond: (amount: number) => Promise<void>;
  confirmToBondMore: (amount: number) => Promise<void>;
  handleBondMore: (amount: number) => Promise<void>;
  confirmToUnbond: (amount: number) => Promise<void>;
  handleUnbond: (amount: number) => Promise<void>;
  confirmToNominate: (targets: string[]) => Promise<void>;
  handleNominate: (targets: string[]) => Promise<void>;
  confirmToBondAndNominate: (
    amount: number,
    targets: string[],
    isBondMore: boolean
  ) => Promise<void>;
  handleBondAndNominate: () => Promise<void>;
  confirmRebond: (amount: BN) => Promise<void>;
  handleRebond: (amount: BN) => Promise<void>;
  confirmWithdrawUnbonded: (slashingSpans: BN) => Promise<void>;
  handleWithdrawUnbonded: (slashingSpans: BN) => Promise<void>;
  confirmToChill: () => Promise<void>;
  handleChill: () => Promise<void>;
  confirmRedeem: (amount: BN) => Promise<void>;
  handleRedeem: (amount: BN) => Promise<void>;
  status: TransactionStatus;
  setStatus: (status: TransactionStatus) => void;
  gasToken: AssetInfo;
  isGasSufficient: boolean;
  gasConversionStatus: string | null;
  gasFee: BN | null;
  handleSetGasToken: (tokenInfo: AssetInfo) => void;
  error?: string | null;
  setError: (error: string | null) => void;
  txInfo?: IExtrinsicInfo;
  encodedMessage: IEncodedMessage | undefined;
  convertGasFeeToString: string;
}
const Context = createContext<TransactionContextType>(InvariantContext('RootTransactionProvider'));

export function useRootTransaction() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useMakeOffer must be used in RootTransactionProvider');
  }
  return context;
}

export const ERC20_PRECOMPILE_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function balanceOf(address who) public view returns (uint256)',
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
  'function decimals() public view returns (uint8)',
  'function transfer(address who, uint256 amount)',
];

const resultToTxInfo = (result: SubmittableResult) => {
  return {
    blockHeight: result.blockNumber?.toString(),
    txIndex: result.txIndex,
    blockHash: result.status.isFinalized
      ? result.status.asFinalized.toHex()
      : result.status.asInBlock.toHex(),
  };
};

const RootTransactionInnerProvider: FC<
  PropsWithChildren<{
    status: TransactionStatus;
    setStatus: Dispatch<SetStateAction<TransactionStatus>>;
  }>
> = ({ status, setStatus, children }) => {
  const { trnApi } = useTrnApi();
  const { userSession } = useAuth();
  const signer = useFutureverseSigner();

  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const { whiteList = '' } = appConfig();
  const gasTokenBalances = useBalance(futurePassAddress, whiteList.split(','));

  const { addMessage } = useMessage();

  const [bondBuilder, setBondBuilder] = useState<CustomExtrinsicBuilder | null>(null);
  const [bondMoreBuilder, setBondMoreBuilder] = useState<CustomExtrinsicBuilder | null>(null);
  const [unbondBuilder, setUnbondBuilder] = useState<CustomExtrinsicBuilder | null>(null);
  const [nominateBuilder, setNominateBuilder] = useState<CustomExtrinsicBuilder | null>(null);
  const [bondAndNominateBuilder, setBondAndNominateBuilder] =
    useState<CustomExtrinsicBuilder | null>(null);
  const [rebondBuilder, setRebondBuilder] = useState<CustomExtrinsicBuilder | null>(null);
  const [withdrawUnbondedBuilder, setWithdrawUnbondedBuilder] =
    useState<CustomExtrinsicBuilder | null>(null);
  const [chillBuilder, setChillBuilder] = useState<CustomExtrinsicBuilder | null>(null);
  const [redeemBuilder, setRedeemBuilder] = useState<CustomExtrinsicBuilder | null>(null);

  // Default gas token is 2
  const [gasToken, setGasToken] = useState<AssetInfo>(DEFAULT_GAS_TOKEN);
  const [isGasSufficient, setIsGasSufficient] = useState<boolean>(true);

  const [gasFee, setGasFee] = useState<BN | null>(null);
  const [gasConversionStatus, setGasConversionStatus] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [txInfo, setTxInfo] = useState<IExtrinsicInfo>();

  const [currentExtrinsic, setCurrentExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(
    null
  );
  const [encodedMessage, setEncodedMessage] = useState<IEncodedMessage | undefined>();

  const clearStatus = (restart = false) => {
    setStatus(restart ? TransactionStatus.START : TransactionStatus.NONE);
  };

  /**
   * @description Converts gas fee represented as a BigInt from a larger unit to a smaller unit and adjusts the precision or scale of the result.
   * @returns {string} A formatted string representing the converted gas fee with the symbol.
   */
  const convertGasFeeToString = useMemo(() => {
    const targetPrecision = new BN(Precision.SIX);
    const divisionFactor = new BN(10 ** Number(gasToken.decimals));
    // Calculate the converted result
    if (gasFee) {
      const dividen = gasFee.mul(targetPrecision).div(divisionFactor);
      const convertedResult = dividen.toNumber() / targetPrecision.toNumber();
      return `${convertedResult} ${gasToken.symbol}`;
    }

    return 'Failed to convert';
  }, [gasFee, gasToken.decimals, gasToken.symbol]);

  const handleSetGasToken = useCallback((tokenInfo: AssetInfo) => {
    setGasToken(tokenInfo);
  }, []);

  const validatePreTransaction = useCallback(() => {
    setTxInfo(undefined);
    return trnApi && futurePassAddress;
  }, [trnApi, futurePassAddress]);

  const calculateGasFee = useCallback(
    async (
      builder: CustomExtrinsicBuilder,
      gasToken: AssetInfo
    ): Promise<CalcResult | undefined> => {
      setGasConversionStatus('loading');
      if (validatePreTransaction() && trnApi) {
        const extrinsic = await builder.getExtrinsicToSend();
        if (!extrinsic) {
          return undefined;
        }

        const { gasFee } = await builder.getGasFees();

        // check balance
        const balance = gasTokenBalances.find(
          (balance) => balance.assetId === gasToken.assetId
        )?.balance;

        setGasConversionStatus('success');

        return {
          isGasSufficient: balance?.gt(new BN(gasFee)) ?? false,
          gasFeeActual: new BN(gasFee) ?? BN_ZERO,
        };
      } else {
        setGasConversionStatus('failed');
      }
    },
    [trnApi, gasTokenBalances, validatePreTransaction]
  );

  const getExplorerLink = useCallback((txInfo?: IExtrinsicInfo) => {
    if (txInfo?.txIndex) {
      const extrinsicId = txInfo && getExtrinsicId(txInfo);
      return `${appConfig().chain.explorer}/extrinsic/${extrinsicId}`;
    }

    if (txInfo?.blockHeight) {
      return `${appConfig().chain.explorer}/block/${txInfo?.blockHeight}`;
    }

    return null;
  }, []);

  const buildExtrinsic = useCallback(
    async (extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>) => {
      if (!trnApi || !signer || !userSession || !futurePassAddress) {
        return null;
      }

      const builder = TransactionBuilder.custom(trnApi, signer, userSession.eoa);

      setCurrentExtrinsic(null);
      setGasFee(null);

      builder.fromExtrinsic(extrinsic);

      if (gasToken.assetId != DEFAULT_GAS_TOKEN.assetId) {
        await builder.addFuturePassAndFeeProxy({
          futurePass: futurePassAddress,
          assetId: parseInt(gasToken.assetId),
          slippage: SLIPPAGE,
        });
      } else {
        await builder.addFuturePass(futurePassAddress);
      }

      const calcResult = await calculateGasFee(builder, gasToken);

      const [_, encodedMessage, rawMessage] = await generateExtrinsicPayload(
        trnApi,
        futurePassAddress,
        extrinsic.method
      );

      setEncodedMessage({ encodedMessage, rawMessage });

      if (!calcResult) {
        throw new Error('Failed to calculate gas fee');
      }

      const { gasFeeActual } = calcResult;

      setIsGasSufficient(calcResult.isGasSufficient);
      setGasFee(gasFeeActual);
      setCurrentExtrinsic(extrinsic);

      return builder;
    },
    [
      trnApi,
      signer,
      userSession,
      gasToken,
      futurePassAddress,
      calculateGasFee,
      setGasFee,
      setIsGasSufficient,
      setCurrentExtrinsic,
    ]
  );

  const sendExtrinsic = useCallback(
    async (builder: CustomExtrinsicBuilder, successMessage: string, failureMessage: string) => {
      setStatus(TransactionStatus.PENDING);
      try {
        const { result } = await builder.signAndSend();

        const txInfo = resultToTxInfo(result);

        setTxInfo(txInfo);

        setStatus(TransactionStatus.SUCCESS);

        addMessage({
          key: MessageKey.Bond,
          type: MessageType.Success,
          message: <MessageBody message={successMessage} explorerLink={getExplorerLink(txInfo)} />,
        });
      } catch (error: any) {
        error?.message && setError(error?.message);
        const { extrinsicInfo } = error;
        extrinsicInfo && setTxInfo(extrinsicInfo);
        setStatus(TransactionStatus.FAILED);

        addMessage({
          key: MessageKey.Bond,
          type: MessageType.Error,
          message: (
            <MessageBody
              message={error?.message || failureMessage}
              explorerLink={getExplorerLink(extrinsicInfo)}
            />
          ),
        });
      }

      setCurrentExtrinsic(null);
    },
    [getExplorerLink, setStatus, setTxInfo, addMessage]
  );

  const confirmToBond = useCallback(
    async (amount: number) => {
      if (validatePreTransaction() && amount > 0 && futurePassAddress && trnApi) {
        const amountBn = scaleBy(amount, DECIMALS);
        try {
          const specVersion = trnApi.runtimeVersion.specVersion.toNumber();
          const extrinsic =
            (specVersion as number) < 55
              ? trnApi.tx.staking.bond(futurePassAddress, amountBn.toString(), 'Stash')
              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                trnApi.tx.staking.bond(amountBn.toString(), 'Stash');

          setBondBuilder(await buildExtrinsic(extrinsic));
        } catch (error: any) {
          error?.message && setError(error?.message);
        }
      }
    },
    [trnApi, buildExtrinsic, validatePreTransaction, futurePassAddress]
  );

  /**
   * Stash / Bond
   */
  const handleBond = useCallback(
    async (amount: number) => {
      if (
        validatePreTransaction() &&
        amount > 0 &&
        bondBuilder &&
        futurePassAddress &&
        currentExtrinsic
      ) {
        await sendExtrinsic(
          bondBuilder,
          `You have staked ${amount} ROOT`,
          `${amount} ROOT staking failed`
        );
        setBondBuilder(null);
      }
    },
    [bondBuilder, sendExtrinsic, validatePreTransaction, futurePassAddress, currentExtrinsic]
  );

  const confirmToBondMore = useCallback(
    async (amount: number) => {
      if (validatePreTransaction() && amount > 0 && futurePassAddress && trnApi) {
        const amountBn = scaleBy(amount, DECIMALS);

        try {
          const extrinsic = trnApi.tx.staking.bondExtra(amountBn.toString());

          setBondMoreBuilder(await buildExtrinsic(extrinsic));
        } catch (error: any) {
          error?.message && setError(error?.message);
        }
      }
    },
    [trnApi, buildExtrinsic, validatePreTransaction, futurePassAddress]
  );

  /**
   * Stash / Bond
   */
  const handleBondMore = useCallback(
    async (amount: number) => {
      if (
        validatePreTransaction() &&
        amount > 0 &&
        bondMoreBuilder &&
        futurePassAddress &&
        currentExtrinsic
      ) {
        await sendExtrinsic(
          bondMoreBuilder,
          `You have staked ${amount} ROOT`,
          `${amount} ROOT staking failed`
        );
        setBondMoreBuilder(null);
      }
    },
    [sendExtrinsic, bondMoreBuilder, currentExtrinsic, futurePassAddress, validatePreTransaction]
  );

  const confirmToUnbond = useCallback(
    async (amount: number) => {
      if (validatePreTransaction() && amount > 0 && futurePassAddress && trnApi) {
        const amountBn = scaleBy(amount, DECIMALS);
        try {
          const extrinsic = trnApi.tx.staking.unbond(amountBn.toString());

          setUnbondBuilder(await buildExtrinsic(extrinsic));
        } catch (error: any) {
          error?.message && setError(error?.message);
        }
      }
    },
    [validatePreTransaction, buildExtrinsic, futurePassAddress, trnApi]
  );

  /**
   * Unstash / Unbond
   */
  const handleUnbond = useCallback(
    async (amount: number) => {
      if (
        validatePreTransaction() &&
        amount > 0 &&
        unbondBuilder &&
        futurePassAddress &&
        currentExtrinsic
      ) {
        await sendExtrinsic(
          unbondBuilder,
          `You have unstaked ${amount} ROOT`,
          `${amount} ROOT unstaking failed`
        );
        setUnbondBuilder(null);
      }
    },
    [unbondBuilder, sendExtrinsic, currentExtrinsic, futurePassAddress, validatePreTransaction]
  );

  const confirmToNominate = useCallback(
    async (targets: string[]) => {
      if (validatePreTransaction() && targets.length > 0 && futurePassAddress && trnApi) {
        try {
          const extrinsic = trnApi.tx.staking.nominate(targets);

          setNominateBuilder(await buildExtrinsic(extrinsic));
        } catch (error: any) {
          error?.message && setError(error?.message);
        }
      }
    },
    [trnApi, buildExtrinsic, validatePreTransaction, futurePassAddress]
  );

  /**
   * Nominate
   */
  const handleNominate = useCallback(
    async (targets: string[]) => {
      if (
        validatePreTransaction() &&
        targets.length > 0 &&
        futurePassAddress &&
        currentExtrinsic &&
        nominateBuilder
      ) {
        await sendExtrinsic(
          nominateBuilder,
          'Your chosen nominators have been updated',
          'Your chosen nominators have failed to update'
        );
        setNominateBuilder(null);
      }
    },
    [sendExtrinsic, nominateBuilder, currentExtrinsic, futurePassAddress, validatePreTransaction]
  );

  const confirmToBondAndNominate = useCallback(
    async (amount: number, targets: string[], isBondExtra: boolean) => {
      if (validatePreTransaction() && targets.length > 0 && futurePassAddress && trnApi) {
        const amountBn = scaleBy(amount, DECIMALS);
        try {
          const txs = [];
          if (amount > 0) {
            if (isBondExtra) {
              txs.push(trnApi.tx.staking.bondExtra(amountBn.toString()));
            } else {
              const specVersion = trnApi.runtimeVersion.specVersion.toNumber();
              const extrinsic =
                (specVersion as number) < 55
                  ? trnApi.tx.staking.bond(futurePassAddress, amountBn.toString(), 'Stash')
                  : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    trnApi.tx.staking.bond(amountBn.toString(), 'Stash');
              txs.push(extrinsic);
            }
          }

          txs.push(trnApi.tx.staking.nominate(targets));
          const extrinsic = trnApi.tx.utility.batch(txs);

          setBondAndNominateBuilder(await buildExtrinsic(extrinsic));
        } catch (error: any) {
          setError(error?.message || error?.error?.message);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trnApi, validatePreTransaction, futurePassAddress, calculateGasFee, gasToken]
  );

  const handleBondAndNominate = useCallback(async () => {
    if (
      validatePreTransaction() &&
      futurePassAddress &&
      currentExtrinsic &&
      bondAndNominateBuilder
    ) {
      await sendExtrinsic(
        bondAndNominateBuilder,
        'Your chosen nominators have been updated',
        'Your chosen nominators have failed to update'
      );
      setBondAndNominateBuilder(null);
    }
  }, [
    sendExtrinsic,
    bondAndNominateBuilder,
    currentExtrinsic,
    futurePassAddress,
    validatePreTransaction,
  ]);

  const confirmRebond = useCallback(
    async (amount: BN) => {
      if (validatePreTransaction() && amount.gt(BN_ZERO) && futurePassAddress && trnApi) {
        try {
          const extrinsic = trnApi.tx.staking.rebond(amount);

          setRebondBuilder(await buildExtrinsic(extrinsic));
        } catch (error: any) {
          error?.message && setError(error?.message);
        }
      }
    },
    [trnApi, buildExtrinsic, futurePassAddress, validatePreTransaction]
  );

  const handleRebond = useCallback(
    async (amount: BN) => {
      if (validatePreTransaction() && rebondBuilder && amount.gt(BN_ZERO) && futurePassAddress) {
        await sendExtrinsic(
          rebondBuilder,
          `You have rebond ${unscaleBy(amount ?? 0, DECIMALS)} ROOT`,
          `${unscaleBy(amount ?? 0, DECIMALS)} ROOT rebond failed`
        );
        setRebondBuilder(null);
      }
    },
    [sendExtrinsic, rebondBuilder, futurePassAddress, validatePreTransaction]
  );

  const confirmWithdrawUnbonded = useCallback(
    async (slashingSpans: BN) => {
      if (validatePreTransaction() && slashingSpans.gte(BN_ZERO) && futurePassAddress && trnApi) {
        try {
          const extrinsic = trnApi.tx.staking.withdrawUnbonded(slashingSpans);
          setWithdrawUnbondedBuilder(await buildExtrinsic(extrinsic));
        } catch (error: any) {
          error?.message && setError(error?.message);
        }
      }
    },
    [trnApi, setWithdrawUnbondedBuilder, buildExtrinsic, futurePassAddress, validatePreTransaction]
  );

  const handleWithdrawUnbonded = useCallback(
    async (slashingSpans: BN) => {
      if (
        validatePreTransaction() &&
        withdrawUnbondedBuilder &&
        slashingSpans.gte(BN_ZERO) &&
        futurePassAddress
      ) {
        await sendExtrinsic(
          withdrawUnbondedBuilder,
          `You have withdrawn all unstaked ROOT`,
          `You failed to withdraw all unstaked ROOT`
        );
        setWithdrawUnbondedBuilder(null);
      }
    },
    [sendExtrinsic, withdrawUnbondedBuilder, futurePassAddress, validatePreTransaction]
  );

  const confirmToChill = useCallback(async () => {
    if (validatePreTransaction() && futurePassAddress && trnApi) {
      try {
        const extrinsic = trnApi.tx.staking.chill();
        setChillBuilder(await buildExtrinsic(extrinsic));
      } catch (error: any) {
        error?.message && setError(error?.message);
      }
    }
  }, [trnApi, buildExtrinsic, validatePreTransaction, futurePassAddress]);

  /**
   * Chill
   */
  const handleChill = useCallback(async () => {
    if (validatePreTransaction() && futurePassAddress && chillBuilder) {
      await sendExtrinsic(
        chillBuilder,
        'You have chilled your nomination',
        'Failed to chill your nomination'
      );
      setChillBuilder(null);
    }
  }, [sendExtrinsic, chillBuilder, futurePassAddress, validatePreTransaction]);

  const confirmRedeem = useCallback(
    async (amount: BN) => {
      if (validatePreTransaction() && amount.gt(BN_ZERO) && futurePassAddress && trnApi) {
        try {
          const extrinsic = trnApi.tx.vortexDistribution.redeemTokensFromVault(amount);

          setRedeemBuilder(await buildExtrinsic(extrinsic));
        } catch (error: any) {
          error?.message && setError(error?.message);
        }
      }
    },
    [trnApi, buildExtrinsic, validatePreTransaction, futurePassAddress]
  );

  const handleRedeem = useCallback(
    async (amount: BN) => {
      if (validatePreTransaction() && amount.gt(BN_ZERO) && futurePassAddress && redeemBuilder) {
        await sendExtrinsic(
          redeemBuilder,
          `You have redeemed, ${unscaleBy(amount ?? 0, DECIMALS)} Vortex`,
          `${unscaleBy(amount ?? 0, DECIMALS)} Vortex redeem failed`
        );
        setRedeemBuilder(null);
      }
    },
    [sendExtrinsic, redeemBuilder, futurePassAddress, validatePreTransaction]
  );

  return (
    <Context.Provider
      value={{
        confirmToBond,
        handleBond,
        confirmToBondMore,
        handleBondMore,
        confirmToNominate,
        handleNominate,
        confirmToUnbond,
        handleUnbond,
        confirmToBondAndNominate,
        handleBondAndNominate,
        confirmRebond,
        handleRebond,
        confirmWithdrawUnbonded,
        handleWithdrawUnbonded,
        confirmToChill,
        handleChill,
        confirmRedeem,
        handleRedeem,
        status,
        setStatus,
        error,
        setError,
        txInfo,
        handleSetGasToken,
        gasToken,
        isGasSufficient,
        gasFee,
        encodedMessage,
        gasConversionStatus,
        convertGasFeeToString,
      }}
    >
      {children}
      <ReverseColorModeProvider>
        <LoadingModal
          open={status === TransactionStatus.PENDING}
          onClose={clearStatus}
          title="Transaction pending"
        />
      </ReverseColorModeProvider>
    </Context.Provider>
  );
};

const MessageBody = ({
  message,
  explorerLink,
}: {
  message: string;
  explorerLink: string | null;
}) => {
  return (
    <Stack direction={'column'} spacing={2}>
      <Typography variant="caption" color="primary.dark">
        {message}
      </Typography>
      {explorerLink && (
        <Link href={explorerLink} target="_blank" rel="noreferrer">
          <Typography variant="caption" sx={{ color: 'primary.dark', textDecoration: 'underline' }}>
            Link to block explorer tx
          </Typography>
        </Link>
      )}
    </Stack>
  );
};

const RootTransactionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.NONE);

  return (
    <MessageProvider>
      <RootTransactionInnerProvider status={status} setStatus={setStatus}>
        {children}
      </RootTransactionInnerProvider>
    </MessageProvider>
  );
};

export default RootTransactionProvider;
