import { useMemo } from 'react';

import { objectSpread } from '@polkadot/util';
import { SessionInfo, Validator } from 'common/types';

import { createNamedHook } from './createNamedHook';
import useElectedValidators from './useElectedValidators';

// function sort(a: Validator, b: Validator): number {
//   return a.isFavorite === b.isFavorite
//     ? a.isOwned === b.isOwned
//       ? a.isElected === b.isElected
//         ? 0
//         : a.isElected
//         ? -1
//         : 1
//       : a.isOwned
//       ? -1
//       : 1
//     : a.isFavorite
//     ? -1
//     : 1;
// }

function sort(a: Validator, b: Validator): number {
  return a.isElected === b.isElected ? 0 : a.isElected ? -1 : 1;
}

function withElected(validators: Validator[], elected: string[]): Validator[] {
  return validators.map((v): Validator => {
    const isElected = elected.includes(v.stashId);

    return v.isElected !== isElected ? objectSpread({}, v, { isElected }) : v;
  });
}

function withSort(
  // allAccounts: string[],
  // favorites: string[],
  validators: Validator[]
): Validator[] {
  return (
    validators
      // .map((v): Validator => {
      //   const isFavorite = favorites.includes(v.stashId);
      //   const isOwned = allAccounts.includes(v.stashId);

      //   return v.isFavorite !== isFavorite || v.isOwned !== isOwned
      //     ? objectSpread({}, v, { isFavorite, isOwned })
      //     : v;
      // })
      .sort(sort)
  );
}

function useTaggedValidatorsImpl(
  sessionInfo: SessionInfo,
  validators?: Validator[]
): Validator[] | undefined {
  const elected = useElectedValidators(sessionInfo);

  const flagged = useMemo(
    () => elected && validators && withElected(validators, elected),
    [elected, validators]
  );

  return useMemo(() => flagged && withSort(flagged), [flagged]);
}

export default createNamedHook('useTaggedValidators', useTaggedValidatorsImpl);
