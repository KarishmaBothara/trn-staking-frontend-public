import { BN, BN_TEN, formatBalance } from '@polkadot/util';

export const scaleBy = (value: string | number, decimal: number) => {
  const inputString = `${value}`.replace(/,/g, '');
  const isDecimalValue = `${inputString}`.match(/^(\d+)\.(\d+)$/);
  let result;

  if (isDecimalValue) {
    const div = new BN(inputString.replace(/\.\d*$/, ''));
    const modString = inputString.replace(/^\d+\./, '').substring(0, decimal);
    const mod = new BN(modString);

    result = div
      .mul(BN_TEN.pow(new BN(decimal)))
      .add(mod.mul(BN_TEN.pow(new BN(decimal - modString.length))));
  } else {
    result = new BN(inputString).mul(BN_TEN.pow(new BN(decimal)));
  }

  return result;
};

export const unscaleBy = (value: string | number | BN, decimals: number) => {
  return formatBalance(value, { decimals, forceUnit: '-', withSi: false }).split(',');
};
