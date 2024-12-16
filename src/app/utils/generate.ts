import { Holder, HolderData, OccupiedSpace } from "@/types";
import { clamp, mapRange } from "./math";
import log from "./log";

function mapPercentSize(value: number) {
  if (value <= 0.004) {
    return 49;
  }
  if (value <= 0.008) {
    return 74;
  }
  if (value <= 0.05) {
    return 98;
  }
  if (value <= 0.1) {
    return 123;
  }
  if (value <= 0.3) {
    return 147;
  }
  if (value <= 1.0) {
    return 172;
  }
  if (value <= 2.0) {
    return 197;
  }
  if (value <= 4.0) {
    return 222;
  }
  if (value <= 8.0) {
    return 247;
  }
  if (value <= 16.0) {
    return 272;
  }
  if (value <= 32.0) {
    return 297;
  }
  if (value <= 64.0) {
    return 322;
  }
  // if <= 100
  return 347;
}

export type GeneratePositionsResult = {
  positions: HolderData[];
  occupiedSpaces: OccupiedSpace[];
};

// create pure functions

export function generatePositions(
  items: Holder[],
  occupiedSpaces: readonly OccupiedSpace[],
  containerWidth: number,
  supply: number,
): Promise<GeneratePositionsResult> {
  log.info(`Processing ${items.length} holders...`);

  const spaces: OccupiedSpace[] = [...occupiedSpaces];

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
        y += 200 * Math.random(); // Move to next row
      }

      if (!doesOverlap(x, y, skeletonWidth, skeletonHeight)) {
        foundPosition = true;
      } else {
        x += 100 * Math.random(); // Try next position
      }
    }

    return { x, y };
  };

  // Process each holder in the chunk
  const positions: HolderData[] = [];

  for (let i = 0; i < items.length; i++) {
    const holder = items[i];

    // const size = 10 + Math.ceil(Math.sqrt(holder.balance / 1e9));
    // const size = clamp(Math.random() * 300, 40, 300);

    // const minSize = 30;
    // const maxSize = 1200;

    const percentage = supply ? (holder.balance / supply) * 100 : 0;

    const size = mapPercentSize(percentage);

    // const scale = mapRange(percentage, 0, 1, 30, 77_000);
    // const size = clamp(scale, minSize, maxSize);

    const seed = parseInt(holder.wallet.slice(0, 8), 16);
    const rotation = Math.sin(seed * 0.1) * 180;

    // Find position ensuring no overlap
    const { x, y } = findValidPosition(size, size);

    // Update occupiedSpaces first
    const newSpace = {
      x1: x,
      y1: y,
      x2: x + size,
      y2: y + size,
    };

    // update occupiedSpaces
    spaces.push(newSpace);

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
