'use client'
import { useState, useEffect } from 'react';
import React from 'react';
import QRCode from 'qrcode.react';
import copyIcon from '../Images/copy.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation';




const QrPayment = ({ address, usdPrice, nativeTokenPrice, transactionFeeCost, orderId }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(null);
    const { push } = useRouter();




    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopySuccess('Address copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            })
            .catch(err => console.error('Failed to copy text: ', err));
    };


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

            <div className='text-md text-red-600 mt-12 w-full'>
                You have to send {nativeTokenPrice} $NTRN or {usdPrice+transactionFeeCost} $USDT
            </div>

            <div className='place-content-center flex mt-5'>
                {
                    address && <QRCode value={address} size={250} />
                }
                {
                    !address && <div className='spinner'></div>
                }
            </div>

            <div className='place-content-center flex flex-col items-center'>
                {
                    address &&
                    <div className="flex items-center mt-2 cursor-pointer" onClick={() => copyToClipboard(address)}>
                        <p className="mr-2">{address.substring(0, 4)}...{address.substring(address.length - 4)}</p>
                        <Image src={copyIcon} alt="copy" width={16} height={16} />
                    </div>
                }

                {copySuccess && <div className='text-sm text-green-500 mt-2'>{copySuccess}</div>}
            </div>


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

        </div>
  );
};

export default QrPayment;
