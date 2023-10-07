import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../Images/cosmos-pay-logo.png';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center md:p-5 bg-black text-white">
      <div className="logo p-4">
        <Link href="/">
            <Image src={logo} width={128} height={77} alt="logo" />
        </Link>
      </div>
      <div className="space-x-4 md:space-x-8 font-bold text-lg p-4">
        <Link href="/docs" className="hover:text-gray-300">
          Docs
        </Link>
        <Link href="/github" className="hover:text-gray-300">
          Github
        </Link>
      </div>
    </nav>
  );
}
