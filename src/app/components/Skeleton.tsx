import React, { useEffect, useMemo, useRef, useState } from "react";
import SkeletonItem from "./SkeletonItem";
import { addressToColor, getFingers, getDynamicAppearance } from "../helpers";
import { HolderData } from "@/types";
import { throttle } from "lodash";
import { $containerWidth, $scrollTop, $worker } from "../stores/holders";

const Skeleton: React.FC<{
  holders: Array<HolderData>;
  searchedAddress: string | null;
  supply: number | null;
  height: number;
}> = ({ holders, searchedAddress, supply, height }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // create web worker and store
  useEffect(() => {
    const worker = new Worker(new URL("../workers/worker.ts", import.meta.url));
    $worker.set(worker);

    // Clean up the worker when the component unmounts
    return () => {
      worker.terminate();
      $worker.set(null);
    };
  }, []);

  // update width of the viewport
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        $containerWidth.set(containerRef.current.offsetWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   const updateDimensions = () => {
  //     if (containerRef.current) {
  //       setDimensions({
  //         width: containerRef.current.offsetWidth,
  //         height: containerRef.current.offsetHeight,
  //       });
  //     }
  //   };
  //
  //   updateDimensions();
  //   window.addEventListener("resize", updateDimensions);
  //   return () => window.removeEventListener("resize", updateDimensions);
  // }, []);

  // useEffect(() => {
  //   if (searchedAddress) {
  //     const skeletonElement = document.querySelector(
  //       `[data-address="${searchedAddress}"]`,
  //     );
  //     if (skeletonElement) {
  //       skeletonElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //       skeletonElement.classList.add("highlight-skeleton");
  //       setTimeout(() => {
  //         skeletonElement.classList.remove("highlight-skeleton");
  //       }, 2000);
  //     }
  //   }
  // }, [searchedAddress]);

  // const itemsRef = useRef<Array<HTMLDivElement>>([]);

  const [viewportTop, setViewportTop] = useState(0);

  const viewportBottom = useMemo(() => {
    return viewportTop + (containerRef.current?.offsetHeight || 800);
  }, [viewportTop, containerRef]);

  // scroll handle
  const onScroll = useMemo(
    () =>
      throttle(
        () => {
          const viewportTop = containerRef.current?.scrollTop || 0;
          setViewportTop(viewportTop);
          $scrollTop.set(viewportTop); // also save to store
        },
        100,
        { leading: false },
      ),
    [],
  );

  // filter holders data which are visible in viewport
  const visibleItems = useMemo(() => {
    return holders.filter((item) => {
      const itemTop = item.position.y;
      const itemBottom = item.position.y + item.position.size;

      const safeArea = 0; // we can also add some safe area to avoid clipping
      const top = viewportTop - safeArea;
      const bottom = viewportBottom + safeArea;

      if (itemBottom >= top && itemTop <= bottom) {
        return true;
      } else {
        return false;
      }
    });
  }, [holders, viewportTop, viewportBottom]);

  // render item based on visibleItems
  const renderItems = useMemo(() => {
    return visibleItems.map((item) => {
      const { wallet, position } = item;
      return (
        <SkeletonItem
          // ref={(el) => {
          //   if (el) {
          //     itemsRef.current[i] = el;
          //   }
          // }}
          key={wallet}
          address={wallet}
          // size={position.balance * 0.7}
          size={position.size}
          x={position.x}
          y={position.y}
          color={{
            hat: addressToColor(wallet, 0, 6),
            clothes: addressToColor(wallet, 6, 12),
            shoes: addressToColor(wallet, 12, 18),
            shorts: addressToColor(wallet, 18, 24),
          }}
          appearance={{
            hat: getDynamicAppearance(wallet, 0, 6),
            clothes: getDynamicAppearance(wallet, 6, 12),
            shoes: getDynamicAppearance(wallet, 12, 18),
            shorts: getDynamicAppearance(wallet, 18, 24),
            fingers: getFingers(wallet, 24, 31),
          }}
          style={{
            position: "absolute",
            transform: `rotate(${position.rotation}deg)`,
          }}
          isHighlighted={searchedAddress === wallet}
          percentage={supply ? (position.balance / supply) * 100 : 0}
        />
      );
    });
  }, [visibleItems, searchedAddress, supply]);

  return (
    <div className="flex-1 relative bg-[url('/grain.png')] bg-cover pb-20 pt-4">
      <div
        ref={containerRef}
        id="skeletonContainer"
        onScroll={onScroll}
        style={{
          position: "relative",
          width: "90%",
          margin: "0px auto",
          maxHeight: "calc(100vh - 90px - 16px - 80px)",
          borderRadius: "0.5rem",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
        className="scrollbar"
      >
        <div
          style={{
            position: "relative",
            height: height,
            padding: "40px 0",
          }}
        >
          {renderItems}
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
