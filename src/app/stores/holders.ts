import {
  Holder,
  HolderData,
  OccupiedSpace,
  WorkerGeneratePositionsData,
  WorkerGeneratePositionsResult,
  WorkerMessage,
} from "@/types";
import { atom, computed } from "nanostores";
import { generatePositions } from "../utils/generate";

// width of the viewport
// we listen window resize event (Skeleton.tsx) to update this value
export const $containerWidth = atom(1200);

// store holders data from api
export const $holders = atom<Array<Holder>>([]);

$holders.subscribe((value) => console.log("holders total:", value.length));

// Web Worker ==========================================================================

// store web worker
export const $worker = atom<Worker | null>(null);

// worker event listener
$worker.subscribe((worker) => {
  if (worker) {
    const w = worker as Worker;

    // set up an event listener for the worker's message event
    w.onmessage = function (event: MessageEvent<WorkerMessage<unknown>>) {
      const message = event.data;

      // handle specific event
      switch (message.event) {
        case "generatePositionsDone":
          handleGeneratePositionsResult(
            message.data as WorkerGeneratePositionsResult,
          );
          break;
      }
    };
  }
});

function workerSendMessage<T>(data: WorkerMessage<T>) {
  const w = $worker.get();
  if (w) {
    w.postMessage(data);
  }
}

function handleGeneratePositionsResult(result: WorkerGeneratePositionsResult) {
  console.log("handleGeneratePositionsResult chunkIdx:", result.chunkIdx);

  $occupiedSpaces.set([...$occupiedSpaces.get(), ...result.occupiedSpaces]);

  $holdersData.set([...$holdersData.get(), ...result.positions]);
}

// ======================================================================================

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

// TODO: should move to Web Worker to avoid blocking UI
// process the chunk
async function processChunk(items: Holder[]) {
  const { positions, occupiedSpaces } = await generatePositions(
    items,
    $occupiedSpaces.get(),
    $containerWidth.get(),
  );

  $occupiedSpaces.set([...$occupiedSpaces.get(), ...occupiedSpaces]);

  $holdersData.set([...$holdersData.get(), ...positions]);
}

// send message to worker and process data
function workerProcessChunk(chunkIdx: number, items: Holder[]) {
  workerSendMessage<WorkerGeneratePositionsData>({
    event: "generatePositions",
    data: {
      chunkIdx,
      items,
      occupiedSpaces: $occupiedSpaces.get(),
      containerWidth: $containerWidth.get(),
    },
  });
}

// process holders data in chunks
const processDataInChunks = (data: readonly Holder[]) => {
  // const totalChunks = Math.ceil(data.length / chunkSize);
  const totalChunks = 5; // TODO: LIMIT CHUNKS

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    const chunk = data.slice(start, end);
    if (chunk.length > 0) {
      // local process chunk
      // setTimeout(
      //   (function (chunk) {
      //     return function () {
      //       processChunk(chunk);
      //     };
      //   })(chunk),
      //   0,
      // );

      // send message to worker
      workerProcessChunk(i, chunk);
    }
  }
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
