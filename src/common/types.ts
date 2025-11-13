import { Balance, TAssetBalance } from '@polkadot/types/interfaces/types';
import { deriveAddressPair } from '@therootnetwork/extrinsic';
import { getAddress, isAddress } from 'viem';
import { BN } from '@polkadot/util';
import { hush } from './utils';
import * as t from 'io-ts';

export const IntercomUserHashResponse = t.type({
  userHash: t.union([t.string, t.null]), // optional
  error: t.union([t.string, t.null]), // optional
});

export type IntercomUserHashResponse = t.TypeOf<typeof IntercomUserHashResponse>;

export enum TxStatus {
  Pending = 'Pending',
  Success = 'Success',
  Error = 'Error',
}

export enum TransactionStatus {
  NONE,
  START,
  PENDING,
  SUCCESS,
  FAILED,
}

export const ROOT_ASSET_ID = '1';

export const XRP_ASSET_ID = '2';

export const VORTEX_ASSET_ID = '3';

export const DECIMALS = 6;

export const ROOT_SYMBOL = 'ROOT';

export const SECS_PER_BLOCK = 4;

export interface BalanceResult {
  assetId: string;
  accountId: string;
  balance: TAssetBalance | Balance;
}

export type CallParam = any;

export type CallParams = [] | CallParam[];

export interface CallOptions<T> {
  defaultValue?: T;
  paramMap?: (params: any) => CallParams;
  transform?: (value: any) => T;
  withParams?: boolean;
  withParamsTransform?: boolean;
}

export interface SessionInfo {
  activeEra?: BN | null;
  currentEra?: BN | null;
  currentSession?: BN | null;
}

export interface Validator {
  isElected: boolean;
  // isFavorite: boolean;
  // isOwned: boolean;
  // isPara?: boolean;
  key: string;
  stashId: string;
  stashIndex: number;
}

export interface PoolMemberInfo {
  claimable: BN;
  member: any;
}

export interface Unlocking {
  remainingEras: BN;
  value: BN;
}

export interface IUnbondingInfo {
  redeemable: BN;
  unlocking: Unlocking[];
}

export const A_DAY = new BN(24 * 60 * 60 * 1000);

export interface SortedTargets {
  avgStaked?: BN;
  counterForNominators?: BN;
  counterForValidators?: BN;
  electedIds?: string[];
  historyDepth?: BN;
  lastEra?: BN;
  lowStaked?: BN;
  medianComm: number;
  maxNominatorsCount?: BN;
  maxValidatorsCount?: BN;
  minNominated: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  nominators?: string[];
  nominateIds?: string[];
  totalStaked?: BN;
  totalIssuance?: BN;
  validators?: Validator[];
  validatorIds?: string[];
  waitingIds?: string[];
}

export interface NominatorValue {
  nominatorId: string;
  value: BN;
}

export interface StakingState {
  nominators?: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

export interface UseExposureExposureEntry {
  who: string;
  value: BN;
}

export interface UseExposureExposure {
  others: UseExposureExposureEntry[];
  own: BN | string;
  total: BN | string;
}

export interface UseExposure {
  clipped?: UseExposureExposure;
  exposure?: UseExposureExposure;
  waiting?: {
    others: UseExposureExposureEntry[];
    total: BN;
  };
}

export interface ValidatorInfo {
  key: number;
  stashId: string;
  commission: number;
  blocked: boolean;
  exposure: UseExposureExposure;
  status: 'Active' | 'Waiting';
  isOverSubscribed: boolean;
}

export interface SortKeyInfo {
  data: number;
  expirationTime: number;
}

export interface NominationInfo {
  commission: string;
  validator: string;
  validatorStatus: 'Active' | 'Inactive' | 'Waiting' | 'Offline';
  nominationStatus: 'Active and earning' | 'Inactive' | 'Chilled' | 'Oversubscribed' | 'Waiting';
  nomBalance?: BN;
  nominatorsNumber: number;
}

/*
 * The codecs below have been copied from the
 * futureverse identity monorepo
 * https://github.com/futureversecom/fv-identity-monorepo/. blob/main/apps/futureverse-identity-dashboard/common/**types/authMethod.ts
 */
const Address = new t.Type<`0x${string}`, `0x${string}`, unknown>(
  'Address',
  (s: unknown): s is `0x${string}` => typeof s === 'string' && isAddress(s),
  (i, c) => {
    if (typeof i === 'string' && isAddress(i)) {
      try {
        const ethereumAddress: string = getAddress(i);
        return t.success(ethereumAddress as `0x${string}`);
      } catch {
        return t.failure(i, c, 'Expected a valid Ethereum-style address');
      }
    }
    return t.failure(i, c, 'Expected a valid Ethereum-style address');
  },
  (x) => x
);
type Address = t.TypeOf<typeof Address>;

export type UserAuthenticationMethod =
  | {
      method: 'fv:email';
      email: string;
    }
  | {
      method: `fv:dynamic-custodial-idp`;
      idp: string;
      sub: string;
      name: string | undefined;
      email: string | undefined;
      darkIcon: string | undefined;
      lightIcon: string | undefined;
    }
  | {
      method: 'wagmi';
      eoa: `0x${string}`;
    }
  | {
      method: 'xaman';
      rAddress: string;
    };

export const AuthMethodImpl = t.union([
  t.type({
    method: t.literal('fv:email'),
    email: t.string,
  }),
  t.type({
    method: t.literal('fv:dynamic-custodial-idp'),
    idp: t.string,
    sub: t.string,
    name: t.union([t.string, t.undefined]),
    email: t.union([t.string, t.undefined]),
    darkIcon: t.union([t.string, t.undefined]),
    lightIcon: t.union([t.string, t.undefined]),
  }),
  t.type({
    method: t.literal('wagmi'),
    eoa: Address,
  }),
  t.type({
    method: t.literal('xaman'),
    rAddress: t.string,
  }),
]);
export type AuthMethodImpl = t.TypeOf<typeof AuthMethodImpl>;

export const AuthMethod = new t.Type<AuthMethodImpl, null, string>(
  'Sub',
  (u): u is AuthMethodImpl => AuthMethodImpl.is(u),
  (u, c) => {
    const [type, ...rest] = u.split(':');
    switch (type) {
      case 'email': {
        const email = rest.join(':');
        if (!email) return t.failure(u, c, 'email is missing');
        return t.success({ method: `fv:email`, email });
      }
      case 'idp': {
        const [idp, sub] = rest;
        if (!idp) return t.failure(u, c, 'idp is missing');
        if (!sub) return t.failure(u, c, 'sub is missing');
        return t.success({
          method: `fv:dynamic-custodial-idp`,
          idp: idp === 'twitter' ? 'X' : idp,
          sub,
          name: undefined, // will be populated later in useAuthenticationMethod
          email: undefined,
          darkIcon: undefined, // will be populated later in useAuthenticationMethod
          lightIcon: undefined, // will be populated later in useAuthenticationMethod
        });
      }
      case 'eoa': {
        const eoa = hush(Address.decode(rest[0]));
        if (!eoa) return t.failure(u, c, 'eoa is missing');
        return t.success({ method: 'wagmi', eoa });
      }
      case 'xrpl': {
        const [publicKey] = rest;
        if (!publicKey) {
          return t.failure(u, c, 'publicKey is missing');
        }

        const [_, rAddress] = deriveAddressPair(publicKey);

        if (!rAddress) {
          return t.failure(u, c, 'rAddress is not a valid');
        }

        return t.success({ method: 'xaman', rAddress });
      }
      default:
        return t.failure(u, c);
    }
  },
  (_) => null
);
export type AuthMethod = t.TypeOf<typeof AuthMethod>;
