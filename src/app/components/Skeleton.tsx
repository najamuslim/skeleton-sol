
import { useEffect, useRef, useState } from 'react';
import SkeletonItem from './SkeletonItem';
import { addressToColor, addressToPosition } from '../helpers';


const Skeleton: React.FC<{holders: Array<{ wallet: string; balance: number }> }> = ({holders}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        // overflow: 'hidden',
      }}
      className='bg-zinc-700 '
    >
      {holders.map((item, index) => (
        <SkeletonItem
          key={item.wallet}
          address={item.wallet}
          size={item.balance} 
          x={addressToPosition(item.wallet, 0, 8,'width')}
          y={addressToPosition(item.wallet, 8, 14, 'height')}
          color={{hat:addressToColor(item.wallet,0,6), clothes:addressToColor(item.wallet,6,12), shoes:addressToColor(item.wallet,12,18)}} 
          style={{
            position: 'absolute'
          }}
        />
      ))}
    </div>
  );
};

export default Skeleton;