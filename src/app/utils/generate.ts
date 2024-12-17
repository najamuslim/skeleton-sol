import { Holder, HolderData, OccupiedSpace } from "@/types";
import { clamp, mapRange } from "./math";
import log from "./log";

function mapPercentSize(value: number) {
  if (value <= 0.004) {
    return 49;
  }
  if (value <= 0.008) {
    return 57;
  }
  if (value <= 0.01) {
    return 65;
  }
  if (value <= 0.05) {
    return 74;
  }
  if (value <= 0.1) {
    return 82;
  }
  if (value <= 0.3) {
    return 90;
  }
  if (value <= 0.5) {
    return 98;
  }
  if (value <= 0.7) {
    return 107;
  }
  if (value <= 0.9) {
    return 115;
  }
  if (value <= 1.1) {
    return 123;
  }
  if (value <= 1.3) {
    return 132;
  }
  if (value <= 1.5) {
    return 140;
  }
  if (value <= 1.7) {
    return 148;
  }
  if (value <= 1.9) {
    return 156;
  }
  if (value <= 2.1) {
    return 165;
  }
  if (value <= 2.3) {
    return 173;
  }
  if (value <= 2.5) {
    return 181;
  }
  if (value <= 2.7) {
    return 190;
  }
  if (value <= 2.9) {
    return 198;
  }
  if (value <= 3.1) {
    return 206;
  }
  if (value <= 3.3) {
    return 215;
  }
  if (value <= 3.5) {
    return 223;
  }
  if (value <= 3.7) {
    return 231;
  }
  if (value <= 3.9) {
    return 239;
  }
  if (value <= 4.1) {
    return 248;
  }
  if (value <= 4.3) {
    return 256;
  }
  if (value <= 4.5) {
    return 264;
  }
  if (value <= 4.7) {
    return 273;
  }
  if (value <= 4.9) {
    return 281;
  }
  if (value <= 5.1) {
    return 289;
  }
  if (value <= 5.3) {
    return 298;
  }
  if (value <= 5.5) {
    return 306;
  }
  if (value <= 5.7) {
    return 315;
  }
  if (value <= 5.9) {
    return 323;
  }
  if (value <= 6.1) {
    return 331;
  }
  if (value <= 6.3) {
    return 339;
  }
  if (value <= 6.5) {
    return 348;
  }
  if (value <= 6.7) {
    return 356;
  }
  if (value <= 6.9) {
    return 365;
  }
  if (value <= 7.1) {
    return 373;
  }
  if (value <= 7.3) {
    return 381;
  }
  if (value <= 7.5) {
    return 390;
  }
  if (value <= 7.7) {
    return 398;
  }
  if (value <= 7.9) {
    return 406;
  }
  if (value <= 8.1) {
    return 414;
  }
  if (value <= 8.3) {
    return 422;
  }
  if (value <= 8.5) {
    return 430;
  }
  if (value <= 8.7) {
    return 439;
  }
  if (value <= 8.9) {
    return 447;
  }
  if (value <= 9.1) {
    return 455;
  }
  if (value <= 9.3) {
    return 464;
  }
  if (value <= 9.5) {
    return 472;
  }
  if (value <= 9.7) {
    return 480;
  }
  if (value <= 9.9) {
    return 488;
  }
  if (value <= 10.1) {
    return 497;
  }
  if (value <= 20) {
    return 550;
  }
  if (value <= 35) {
    return 600;
  }
  if (value <= 50) {
    return 650;
  }
  return 650;
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
