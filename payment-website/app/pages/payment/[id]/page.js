"use client"
import { useParams } from 'next/navigation';
import { useState } from 'react';
import WalletPayment from '../../Components/WalletPayment';
import QrPayment from '../../Components/QrPayment';


export default function Page() {
  const params = useParams();
  const id = params.id;

  const [activeTab, setActiveTab] = useState('wallet');
  const address = '0x0d67b2afc0c63c672fc5ae02b69377139187d6da39ea2f43eba5e80c20d9b923';
  const usdPrice = 26;
  const nativeTokenPrice = 34.2;
  const transactionFee = 0.02;


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
