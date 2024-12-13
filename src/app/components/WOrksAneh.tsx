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
  const [positions, setPositions] = useState<
    Map<string, { x: number; y: number; rotation: number }>
  >(new Map());

  // Menyimpan posisi yang sudah terpakai
  const occupiedSpaces = useRef<
    Array<{ x1: number; y1: number; x2: number; y2: number }>
  >([]);

  const ROW_HEIGHT = 100;
  const ITEMS_PER_ROW = 4;

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(holders.length / ITEMS_PER_ROW),
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  // Fungsi untuk mengecek overlap
  const doesOverlap = (x: number, y: number, width: number, height: number) => {
    const margin = 2;
    for (const space of occupiedSpaces.current) {
      if (
        !(
          x + width + margin < space.x1 ||
          x - margin > space.x2 ||
          y + height + margin < space.y1 ||
          y - margin > space.y2
        )
      ) {
        return true;
      }
    }
    return false;
  };

  // Fungsi untuk mencari posisi valid
  const findValidPosition = (
    skeletonWidth: number,
    skeletonHeight: number,
    rowStart: number,
    rowEnd: number
  ) => {
    let x = 0;
    let y = rowStart;
    let foundPosition = false;

    while (!foundPosition && y < rowEnd) {
      if (x + skeletonWidth > parentDimensions.width) {
        x = 0;
        y += 50; // Increment lebih kecil untuk positioning yang lebih halus
      }

      if (!doesOverlap(x, y, skeletonWidth, skeletonHeight)) {
        foundPosition = true;
      } else {
        x += 50;
      }
    }

    return foundPosition ? { x, y } : null;
  };

  // Calculate positions when dimensions or holders change
  useEffect(() => {
    if (parentDimensions.width === 0) return;

    const newPositions = new Map();
    occupiedSpaces.current = [];

    holders.forEach((holder) => {
      const size = 50 + Math.sqrt(holder.balance) * 10;
      const seed = parseInt(holder.wallet.slice(0, 8), 16);
      const rotation = Math.sin(seed * 0.1) * 180;

      const rowIndex = Math.floor(holders.indexOf(holder) / ITEMS_PER_ROW);
      const rowStart = rowIndex * ROW_HEIGHT;
      const rowEnd = rowStart + ROW_HEIGHT;

      const position = findValidPosition(size, size, rowStart, rowEnd);

      if (position) {
        newPositions.set(holder.wallet, {
          ...position,
          rotation,
        });

        occupiedSpaces.current.push({
          x1: position.x,
          y1: position.y,
          x2: position.x + size,
          y2: position.y + size,
        });
      }
    });

    setPositions(newPositions);
  }, [parentDimensions.width, holders]);

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

  return (
    <div className="flex-1 relative bg-[url('/grain.png')] bg-cover">
      {/* Background pattern stays fixed */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/frame.png"
          alt="Frame"
          className="absolute top-0 w-full object-cover"
        />
      </div>

      {/* Scrollable content area in the middle */}
      <div className="absolute inset-x-0 top-[100px] bottom-[100px] mx-auto max-w-[90%]">
        <div
          ref={parentRef}
          className="h-full w-full overflow-auto relative"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
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
              const startIndex = virtualRow.index * ITEMS_PER_ROW;
              const endIndex = Math.min(
                startIndex + ITEMS_PER_ROW,
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
                  {holders.slice(startIndex, endIndex).map((holder) => {
                    const position = positions.get(holder.wallet);
                    if (!position) return null;

                    const size = 50 + Math.sqrt(holder.balance) * 10;

                    return (
                      <SkeletonItem
                        key={holder.wallet}
                        address={holder.wallet}
                        size={size}
                        x={position.x}
                        y={position.y - virtualRow.start}
                        color={{
                          hat: addressToColor(holder.wallet, 0, 6),
                          clothes: addressToColor(holder.wallet, 6, 12),
                          shoes: addressToColor(holder.wallet, 12, 18),
                        }}
                        style={{
                          position: "absolute",
                          transform: `rotate(${position.rotation}deg)`,
                        }}
                        isHighlighted={searchedAddress === holder.wallet}
                        percentage={
                          supply ? (holder.balance / supply) * 100 : 0
                        }
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom frame stays fixed */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/frame.png"
          alt="Frame"
          className="absolute bottom-0 w-full object-cover object-bottom"
        />
      </div>
    </div>
  );
};

export default Skeleton;
