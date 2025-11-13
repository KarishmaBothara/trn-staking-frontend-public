import { Option } from '@polkadot/types';
import { ValidatorInfo } from 'common/types';
import { BN, BN_ZERO, hexToBn } from '@polkadot/util';
import { useTrnApi } from '@futureverse/transact-react';
import { Nominations } from '@polkadot/types/interfaces';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';
import { loadFromLocalStorage, saveToLocalStorage } from 'utils/localStorageHelper';
import {
  ExcludeFilters,
  IFilter,
  IncludeFilters,
  VALIDATORS_PAGE_SIZE,
} from 'modules/shared/components/ValidatorFilterDrawer/types';
import { DeriveStakingQuery, DeriveStakingWaiting } from '@polkadot/api-derive/types';

const VALIDATORS_LOCAL_STORAGE_KEY = 'validators';
const VALIDATORS_SORT_KEY = 'validators-sort-key';

export const DEFAULT_FLAGS_ELECTED = {
  withController: true,
  withExposure: true,
  withPrefs: true,
  withLedger: true,
};

export const DEFAULT_FILTERS = {
  [IncludeFilters.Active]: false,
  [IncludeFilters.MyNominations]: false,
  [ExcludeFilters.Oversubscribed]: false,
};

export enum SortedBy {
  UNORDERED = 'UNORDERED',
  LOWEST_COMMISION = 'LOWEST_COMMISION',
  HIGHEST_COMMISION = 'HIGHEST_COMMISION',
}

export const SortOptions = [
  {
    id: SortedBy.UNORDERED,
    value: 'Unordered',
  },
  {
    id: SortedBy.LOWEST_COMMISION,
    value: 'Lowest Commissions',
  },
  {
    id: SortedBy.HIGHEST_COMMISION,
    value: 'Highest Commissions',
  },
];
interface IStatisticsInfo {
  totalOthersStake: BN;
  totalStake: BN;
  averageCommission: number;
  highestCommission: number;
}

export interface IValidatorsContext {
  page: number;
  total: number;
  filter: IFilter;
  sortedBy: SortedBy;
  oldValidators: string[];
  clearFilter: () => void;
  activeValidators: number;
  validators: ValidatorInfo[];
  clearFilterAndSort: () => void;
  allValidators: ValidatorInfo[];
  setPage: (page: number) => void;
  statisticsInfo?: IStatisticsInfo;
  getValidators: () => Promise<void>;
  setFilter: (filter: IFilter) => void;
  setSortedBy: (sortedBy: SortedBy) => void;
  validatorsWithoutPagination: ValidatorInfo[];
}

const ValidatorsContext = createContext<IValidatorsContext>({} as IValidatorsContext);

export const ValidatorsProvider = ({ children }: { children: ReactNode }) => {
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const [allValidators, setAllValidators] = useState<ValidatorInfo[]>([]);
  const [validators, setValidators] = useState<ValidatorInfo[]>([]);
  const [validatorsWithoutPagination, setValidatorsWithoutPagination] = useState<ValidatorInfo[]>(
    []
  );
  const [sortedBy, setSortedBy] = useState<SortedBy>(SortedBy.UNORDERED);
  const [total, setTotal] = useState(0);
  const [activeValidators, setActiveValidators] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<IFilter>(DEFAULT_FILTERS);
  const [oldValidators, setOldValidators] = useState<string[]>([]);
  const [oldNomination, setOldNomination] = useState<string[]>([]);
  const { trnApi } = useTrnApi();

  const clearFilter = () => {
    setFilter(DEFAULT_FILTERS);
  };

  const clearFilterAndSort = () => {
    clearFilter();
    setSortedBy(SortedBy.UNORDERED);
    setPage(1);
  };

  const statisticsInfo = useMemo(() => {
    if (allValidators.length <= 0) {
      return;
    }
    const totalOthersStake = allValidators.reduce((acc, currentData) => {
      const othersSum = currentData.exposure.others.reduce(
        (innerAcc, other) => innerAcc.add(new BN(other.value)),
        BN_ZERO
      );
      return acc.add(othersSum);
    }, BN_ZERO);
    const totalStake = allValidators.reduce((innerAcc, validator) => {
      return innerAcc.add(
        typeof validator.exposure.total === 'string'
          ? hexToBn(validator.exposure.total)
          : validator.exposure.total
      );
    }, BN_ZERO);
    const highestCommission = allValidators.reduce((highest, currentData) => {
      return Math.max(highest, currentData.commission);
    }, 0);

    const totalCommission = allValidators.reduce((acc, currentData) => {
      return acc + currentData.commission;
    }, 0);

    const averageCommission = totalCommission / allValidators.length;

    return {
      totalOthersStake,
      totalStake,
      highestCommission,
      averageCommission,
    };
  }, [allValidators]);

  const fetchNominators = useCallback(async () => {
    if (trnApi) {
      if (futurePassAddress) {
        const nominationsWithFP: Option<Nominations> = (await trnApi.query.staking.nominators(
          futurePassAddress
        )) as unknown as Option<Nominations>;
        if (nominationsWithFP.isSome) {
          const oldNominations = nominationsWithFP
            .unwrap()
            .targets.toArray()
            .map((acc) => acc.toString());

          setOldNomination(oldNominations);
        }
      }
    }
  }, [trnApi, futurePassAddress]);

  useEffect(() => {
    const filteredOldNomination = oldNomination.filter(
      (oldNominationel) => !allValidators.some((el) => el.stashId === oldNominationel)
    );
    setOldValidators(filteredOldNomination);
  }, [allValidators, oldNomination]);

  const fetchValidators = useCallback(async () => {
    if (trnApi) {
      const maxNominatorRewardedPerValidator = Number(
        trnApi.consts.staking.maxNominatorRewardedPerValidator.toString()
      );
      const electedInfo = await trnApi.derive.staking.electedInfo({ ...DEFAULT_FLAGS_ELECTED });
      const waitingInfo: DeriveStakingWaiting = await trnApi.derive.staking.waitingInfo({
        ...DEFAULT_FLAGS_ELECTED,
      });
      if (electedInfo) {
        const decoded = {
          info: electedInfo.info.map((i) => ({
            accountId: i.accountId.toString(),
            stakingLedger: i.stakingLedger,
            exposure: i.exposure,
            validatorPrefs: i.validatorPrefs,
            stashId: i.stashId.toString(),
          })),
          nextElected: electedInfo.nextElected.map((i) => i.toString()),
          validators: electedInfo.validators.map((i) => i.toString()),
        };
        if (waitingInfo) {
          waitingInfo.info.forEach((i: DeriveStakingQuery) =>
            decoded.info.push({
              accountId: i.accountId.toString(),
              stakingLedger: i.stakingLedger,
              exposure: i.exposure,
              validatorPrefs: i.validatorPrefs,
              stashId: i.stashId.toString(),
            })
          );
          waitingInfo.waiting.forEach((i) => decoded.nextElected.push(i.toString()));
        }
        const validatorInfo = decoded.info.map((info, index) => {
          return {
            key: index + 1,
            stashId: info.stashId,
            exposure: {
              total: info.exposure.total.toBn(),
              own: info.exposure.own.toString(),
              others: info.exposure.others.map((other: any) => ({
                who: other.who.toString(),
                value: other.value,
              })),
            },
            commission: info.validatorPrefs.commission.toNumber(),
            status: decoded.validators.includes(info.stashId) ? 'Active' : 'Waiting',
            blocked: info.validatorPrefs.blocked.isTrue,
            isOverSubscribed: info.exposure.others.length >= maxNominatorRewardedPerValidator,
          } as ValidatorInfo;
        }) as ValidatorInfo[];
        saveToLocalStorage(VALIDATORS_LOCAL_STORAGE_KEY, validatorInfo);
        setAllValidators(validatorInfo);
      }
    }
  }, [trnApi]);

  const getValidators = useCallback(async () => {
    let storedValidators: ValidatorInfo[] | undefined = loadFromLocalStorage(
      VALIDATORS_LOCAL_STORAGE_KEY
    );
    let sortKey: number | undefined = loadFromLocalStorage(VALIDATORS_SORT_KEY);

    if (!storedValidators) {
      await fetchValidators();
      storedValidators = loadFromLocalStorage(VALIDATORS_LOCAL_STORAGE_KEY);
    }

    if (!sortKey) {
      sortKey = Math.random();
      saveToLocalStorage(VALIDATORS_SORT_KEY, sortKey);
    }

    setAllValidators(storedValidators || []);

    const skip = (page - 1) * VALIDATORS_PAGE_SIZE;

    // Apply filter before sort
    const filteredData = storedValidators?.filter((item) => {
      // Check if isNotOverSubscribed filter is selected and if the item doesn't match the condition
      if (filter[ExcludeFilters.Oversubscribed] && item.isOverSubscribed) {
        return false;
      }

      // Check if the ActiveValidators filter is selected and if the itme status matches the condition
      if (filter[IncludeFilters.Active] && item.status === 'Waiting') {
        return false;
      }

      // Check if the MyNominations filter is selected and if the validator is not nominated by the user
      if (filter[IncludeFilters.MyNominations] && !oldNomination.includes(item.stashId)) {
        return false;
      }

      // If none of the filters disqualify the item, then it is included in the result
      return true;
    });

    // Sort before paginate
    if (sortedBy === SortedBy.LOWEST_COMMISION) {
      filteredData?.sort((a, b) => a.commission - b.commission);
    } else if (sortedBy === SortedBy.HIGHEST_COMMISION) {
      filteredData?.sort((a, b) => b.commission - a.commission);
    } else {
      // Randomize the order of the validators
      filteredData?.sort(() => sortKey ?? 0 - 0.5);
    }

    // Push oversubscribed validators to the bottom of the list
    const oversubscribedData = filteredData?.reduce((acc: ValidatorInfo[], curr: ValidatorInfo) => {
      if (curr.isOverSubscribed) {
        acc.push(curr);
      } else {
        acc.unshift(curr);
      }
      return acc;
    }, []);

    const data = oversubscribedData && oversubscribedData.slice(skip, skip + VALIDATORS_PAGE_SIZE);
    const activeValidators = storedValidators?.filter((v) => v.status === 'Active');
    setValidators(data || []);
    setValidatorsWithoutPagination(oversubscribedData || []);
    setTotal(filteredData?.length || 0);
    setActiveValidators(activeValidators?.length || 0);
  }, [page, sortedBy, fetchValidators, filter, oldNomination]);

  useEffect(() => {
    const fetchValidators = async () => {
      await getValidators();
      await fetchNominators();
    };

    fetchValidators().catch(console.error);
  }, [filter, sortedBy, page, getValidators, fetchNominators]);

  return (
    <ValidatorsContext.Provider
      value={{
        page,
        total,
        filter,
        setPage,
        sortedBy,
        setFilter,
        validators,
        clearFilter,
        setSortedBy,
        oldValidators,
        allValidators,
        getValidators,
        statisticsInfo,
        activeValidators,
        clearFilterAndSort,
        validatorsWithoutPagination,
      }}
    >
      {children}
    </ValidatorsContext.Provider>
  );
};

const useValidators = () => {
  const context = useContext(ValidatorsContext);

  if (!context) {
    throw new Error('useValidators must be used within a ValidatorsProvider');
  }

  return context;
};

export default useValidators;
