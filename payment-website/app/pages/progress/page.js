'use client';

import React, { useState, useEffect } from 'react';

export const page = () => {
  return (
    <div className="max-w-screen-sm flex flex-wrap items-center justify-between mx-auto p-4 mt-4 md:mt-16 text-black">
      <div className='bg-white rounded-3xl w-full p-4 md:p-8'>
        <div className='text-center text-2xl'>
          Transaction in progress
        </div>
        <div className='mt-12'>
          <span id="ProgressLabel" className="sr-only">Loading</span>

          <span
            role="progressbar"
            aria-labelledby="ProgressLabel"
            aria-valuenow="75"
            className="relative block rounded-full bg-gray-200"
          >
            <span
              className="absolute inset-0 flex items-center justify-center text-[10px]/4"
            >
              <span className="font-bold text-white"> 75% </span>
            </span>

            <span
              className="block h-4 rounded-full bg-indigo-600 text-center"
              style={{ width: '75%' }} // Stil özelliği nesne olarak ayarlandı
            >
            </span>
          </span>
        </div>

        <div className="mt-2 flex justify-center items-center h-full">
            <p className='text-center'>Processing</p>
        </div>


        <div className='center flex w-full justify-center mt-16'>
          <button className='border text-black w-full border-gray-800 rounded-xl h-12 transition-all duration-800 ease-in-out hover:text-white hover:bg-black hover:rounded-xl'> Cancel transaction </button>
        </div>
      </div>
    </div>
  )
}

export default page;
