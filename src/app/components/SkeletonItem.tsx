// components/Skeleton.tsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import BaseSkeleton from "../constants/skeletons/base";
import Clothes5 from "../constants/skeletons/clothes/Clothes5";
import Fingers7 from "../constants/skeletons/fingers/Fingers7";
import Hats5 from "../constants/skeletons/hats/Hats5";
import Shorts5 from "../constants/skeletons/shorts/Shorts5";
import Shoes5 from "../constants/skeletons/shoes/Shoes5";
import Fingers1 from "../constants/skeletons/fingers/Fingers1";
import Shorts4 from "../constants/skeletons/shorts/Shorts4";
import Shorts3 from "../constants/skeletons/shorts/Shorts3";
import Hats1 from "../constants/skeletons/hats/Hats1";
import Hats2 from "../constants/skeletons/hats/Hats2";
import Hats3 from "../constants/skeletons/hats/Hats3";
import Clothes2 from "../constants/skeletons/clothes/Clothes2";
import Clothes1 from "../constants/skeletons/clothes/Clothes1";
import Clothes3 from "../constants/skeletons/clothes/Clothes3";
import Hats4 from "../constants/skeletons/hats/Hats4";
import Clothes4 from "../constants/skeletons/clothes/Clothes4";
import Shoes1 from "../constants/skeletons/shoes/Shoes1";
import Shoes4 from "../constants/skeletons/shoes/Shoes4";
import Shoes2 from "../constants/skeletons/shoes/Shoes2";
import Shoes3 from "../constants/skeletons/shoes/Shoes3";
import Shorts1 from "../constants/skeletons/shorts/Shorts1";
import Shorts2 from "../constants/skeletons/shorts/Shorts2";
import Fingers3 from "../constants/skeletons/fingers/Fingers3";
import Fingers4 from "../constants/skeletons/fingers/Fingers4";
import Fingers5 from "../constants/skeletons/fingers/Fingers5";
import Fingers6 from "../constants/skeletons/fingers/Fingers6";
import Fingers2 from "../constants/skeletons/fingers/Fingers2";
import classNames from "classnames";
import { $holdersData } from "../stores/holders";

interface SkeletonProps {
  address: string;
  style?: React.CSSProperties;
  color: SkeletonColors;
  size: number;
  balance: number;
  x: number;
  y: number;
  isHighlighted?: boolean;
  percentage: number;
  appearance: SkeletonAppearance;
  ref?: React.Ref<HTMLDivElement>;
}

interface SkeletonColors {
  hat: string;
  clothes: string;
  shoes: string;
  shorts: string;
}
interface SkeletonAppearance {
  hat: string;
  clothes: string;
  shoes: string;
  shorts: string;
  fingers: string;
}

const SkeletonItem: React.FC<SkeletonProps> = ({
  address,
  style,
  color,
  size,
  balance,
  x,
  y,
  isHighlighted,
  percentage,
  appearance,
  ref,
}) => {
  // console.log(appearance)

  const rotation = style?.transform?.match(/-?\d+/)?.[0] || 0;
  const [showTooltip, setShowTooltip] = useState(false);
  // const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    }, 50);
  }, []);

  // useEffect(() => {
  //   const updateTooltipPosition = () => {
  //     if (elementRef.current) {
  //       const rect = elementRef.current.getBoundingClientRect();
  //       const scrollLeft =
  //         document.documentElement.scrollLeft || window.scrollX;
  //       const scrollTop = document.documentElement.scrollTop || window.scrollY;
  //
  //       setTooltipPosition({
  //         x: rect.left + rect.width / 2 + scrollLeft,
  //         y: rect.top + rect.height / 2 + scrollTop,
  //       });
  //     }
  //   };
  //
  //   window.addEventListener("scroll", updateTooltipPosition, true);
  //   window.addEventListener("resize", updateTooltipPosition, true);
  //   updateTooltipPosition();
  //
  //   return () => {
  //     window.removeEventListener("scroll", updateTooltipPosition, true);
  //     window.removeEventListener("resize", updateTooltipPosition, true);
  //   };
  // }, []);

  return (
    <div
      ref={ref}
      data-address={address}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
      className="absolute group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => {
        const idx = $holdersData
          .get()
          .findIndex((holder) => holder.wallet === address);
        console.log("skeleton index:", idx, address);
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          className={classNames("absolute inset-0 transition duration-200", {
            "scale-0": !isShow,
            "scale-125": isShow,
          })}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 108 108"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute ${isHighlighted ? "highlight-skeleton" : ""} relative z-10`}
            style={{
              filter: isHighlighted
                ? "drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))"
                : "none",
              // transition: "all 0.3s ease",
            }}
          >
            <BaseSkeleton />
          </svg>

          {renderAppearance("hat", appearance.hat, color)}
          {renderAppearance("clothes", appearance.clothes, color)}
          {renderAppearance("shoes", appearance.shoes, color)}
          {renderAppearance("shorts", appearance.shorts, color)}
          {renderAppearance("fingers", appearance.fingers, color)}
        </div>
      </div>

      {showTooltip && (
        <div
          className="transition-opacity bg-black bg-opacity-60 p-2 rounded-lg backdrop-blur-sm fixed text-center"
          style={{
            position: "absolute",
            width: "150px",
            // left: tooltipPosition.x,
            // top: tooltipPosition.y,
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%)`,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <p className="text-white">
            {address.slice(0, 4)}...{address.slice(-4)}
          </p>
          <p className="text-white">{`${balance.toFixed(2)} $SKELLY`}</p>
          <p className="text-white">{`${percentage < 0.01 ? "<0.01" : percentage.toFixed(2)}%`}</p>
        </div>
      )}
    </div>
  );
};

function renderAppearance(type: string, value: string, color: SkeletonColors) {
  switch (type) {
    case "hat":
      switch (value) {
        case "1":
          return <Hats1 color={color.hat} />;
        case "2":
          return <Hats2 color={color.hat} />;
        case "3":
          return <Hats3 color={color.hat} />;
        case "4":
          return <Hats4 color={color.hat} />;
        default:
          return <Hats1 color={color.hat} />;
      }
    case "clothes":
      switch (value) {
        case "1":
          return <Clothes1 color={color.clothes} />;
        case "2":
          return <Clothes2 color={color.clothes} />;
        case "3":
          return <Clothes3 color={color.clothes} />;
        case "4":
          return <Clothes4 color={color.clothes} />;
        case "5":
          return <Clothes5 color={color.clothes} />;
        default:
          return <Clothes1 color={color.clothes} />;
      }
    case "shoes":
      switch (value) {
        case "1":
          return <Shoes1 color={color.shoes} />;
        case "2":
          return <Shoes2 color={color.shoes} />;
        case "3":
          return <Shoes3 color={color.shoes} />;
        case "4":
          return <Shoes4 color={color.shoes} />;
        default:
          return <Shoes1 color={color.shoes} />;
      }
    case "shorts":
      switch (value) {
        case "1":
          return <Shorts1 color={color.shorts} />;
        case "2":
          return <Shorts2 color={color.shorts} />;
        case "3":
          return <Shorts3 color={color.shorts} />;
        case "4":
          return <Shorts4 color={color.shorts} />;
        case "5":
          return <Shorts5 color={color.shorts} />;
        default:
          return <Shorts1 color={color.shorts} />;
      }
    case "fingers":
      switch (value) {
        case "1":
          return <Fingers1 />;
        case "2":
          return <Fingers2 />;
        case "3":
          return <Fingers3 />;
        case "4":
          return <Fingers4 />;
        case "5":
          return <Fingers5 />;
        case "6":
          return <Fingers6 />;
        case "7":
          return <Fingers7 />;
        default:
          return <Fingers1 />;
      }
    default:
      return <div>Component type {type} not recognized</div>;
  }
}

export default SkeletonItem;
