// components/Skeleton.tsx
import React, { useEffect, useRef, useState } from "react";
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

interface SkeletonProps {
  address: string;
  style?: React.CSSProperties;
  color: SkeletonColors;
  size: number;
  x: number;
  y: number;
  isHighlighted?: boolean;
  percentage: number;
  appearance: SkeletonAppearance;
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

// Tambahkan konstanta untuk path options
const HAT_PATHS = {
  TRIANGLE: "M28.5 0L47.1195 27H9.88045L28.5 0Z",
  STAR: "M28.5 0L34.2251 17.6201L52.7519 17.6201L37.7634 28.5099L43.4885 46.1299L28.5 35.2401L13.5115 46.1299L19.2366 28.5099L4.24806 17.6201L22.7749 17.6201L28.5 0Z",
  HEXAGON: "M28.5 0L42.75 8.25V24.75L28.5 33L14.25 24.75V8.25L28.5 0Z",
};

const getHatPath = (address: string) => {
  // Gunakan karakter terakhir dari address untuk memilih path
  const lastChar = address.slice(-1);
  const charCode = lastChar.charCodeAt(0);

  // Bagi menjadi 3 kelompok berdasarkan charCode
  if (charCode % 3 === 0) {
    return HAT_PATHS.TRIANGLE;
  } else if (charCode % 3 === 1) {
    return HAT_PATHS.STAR;
  } else {
    return HAT_PATHS.HEXAGON;
  }
};

const SkeletonItem: React.FC<SkeletonProps> = ({
  address,
  style,
  color,
  size,
  x,
  y,
  isHighlighted,
  percentage,
  appearance,
}) => {
  console.log(appearance)

  const rotation = style?.transform?.match(/-?\d+/)?.[0] || 0;
  const hatPath = getHatPath(address);
  const [showTooltip, setShowTooltip] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrollLeft = document.documentElement.scrollLeft || window.scrollX;
        const scrollTop = document.documentElement.scrollTop || window.scrollY;

        setTooltipPosition({
          x: rect.left + rect.width / 2 + scrollLeft,
          y: rect.top + rect.height / 2 + scrollTop,
        });
      }
    };

    window.addEventListener("scroll", updateTooltipPosition, true);
    window.addEventListener("resize", updateTooltipPosition, true);
    updateTooltipPosition();

    return () => {
      window.removeEventListener("scroll", updateTooltipPosition, true);
      window.removeEventListener("resize", updateTooltipPosition, true);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      data-address={address}
      style={{
        left: x,
        top: y,
        position: "absolute",
        transform: `rotate(${rotation}deg)`,
      }}
      className="group cursor-pointer relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <svg
        width={40 + Math.sqrt(size) * 8}
        height={40 + Math.sqrt(size) * 8}
        viewBox="0 0 57 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${isHighlighted ? "highlight-skeleton" : ""} relative z-10`}
        style={{
          filter: isHighlighted
            ? "drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))"
            : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Base */}
        <BaseSkeleton />
        {/* Hat */}
        {renderAppearance('hat', appearance.hat, color)}
        {/* Clothes */}
        {renderAppearance('clothes', appearance.clothes, color)}
        {/* Shoes */}
        {renderAppearance('shoes', appearance.shoes, color)}
        {/* Shorts */}
        {renderAppearance('shorts', appearance.shorts, color)}
        {/* Fingers */}
        {renderAppearance('fingers', appearance.fingers, color)}
      </svg>

      {showTooltip &&
        createPortal(
          <div
            className="transition-opacity bg-black bg-opacity-60 p-2 rounded-lg backdrop-blur-sm fixed text-center"
            style={{
              position: "absolute",
              width: "150px",
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: `translate(-50%, -50%)`,
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <p className="text-white">
              {address.slice(0, 4)}...{address.slice(-4)}
            </p>
            <p className="text-white">{`${size.toFixed(2)} $SKELETON`}</p>
            <p className="text-white">{`${percentage.toFixed(2)}%`}</p>
          </div>,
          document.body
        )}
    </div>
  );
};


function renderAppearance(type: string, value: string, color: SkeletonColors) {
  switch (type) {
    case 'hat':
      switch (value) {
        case '1': return <Hats1 color={color.hat} />;
        case '2': return <Hats2 color={color.hat} />;
        case '3': return <Hats3 color={color.hat} />;
        case '4': return <Hats4 color={color.hat} />;
        default: return <Hats1 color={color.hat} />;
      }
    case 'clothes':
      switch (value) {
        case '1': return <Clothes1 color={color.clothes} />;
        case '2': return <Clothes2 color={color.clothes} />;
        case '3': return <Clothes3 color={color.clothes} />;
        case '4': return <Clothes4 color={color.clothes} />;
        case '5': return <Clothes5 color={color.clothes} />;
        default: return <Clothes1 color={color.clothes} />;
      }
    case 'shoes':
      switch (value) {
        case '1': return <Shoes1 color={color.shoes} />;
        case '2': return <Shoes2 color={color.shoes} />;
        case '3': return <Shoes3 color={color.shoes} />;
        case '4': return <Shoes4 color={color.shoes} />;
        default: return <Shoes1 color={color.shoes} />;
      }
    case 'shorts':
      switch (value) {
        case '1': return <Shorts1 color={color.shorts} />;
        case '2': return <Shorts2 color={color.shorts} />;
        case '3': return <Shorts3 color={color.shorts} />;
        case '4': return <Shorts4 color={color.shorts} />;
        case '5': return <Shorts5 color={color.shorts} />;
        default: return <Shorts1 color={color.shorts} />;
      }
    case 'fingers':
      switch (value) {
        case '1': return <Fingers1 />;
        case '2': return <Fingers2 />;
        case '3': return <Fingers3 />;
        case '4': return <Fingers4 />;
        case '5': return <Fingers5 />;
        case '6': return <Fingers6 />;
        case '7': return <Fingers7 />;
        default: return <Fingers1 />;
      }
    default:
      return <div>Component type {type} not recognized</div>;
  }
}

export default SkeletonItem;
