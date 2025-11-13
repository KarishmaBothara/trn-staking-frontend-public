// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import type { StorageKey } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import { SessionInfo, SortedTargets, Validator } from 'common/types';

import { createNamedHook } from './createNamedHook';
import { useCacheValue } from './useCacheValue';
import { useMapKeys } from './useMapKeys';
import useTaggedValidators from './useTaggedValidators';
import { useTrnApi } from '@futureverse/transact-react';

const EMPTY_PARAMS: unknown[] = [];
const EMPTY_PARTIAL: Partial<SortedTargets> = {};
const DEFAULT_FLAGS_ELECTED = { withController: true, withExposure: true, withPrefs: true };
const DEFAULT_FLAGS_WAITING = { withController: true, withPrefs: true };

const OPT_VALIDATORS = {
  transform: (keys: StorageKey<[AccountId32]>[]): AccountId32[] => keys.map(({ args: [id] }) => id),
};

function mapValidators(validators?: AccountId32[]): Validator[] | undefined {
  return (
    validators &&
    validators.map((a) => {
      const stashId = a.toString();

      return {
        isElected: false,
        // isFavorite: false,
        // isOwned: false,
        key: `${stashId}::-1`,
        stashId,
        stashIndex: -1,
      };
    })
  );
}

function useValidatorsAllImpl(sessionInfo: SessionInfo): Validator[] | undefined {
  const { trnApi } = useTrnApi();
  const validators = useMapKeys(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    trnApi && trnApi.query.staking.validators,
    EMPTY_PARAMS,
    OPT_VALIDATORS
  );

  const validatorsIndexed = useMemo(() => mapValidators(validators), [validators]);
  const tagged = useTaggedValidators(sessionInfo, validatorsIndexed);

  return useCacheValue('useValidatorsAll', tagged);
}

export default createNamedHook('useValidatorsAll', useValidatorsAllImpl);
