
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

const Skeleton: React.FC<{wallet: string; size: number, length:number }> = ({wallet, size, length}) => {
  const [skeletons, setSkeletons] = useState<Position[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const numSkeletons = length; // Number of skeletons
    const positions: Position[] = [];

    for (let i = 0; i < numSkeletons; i++) {
      let position: Position;
      let overlap = false;

    //   Ensure no overlap
    //   do {
    //     position = addressToPosition(wallet, 100);
    //     overlap = positions.some(
    //       (pos) => Math.abs(pos.x - position.x) < 100 && Math.abs(pos.y - position.y) < 100
    //     );
    //   } while (overlap);

      positions.push(addressToPosition(wallet, 100));
    }
    setSkeletons(positions);
  }, []);

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
      {skeletons.map((position, index) => (
        <SkeletonItem
          key={index}
          size={100} 
          color={{hat:addressToColor(wallet,0,6), clothes:addressToColor(wallet,7,13), shoes:addressToColor(wallet,14,20) }} 
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
          }}
        />
      ))}
    </div>
  );
};

export default Skeleton;