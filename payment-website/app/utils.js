export const loadKeplrWallet = async () => {
    if (!window.getOfflineSigner || !window.keplr || !window.getOfflineSignerAuto) {
      throw new Error('Keplr extension is not available')
    }
  
    await window.keplr.experimentalSuggestChain(keplrConfig())
    await window.keplr.enable("neutron-1")
  
    const signer = await window.getOfflineSignerAuto("neutron-1")
    Object.assign(signer, {
      signAmino: signer.signAmino ?? signer.sign,
    })
  
    return signer
  }

const keplrConfig = () => ({
    chainId: "neutron-1",
    chainName: "neutron",
    rpc: "https://rpc-kralum.neutron-1.neutron.org",
    rest: "https://rest-kralum.neutron-1.neutron.org",
    bech32Config: {
      bech32PrefixAccAddr: `${"neutron"}`,
      bech32PrefixAccPub: `${"neutron"}pub`,
      bech32PrefixValAddr: `${"neutron"}valoper`,
      bech32PrefixValPub: `${"neutron"}valoperpub`,
      bech32PrefixConsAddr: `${"neutron"}valcons`,
      bech32PrefixConsPub: `${"neutron"}valconspub`,
    },
    currencies: [
      {
        coinDenom: "untrn",
        coinMinimalDenom: "untrn",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "untrn",
        coinMinimalDenom: "untrn",
        coinDecimals: 6,
      },
    ],
    stakeCurrency: {
      coinDenom: "untrn",
      coinMinimalDenom: "untrn",
      coinDecimals: 6,
    },
    // gasPriceStep: {
    //   low: config.gasPrice / 2,
    //   average: config.gasPrice,
    //   high: config.gasPrice * 2,
    // },
    bip44: { coinType: 118 },
    coinType: 118,
    features: ['ibc-transfer', 'cosmwasm', 'ibc-go'],
  })