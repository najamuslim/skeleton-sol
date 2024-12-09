
import { useEffect, useRef, useState } from 'react';
import SkeletonItem from './SkeletonItem';
import { addressToColor, addressToPosition } from '../helpers';
interface Position {
  x: number;
  y: number;
}

const generateRandomPosition = (containerWidth: number, containerHeight: number): Position => {
  const width = 100; // Skeleton width
  const height = 100; // Skeleton height
  const x = Math.random() * (containerWidth - width);
  const y = Math.random() * (containerHeight - height);

  return { x, y };
};

const Skeleton: React.FC<{holders: Array<{ wallet: string; balance: number }> }> = ({holders}) => {
  const [skeletons, setSkeletons] = useState<Position[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     // const numSkeletons = length; // Number of skeletons
//     // const positions: Position[] = [];

//     // for (let i = 0; i < numSkeletons; i++) {
//     //   let position: Position;
//     //   let overlap = false;

//     //   Ensure no overlap
//     //   do {
//     //     position = addressToPosition(wallet, 100);
//     //     overlap = positions.some(
//     //       (pos) => Math.abs(pos.x - position.x) < 100 && Math.abs(pos.y - position.y) < 100
//     //     );
//     //   } while (overlap);

//       positions.push(addressToPosition(wallet, 100));
//     }
//     setSkeletons(positions);
//   }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '1000px',
        overflow: 'hidden',
      }}
      className='bg-zinc-700'
    >
      {holders.map((item, index) => (
        <SkeletonItem
          key={item.wallet}
          size={item.balance} 
          x={addressToPosition(item.wallet,100,0,8)}
          y={addressToPosition(item.wallet,100,8,14)}
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