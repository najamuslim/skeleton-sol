// components/Skeleton.tsx
import React from "react";

interface SkeletonProps {
  address: string;
  style?: React.CSSProperties;
  color: SkeletonColors;
  size: number;
  x: number;
  y: number;
  isHighlighted?: boolean;
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
  HEXAGON: "M28.5 0L42.75 8.25V24.75L28.5 33L14.25 24.75V8.25L28.5 0Z"
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
}) => {
  const rotation = style?.transform?.match(/-?\d+/)?.[0] || 0;
  const hatPath = getHatPath(address);
  
  return (
    <div
      data-address={address}
      style={{
        left: x,
        top: y,
        position: "absolute",
        transform: `rotate(${rotation}deg)`,
      }}
      className="group cursor-pointer"
    >
      <svg
        width={40 + Math.sqrt(size) * 8}
        height={40 + Math.sqrt(size) * 8}
        viewBox="0 0 57 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isHighlighted ? 'highlight-skeleton' : ''}
        style={{
          filter: isHighlighted ? 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <rect 
          x="11" 
          y="46" 
          width="34" 
          height="71" 
          fill={`${color.clothes}`}
          className={isHighlighted ? 'animate-pulse' : ''}
        />
        <ellipse cx="28" cy="36" rx="17" ry="14" fill="#ffffff" />
        <path d={hatPath} fill={`${color.hat}`} />
        <circle cx="11.5" cy="123.5" r="11.5" fill={`${color.shoes}`} />
        <circle cx="45.5" cy="123.5" r="11.5" fill={`${color.shoes}`} />
      </svg>

      <div
        className="absolute text-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 p-2"
        style={{
          width: "200px",
          left: "50%",
          transform: `translateX(-50%) translateY(-50%) rotate(${-rotation}deg)`,
          top: "50%",
          marginLeft: "-100px",
          zIndex: 9999,
        }}
      >
        <p className="text-white truncate">{address}</p>
        <p className="text-white">{`${size} $SKELETON`}</p>
      </div>
    </div>
  );
};

export default SkeletonItem;
