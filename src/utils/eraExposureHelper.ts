import type { DeriveEraExposure } from '@polkadot/api-derive/types';
import { BN, isToBn } from '@polkadot/util';

export function mapExposure(
  stashId: string,
  all: string[],
  eraExposure?: DeriveEraExposure
): Record<string, BN> {
  if (!eraExposure?.validators) {
    return {};
  }
  const nomBalanceMap: Record<string, BN> = {};

  // for every active nominee
  all.forEach((nom) => {
    // cycle through its nominator to find our current stash
    eraExposure.validators[nom]?.others.some((o: any) => {
      // NOTE Some chains have non-standard implementations, without value
      if (o.who.eq(stashId) && isToBn(o.value)) {
        nomBalanceMap[nom] = o.value.toBn();

        return true;
      }

      return false;
    });
  });

  return nomBalanceMap;
}
