import { useEffect, useRef, useState } from "react";
import SkeletonItem from "./SkeletonItem";
import { addressToColor } from "../helpers";

const Skeleton: React.FC<{
  holders: Array<{ wallet: string; balance: number }>;
  searchedAddress: string | null;
  supply: number | null;
}> = ({ holders, searchedAddress, supply }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (searchedAddress) {
      const skeletonElement = document.querySelector(
        `[data-address="${searchedAddress}"]`
      );
      if (skeletonElement) {
        skeletonElement.scrollIntoView({ behavior: "smooth", block: "center" });
        skeletonElement.classList.add("highlight-skeleton");
        setTimeout(() => {
          skeletonElement.classList.remove("highlight-skeleton");
        }, 2000);
      }
    }
  }, [searchedAddress]);

  const getPositions = () => {
    const positions: Array<{
      x: number;
      y: number;
      wallet: string;
      balance: number;
      rotation: number;
    }> = [];

    // Track occupied spaces with rectangles
    const occupiedSpaces: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }> = [];

    const doesOverlap = (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      const margin = 2; // Extra space between skeletons
      for (const space of occupiedSpaces) {
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

    const findValidPosition = (
      skeletonWidth: number,
      skeletonHeight: number
    ) => {
      let x = 0;
      let y = 0;
      let foundPosition = false;

      while (!foundPosition) {
        if (x + skeletonWidth > dimensions.width) {
          x = 0;
          y += 100; // Move to next row
        }

        if (!doesOverlap(x, y, skeletonWidth, skeletonHeight)) {
          foundPosition = true;
        } else {
          x += 50; // Try next position
        }
      }

      return { x, y };
    };

    holders.forEach((holder) => {
      const skeletonSize = 50 + Math.sqrt(holder.balance) * 10;
      const seed = parseInt(holder.wallet.slice(0, 8), 16);
      const rotation = Math.sin(seed * 0.1) * 180; // Will give smooth random angles between -180 and 180

      const { x, y } = findValidPosition(skeletonSize, skeletonSize);

      positions.push({
        x,
        y,
        wallet: holder.wallet,
        balance: holder.balance,
        rotation,
      });

      // Mark space as occupied
      occupiedSpaces.push({
        x1: x,
        y1: y,
        x2: x + skeletonSize,
        y2: y + skeletonSize,
      });
    });

    return positions;
  };

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
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            padding: "40px 0",
          }}
        >
          {dimensions.width > 0 &&
            getPositions().map((item) => (
              <SkeletonItem
                key={item.wallet}
                address={item.wallet}
                size={item.balance * 0.7}
                x={item.x}
                y={item.y}
                color={{
                  hat: addressToColor(item.wallet, 0, 6),
                  clothes: addressToColor(item.wallet, 6, 12),
                  shoes: addressToColor(item.wallet, 12, 18),
                }}
                style={{
                  position: "absolute",
                  transform: `rotate(${item.rotation}deg)`,
                }}
                isHighlighted={searchedAddress === item.wallet}
                percentage={supply ? (item.balance / supply) * 100 : 0}
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
