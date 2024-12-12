// components/Skeleton.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface SkeletonProps {
  address: string;
  style?: React.CSSProperties;
  color: SkeletonColors;
  size: number;
  x: number;
  y: number;
  isHighlighted?: boolean;
  percentage: number;
}

interface SkeletonColors {
  hat: string;
  clothes: string;
  shoes: string;
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
}) => {
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
        <rect
          x="11"
          y="46"
          width="34"
          height="71"
          fill={`${color.clothes}`}
          className={isHighlighted ? "animate-pulse" : ""}
        />
        <ellipse cx="28" cy="36" rx="17" ry="14" fill="#ffffff" />
        <path d={hatPath} fill={`${color.hat}`} />
        <circle cx="11.5" cy="123.5" r="11.5" fill={`${color.shoes}`} />
        <circle cx="45.5" cy="123.5" r="11.5" fill={`${color.shoes}`} />
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

export default SkeletonItem;
