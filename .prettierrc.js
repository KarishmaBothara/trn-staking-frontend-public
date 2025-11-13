module.exports = {
  // Change your rules accordingly to your coding style preferences.
  // https://prettier.io/docs/en/options.html
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  importOrder: [
    'react',
    'next',
    '^@mui/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '[common|components|hooks|modules|pages|provider|service|styles|utils|wallets]/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
