import { useEffect, useRef, useState } from "react";

interface Skeleton {
  x: number;
  y: number;
  size: number;
  color: string;
  wallet: string;
}

interface CanvasSkeletonsProps {
  skeletons: Skeleton[];
}

const CanvasSkeletons: React.FC<CanvasSkeletonsProps> = ({ skeletons }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredSkeletonIndex, setHoveredSkeletonIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw skeletons
    skeletons.forEach(({ x, y, size, color,wallet }, index) => {
      // Apply smooth transition by interpolating size and color
      const isHovered = index === hoveredSkeletonIndex;
      const transitionSize = isHovered ? size * 1.2 : size; // Increase size on hover
      const transitionColor = isHovered ? "orange" : color; // Change color on hover

      ctx.beginPath();
      ctx.arc(x, y, transitionSize, 0, Math.PI * 2, false);
      ctx.fillStyle = transitionColor;
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
      // Draw text when hovering over a skeleton
      if (index === hoveredSkeletonIndex) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(wallet, x + size + 5, y);
      }
    });
  }, [skeletons, hoveredSkeletonIndex]);

  const handleMouseMove = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the mouse is hovering over any skeleton
    let isHoveringOverSkeleton = false;
    let hoveredIndex: number | null = null;

    skeletons.forEach(({ x, y, size }, index) => {
      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      if (distance <= size) {
        isHoveringOverSkeleton = true;
        hoveredIndex = index;
      }
    });

    setHoveredSkeletonIndex(isHoveringOverSkeleton ? hoveredIndex : null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [skeletons]);

  return (
    <canvas
      ref={canvasRef}
      width={1000} // Set width of canvas
      height={700} // Set height of canvas
      style={{ border: "1px solid black" }}
    ></canvas>
  );
};

export default CanvasSkeletons;
