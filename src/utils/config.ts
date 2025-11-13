export type Asset = {
  assetId: string;
  symbol: string;
  name: string;
  decimals: number;
};

export const rootAsset: Asset = {
  assetId: '1',
  symbol: 'ROOT',
  name: 'ROOT',
  decimals: 6,
} as const;

export const devAssets: Asset[] = [
  rootAsset,
  { assetId: '2', symbol: 'XRP', name: 'XRP', decimals: 6 },
  {
    assetId: '1124',
    symbol: 'GoerliETH',
    name: 'GoerliETH',
    decimals: 18,
  },
  {
    assetId: '2148',
    symbol: 'GoerliUSDC',
    name: 'GoerliUSDC',
    decimals: 6,
  },
  {
    assetId: '3172',
    symbol: 'GoerliSYLO',
    name: 'GoerliSYLO',
    decimals: 18,
  },
  {
    assetId: '17508',
    symbol: 'GoerliASTO',
    name: 'GoerliASTO',
    decimals: 18,
  },
  {
    assetId: '24676',
    symbol: 'LP-1-2',
    name: 'LP ROOT XRP',
    decimals: 18,
  },
  {
    assetId: '25700',
    symbol: 'LP-2-17508',
    name: 'LP XRP GoerliASTO',
    decimals: 18,
  },
  {
    assetId: '26724',
    symbol: 'LP-2-3172',
    name: 'LP XRP GoerliSYLO',
    decimals: 18,
  },
  {
    assetId: '27748',
    symbol: 'LP-1-3172',
    name: 'LP ROOT GoerliSYLO',
    decimals: 18,
  },
  { assetId: '28772', symbol: 'tst', name: 'test', decimals: 18 },
  {
    assetId: '29796',
    symbol: 'LP-2-28772',
    name: 'LP XRP tst',
    decimals: 18,
  },
  { assetId: '30820', symbol: 'TEST2', name: 'test2', decimals: 18 },
  {
    assetId: '31844',
    symbol: 'LP-2-30820',
    name: 'LP XRP TEST2',
    decimals: 18,
  },
  { assetId: '32868', symbol: 'Tst1', name: 'Tester', decimals: 6 },
  { assetId: '33892', symbol: 'TEST', name: 'TestAsset', decimals: 6 },
  {
    assetId: '34916',
    symbol: '1TASS',
    name: 'Test Asset 1',
    decimals: 18,
  },
  {
    assetId: '35940',
    symbol: 'LP-2-34916',
    name: 'LP XRP 1TASS',
    decimals: 18,
  },
  {
    assetId: '36964',
    symbol: 'PCOIN1',
    name: 'Party Coin 1',
    decimals: 18,
  },
  {
    assetId: '37988',
    symbol: 'PCOIN2',
    name: 'Party Coin 2',
    decimals: 18,
  },
  {
    assetId: '39012',
    symbol: 'LP-36964-37988',
    name: 'LP PCOIN1 PCOIN2',
    decimals: 18,
  },
];

export const productionAssets: Asset[] = [
  rootAsset,
  { assetId: '2', symbol: 'XRP', name: 'XRP', decimals: 6 },
  { assetId: '1124', symbol: 'ETH', name: 'ETH', decimals: 18 },
  { assetId: '2148', symbol: 'SYLO', name: 'SYLO', decimals: 18 },
  { assetId: '4196', symbol: 'ASTO', name: 'ASTO', decimals: 18 },
  {
    assetId: '5220',
    symbol: 'LP-2-4196',
    name: 'LP XRP ASTO',
    decimals: 18,
  },
  {
    assetId: '33892',
    symbol: 'LP-1-2',
    name: 'LP ROOT XRP',
    decimals: 18,
  },
  {
    assetId: '34916',
    symbol: 'LP-1-4196',
    name: 'LP ROOT ASTO',
    decimals: 18,
  },
  {
    assetId: '35940',
    symbol: 'LP-2-2148',
    name: 'LP XRP SYLO',
    decimals: 18,
  },
  {
    assetId: '36964',
    symbol: 'LP-1-3',
    name: 'LP ROOT VTX',
    decimals: 18,
  },
  {
    assetId: '37988',
    symbol: 'LP-2-3',
    name: 'LP XRP VTX',
    decimals: 18,
  },
  {
    assetId: '39012',
    symbol: 'LP-1-2148',
    name: 'LP ROOT SYLO',
    decimals: 18,
  },
  {
    assetId: '40036',
    symbol: 'LP-2148-4196',
    name: 'LP SYLO ASTO',
    decimals: 18,
  },
  {
    assetId: '41060',
    symbol: 'LP-1-1124',
    name: 'LP ROOT ETH',
    decimals: 18,
  },
  {
    assetId: '42084',
    symbol: 'LP-3-4196',
    name: 'LP VTX ASTO',
    decimals: 18,
  },
  {
    assetId: '43108',
    symbol: 'LP-3-2148',
    name: 'LP VTX SYLO',
    decimals: 18,
  },
  {
    assetId: '44132',
    symbol: 'LP-4196-6244',
    name: 'LP ASTO USDT',
    decimals: 18,
  },
  {
    assetId: '45156',
    symbol: 'LP-2-3172',
    name: 'LP XRP USDC',
    decimals: 18,
  },
  {
    assetId: '46180',
    symbol: 'LP-2-1124',
    name: 'LP XRP ETH',
    decimals: 18,
  },
  {
    assetId: '47204',
    symbol: 'LP-3172-4196',
    name: 'LP USDC ASTO',
    decimals: 18,
  },
  {
    assetId: '48228',
    symbol: 'LP-2148-6244',
    name: 'LP SYLO USDT',
    decimals: 18,
  },
  {
    assetId: '49252',
    symbol: 'LP-1-6244',
    name: 'LP ROOT USDT',
    decimals: 18,
  },
  {
    assetId: '50276',
    symbol: 'LP-3-6244',
    name: 'LP VTX USDT',
    decimals: 18,
  },
  {
    assetId: '51300',
    symbol: 'LP-1-3172',
    name: 'LP ROOT USDC',
    decimals: 18,
  },
  {
    assetId: '53348',
    symbol: 'LP-2-6244',
    name: 'LP XRP USDT',
    decimals: 18,
  },
];

export const assetList = {
  development: devAssets,
  staging: devAssets,
  production: productionAssets,
} as const;
