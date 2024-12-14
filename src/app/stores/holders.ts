import { Holder, HolderData } from "@/types";
import { atom, computed } from "nanostores";
import { clamp } from "../utils/math";

export const $containerWidth = atom(1200);

// store holders data from api
export const $holders = atom<Array<Holder>>([]);

type OccupiedSpace = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

// store occupied spaces of the skeleton container
const $occupiedSpaces = atom<OccupiedSpace[]>([]);

// store holder data with position, rotation, and size
export const $holdersData = atom<Array<HolderData>>([]);

export const $maxY = computed($holdersData, (values) => {
  return values.reduce((max, holder) => Math.max(max, holder.position.y), 0);
});

// process the chunk
async function generatePositions(holdersData: Holder[]) {
  console.log(`Processing ${holdersData.length} holders...`);
  const doesOverlap = (x: number, y: number, width: number, height: number) => {
    const margin = 2;
    for (const space of $occupiedSpaces.get()) {
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
      if (x + skeletonWidth > $containerWidth.get()) {
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
    // console.log(x, y);

    // Update occupiedSpaces first
    const newSpace = {
      x1: x,
      y1: y,
      x2: x + size,
      y2: y + size,
    };
    $occupiedSpaces.set([...$occupiedSpaces.get(), newSpace]);

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
    $holdersData.set([...$holdersData.get(), position]);
  }

  console.log(`Done Processing chunk`);
}

const chunkSize = 100;
const chunkSizeInPixels = chunkSize * 24; // estimated

export const $totalChunks = computed($holders, (values) => {
  return Math.ceil(values.length / chunkSize);
});

export const $scrollTop = atom(0);
export const $currentChunkIdx = atom(0);

// holders data of current chunk
export const $holdersDataChunk = atom<Array<HolderData>>([]);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// process holders data in chunks
const processDataInChunks = (data: readonly Holder[]) => {
  // const totalChunks = Math.ceil(data.length / chunkSize);
  const totalChunks = 10; // TODO: LIMIT TO 10 CHUNKS

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    const chunk = data.slice(start, end);
    if (chunk.length > 0) {
      generatePositions(chunk);
    }
  }
};

// subscribe to holders data and generate positions in chunks
$holders.subscribe((value) => processDataInChunks(value));

// get chunk data of specified index, and update holdersDataChunk
function getChunkDataAndUpdate(chunkIdx: number) {
  console.log(`Loading chunk: ${chunkIdx}`);

  // load prev, current, and next chunk
  const totalChunks = Math.ceil($holders.get().length / chunkSize);
  const prevChunkIdx = chunkIdx - 1 >= 0 ? chunkIdx - 1 : chunkIdx;
  const nextChunkIdx = chunkIdx + 1;

  // console.log([prevChunkIdx, nextChunkIdx]);
  // console.log($holdersData.get().length);

  const chunk = $holdersData
    .get()
    .slice(prevChunkIdx * chunkSize, nextChunkIdx * chunkSize);
  // console.log("chunk data size", chunk.length);
  $holdersDataChunk.set(chunk);
}

$scrollTop.subscribe((scrollTop) => {
  // console.log("scrollTop", scrollTop);
  const totalChunks = $totalChunks.get();
  const currentChunkIdx = $currentChunkIdx.get();
  const nextChunkIdx = Math.floor(scrollTop / chunkSizeInPixels);

  if (nextChunkIdx !== currentChunkIdx && nextChunkIdx < totalChunks) {
    $currentChunkIdx.set(nextChunkIdx);
    getChunkDataAndUpdate(nextChunkIdx);
  }
});

// first time horldersData is loaded, load first chunk
$holdersData.subscribe((value) => {
  const currentChunkIdx = $currentChunkIdx.get();

  // const noMoreChunk = value.length <= chunkSize;

  if (value.length > 0 && currentChunkIdx === 0) {
    const nextChunkIdx = 1;
    $currentChunkIdx.set(nextChunkIdx);
    getChunkDataAndUpdate(currentChunkIdx);
  }
});
