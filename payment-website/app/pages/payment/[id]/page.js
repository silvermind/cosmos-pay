"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import WalletPayment from '../../Components/WalletPayment';
import QrPayment from '../../Components/QrPayment';
import { loadKeplrWallet } from '@/app/utils';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { GasPrice } from '@cosmjs/stargate';

export default function Page() {
  const params = useParams();
  const id = params.id;

  const [activeTab, setActiveTab] = useState('wallet');
  const address = 'neutron10g43cun9k2nev5uh3pawt843zj2z86zl3y555u';
  const usdPrice = 12.02;
  const nativeTokenPrice = 32.82;
  const transactionFee = 0.02;

    // TODO: Change this later on
    // This will be called by the backend with the admin key
    // Only admin will be able to create the order
    useEffect(() => {
        const createOrder = async () => {
            let signer = await loadKeplrWallet()
            let walletAddress = (await signer.getAccounts())[0].address
    
            let client = await SigningCosmWasmClient.connectWithSigner(
                "https://rpc-kralum.neutron-1.neutron.org",
                signer,
                {
                  gasPrice: GasPrice.fromString("0.025untrn")
                }
            )
        
            await client.execute(
                walletAddress,
                "neutron1ndqt9wmlkjkgazudrfx6mptfsp3pzkmxv5f8a0vtqyy9y6xfhutsl5td3v",
                {
                    create_order: {
                        order_id: "1234",
                        price: "12020000"
                    }
                },
                'auto'
            )
        }
    }, [])

    // TODO: Change this later on
    // This will be called by the backend with the admin key
    // Only admin will be able to create the order
    useEffect(() => {
        const checkPayment = async () => {
            let signer = await loadKeplrWallet()
            let walletAddress = (await signer.getAccounts())[0].address
    
            let client = await SigningCosmWasmClient.connectWithSigner(
                "https://rpc-kralum.neutron-1.neutron.org",
                signer,
                {
                  gasPrice: GasPrice.fromString("0.025untrn")
                }
            )
        
            let order = await client.queryContractSmart(
                "neutron1ndqt9wmlkjkgazudrfx6mptfsp3pzkmxv5f8a0vtqyy9y6xfhutsl5td3v",
                { order: { order_id: "1234" } },
                'auto'
            )

            // There is an order with this order id
            if (order) {
                let valid_payment = await client.queryContractSmart(
                    order.address,
                    { check_payment: { } },
                    'auto'
                )

                // The user sent the payment to contract
                if (valid_payment) {
                    await client.execute(
                        walletAddress,
                        "neutron1ndqt9wmlkjkgazudrfx6mptfsp3pzkmxv5f8a0vtqyy9y6xfhutsl5td3v",
                        {
                            confirm_payment: {
                                order_id: "1234"
                            }
                        },
                        'auto'
                    )
                }
            }
        }
    }, [])

  return (
    <div className="max-w-screen-sm flex flex-wrap items-center justify-between mx-auto p-4 mt-16">

    <div className='bg-white rounded-3xl w-full p-8'>

        <div className='flex mb-8 border rounded-lg bg-gray-300 overflow-hidden'>
            <button
                onClick={() => setActiveTab('wallet')}
                className={`text-black text-sm w-1/2 border-gray-800 h-9 ${activeTab === 'wallet' ? 'bg-white' : ''}`}>
                Pay With Wallet
            </button>
            <button
                onClick={() => setActiveTab('qr')}
                className={`text-black text-sm w-1/2 h-9 ${activeTab === 'qr' ? 'bg-white' : ''}`}>
                Pay With QR
            </button>
        </div>

        {activeTab === 'wallet' &&         
            <WalletPayment
            address={address}
            usdPrice={usdPrice}
            nativeTokenPrice={nativeTokenPrice}
            transactionFeeCost={transactionFee}
            orderId={id}
            />
        }

        {activeTab === 'qr' &&         
            <QrPayment
            address={address}
            usdPrice={usdPrice}
            nativeTokenPrice={nativeTokenPrice}
            transactionFeeCost={transactionFee}
            orderId={id}
            />
        }
    </div>
</div>
  );
}
