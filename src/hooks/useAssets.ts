import { useTrnApi } from '@futureverse/transact-react';
import { useEffect, useState } from 'react';
import { BN, BN_ZERO } from '@polkadot/util';
import { DEFAULT_GAS_TOKEN } from 'providers/RootTransactionProvider';
import appConfig from 'utils/appConfig';
import { createNamedHook } from './createNamedHook';
import useBalance from './useBalance';
import { useFuturePassAccountAddress } from './useFuturePassAccountAddress';

export interface AssetInfo {
  assetId: string;
  name: string;
  symbol: string;
  decimals: string;
  isFrozen?: boolean;
  deposit?: string;
}
export const XRP_ESTIMATED_GAS_FEE = new BN('352500');

const useAssets = () => {
  const { trnApi } = useTrnApi();
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const [assetsInfo, setAssetsInfo] = useState<AssetInfo[]>([]);
  const { whiteList = '' } = appConfig();
  const [activeList, setActiveList] = useState<string[]>(whiteList.split(','));

  const balances = useBalance(futurePassAddress, activeList);

  const [selectedAsset, setSelectedAsset] = useState<AssetInfo>(DEFAULT_GAS_TOKEN);

  useEffect(() => {
    const fetchData = async () => {
      if (!trnApi) return;

      const assets = await trnApi.query.assets.metadata.multi(activeList);
      setAssetsInfo(
        assets.map((asset, index) => {
          const { decimals, name, symbol } = asset.toHuman() as {
            decimals: string;
            name: string;
            symbol: string;
          };
          const assetId = activeList[index];

          const assetInfo: AssetInfo = {
            assetId,
            name,
            symbol: symbol.toUpperCase(),
            decimals,
          };
          return assetInfo;
        })
      );
    };

    fetchData();
  }, [trnApi, activeList]);

  useEffect(() => {
    setActiveList(whiteList.split(','));
  }, [whiteList]);

  useEffect(() => {
    if (assetsInfo.length === 0 || balances.length === 0) return;
    //check XRP balance first

    const xrpBalance = balances.find((balance) => balance.assetId === DEFAULT_GAS_TOKEN.assetId);

    if (xrpBalance?.balance?.gt(XRP_ESTIMATED_GAS_FEE)) {
      setSelectedAsset(DEFAULT_GAS_TOKEN);
      return;
    }

    //check other assets
    const otherBalances = balances.filter(
      (balance) => balance.assetId !== DEFAULT_GAS_TOKEN.assetId
    );
    for (let i = 0; i < otherBalances.length; i++) {
      const balance = otherBalances[i];
      if (balance.balance.gt(BN_ZERO)) {
        const asset = assetsInfo.find((asset) => asset.assetId === balance.assetId);
        if (asset) {
          setSelectedAsset(asset);
          return;
        }
      }
    }
  }, [assetsInfo, balances]);

  return { assets: assetsInfo, selectedAsset };
};

export default createNamedHook('useAssets', useAssets);
