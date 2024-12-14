import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import SkeletonItem from "./SkeletonItem";
import { addressToColor } from "../helpers";

const Skeleton: React.FC<{
  holders: Array<{ wallet: string; balance: number }>;
  searchedAddress: string | null;
  supply: number | null;
}> = ({ holders, searchedAddress, supply }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Calculate estimated row height based on your layout needs
  const estimatedRowHeight = 100; // Adjust based on your needs
  const estimatedColumnCount = 4; // Number of items per row

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(holders.length / estimatedColumnCount),
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 5, // Number of items to render outside the viewport
  });

  useEffect(() => {
    if (parentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setParentDimensions({ width, height });
      });

      resizeObserver.observe(parentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    if (searchedAddress) {
      const index = holders.findIndex(
        (holder) => holder.wallet === searchedAddress
      );
      if (index !== -1) {
        const rowIndex = Math.floor(index / estimatedColumnCount);
        rowVirtualizer.scrollToIndex(rowIndex);
      }
    }
  }, [searchedAddress, holders, rowVirtualizer]);

  const getPositions = (index: number) => {
    const column = index % estimatedColumnCount;
    const x = column * (parentDimensions.width / estimatedColumnCount);
    const y = Math.floor(index / estimatedColumnCount) * estimatedRowHeight;
    return { x, y };
  };

  return (
    <div
      ref={parentRef}
      style={{
        height: "100vh",
        overflow: "auto",
        position: "relative",
        background: "var(--background)",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * estimatedColumnCount;
          const endIndex = Math.min(
            startIndex + estimatedColumnCount,
            holders.length
          );

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {holders
                .slice(startIndex, endIndex)
                .map((holder, columnIndex) => {
                  const absoluteIndex = startIndex + columnIndex;
                  const { x, y } = getPositions(absoluteIndex);
                  const seed = parseInt(holder.wallet.slice(0, 8), 16);
                  const rotation = Math.sin(seed * 0.1) * 180;
                  const size = 50 + Math.sqrt(holder.balance) * 10;

                  return (
                    <SkeletonItem
                      key={holder.wallet}
                      address={holder.wallet}
                      size={size}
                      x={x}
                      y={y - virtualRow.start} // Adjust y position relative to virtual row
                      color={{
                        hat: addressToColor(holder.wallet, 0, 6),
                        clothes: addressToColor(holder.wallet, 6, 12),
                        shoes: addressToColor(holder.wallet, 12, 18),
                      }}
                      style={{
                        position: "absolute",
                        transform: `rotate(${rotation}deg)`,
                      }}
                      isHighlighted={searchedAddress === holder.wallet}
                      percentage={supply ? (holder.balance / supply) * 100 : 0}
                    />
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skeleton;
