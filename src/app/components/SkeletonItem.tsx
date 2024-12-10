// components/Skeleton.tsx
import React from "react";

interface SkeletonProps {
  address: string;
  style?: React.CSSProperties;
  color: SkeletonColors;
  size: number;
  x: number;
  y: number;
}

interface SkeletonColors {
  hat: string;
  clothes: string;
  shoes: string;
}

const SkeletonItem: React.FC<SkeletonProps> = ({
  address,
  style,
  color,
  size,
  x,
  y,
}) => (
  <div
    style={{
      left: x,
      top: y,
      transform: "translate(0, 0)",
      ...style,
    }}
    className="group cursor-pointer"
  >
    <svg
      width={50 + Math.sqrt(size) * 10}
      height={50 + Math.sqrt(size) * 10}
      viewBox="0 0 57 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="11" y="46" width="34" height="71" fill={`${color.clothes}`} />
      <ellipse cx="28" cy="36" rx="17" ry="14" fill="#ffffff" />
      <path d="M28.5 0L47.1195 27H9.88045L28.5 0Z" fill={`${color.hat}`} />
      <circle cx="11.5" cy="123.5" r="11.5" fill={`${color.shoes}`} />
      <circle cx="45.5" cy="123.5" r="11.5" fill={`${color.shoes}`} />
    </svg>

    {/* Text below the SVG, only visible when hovering */}
    <div
      className="absolute z-10  mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity min-w-48 w-full bg-black bg-opacity-30 p-2 "
      style={{ width: "100%" }}
    >
      <p className=" text-black truncate">{address}</p>
      <p className=" text-black">{`${size} $SKELETON`}</p>
    </div>
  </div>
);

export default SkeletonItem;
