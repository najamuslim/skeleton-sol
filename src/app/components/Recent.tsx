// components/Skeleton.tsx
import React, { useState } from 'react';

interface SkeletonProps {
  style?: React.CSSProperties;
}

const Recent: React.FC<SkeletonProps> = ({ style }) => (
  <div className="absolute top-36 right-20 text-black">
    <div className='bg-[#FFFFFF] py-3 px-3 w-[24rem]'>
      <span>{`>>>`}</span>
      <p className='font-bold text-xl'>Recent Input</p>
      <hr className='border border-black my-4'/>
      <div className="flex justify-between font-bold">
        <p>Time</p>
        <p>From</p>
        <p>Amount</p>
      </div>
      <div className="flex justify-between font-bold my-2">
        <p>2m Ago</p>
        <p className='w-1/3 truncate'>asdasdasdasdasdasdasdasdasdasdasdasdasdasd</p>
        <p>1</p>
      </div>
      <div className="flex justify-between font-bold my-2">
        <p>2m Ago</p>
        <p className='w-1/3 truncate'>asdasdasdasdasdasdasdasdasdasdasdasdasdasd</p>
        <p>1</p>
      </div>
      <div className="flex justify-between font-bold my-2">
        <p>2m Ago</p>
        <p className='w-1/3 truncate'>asdasdasdasdasdasdasdasdasdasdasdasdasdasd</p>
        <p>1</p>
      </div>
      <div className="flex justify-between font-bold my-2">
        <p>2m Ago</p>
        <p className='w-1/3 truncate'>asdasdasdasdasdasdasdasdasdasdasdasdasdasd</p>
        <p>1</p>
      </div>
      <div className="flex justify-between font-bold my-2">
        <p>2m Ago</p>
        <p className='w-1/3 truncate'>asdasdasdasdasdasdasdasdasdasdasdasdasdasd</p>
        <p>1</p>
      </div>
      <div className="flex justify-between font-bold my-2">
        <p>2m Ago</p>
        <p className='w-1/3 truncate'>asdasdasdasdasdasdasdasdasdasdasdasdasdasd</p>
        <p>1</p>
      </div>
      <div className="flex justify-between font-bold my-2">
        <p>2m Ago</p>
        <p className='w-1/3 truncate'>asdasdasdasdasdasdasdasdasdasdasdasdasdasd</p>
        <p>1</p>
      </div>
    </div>
  </div>

);

export default Recent;
