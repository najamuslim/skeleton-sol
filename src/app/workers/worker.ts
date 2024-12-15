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

  // postMessage(result);
};

// send message to main thread
function sendMessage<T>(data: WorkerMessage<T>) {
  postMessage(data);
}

function handleGeneratePositions(data: WorkerGeneratePositionsData) {
  log.green("Worker: generatePositions", data);

  processDataInChunks(data.items, data.containerWidth);

  // generatePositions(data.items, data.occupiedSpaces, data.containerWidth).then(
  //   (result) => {
  //     console.log(
  //       "Worker: generatePositionsDone",
  //       { chunkIdx: data.chunkIdx },
  //       "result:",
  //       result,
  //     );
  //
  //     // send result back to main thread
  //     sendMessage<WorkerGeneratePositionsResult>({
  //       event: "generatePositionsDone",
  //       data: {
  //         chunkIdx: data.chunkIdx,
  //         positions: result.positions,
  //         occupiedSpaces: result.occupiedSpaces,
  //       },
  //     });
  //   },
  // );
}

const chunkSize = 100;

const processDataInChunks = async (data: Holder[], containerWidth: number) => {
  const totalChunks = Math.ceil(data.length / chunkSize);
  //const totalChunks = 20; // TODO: LIMIT CHUNKS

  let occupiedSpaces: OccupiedSpace[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    const chunk = data.slice(start, end);

    if (chunk.length > 0) {
      const result = await generatePositions(
        chunk,
        occupiedSpaces,
        containerWidth,
      );
      log.green("Worker: generatePositionsDone", "result:", result);

      // trim prev occupiedSpaces a half at end
      // occupiedSpaces = occupiedSpaces.splice(occupiedSpaces.length / 2);

      //occupiedSpaces.push(...result.occupiedSpaces);

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
