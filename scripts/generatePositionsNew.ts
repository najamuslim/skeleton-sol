import { clamp } from "@/app/utils/math";
import fs from "fs";
import path from "path";

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

const width = 1200;
const height = 1200;

async function generatePositions() {
  const holdersPath = path.join(process.cwd(), "src/app/data/holders.json");
  const holdersData: Holder[] = JSON.parse(
    fs.readFileSync(holdersPath, "utf-8"),
  );

  console.log(`Processing ${holdersData.length} holders...`);

  const positions = new Map<string, Position>();
  const objects: Position[] = [];

  for (const holder of holdersData) {
    let newObject = {
      balance: holder.balance,
      x: 0,
      y: 0,
      size: 0,
      rotation: 0,
    };

    let overlaps = false;
    do {
      newObject.x = Math.random() * (width - newObject.size);
      newObject.y = Math.random() * (height - newObject.size);
      newObject.size = clamp(Math.random() * 300, 40, 300);

      overlaps = false;
      for (const obj of objects) {
        if (
          newObject.x < obj.x + obj.size &&
          newObject.x + newObject.size > obj.x &&
          newObject.y < obj.y + obj.size &&
          newObject.y + newObject.size > obj.y
        ) {
          overlaps = true;
          break;
        }
      }
    } while (overlaps);

    objects.push(newObject);
    positions.set(holder.wallet, newObject);
  }

  console.log(
    `Processed ${holdersData.length}/${holdersData.length} holders...`,
  );

  const outputPath = path.join(
    process.cwd(),
    "src/app/data/precomputedPositionsNew.json",
  );
  fs.writeFileSync(
    outputPath,
    JSON.stringify(Object.fromEntries(positions), null, 2),
  );

  console.log(`Generated positions for ${positions.size} holders`);
  console.log(`Saved to ${outputPath}`);
}

generatePositions().catch(console.error);
