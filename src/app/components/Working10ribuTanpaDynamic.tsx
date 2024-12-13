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
  const [allPositions, setAllPositions] = useState<
    Map<
      string,
      {
        x: number;
        y: number;
        size: number;
        rotation: number;
        balance: number;
      }
    >
  >(new Map());

  // Chunking data untuk mengurangi beban kalkulasi
  const CHUNK_SIZE = 100; // Jumlah holder yang diproses per chunk
  const [processedChunks, setProcessedChunks] = useState(0);

  const occupiedSpaces = useRef<
    Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }>
  >([]);

  // Memproses posisi secara bertahap menggunakan chunks
  useEffect(() => {
    if (dimensions.width === 0) return;

    const processNextChunk = () => {
      const startIdx = processedChunks * CHUNK_SIZE;
      const endIdx = Math.min(startIdx + CHUNK_SIZE, holders.length);

      if (startIdx >= holders.length) return;

      const newPositions = new Map(allPositions);

      holders.slice(startIdx, endIdx).forEach((holder) => {
        if (newPositions.has(holder.wallet)) return;

        const size = 50 + Math.sqrt(holder.balance) * 10;
        const seed = parseInt(holder.wallet.slice(0, 8), 16);
        const rotation = Math.sin(seed * 0.1) * 180;

        const { x, y } = findValidPosition(size, size);

        newPositions.set(holder.wallet, {
          x,
          y,
          size,
          rotation,
          balance: holder.balance,
        });
        occupiedSpaces.current.push({
          x1: x,
          y1: y,
          x2: x + size,
          y2: y + size,
        });
      });

      setAllPositions(newPositions);
      setProcessedChunks((prev) => prev + 1);
    };

    const processChunkInIdle = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
          processNextChunk();
        });
      } else {
        setTimeout(processNextChunk, 0);
      }
    };

    processChunkInIdle();
  }, [dimensions.width, holders, processedChunks]);

  // Fungsi helper yang sudah ada
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

  const findValidPosition = (skeletonWidth: number, skeletonHeight: number) => {
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
          {dimensions.width > 0 &&
            Array.from(allPositions.entries()).map(([wallet, item]) => (
              <SkeletonItem
                key={wallet}
                address={wallet}
                size={item.balance * 0.7}
                x={item.x}
                y={item.y}
                color={{
                  hat: addressToColor(wallet, 0, 6),
                  clothes: addressToColor(wallet, 6, 12),
                  shoes: addressToColor(wallet, 12, 18),
                }}
                style={{
                  position: "absolute",
                  transform: `rotate(${item.rotation}deg)`,
                }}
                isHighlighted={searchedAddress === wallet}
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
