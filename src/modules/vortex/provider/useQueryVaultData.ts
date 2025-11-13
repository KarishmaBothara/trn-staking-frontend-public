import { useQuery } from '@tanstack/react-query';
import appConfig from '../../../utils/appConfig';
import { assetList, rootAsset } from '../../../utils/config';
import { ApiPromise } from '@polkadot/api';
import { unscaleBy } from 'utils/polkadotBN';

type AssetsBalance = {
  assetId: string;
  symbol: string;
  balance: number;
};

type RedeemAsset = {
  composition: number;
  symbol: string;
  value: number;
};

export const useQueryVaultData = (api: ApiPromise) => {
  const { stage: env, vortexVaultAddress } = appConfig();

  return useQuery<RedeemAsset[]>({
    queryKey: ['vortex-vault'],
    queryFn: async () => {
      const assetsWithoutRoot = assetList[env as keyof typeof assetList].filter(
        (asset) => asset.assetId !== '1'
      );
      const assetsBalance: AssetsBalance[] = [];
      const queries = [];
      for (const asset of assetsWithoutRoot) {
        const assetQuery = [api.query.assets.account, [asset.assetId, vortexVaultAddress]];
        queries.push(assetQuery);
      }

      const result = await api.queryMulti(queries as any);

      for (let i = 0; i < assetsWithoutRoot.length; i++) {
        if (!result[i] || !result[i].toJSON()) continue;
        const asset = assetsWithoutRoot[i];

        assetsBalance.push({
          assetId: asset.assetId,
          symbol: asset.symbol,
          balance: Number(
            unscaleBy(
              (result[i].toHuman() as any).balance.toString().replaceAll(',', '') || '0',
              asset.decimals
            ).join('')
          ),
        });
      }

      // ROOT
      const rootResult = await api.query.system.account(vortexVaultAddress);
      const rootBalance = (rootResult.toJSON() as any).data.free.toString();

      assetsBalance.push({
        assetId: '1',
        symbol: 'ROOT',
        balance: Number(unscaleBy(rootBalance || '0', rootAsset.decimals).join('')),
      });

      const sum = assetsBalance.reduce((acc, cur) => {
        return acc + Number(cur.balance);
      }, 0);

      const redeemAssets = assetsBalance.map((x) => ({
        composition: (Number(x.balance) / sum) * 100,
        symbol: x.symbol,
        value: x.balance,
      }));

      return redeemAssets;
    },
    enabled: !!api,
  });
};
