import {
  Holder,
  OccupiedSpace,
  WorkerGeneratePositionsData,
  WorkerGeneratePositionsResult,
  WorkerMessage,
} from "@/types";
import { generatePositions } from "../utils/generate";
import log from "../utils/log";

// handle message from main thread
self.onmessage = function (event: MessageEvent<WorkerMessage<unknown>>) {
  const message = event.data;

  // handle specific event
  switch (message.event) {
    case "generatePositions":
      handleGeneratePositions(message.data as WorkerGeneratePositionsData);
      break;
  }
};

// send message to main thread
function sendMessage<T>(data: WorkerMessage<T>) {
  postMessage(data);
}

function handleGeneratePositions(data: WorkerGeneratePositionsData) {
  log.green("Worker: generatePositions", data);

  processDataInChunks(data);
}

const chunkSize = 100;

const processDataInChunks = async (data: WorkerGeneratePositionsData) => {
  const totalChunks = Math.ceil(data.items.length / chunkSize);
  // const totalChunks = 10; // TODO: LIMIT CHUNKS

  let occupiedSpaces: OccupiedSpace[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.items.length);
    const chunk = data.items.slice(start, end);

    if (chunk.length > 0) {
      const result = await generatePositions(
        chunk,
        occupiedSpaces,
        data.containerWidth,
        data.supply,
      );
      log.green("Worker: generatePositionsDone", "result:", result);

      occupiedSpaces = result.occupiedSpaces;

      // send result back to main thread
      sendMessage<WorkerGeneratePositionsResult>({
        event: "generatePositionsDone",
        data: {
          chunkIdx: i,
          positions: result.positions,
          occupiedSpaces: result.occupiedSpaces,
        },
      });
    }
  }
};

export {};
