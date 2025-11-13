import { BN, BN_HUNDRED, BN_ONE, BN_TEN, BN_ZERO } from '@polkadot/util';

import { scaleBy } from './polkadotBN';

describe('polkaDotBN', () => {
  describe.each([
    [1, 1, BN_TEN],
    [1, 2, BN_HUNDRED],
    [0.1, 1, BN_ONE],
    [0.01, 2, BN_ONE],
    [0.001, 2, BN_ZERO],
    [12.11132, 3, new BN('12111')],
    ['1234.556778123444123', 6, new BN('1234556778')],
  ])('scaleBy(%d, %i) should work', (value: number | string, decimals: number, expected: BN) => {
    test(`returns ${expected}`, () => {
      expect(scaleBy(value, decimals)).toEqual(expected);
      expect(scaleBy(value, decimals).toString()).toEqual(expected.toString());
    });
  });
});
