import * as React from 'react';

import * as t from 'io-ts';
import { useAccount } from 'wagmi';

import * as E from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { createContainer } from 'stateboss/Container';

import * as C from '../common';

function createStorageKey(
  key: StorageKey,
  address: string | undefined,
  isEntryPerAccount?: boolean,
  accountIdentifier?: string
): string {
  const entryIdentifier = accountIdentifier ?? address;
  return `${key}${isEntryPerAccount && entryIdentifier != undefined ? `-${entryIdentifier}` : ''}`;
}

/*
 * TODO: Note that this container has been introduced when there were already
 * many local storage keys in use, so they may not all be here.
 * All the other uses of storage should be changed to use this container.
 */
/**
 * Add the key to this union when introducing a new storage key-value pair.
 */
export type StorageKey = 'isSwitchingAccounts'; // FIXME: probably could use a better name

type SetStorageParams<A> = {
  key: StorageKey;
  value: A;
  codec: t.Encoder<A, unknown>;
  isEntryPerAccount?: boolean;
  accountIdentifier?: string;
};

type GetStorageParams<A> = Pick<
  SetStorageParams<A>,
  'key' | 'isEntryPerAccount' | 'accountIdentifier'
> & {
  codec: t.Decoder<unknown, A>;
};

// unknown is fine here because removing item does not depend on the value of the entry
type RemoveStorageParams = Pick<
  SetStorageParams<unknown>,
  'key' | 'isEntryPerAccount' | 'accountIdentifier'
>;

const CLEAR_ACCOUNT_ENTRY_KEYS: Partial<StorageKey>[] = [];
/**
 * The storage methods encode and decode values with the provided codec.
 *
 * `isEntryPerAccount` true if value should be unique between user's wallet accounts, false otherwise.
 * `accountIdentifier` if specified will use this instead of user's account address to distinguish between
 * entries for different accounts.
 */
type StorageInterface = {
  /**
   * Example use: setItem('key', 123, t.number)
   *
   * If `isEntryPerAccount` is true, there will be a separate storage entry per account address.
   * EOA address from Wagmi is used by default, but you can specify another identifier using `accountIdentifier`.
   */
  setItem: <A>({
    key,
    value,
    codec,
    isEntryPerAccount,
    accountIdentifier,
  }: SetStorageParams<A>) => void;
  /**
   * Example use: getItem('key', M.WholeNumber)
   *
   * If `isEntryPerAccount` is true, there will be a separate storage entry per account address.
   * EOA address from Wagmi is used by default, but you can specify another identifier using `accountIdentifier`.
   */
  getItem: <A>({
    key,
    codec,
    isEntryPerAccount,
    accountIdentifier,
  }: GetStorageParams<A>) => A | null;
  /**
   * If `isEntryPerAccount` is true, there will be a separate storage entry per account address.
   * EOA address from Wagmi is used by default, but you can specify another identifier using `accountIdentifier`.
   */
  removeItem: ({ key, isEntryPerAccount, accountIdentifier }: RemoveStorageParams) => void;
  clear: () => void;
};

type StorageContainer = {
  useLocalStorage: () => StorageInterface;
  useSessionStorage: () => StorageInterface;
};

const useStorageImpl = (): StorageContainer => {
  const { address, isConnected } = useAccount();
  const accountAddressRef = React.useRef(address);
  React.useEffect(() => {
    if (address != undefined) {
      accountAddressRef.current = address;
    }
  }, [address]);

  React.useEffect(() => {
    if (!isConnected) {
      const accountAddress = accountAddressRef.current;
      if (accountAddress != null) {
        CLEAR_ACCOUNT_ENTRY_KEYS.map((key) => {
          const storageKey = createStorageKey(key, undefined, true, accountAddress);
          localStorage.removeItem(storageKey);
          sessionStorage.removeItem(storageKey);
        });
      }
    }
  }, [isConnected]);

  const useLocalStorage = () => {
    function setItem<A>({
      key,
      value,
      codec,
      isEntryPerAccount,
      accountIdentifier,
    }: SetStorageParams<A>) {
      localStorage.setItem(
        createStorageKey(key, address, isEntryPerAccount, accountIdentifier),
        C.toJSONString(codec, value)
      );
    }

    function getItem<A>({
      key,
      codec,
      isEntryPerAccount,
      accountIdentifier,
    }: GetStorageParams<A>): A | null {
      const item = localStorage.getItem(
        createStorageKey(key, address, isEntryPerAccount, accountIdentifier)
      );

      if (item == null) {
        return null;
      }

      const itemR = C.fromJSONString(codec, item);

      if (E.isLeft(itemR)) {
        throw new Error(
          `Unexpectedly failed to decode '${codec.name}' value from JSON localStorage; error:` +
            PathReporter.report(itemR).join('\n ')
        );
      }

      return itemR.right;
    }

    function removeItem({ key, isEntryPerAccount, accountIdentifier }: RemoveStorageParams) {
      localStorage.removeItem(createStorageKey(key, address, isEntryPerAccount, accountIdentifier));
    }

    function clear() {
      localStorage.clear();
    }

    return {
      setItem,
      getItem,
      removeItem,
      clear,
    };
  };

  const useSessionStorage = React.useCallback(() => {
    function setItem<A>({
      key,
      value,
      codec,
      isEntryPerAccount,
      accountIdentifier,
    }: SetStorageParams<A>) {
      sessionStorage.setItem(
        createStorageKey(key, address, isEntryPerAccount, accountIdentifier),
        C.toJSONString(codec, value)
      );
    }

    function getItem<A>({
      key,
      codec,
      isEntryPerAccount,
      accountIdentifier,
    }: GetStorageParams<A>): A | null {
      const item = sessionStorage.getItem(
        createStorageKey(key, address, isEntryPerAccount, accountIdentifier)
      );

      if (item == null) {
        return null;
      }

      const itemR = C.fromJSONString(codec, item);

      if (E.isLeft(itemR)) {
        throw new Error(
          `Unexpectedly failed to decode '${codec.name}' value from JSON sessionStorage; error:` +
            PathReporter.report(itemR).join('\n ')
        );
      }

      return itemR.right;
    }

    function removeItem({ key, isEntryPerAccount, accountIdentifier }: RemoveStorageParams) {
      sessionStorage.removeItem(
        createStorageKey(key, address, isEntryPerAccount, accountIdentifier)
      );
    }

    function clear() {
      sessionStorage.clear();
    }

    return {
      setItem,
      getItem,
      removeItem,
      clear,
    };
  }, [address]);

  return {
    useLocalStorage,
    useSessionStorage,
  };
};

export const { Provider: StorageProvider, useContainer: useStorage } = createContainer(
  useStorageImpl,
  {
    componentName: 'Storage',
  }
);
