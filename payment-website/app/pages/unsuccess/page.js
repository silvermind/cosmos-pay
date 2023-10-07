'use client';

import React, { useState } from 'react';
import unsucessImage from "../Images/unsuccess.png"
import Image from 'next/image'

export const page = () => {
  return (
    <div className="max-w-screen-sm flex flex-wrap items-center justify-between mx-auto p-4 mt-4 md:mt-16 text-black">
        <div className='bg-white rounded-3xl w-full p-4 md:p-8'>
            <div className='text-center text-2xl'>
                Transaction failed
            </div>
            <div className='place-content-center flex mt-5'>
                <Image src={unsucessImage} alt="Unsuccess Image" width={150} height={150} />
            </div>
            <div className='text-center text-sm mt-5'>
                Your transaction has failed. Please try again.
            </div>
        </div>
    </div>
  )
}

export default page
