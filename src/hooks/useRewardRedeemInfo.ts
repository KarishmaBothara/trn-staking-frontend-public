import { createNamedHook } from './createNamedHook';
import { useState, useMemo, useCallback } from 'react';
import { GET_REDEEM_TOKENS_FROM_VAULT_EXTRINSIC, GET_VORTEX_PAID_OUT } from 'queries';
import { useQuery } from '@apollo/client';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import { AssetBurned, VortexPaidOut } from 'queries';
import { IRewardRedeemHistory, IRewardRedeemHistoryResponse } from 'modules/vortex/type';
import { fetchRewardCycleRanges } from 'queries/fetchRewardCycleRanges';
import { useQuery as useQueryReact } from '@tanstack/react-query';
import useSessionInfo from './useSessionInfo';
import { BN } from '@polkadot/util';

const REWARD_CYCLE_ONE_START_ERA = 259;
const REWARD_CYCLE_SEVEN_START_ERA = 800;
const REWARD_CYCLE_LENGTH_IN_ERAS = 90;

export function useRewardRedeemInfoImpl(futurepass: string | null) {
  const [burnedEvents, setBurnedEvents] = useState<AssetBurned | null>(null);
  const [vortexPayOuts, setVortexPayOuts] = useState<VortexPaidOut | null>(null);
  const [errorRedeem, setErrorRedeem] = useState<boolean>(false); // Need better error handling
  const [errorReward, setErrorReward] = useState<boolean>(false);
  const sessionInfo = useSessionInfo();

  const { loading: loadingRedeemTokens, refetch: refetchReedemTokens } = useQuery(
    GET_REDEEM_TOKENS_FROM_VAULT_EXTRINSIC,
    {
      variables: { futurepass: futurepass?.toLowerCase() },
      fetchPolicy: 'cache-and-network',
      onCompleted(data) {
        pipe(
          AssetBurned.decode(data),
          fold(
            (err) => {
              console.error('Decoding Error: Failed to decode Vortex redeem data. Details: ', err);
              setErrorRedeem(true);
            },
            (decodedBurnData) => {
              setErrorRedeem(false);
              setBurnedEvents(decodedBurnData);
            }
          )
        );
      },
      onError(error) {
        console.error('could not fetch Vortex redeem data: ', error.message);
        setErrorRedeem(true);
      },
      skip: futurepass === null,
    }
  );

  const { loading: loadingVortexPaidOut, refetch: refetchVortexPaidOut } = useQuery(
    GET_VORTEX_PAID_OUT,
    {
      variables: { futurepass: futurepass?.toLowerCase() },
      fetchPolicy: 'cache-and-network',
      onCompleted(data) {
        pipe(
          VortexPaidOut.decode(data),
          fold(
            (err) => {
              console.error('Decoding Error: Failed to decode Vortex payout data. Details: ', err);
              setErrorReward(true);
            },
            (decodedVortexData) => {
              setErrorReward(false);
              setVortexPayOuts(decodedVortexData);
            }
          )
        );
      },
      onError(error) {
        console.error('could not fetch Vortex payout data: ', error.message);
        setErrorReward(true);
      },
      skip: futurepass === null,
    }
  );

  const currentCycle = useMemo(() => {
    if (!sessionInfo.activeEra) return;

    // This accounts for prolonged era count for cycle six (91 eras instead of 90).
    const totalCycleEras = sessionInfo.activeEra
      .sub(new BN(REWARD_CYCLE_SEVEN_START_ERA))
      .toNumber();

    return Math.floor(totalCycleEras / REWARD_CYCLE_LENGTH_IN_ERAS) + 7;
  }, [sessionInfo.activeEra]);

  const rewardCycleEraRanges = useMemo(() => {
    if (!currentCycle) return;

    const eras: Array<number> = [REWARD_CYCLE_ONE_START_ERA];
    for (let i = 0; i < currentCycle; i++) {
      let endOfCycleEra = eras[i === 0 ? 0 : eras.length - 1] + (REWARD_CYCLE_LENGTH_IN_ERAS - 1);
      if (i === 5) {
        // Edge case for cycle six which was 91 eras long
        endOfCycleEra = eras[eras.length - 1] + (REWARD_CYCLE_LENGTH_IN_ERAS + 1);
      }
      const startOfNextCycleEra = endOfCycleEra + 1;
      eras.push(endOfCycleEra, startOfNextCycleEra);
    }

    return eras;
  }, [currentCycle]);

  /*
    Expected values in rewardCycleBlockRanges.
    Reward cycle 9 (18/08/2025).

    [
      { blockNumber: 7035347, eraIndex: 259 },
      { blockNumber: 8951866, eraIndex: 348 },
      { blockNumber: 8973464, eraIndex: 349 },
      { blockNumber: 10893877, eraIndex: 438 },
      { blockNumber: 10915472, eraIndex: 439 },
      { blockNumber: 12801008, eraIndex: 528 },
      { blockNumber: 12822596, eraIndex: 529 },
      { blockNumber: 14740155, eraIndex: 618 },
      { blockNumber: 14761738, eraIndex: 619 },
      { blockNumber: 16680635, eraIndex: 708 },
      { blockNumber: 16702213, eraIndex: 709 },
      { blockNumber: 18661314, eraIndex: 800 },
      { blockNumber: 18682911, eraIndex: 801 },
      { blockNumber: 20538489, eraIndex: 890 },
      { blockNumber: 20559784, eraIndex: 891 },
      { blockNumber: 22460392, eraIndex: 980 },
      { blockNumber: 22481976, eraIndex: 981 }
    ]
  */
  const {
    data: rewardCycleBlockRanges,
    isLoading: rewardCycleBlockRangesLoading,
    error: rewardCycleBlockRangesError,
  } = useQueryReact({
    queryKey: ['activeEras', rewardCycleEraRanges],
    queryFn: () =>
      fetchRewardCycleRanges({ rewardCycleEraRanges, queryLength: rewardCycleEraRanges?.length }),
    enabled: !!rewardCycleEraRanges,
  });

  const queriesError = useMemo(() => {
    return errorRedeem || errorReward || !!rewardCycleBlockRangesError;
  }, [errorRedeem, errorReward, rewardCycleBlockRangesError]);

  const queriesLoading = useMemo(() => {
    return loadingRedeemTokens || loadingVortexPaidOut || rewardCycleBlockRangesLoading;
  }, [loadingRedeemTokens, loadingVortexPaidOut, rewardCycleBlockRangesLoading]);

  const refetchHistory = useCallback(() => {
    refetchVortexPaidOut();
    refetchReedemTokens();
  }, [refetchReedemTokens, refetchVortexPaidOut]);

  const extractData = useCallback(() => {
    if (!burnedEvents) return;
    return burnedEvents.archive.event.flatMap((event) => ({
      vortexAmount: event.args.balance,
      height: event.block.height,
    }));
  }, [burnedEvents]);

  const extractBlockTimestamps = useCallback(
    (key: 'now') => {
      if (!burnedEvents) return;
      return burnedEvents.archive.event.flatMap((event) =>
        event.block.extrinsics
          .flatMap((extrinsic) =>
            extrinsic.calls.map((call) => ({
              blockHeight: event.block.height,
              value: call[key],
            }))
          )
          .filter((entry) => !!entry.value)
      );
    },
    [burnedEvents]
  );

  const rewardRedeemHistory: IRewardRedeemHistoryResponse | undefined = useMemo(() => {
    if (!burnedEvents || !vortexPayOuts || !futurepass || !rewardCycleBlockRanges || !currentCycle)
      return;

    const getCycleId = (height: number): string => {
      for (let i = 0; i < rewardCycleBlockRanges.length - 1; i += 2) {
        const startBlock =
          i === 0
            ? rewardCycleBlockRanges[i].blockNumber
            : rewardCycleBlockRanges[i - 1].blockNumber;
        const endBlock = rewardCycleBlockRanges[i + 1].blockNumber;

        if (startBlock <= height && height <= endBlock) {
          return (i / 2).toString();
        }
      }
      return ' ';
    };

    const blocksTimestamps = extractBlockTimestamps('now');
    const vortexAmounts = extractData();
    if (!blocksTimestamps || !vortexAmounts) return;

    const redeems = blocksTimestamps.map((timestamp, index): IRewardRedeemHistory => {
      const vortexAmount =
        vortexAmounts[index] && vortexAmounts[index].vortexAmount
          ? Number(vortexAmounts[index].vortexAmount)
          : undefined;

      return {
        account: futurepass,
        blockNumber: timestamp.blockHeight,
        type: 'Redeem',
        amount: vortexAmount,
        timestamp: timestamp.value ?? '',
        cycleId: '',
      };
    });

    const rewards = vortexPayOuts.archive.event.map((event): IRewardRedeemHistory => {
      const timestamp = event.block.extrinsics[0].calls[0].now;

      // This is because rewards are processed in the current reward cycle.
      // Reward cycle block ranges has an odd number of elements because the current (incomplete) cycle
      // doesn't have an end block yet. Rewards from the previous cycle are processed at the start of
      // the current cycle, so we need to check against the previous cycle's end block to determine
      // the correct cycle ID for rewards.
      let cycleId: string;
      if (
        event.block.height >= rewardCycleBlockRanges[rewardCycleBlockRanges.length - 2].blockNumber
      ) {
        cycleId = (currentCycle - 1).toString();
      } else {
        cycleId = getCycleId(event.block.height);
      }

      return {
        account: event.args.who,
        blockNumber: event.block.height,
        type: 'Reward',
        amount: Number(event.args.amount),
        timestamp: timestamp ?? '',
        cycleId: cycleId,
      };
    });

    const data = redeems.concat(rewards);

    data.sort(
      (a, b) => new Date(Number(b.timestamp)).getTime() - new Date(Number(a.timestamp)).getTime()
    );

    return { data, totalCount: data.length };
  }, [
    burnedEvents,
    vortexPayOuts,
    extractData,
    extractBlockTimestamps,
    futurepass,
    rewardCycleBlockRanges,
    currentCycle,
  ]);

  return {
    history: rewardRedeemHistory,
    loading: queriesLoading,
    error: queriesError,
    refetchHistory,
  };
}

export default createNamedHook('useRewardRedeemInfo', useRewardRedeemInfoImpl);
