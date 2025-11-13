import { ApiPromise } from '@polkadot/api';
import type { SignerOptions } from '@polkadot/api/submittable/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { GenericSignerPayload } from '@polkadot/types';
import { DispatchError } from '@polkadot/types/interfaces';
import { ISubmittableResult, ITuple } from '@polkadot/types/types';
import { blake2AsHex } from '@polkadot/util-crypto';
import { cons } from 'fp-ts/lib/ReadonlyNonEmptyArray';

export interface IExtrinsicInfo {
  blockHeight?: string;
  txIndex?: number;
  blockHash: string;
}

interface ISubmittableResultWithBlockNumber extends ISubmittableResult {
  blockNumber?: string;
}

export const SendExtrinsic = (
  api: ApiPromise,
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResultWithBlockNumber>
): Promise<{
  message?: string;
  result: ISubmittableResult;
  extrinsicInfo?: IExtrinsicInfo;
}> => {
  return new Promise((resolve, reject) => {
    extrinsic
      .send((result) => {
        if (result.status.isFinalized) {
          const extrinsicInfo = {
            blockHeight: result.blockNumber?.toString(),
            txIndex: result.txIndex,
            blockHash: result.status.isFinalized
              ? result.status.asFinalized.toHex()
              : result.status.asInBlock.toHex(),
          };
          result.events.forEach((event) => {
            const {
              event: { data, method },
            } = event;
            if (method === 'ExtrinsicFailed' || method === 'BatchInterrupted') {
              const [dispatchError] = data as unknown as ITuple<[DispatchError]>;
              let message: any = dispatchError.type;
              if (dispatchError.isModule) {
                try {
                  const mod = dispatchError.asModule;
                  const error = api.registry.findMetaError(
                    new Uint8Array([mod.index.toNumber(), Number(mod.error.toString())])
                  );
                  message = `${error.section}.${error.name}`;
                } catch (error) {
                  reject({ result });
                }
              }
              reject({ message, result, extrinsicInfo });
            } else if (method === 'ExtrinsicSuccess') {
              resolve({ result, extrinsicInfo });
            }
          });
        } else if (result.isError) {
          reject({ result });
        }
      })
      .catch((error) => {
        reject({ error });
      });
  });
};

export const getExtrinsicId = (extrinsicInfo: IExtrinsicInfo) => {
  const blockHeight = extrinsicInfo.blockHeight?.padStart(10, '0');
  const txIndex = extrinsicInfo.txIndex?.toString().padStart(6, '0');
  const blockHashPre5 = extrinsicInfo.blockHash.substring(2, 7);
  return `${blockHeight}-${txIndex}-${blockHashPre5}`;
};

export async function generateExtrinsicPayload(
  api: ApiPromise,
  address: string,
  method: SubmittableExtrinsic<'promise'>['method'],
  options?: Partial<SignerOptions>
): Promise<[GenericSignerPayload, `0x${string}`, Record<string, unknown>]> {
  const { header, mortalLength, nonce } = await api.derive.tx.signingInfo(address);
  const eraOptions = {
    address,
    blockHash: header?.hash,
    blockNumber: header?.number,
    era: api.registry.createTypeUnsafe('ExtrinsicEra', [
      {
        current: header?.number,
        period: mortalLength,
      },
    ]),
    genesisHash: api.genesisHash,
    method,
    nonce,
    runtimeVersion: api.runtimeVersion,
    signedExtensions: api.registry.signedExtensions,
    version: api.extrinsicVersion,
    ...options,
  };

  const payload = api.registry.createTypeUnsafe('SignerPayload', [
    eraOptions,
  ]) as unknown as GenericSignerPayload;
  const { data } = payload.toRaw();
  const hashed = data.length > (256 + 1) * 2 ? blake2AsHex(data) : data;
  const ethPayload = blake2AsHex(hashed);

  return [payload, ethPayload, eraOptions];
}
