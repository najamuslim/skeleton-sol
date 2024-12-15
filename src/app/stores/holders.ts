import {
  Holder,
  HolderData,
  OccupiedSpace,
  WorkerGeneratePositionsData,
  WorkerGeneratePositionsResult,
  WorkerMessage,
} from "@/types";
import { atom, computed } from "nanostores";
import log from "../utils/log";

// width of the viewport
// we listen window resize event (Skeleton.tsx) to update this value
export const $containerWidth = atom(1200);

// store raw holders data from api
export const $holders = atom<Array<Holder>>([]);

// total supply of the token
export const $supply = atom<number>(0);

$holders.subscribe((value) => log.info("holders total:", value.length));

// store occupied spaces of the skeleton container
const $occupiedSpaces = atom<OccupiedSpace[]>([]);

$occupiedSpaces.listen((spaces) =>
  log.info("occupiedSpaces total:", spaces.length),
);

// store calculated holder data with position, rotation, and size
export const $holdersData = atom<Array<HolderData>>([]);

$holdersData.subscribe((value) =>
  log.info("calculated holdersData total:", value.length),
);

// Web Worker ==========================================================================

// store web worker
export const $worker = atom<Worker | null>(null);

// send a message to worker
function workerSendMessage<T>(data: WorkerMessage<T>) {
  const w = $worker.get();
  if (w) {
    w.postMessage(data);
  }
}

// send message to worker to generate positions
function workerGeneratePositions(items: readonly Holder[]) {
  workerSendMessage<WorkerGeneratePositionsData>({
    event: "generatePositions",
    data: {
      items: items as Holder[],
      containerWidth: $containerWidth.get(),
    },
  });
}

// subscribe to holders data and generate positions in worker
$holders.subscribe((value) => {
  workerGeneratePositions(value);
});

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

// handle message from worker
// when worker finished generating positions
function handleGeneratePositionsResult(result: WorkerGeneratePositionsResult) {
  log.info("Main: handleGeneratePositionsResult chunkIdx:", result);

  // update occupied spaces
  $occupiedSpaces.set(result.occupiedSpaces);

  // update holders data
  $holdersData.set([...$holdersData.get(), ...result.positions]);
}

// Viewport & Scroll Handler ==========================================================================

// height of the content of scrollable area
export const $maxY = computed($holdersData, (values) => {
  return values.reduce((max, holder) => Math.max(max, holder.position.y), 800);
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

// get chunk data of specified index, and update holdersDataChunk
function getChunkDataAndUpdate(chunkIdx: number) {
  log.info(`Loading chunk index: ${chunkIdx}`);

  // load prev, current, and next chunk
  const prevChunkIdx = chunkIdx - 1 >= 0 ? chunkIdx - 1 : chunkIdx;
  const nextChunkIdx = chunkIdx + 1;

  log.info("Adjacent chunk indexes: ", [prevChunkIdx, nextChunkIdx]);

  const sliceStart = prevChunkIdx * chunkSize;
  const sliceEnd = (nextChunkIdx + 1) * chunkSize;
  log.info("Slice data: [", sliceStart, ":", sliceEnd, "]");

  // slice the chunk data
  const chunk = $holdersData.get().slice(sliceStart, sliceEnd);

  log.info("Loaded chunk data size: ", chunk.length);

  $holdersDataChunk.set(chunk);
}

// first time viewport rendered handler
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

// scroll handler, get spesific chunks of data to be rendered
// subscribe to scroll position
$scrollTop.subscribe((scrollTop) => {
  // log.info("scrollTop", scrollTop);
  const totalChunks = $totalChunks.get();
  const currentChunkIdx = $currentChunkIdx.get();

  // if scroll passed the chunk size, load the next chunk
  const nextChunkIdx = Math.floor(scrollTop / chunkSizeInPixels);

  if (nextChunkIdx !== currentChunkIdx && nextChunkIdx < totalChunks) {
    $currentChunkIdx.set(nextChunkIdx);
    getChunkDataAndUpdate(nextChunkIdx);
  }
});
