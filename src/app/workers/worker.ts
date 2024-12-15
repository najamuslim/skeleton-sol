import {
  WorkerGeneratePositionsData,
  WorkerGeneratePositionsResult,
  WorkerMessage,
} from "@/types";
import { generatePositions } from "../utils/generate";

// handle message from main thread
self.onmessage = function (event: MessageEvent<WorkerMessage<unknown>>) {
  const message = event.data;

  // handle specific event
  switch (message.event) {
    case "generatePositions":
      handleGeneratePositions(message.data as WorkerGeneratePositionsData);
      break;
  }

  // postMessage(result);
};

function sendMessage<T>(data: WorkerMessage<T>) {
  postMessage(data);
}

function handleGeneratePositions(data: WorkerGeneratePositionsData) {
  console.log("Worker: generatePositions", {
    chunkIdx: data.chunkIdx,
    total: data.items.length,
  });

  generatePositions(data.items, data.occupiedSpaces, data.containerWidth).then(
    (result) => {
      console.log(
        "Worker: generatePositionsDone",
        { chunkIdx: data.chunkIdx },
        "result:",
        result,
      );

      // send result back to main thread
      sendMessage<WorkerGeneratePositionsResult>({
        event: "generatePositionsDone",
        data: {
          chunkIdx: data.chunkIdx,
          positions: result.positions,
          occupiedSpaces: result.occupiedSpaces,
        },
      });
    },
  );
}

export {};
