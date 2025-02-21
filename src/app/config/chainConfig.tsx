export const chainConfig = {
  chainId: 'regen-redwood-1',
  chainName: 'Regen Redwood Testnet',
  rpc: 'http://redwood.regen.network:26657/',
  rest: 'http://redwood.regen.network:1317/',
  stakeCurrency: {
    coinDenom: 'REGEN',
    coinMinimalDenom: 'uregen',
    coinDecimals: 6,
  },
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: 'regen',
    bech32PrefixAccPub: 'regenpub',
    bech32PrefixValAddr: 'regenvaloper',
    bech32PrefixValPub: 'regenvaloperpub',
    bech32PrefixConsAddr: 'regenvalcons',
    bech32PrefixConsPub: 'regenvalconspub',
  },
  currencies: [
    {
      coinDenom: 'REGEN',
      coinMinimalDenom: 'uregen',
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'REGEN',
      coinMinimalDenom: 'uregen',
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  features: ['stargate'],
};
