import { Holder, HolderData } from "@/types";
import { atom, computed } from "nanostores";
import { clamp } from "../utils/math";

// width of the viewport
// we listen window resize event (Skeleton.tsx) to update this value
export const $containerWidth = atom(1200);

// store holders data from api
export const $holders = atom<Array<Holder>>([]);

$holders.subscribe((value) => console.log("holders total:", value.length));

type OccupiedSpace = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

// store occupied spaces of the skeleton container
const $occupiedSpaces = atom<OccupiedSpace[]>([]);

// store calculated holder data with position, rotation, and size
export const $holdersData = atom<Array<HolderData>>([]);

$holdersData.subscribe((value) =>
  console.log("calculated holdersData total:", value.length),
);

// height of the content of scrollable area
export const $maxY = computed($holdersData, (values) => {
  return values.reduce((max, holder) => Math.max(max, holder.position.y), 0);
});

// process the chunk
async function generatePositions(items: Holder[]) {
  console.log(`Processing ${items.length} holders...`);
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
    positions.push(position);
  }

  $holdersData.set([...$holdersData.get(), ...positions]);
}

// a chunk is equals of x data
const chunkSize = 100;

// estimated chunk in pixels size
const chunkSizeInPixels = chunkSize * 24;

export const $totalChunks = computed($holders, (values) => {
  return Math.ceil(values.length / chunkSize);
});

// viewport top
export const $scrollTop = atom(0);

// the chunk which is currently visible
export const $currentChunkIdx = atom(0);

// holders data of current visible chunk
export const $holdersDataChunk = atom<Array<HolderData>>([]);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// process holders data in chunks
const processDataInChunks = (data: readonly Holder[]) => {
  // const totalChunks = Math.ceil(data.length / chunkSize);
  const totalChunks = 5; // TODO: LIMIT CHUNKS

  return new Promise((resolve) => {
    let processedChunks = 0;

    const processChunk = (chunkStart: number, chunkEnd: number) => {
      for (let i = chunkStart; i < chunkEnd; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, data.length);
        const chunk = data.slice(start, end);
        if (chunk.length > 0) {
          setTimeout(
            (function (chunk) {
              return function () {
                generatePositions(chunk);
              };
            })(chunk),
            0,
          );
        }
        processedChunks++;
      }

      if (processedChunks === totalChunks) {
        resolve(true);
      } else {
        setTimeout(() => {
          processChunk(
            processedChunks,
            Math.min(processedChunks + 1, totalChunks),
          );
        }, 0);
      }
    };

    processChunk(0, totalChunks);
  });
};

// subscribe to holders data and generate positions in chunks
$holders.subscribe((value) => processDataInChunks(value));

// get chunk data of specified index, and update holdersDataChunk
function getChunkDataAndUpdate(chunkIdx: number) {
  console.log(`Loading chunk index: ${chunkIdx}`);

  // load prev, current, and next chunk
  const prevChunkIdx = chunkIdx - 1 >= 0 ? chunkIdx - 1 : chunkIdx;
  const nextChunkIdx = chunkIdx + 1;

  console.log("Adjacent chunk indexes: ", [prevChunkIdx, nextChunkIdx]);

  const sliceStart = prevChunkIdx * chunkSize;
  const sliceEnd = (nextChunkIdx + 1) * chunkSize;
  console.log("Slice data: [", sliceStart, ":", sliceEnd, "]");

  // slice the chunk data
  const chunk = $holdersData.get().slice(sliceStart, sliceEnd);

  console.log("Loaded chunk data size: ", chunk.length);

  $holdersDataChunk.set(chunk);
}

// subscribe to scroll position
$scrollTop.subscribe((scrollTop) => {
  // console.log("scrollTop", scrollTop);
  const totalChunks = $totalChunks.get();
  const currentChunkIdx = $currentChunkIdx.get();

  // if scroll passed the chunk size, load the next chunk
  const nextChunkIdx = Math.floor(scrollTop / chunkSizeInPixels);

  if (nextChunkIdx !== currentChunkIdx && nextChunkIdx < totalChunks) {
    $currentChunkIdx.set(nextChunkIdx);
    getChunkDataAndUpdate(nextChunkIdx);
  }
});

// subscribe to holdersData changes
$holdersData.subscribe((value) => {
  const currentChunkIdx = $currentChunkIdx.get();

  // when the first time horldersData populated, load the first chunk
  if (value.length > 0 && currentChunkIdx === 0) {
    getChunkDataAndUpdate(currentChunkIdx);

    const nextChunkIdx = 1;
    $currentChunkIdx.set(nextChunkIdx);
  }
});
