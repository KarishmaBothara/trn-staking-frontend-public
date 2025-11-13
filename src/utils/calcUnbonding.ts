import type { DeriveSessionProgress, DeriveUnlocking } from '@polkadot/api-derive/types';
import { Balance } from '@polkadot/types/interfaces';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';
import { IUnbondingInfo, Unlocking } from 'common/types';

export function calcUnbonding(
  { activeEra }: DeriveSessionProgress,
  unbondingEras: any[]
): IUnbondingInfo {
  const unlocking: Unlocking[] = [];
  const redeemable = new BN(0);

  unbondingEras.map((item: { era: any; value: any }) => {
    const { era, value } = item;
    const eraBN = new BN(era);
    const valueBN = new BN(value);
    if (eraBN.lte(activeEra)) {
      redeemable.iadd(valueBN);
    } else {
      unlocking.push({ remainingEras: eraBN.sub(activeEra), value: valueBN });
    }
  });

  return {
    redeemable,
    unlocking,
  };
}

export function extractTotals(
  stakingInfo?: IUnbondingInfo,
  progress?: DeriveSessionProgress
): [[Unlocking, BN, BN][], BN, boolean] {
  if (!stakingInfo?.unlocking || !progress) {
    return [[], BN_ZERO, false];
  }

  const isStalled = progress.eraProgress.gt(BN_ZERO) && progress.eraProgress.gt(progress.eraLength);
  const mapped = stakingInfo.unlocking
    .filter(({ remainingEras, value }) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
    .map((unlock): [Unlocking, BN, BN] => [
      unlock,
      unlock.remainingEras,
      unlock.remainingEras
        .sub(BN_ONE)
        .imul(progress.eraLength)
        .iadd(progress.eraLength)
        .isub(
          // in the case of a stalled era, this would not be accurate. We apply the mod here
          // otherwise we would enter into negative values (which is "accurate" since we are
          // overdue, but confusing since it implied it needed to be done already).
          //
          // This does mean that in cases of era stalls we would have an jiggling time, i.e.
          // would be down and then when a session completes, would be higher again, just to
          // repeat the cycle again
          //
          // See https://github.com/polkadot-js/apps/issues/9397#issuecomment-1532465939
          isStalled ? progress.eraProgress.mod(progress.eraLength) : progress.eraProgress
        ),
    ]);
  const total = mapped.reduce((total, [{ value }]) => total.iadd(value), new BN(0));

  return [mapped, total, isStalled];
}
