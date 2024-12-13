/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import SkeletonItem from "./SkeletonItem";
import { addressToColor } from "../helpers";

const Skeleton: React.FC<{
  holders: any;
  searchedAddress: string | null;
  supply: number | null;
}> = ({ holders, searchedAddress, supply }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchedAddress) {
      const skeletonElement = document.querySelector(
        `[data-address="${searchedAddress}"]`
      );
      if (skeletonElement) {
        skeletonElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [searchedAddress]);

  return (
    <div className="flex-1 relative bg-[url('/grain.png')] bg-cover pb-20 pt-4">
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "90%",
          margin: "0px auto",
          height: "100%",
          borderRadius: "0.5rem",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            position: "relative",
            padding: "40px 0",
          }}
        >
          {Array.from(Object.entries(holders)).map(([wallet, position]: [string, any]) => (
            <SkeletonItem
              key={wallet}
              address={wallet}
              size={position.balance * 0.7}
              x={position.x}
              y={position.y}
              color={{
                hat: addressToColor(wallet, 0, 6),
                clothes: addressToColor(wallet, 6, 12),
                shoes: addressToColor(wallet, 12, 18),
              }}
              style={{
                position: "absolute",
                transform: `rotate(${position.rotation}deg)`,
              }}
              isHighlighted={searchedAddress === wallet}
              percentage={supply ? (position.balance / supply) * 100 : 0}
            />
          ))}
        </div>
      </div>
      <img
        src="/frame.png"
        alt="Frame"
        className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

export default Skeleton;
