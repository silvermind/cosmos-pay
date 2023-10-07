'use client'
import { useState, useEffect } from 'react';
import React from 'react';
import Dropdown from './Dropdown';
import { useRouter } from 'next/navigation';


const WalletPayment = ({ paymentAddress, usdPrice, nativeTokenPrice, transactionFeeCost, orderId }) => {
  const [currency, setCurrency] = useState('NTRN');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
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
        <button className='border text-black w-full border-gray-800 rounded-xl h-12 mb-2'>Connect Wallet</button>
        <button disabled={isWalletConnected} className={`w-full rounded-xl h-12 ${isWalletConnected ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-blue-400 text-white'}`}> Pay now </button>
      </div>
    </div>
  );
};

export default WalletPayment;
