import React from "react";

const Flower = ({ wallet, size }: { wallet: string; size: number }) => {
  const hash = wallet; // Use the wallet address as the hash seed
  const petalCount = (parseInt(hash.slice(0, 2), 16) % 12) + 3; // Generate 3-14 petals
  const color = `#${hash.slice(-6)}`; // Generate a color based on the wallet

  return (
    <svg width={size} height={size}>
      {[...Array(petalCount)].map((_, i) => {
        const angle = (i * 360) / petalCount; // Distribute petals evenly
        const x = size / 2 + (size / 3) * Math.cos((angle * Math.PI) / 180);
        const y = size / 2 + (size / 3) * Math.sin((angle * Math.PI) / 180);

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="10"
            fill={color}
            transform={`rotate(${angle} ${size / 2} ${size / 2})`}
          />
        );
      })}
      <circle cx={size / 2} cy={size / 2} r="20" fill={color} />
    </svg>
  );
};

export default Flower;
