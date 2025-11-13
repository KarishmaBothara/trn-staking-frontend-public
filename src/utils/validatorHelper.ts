import { BN, BN_ZERO } from '@polkadot/util';
import { NominatorValue, StakingState, UseExposureExposure } from 'common/types';

export function expandInfo(exposure: UseExposureExposure): StakingState {
  let nominators: NominatorValue[] | undefined;
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposure && exposure.total) {
    nominators = exposure.others.map(({ value, who }) => ({
      nominatorId: who.toString(),
      value: value,
    }));
    stakeTotal = (exposure.total as BN) || BN_ZERO;
    stakeOwn = exposure.own as BN;
    stakeOther = stakeTotal?.sub(stakeOwn);
  }

  return {
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal,
  };
}
