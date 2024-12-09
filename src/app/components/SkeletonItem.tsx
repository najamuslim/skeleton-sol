// components/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  style?: React.CSSProperties;
  color: SkeletonColors,
  size: number,
  x: number,
  y: number,
}

interface SkeletonColors {
  hat: string,
  clothes: string,
  shoes: string,
}

const SkeletonItem: React.FC<SkeletonProps> = ({ style, color, size, x, y }) => (
  <div
    style={{
      left: x,
      right: y,
      ...style
    }}
  >

    <svg width="57" height="135" viewBox="0 0 57 135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="46" width="34" height="71" fill={`${color.clothes}`} />
      <ellipse cx="28" cy="36" rx="17" ry="14" fill="#ffffff" />
      <path d="M28.5 0L47.1195 27H9.88045L28.5 0Z" fill={`${color.hat}`} />
      <circle cx="11.5" cy="123.5" r="11.5" fill={`${color.shoes}`} />
      <circle cx="45.5" cy="123.5" r="11.5" fill={`${color.shoes}`} />
    </svg>

  </div>
);

export default SkeletonItem;
