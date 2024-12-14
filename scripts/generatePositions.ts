import { clamp } from "@/app/utils/math";

const fs = require("fs");
const path = require("path");

interface Holder {
  wallet: string;
  balance: number;
}

interface Position {
  x: number;
  y: number;
  size: number;
  rotation: number;
  balance: number;
}

interface OccupiedSpace {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Gunakan persentase untuk width agar responsif
const CONTAINER_WIDTH = 1200; // 90% dari viewport width
//const BASE_SIZE = 10;

async function generatePositions() {
  const holdersPath = path.join(process.cwd(), "src/app/data/holders.json");
  const holdersData: Holder[] = JSON.parse(
    fs.readFileSync(holdersPath, "utf-8"),
  );

  console.log(`Processing ${holdersData.length} holders...`);

  const positions = new Map<string, Position>();
  const occupiedSpaces: OccupiedSpace[] = [];

  const doesOverlap = (x: number, y: number, width: number, height: number) => {
    const margin = 2;
    for (const space of occupiedSpaces) {
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

    while (!foundPosition) {
      if (x + skeletonWidth > CONTAINER_WIDTH) {
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
  for (const holder of holdersData) {
    // const size = 10 + Math.ceil(Math.sqrt(holder.balance / 1e9));
    const size = clamp(Math.random() * 300, 40, 300);
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
    occupiedSpaces.push(newSpace);

    // Then set position
    positions.set(holder.wallet, {
      x,
      y,
      size,
      rotation,
      balance: holder.balance,
    });
  }

  console.log(
    `Processed ${holdersData.length}/${holdersData.length} holders...`,
  );

  const outputPath = path.join(
    process.cwd(),
    "src/app/data/precomputedPositions.json",
  );
  fs.writeFileSync(
    outputPath,
    JSON.stringify(Object.fromEntries(positions), null, 2),
  );

  console.log(`Generated positions for ${positions.size} holders`);
  console.log(`Saved to ${outputPath}`);
}

generatePositions().catch(console.error);
