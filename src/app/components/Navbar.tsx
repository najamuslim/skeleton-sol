// components/Navbar.tsx
import React, { useState } from 'react';

interface NavbarProps {
  onSearch: (address: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <div className='flex bg-[#9B2823] justify-between items-center py-5 px-4 md:px-12 gap-2 md:gap-0'>
      <div>
        <h1 className='text-[2rem] md:text-[3.125rem] leading-none text-[#FFFFFF]'>SKELLY</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center overflow-hidden bg-[#FFFFFF] px-3 rounded-sm h-10 self-center">
        <button type="submit">
          <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.031 15.1168L20.3137 19.3995L18.8995 20.8137L14.6168 16.531C13.0769 17.763 11.124 18.5 9 18.5C4.032 18.5 0 14.468 0 9.5C0 4.532 4.032 0.5 9 0.5C13.968 0.5 18 4.532 18 9.5C18 11.624 17.263 13.5769 16.031 15.1168ZM14.0247 14.3748C15.2475 13.1146 16 11.3956 16 9.5C16 5.6325 12.8675 2.5 9 2.5C5.1325 2.5 2 5.6325 2 9.5C2 13.3675 5.1325 16.5 9 16.5C10.8956 16.5 12.6146 15.7475 13.8748 14.5247L14.0247 14.3748Z" fill="#9B2823" />
          </svg>
        </button>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by address"
          className="px-3 py-0 w-full border-none focus:outline-none placeholder-black placeholder-font-bold text-black text-base"
        />
      </form>
    </div>
  );
};

export default Navbar;
