import { useEffect, useRef, useState } from "react";
import SkeletonItem from "./SkeletonItem";
import { addressToColor } from "../helpers";

const Skeleton: React.FC<{
  holders: Array<{ wallet: string; balance: number }>;
}> = ({ holders }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;
      setDimensions({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

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
      const margin = 20; // Extra space between skeletons
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
    <div className="w-full px-8 py-6" style={{ height: "calc(100vh - 100px)" }}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "85vh",
          background: "#374151",
          borderRadius: "0.5rem",
          overflowY: "auto", // Tambahkan scroll vertikal
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: "100%",
            paddingBottom: "100px", // Extra padding untuk space di bawah
          }}
        >
          {dimensions.width > 0 &&
            getPositions().map((item) => (
              <SkeletonItem
                key={item.wallet}
                address={item.wallet}
                size={item.balance}
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
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
