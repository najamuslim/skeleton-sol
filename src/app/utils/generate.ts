import { Holder, HolderData, OccupiedSpace } from "@/types";
import { clamp } from "./math";
// import { Quadtree, Rectangle } from "@timohausmann/quadtree-ts";

export type GeneratePositionsResult = {
  positions: HolderData[];
  occupiedSpaces: OccupiedSpace[];
};

// create pure functions

export function generatePositions(
  items: Holder[],
  occupiedSpaces: readonly OccupiedSpace[],
  containerWidth: number,
): Promise<GeneratePositionsResult> {
  console.log(`Processing ${items.length} holders...`);

  const spaces: OccupiedSpace[] = [...occupiedSpaces];

  // const quadTree = new Quadtree({
  //   width: containerWidth,
  //   height: containerWidth,
  //   maxObjects: 1,
  // });

  const doesOverlap = (x: number, y: number, width: number, height: number) => {
    const margin = 2;
    for (const space of spaces) {
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

    // try 100 times
    while (!foundPosition) {
      if (x + skeletonWidth > containerWidth) {
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

  // Process each holder in the chunk
  const positions: HolderData[] = [];

  for (let i = 0; i < items.length; i++) {
    const holder = items[i];

    // const size = 10 + Math.ceil(Math.sqrt(holder.balance / 1e9));
    const size = clamp(Math.random() * 300, 40, 300);
    const seed = parseInt(holder.wallet.slice(0, 8), 16);
    const rotation = Math.sin(seed * 0.1) * 180;

    // Find position ensuring no overlap
    const { x, y } = findValidPosition(size, size);
    // console.log(x, y);

    // Update occupiedSpaces first
    const newSpace = {
      x1: x,
      y1: y,
      x2: x + size,
      y2: y + size,
    };

    // update occupiedSpaces
    spaces.push(newSpace);

    // update quadTree
    // quadTree.insert(new Rectangle({ x, y, width: size, height: size }));

    const position = {
      wallet: holder.wallet,
      position: {
        x,
        y,
        size,
        rotation,
        balance: holder.balance,
      },
    };

    // Then set position
    positions.push(position);
  }

  return new Promise((resolve) => {
    resolve({ positions, occupiedSpaces: spaces });
  });
}
