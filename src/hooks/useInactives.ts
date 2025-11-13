// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import type { ApiPromise } from '@polkadot/api';
import type { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { QueryableStorageMultiArg } from '@polkadot/api/types';
import type { Option } from '@polkadot/types';
import type { EraIndex, Exposure, Nominations, SlashingSpans } from '@polkadot/types/interfaces';
import { BN, BN_ZERO } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';
import { useTrnApi } from '@futureverse/transact-react';

interface Inactives {
  nomsActive?: string[];
  nomsChilled?: string[];
  nomsInactive?: string[];
  nomsOver?: string[];
  nomsWaiting?: string[];
}

function extractState(
  api: ApiPromise,
  stashId: string,
  slashes: Option<SlashingSpans>[],
  nominees: string[],
  { activeEra }: DeriveSessionIndexes,
  submittedIn: EraIndex,
  exposures: Exposure[]
): Inactives {
  const max = api.consts.staking?.maxNominatorRewardedPerValidator;

  // chilled
  // NOTE With the introduction of the SlashReported event,
  // nominators are not auto-chilled on validator slash
  const nomsChilled = !api.events.staking.SlashReported
    ? nominees.filter((_, index) =>
        slashes[index].isNone
          ? false
          : // to be chilled, we have a slash era and it is later than the submission era
            // (if submitted in the same, the nomination will only take effect after the era)
            slashes[index].unwrap().lastNonzeroSlash.gt(submittedIn)
      )
    : [];

  // all nominations that are oversubscribed
  const nomsOver = exposures
    .map(({ others }) =>
      others.sort((a, b) => (b.value?.unwrap() || BN_ZERO).cmp(a.value?.unwrap() || BN_ZERO))
    )
    .map((others, index) =>
      !max || new BN(max.toString()).gtn(others.map(({ who }) => who.toString()).indexOf(stashId))
        ? null
        : nominees[index]
    )
    .filter((nominee): nominee is string => !!nominee && !nomsChilled.includes(nominee));

  // first a blanket find of nominations not in the active set
  let nomsInactive = exposures
    .map((exposure, index) =>
      exposure.others.some(({ who }) => who.eq(stashId)) ? null : nominees[index]
    )
    .filter((nominee): nominee is string => !!nominee);

  // waiting if validator is inactive or we have not submitted long enough ago
  const nomsWaiting = exposures
    .map((exposure, index) =>
      exposure.total?.unwrap().isZero() ||
      (nomsInactive.includes(nominees[index]) &&
        // it could be activeEra + 1 (currentEra for last session)
        submittedIn.gte(activeEra))
        ? nominees[index]
        : null
    )
    .filter((nominee): nominee is string => !!nominee)
    .filter((nominee) => !nomsChilled.includes(nominee) && !nomsOver.includes(nominee));

  // filter based on all inactives
  const nomsActive = nominees.filter(
    (nominee) =>
      !nomsInactive.includes(nominee) &&
      !nomsChilled.includes(nominee) &&
      !nomsOver.includes(nominee)
  );

  // inactive also contains waiting, remove those
  nomsInactive = nomsInactive.filter(
    (nominee) =>
      !nomsWaiting.includes(nominee) &&
      !nomsChilled.includes(nominee) &&
      !nomsOver.includes(nominee)
  );

  return {
    nomsActive,
    nomsChilled,
    nomsInactive,
    nomsOver,
    nomsWaiting,
  };
}

function useInactivesImpl(stashId?: string, nominees?: string[]): Inactives {
  const { trnApi } = useTrnApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Inactives>({});
  const indexes = useCall<DeriveSessionIndexes>(trnApi?.derive.session.indexes);

  useEffect((): (() => void) | undefined => {
    let unsub: (() => void) | undefined;

    if (!trnApi?.isReady) return;

    if (mountedRef.current && nominees && nominees.length && indexes && stashId) {
      trnApi
        .queryMulti(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [[trnApi.query.staking.nominators, stashId] as QueryableStorageMultiArg<'promise'>]
            .concat(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              trnApi.query.staking.erasStakers
                ? nominees.map((id) => [trnApi.query.staking.erasStakers, [indexes.activeEra, id]])
                : nominees.map((id) => [trnApi.query.staking.stakers, id])
            )
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .concat(nominees.map((id) => [trnApi.query.staking.slashingSpans, id])),
          ([optNominations, ...exposuresAndSpans]: [
            Option<Nominations>,
            ...(Exposure | Option<SlashingSpans>)[]
          ]): void => {
            const exposures = exposuresAndSpans.slice(0, nominees.length) as Exposure[];
            const slashes = exposuresAndSpans.slice(nominees.length) as Option<SlashingSpans>[];
            mountedRef.current &&
              setState(
                extractState(
                  trnApi,
                  stashId,
                  slashes,
                  nominees,
                  indexes,
                  optNominations.unwrapOrDefault().submittedIn,
                  exposures
                )
              );
          }
        )
        .then((_unsub): void => {
          unsub = _unsub;
        })
        .catch(console.error);
    }

    return (): void => {
      unsub && unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stashId]);

  return state;
}

export default createNamedHook('useInactives', useInactivesImpl);
