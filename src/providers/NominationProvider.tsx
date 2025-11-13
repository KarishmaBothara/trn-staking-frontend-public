import { useCall } from 'hooks/useCall';
import { Option } from '@polkadot/types';
import useInactives from 'hooks/useInactives';
import useNominator from 'hooks/useNominator';
import { NominationInfo } from 'common/types';
import { SortedBy } from './ValidatorsProvider';
import useStakingStatus from 'hooks/useStakingStatus';
import useValidatorInfo from 'hooks/useValidatorInfo';
import { mapExposure } from 'utils/eraExposureHelper';
import { useTrnApi } from '@futureverse/transact-react';
import { Nominations } from '@polkadot/types/interfaces';
import { DEFAULT_FLAGS_ELECTED } from './ValidatorsProvider';
import { createContext, useContext, useMemo, useState } from 'react';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';
import type { DeriveEraExposure, DeriveSessionIndexes } from '@polkadot/api-derive/types';
import { VALIDATORS_PAGE_SIZE } from 'modules/shared/components/ValidatorFilterDrawer/types';

interface NominationContextType {
  page: number;
  total: number;
  isActive: boolean;
  sortedBy: SortedBy;
  nominations: NominationInfo[];
  setPage: (page: number) => void;
  filteredNominations: NominationInfo[];
  setSortedBy: (sortedBy: SortedBy) => void;
  setIsActive: (isActive: boolean) => void;
  unfilteredUnpaginatedNominations: NominationInfo[];
}

const NominationContext = createContext<NominationContextType | null>(null);

const NominationProvider = ({ children }: { children: React.ReactNode }) => {
  const [sortedBy, setSortedBy] = useState<SortedBy>(SortedBy.UNORDERED);
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const { trnApi } = useTrnApi();

  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const nominator = useNominator(futurePassAddress || '');
  const stakingStatus = useStakingStatus(futurePassAddress || '');
  const { nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting } = useInactives(
    (nominator && stakingStatus?.stash?.toString()) || '',
    (nominator?.targets as any) || []
  );

  const validatorInfo = useValidatorInfo(nominator?.targets || []);

  const sessionInfo = useCall<DeriveSessionIndexes>(trnApi?.derive.session?.indexes);
  const eraExposure = useCall<DeriveEraExposure>(trnApi?.derive.staking.eraExposure, [
    sessionInfo?.activeEra,
  ]);

  const electedInfo: any = useCall(trnApi && trnApi.derive.staking.electedInfo, [
    DEFAULT_FLAGS_ELECTED,
  ]);

  const nominatorInfo: Option<Nominations> = useCall(trnApi && trnApi.query.staking.nominators, [
    futurePassAddress,
  ]) as unknown as Option<Nominations>;

  const nomBalanceMap = useMemo(() => {
    return mapExposure(stakingStatus?.stash?.toString() || '', nomsActive || [], eraExposure);
  }, [eraExposure, nomsActive, stakingStatus?.stash]);

  const validatorList = useMemo(() => {
    if (electedInfo) {
      return validatorInfo.map((validator) => {
        const info = electedInfo.info.find(
          (info: any) => info.stashId.toString() === validator.validator
        );
        return { ...validator, nominatorsNumber: info?.exposure?.others?.length || 0 };
      });
    }
    return [];
  }, [electedInfo, validatorInfo]);

  const validators = useMemo(() => {
    if (validatorList.length > 0) {
      return validatorList.map((validator) => {
        if (nomsActive?.includes(validator.validator)) {
          const nomBalance = nomBalanceMap[validator.validator];
          return {
            ...validator,
            validatorStatus: 'Active',
            nominationStatus: 'Active and earning',
            nomBalance,
          };
        } else if (nomsInactive?.includes(validator.validator)) {
          return { ...validator, validatorStatus: 'Active', nominationStatus: 'Inactive' };
        } else if (nomsChilled?.includes(validator.validator)) {
          return { ...validator, validatorStatus: 'Active', nominationStatus: 'Chilled' };
        } else if (nomsOver?.includes(validator.validator)) {
          return { ...validator, validatorStatus: 'Active', nominationStatus: 'Oversubscribed' };
        } else if (nomsWaiting?.includes(validator.validator)) {
          return { ...validator, validatorStatus: 'Active', nominationStatus: 'Waiting' };
        }

        return { ...validator, validatorStatus: 'Active', nominationStatus: 'Inactive' };
      });
    }
    return [];
  }, [nomBalanceMap, nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting, validatorList]);

  const allNominators = useMemo(() => {
    let nominators = validators;

    if (isActive) {
      nominators = nominators.filter(
        (nominator) => nominator.nominationStatus === 'Active and earning'
      );
    }

    if (sortedBy !== SortedBy.UNORDERED) {
      nominators = nominators.sort((a, b) => {
        const commissionA = Number(a.commission.split('%')[0]);
        const commissionB = Number(b.commission.split('%')[0]);

        return sortedBy === SortedBy.HIGHEST_COMMISION
          ? commissionB - commissionA
          : commissionA - commissionB;
      });
    }

    if (nominatorInfo?.isSome) {
      nominatorInfo
        .unwrap()
        .targets.toArray()
        .map((acc) => {
          const oldValidator = acc.toString();
          if (!validators.find((v) => v.validator === oldValidator)) {
            // This is a validator that is no longer in the elected
            // set and still nominated by the user.
            // If nomination isn't in the set of all Validators then it is offline.
            nominators.push({
              commission: '0',
              validator: oldValidator,
              validatorStatus: 'Offline',
              nominationStatus: 'Inactive',
              nominatorsNumber: 0,
              blocked: false,
            });
          }
        });
    }

    return nominators;
  }, [isActive, nominatorInfo, sortedBy, validators]);

  const nominations = useMemo(() => {
    let nominators = allNominators;
    const skip = (page - 1) * VALIDATORS_PAGE_SIZE;
    nominators = allNominators.slice(skip, skip + VALIDATORS_PAGE_SIZE);

    return nominators;
  }, [page, allNominators]);

  return (
    <NominationContext.Provider
      value={{
        page,
        setPage,
        isActive,
        sortedBy,
        setIsActive,
        setSortedBy,
        total: validators.length,
        nominations: nominations as NominationInfo[],
        filteredNominations: allNominators as NominationInfo[],
        unfilteredUnpaginatedNominations: validators as NominationInfo[],
      }}
    >
      {children}
    </NominationContext.Provider>
  );
};

const useNomination = () => {
  const context = useContext(NominationContext);
  if (context === null) {
    throw new Error('useNomination must be used within a NominationProvider');
  }
  return context;
};

export { NominationProvider, useNomination };
