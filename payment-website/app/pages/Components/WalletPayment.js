'use client'
import { useState, useEffect } from 'react';
import React from 'react';
import Dropdown from './Dropdown';
import { useRouter } from 'next/navigation';
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate'


const WalletPayment = ({ address, usdPrice, nativeTokenPrice, transactionFeeCost, orderId }) => {
  const [currency, setCurrency] = useState('NTRN');
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [ signer, setSigner] = useState(null)
  const { push } = useRouter();


  const options = ['NTRN', 'USDT'];


  useEffect(() => {
    const duration = 10 * 60 * 1000; // 10 minutes
  
    const startTime = localStorage.getItem('startTime');
  
    if (!startTime) {
      const now = new Date().getTime();
      localStorage.setItem('startTime', now.toString());
      setTimeRemaining(duration);
    } else {
      const elapsed = new Date().getTime() - parseInt(startTime);
      const remaining = duration - elapsed;
      setTimeRemaining(remaining);
    }
  }, []);
  
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1000);
      }, 1000);
  
      return () => clearTimeout(timer);
    } else if (timeRemaining !== null && timeRemaining <= 0) {
      localStorage.removeItem('startTime');
      push('/pages/unsuccess');
    }
  }, [timeRemaining]);

  const walletConnection = async () => {
    let signer = await loadKeplrWallet()
    let walletAddress = (await signer.getAccounts())[0].address
    setSigner(signer)
    setWalletAddress(walletAddress)
    setIsWalletConnected(true)
  }

  const loadKeplrWallet = async () => {
    let config = {
      "$schema": "../chain.schema.json",
      "chain_name": "neutron",
      "status": "live",
      "network_type": "mainnet",
      "pretty_name": "Neutron",
      "chain_id": "neutron-1",
      "bech32_prefix": "neutron",
      "daemon_name": "neutrond",
      "node_home": "$HOME/.neutrond",
      "key_algos": [
        "secp256k1"
      ],
      "slip44": 118,
      "fees": {
        "fee_tokens": [
          {
            "denom": "untrn",
            "low_gas_price": 0.01,
            "average_gas_price": 0.025,
            "high_gas_price": 0.05
          }
        ]
      },
      "staking": {
        "staking_tokens": [
          {
            "denom": "untrn"
          }
        ]
      },
      "codebase": {
        "git_repo": "https://github.com/neutron-org/neutron",
        "recommended_version": "v1.0.4",
        "compatible_versions": [
          "v1.0.3",
          "v1.0.4"
        ],
        "cosmos_sdk_version": "0.45",
        "consensus": {
          "type": "tendermint",
          "version": "0.34"
        },
        "cosmwasm_version": "0.31",
        "cosmwasm_enabled": true,
        "ibc_go_version": "4.3.0",
        "genesis": {
          "genesis_url": "https://raw.githubusercontent.com/neutron-org/mainnet-assets/main/neutron-1-genesis.json"
        },
        "versions": [
          {
            "name": "v1.0.1",
            "recommended_version": "v1.0.4",
            "compatible_versions": [
              "v1.0.3",
              "v1.0.4"
            ],
            "cosmos_sdk_version": "0.45",
            "consensus": {
              "type": "tendermint",
              "version": "0.34"
            },
            "cosmwasm_version": "0.31",
            "cosmwasm_enabled": true,
            "ibc_go_version": "4.3.0"
          }
        ]
      },
      "logo_URIs": {
        "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-black-logo.png",
        "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-black-logo.svg"
      },
      "peers": {
        "seeds": [
          {
            "id": "24f609fb5946ca3a979f40b7f54132c00104433e",
            "address": "p2p-erheim.neutron-1.neutron.org:26656",
            "provider": "Neutron"
          },
          {
            "id": "b1c6fa570a184c56d0d736d260b8065d887e717c",
            "address": "p2p-kralum.neutron-1.neutron.org:26656",
            "provider": "Neutron"
          },
          {
            "id": "20e1000e88125698264454a884812746c2eb4807",
            "address": "seeds.lavenderfive.com:19156",
            "provider": "Lavender.Five Nodes 🐝"
          },
          {
            "id": "f4422e68f9a678838522d75fa8221985c723294d",
            "address": "seeds.whispernode.com:19156",
            "provider": "WhisperNode🤐"
          },
          {
            "id": "e1b058e5cfa2b836ddaa496b10911da62dcf182e",
            "address": "neutron-seed-de.allnodes.me:26656",
            "provider": "Allnodes.com ⚡️ Nodes & Staking"
          },
          {
            "id": "e726816f42831689eab9378d5d577f1d06d25716",
            "address": "neutron-seed-us.allnodes.me:26656",
            "provider": "Allnodes.com ⚡️ Nodes & Staking"
          }
        ],
        "persistent_peers": [
          {
            "id": "e5d2743d9a3de514e4f7b9461bf3f0c1500c58d9",
            "address": "neutron.peer.stakewith.us:39956",
            "provider": "StakeWithUs"
          }
        ]
      },
      "apis": {
        "rpc": [
          {
            "address": "https://rpc-kralum.neutron-1.neutron.org",
            "provider": "Neutron"
          },
          {
            "address": "https://rpc.novel.remedy.tm.p2p.org",
            "provider": "P2P"
          },
          {
            "address": "https://neutron-rpc.lavenderfive.com",
            "provider": "Lavender.Five Nodes 🐝"
          },
          {
            "address": "https://rpc-neutron.whispernode.com",
            "provider": "WhisperNode🤐"
          },
          {
            "address": "https://rpc-neutron.cosmos-spaces.cloud",
            "provider": "Cosmos Spaces"
          },
          {
            "address": "http://posthuman-neutron-rpc.ingress.europlots.com",
            "provider": "POSTHUMAN ꝏ DVS"
          },
          {
            "address": "http://rpc.neutron.nodestake.top",
            "provider": "NodeStake"
          },
          {
            "address": "https://neutron-rpc.publicnode.com",
            "provider": "Allnodes.com ⚡️ Nodes & Staking"
          },
          {
            "address": "https://community.nuxian-node.ch:6797/neutron/trpc",
            "provider": "PRO Delegators"
          },
          {
            "address": "https://rpc-neutron.in3s.com:443",
            "provider": "in3s.com"
          }
        ],
        "rest": [
          {
            "address": "https://rest-kralum.neutron-1.neutron.org",
            "provider": "Neutron"
          },
          {
            "address": "https://api.novel.remedy.tm.p2p.org",
            "provider": "P2P"
          },
          {
            "address": "https://neutron-api.lavenderfive.com",
            "provider": "Lavender.Five Nodes 🐝"
          },
          {
            "address": "https://lcd-neutron.whispernode.com",
            "provider": "WhisperNode🤐"
          },
          {
            "address": "https://api-neutron.cosmos-spaces.cloud",
            "provider": "Cosmos Spaces"
          },
          {
            "address": "http://api.neutron.nodestake.top",
            "provider": "NodeStake"
          },
          {
            "address": "https://neutron-rest.publicnode.com",
            "provider": "Allnodes.com ⚡️ Nodes & Staking"
          },
          {
            "address": "https://community.nuxian-node.ch:6797/neutron/crpc",
            "provider": "PRO Delegators"
          }
        ],
        "grpc": [
          {
            "address": "grpc-kralum.neutron-1.neutron.org:80",
            "provider": "Neutron"
          },
          {
            "address": "https://grpc.novel.remedy.tm.p2p.org",
            "provider": "P2P"
          },
          {
            "address": "https://grpc-web.novel.remedy.tm.p2p.org",
            "provider": "P2P"
          },
          {
            "address": "neutron-grpc.lavenderfive.com:443",
            "provider": "Lavender.Five Nodes 🐝"
          },
          {
            "address": "grpc-neutron.whispernode.com:443",
            "provider": "WhisperNode🤐"
          },
          {
            "address": "grpc-neutron.cosmos-spaces.cloud:3090",
            "provider": "Cosmos Spaces"
          },
          {
            "address": "grpc.neutron.nodestake.top:9090",
            "provider": "NodeStake"
          },
          {
            "address": "neutron-grpc.publicnode.com:443",
            "provider": "Allnodes.com ⚡️ Nodes & Staking"
          }
        ]
      },
      "explorers": [
        {
          "kind": "Mintscan",
          "url": "https://www.mintscan.io/neutron",
          "tx_page": "https://www.mintscan.io/neutron/transactions/${txHash}",
          "account_page": "https://www.mintscan.io/neutron/accounts/${accountAddress}"
        }
      ],
      "images": [
        {
          "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-black-logo.png",
          "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-black-logo.svg"
        }
      ]
    }

    if (!window.getOfflineSigner || !window.keplr || !window.getOfflineSignerAuto) {
      throw new Error('Keplr extension is not available')
    }
  
    await window.keplr.experimentalSuggestChain(keplrConfig(config))
    await window.keplr.enable(config.chain_id)
  
    const signer = await window.getOfflineSignerAuto(config.chain_id)
    Object.assign(signer, {
      signAmino: signer.signAmino ?? signer.sign,
    })
  
    return signer
  }

  const keplrConfig = (config) => ({
    chainId: config.chain_id,
    chainName: config.chain_name,
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
    gasPriceStep: {
      low: config.gasPrice / 2,
      average: config.gasPrice,
      high: config.gasPrice * 2,
    },
    bip44: { coinType: 118 },
    coinType: 118,
    features: ['ibc-transfer', 'cosmwasm', 'ibc-go'],
  })

  const payNow = async () => {
    if (signer) {
      let client = await SigningStargateClient.connectWithSigner(
        "https://rpc-kralum.neutron-1.neutron.org",
        signer,
        {
          gasPrice: GasPrice.fromString("0.025untrn")
        }
      )

      await client.sendTokens(walletAddress, address, [{ denom: 'untrn', amount: "32820000"}], 'auto')

      push('/pages/success');
    }
  }

  return (
    <div className='text-black'>
      <div className='flex justify-between'>
        <div className='text-md'>
          Pay #{orderId} order
        </div>
        <div>
          Time remaining
            <p className='text-red-600 '>
              {Math.floor(timeRemaining / 60000).toString().padStart(2, '0')}:
              {Math.floor((timeRemaining % 60000) / 1000).toString().padStart(2, '0')}
            </p>
        </div>
      </div>

      <div className='text-xl sm:text-2xl'>
          ${usdPrice+transactionFeeCost}
      </div>

      <div className='text-sm sm:text-l'>
        ~{nativeTokenPrice} $NTRN
      </div>

      <div className='text-xl mt-2 flex justify-between'>
        <div></div>
          <Dropdown label={currency} options={options} selectedOption={currency} onSelect={setCurrency} />
      </div>

        {currency === 'NTRN' &&         
          <div className='text-md text-red-600 mt-12 w-full'>
              You are going to pay {nativeTokenPrice} $NTRN
          </div>
        }

        {currency === 'USDT' &&         
          <div className='text-md text-red-600 mt-12 w-full'>
              You are going to pay {usdPrice+transactionFeeCost} $USDT
          </div>
        }

      <hr className="h-px my-8 bg-gray-800 border-0 dark:bg-gray-700" />

      <div className='p-2'>
        <div className='flex justify-between'>
          <p className='text-xl'>Cart</p>
          <p className='text-xl'>${usdPrice}</p>
        </div>

        <div className='flex justify-between'>
          <p className='text-xl'> Transaction Fee </p>
          <p className='text-xl'>${transactionFeeCost}</p>
        </div>
      </div>

      <div className='center flex w-full justify-center mt-14 flex-col'>
        <button className='border text-black w-full border-gray-800 rounded-xl h-12 mb-2' onClick={walletConnection}>{isWalletConnected ? walletAddress : "Connect Wallet"}</button>
        <button onClick={payNow} disabled={!isWalletConnected} className={`w-full rounded-xl h-12 ${!isWalletConnected ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-blue-400 text-white'}`}> Pay now </button>
      </div>
    </div>
  );
};

export default WalletPayment;
