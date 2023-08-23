import { ILogger } from '@cypherock/sdk-interfaces';
import { numToByteArray } from './crypto';

export type ForceStatusUpdate = (flowStatus: number) => void;
export type OnStatus = (status: { flowStatus: number }) => void;

const getNumbersFromEnums = (enums: object) =>
  Object.keys(enums)
    .filter(e => !Number.isNaN(Number(e)))
    .map(e => parseInt(e, 10))
    .filter(e => e >= 0)
    .sort((a, b) => a - b);

const getNamesFromEnums = (enums: object) =>
  Object.keys(enums).filter(e => Number.isNaN(Number(e)));

export function createStatusListener(params: {
  enums: object;
  operationEnums?: object;
  seedGenerationEnums?: object;
  onEvent?: (event: number) => void;
  logger?: ILogger;
}) {
  const {
    enums,
    onEvent,
    logger,
    operationEnums: _operationEnums,
    seedGenerationEnums,
  } = params;

  const operationEnums = _operationEnums ?? enums;
  const alreadySent: Record<number, boolean> = {};

  // Gets the flow status list as numbers from enums
  const eventList = getNumbersFromEnums(enums);
  const seedGenerationEventList = getNumbersFromEnums(
    seedGenerationEnums ?? {},
  );
  const operationEventNames = getNamesFromEnums(operationEnums);
  const operationSeedGenerationEventName = operationEventNames.find(e =>
    e.includes('SEED_GENERATED'),
  );

  const onStatus: OnStatus = (status: { flowStatus: number }) => {
    const byteArray = numToByteArray(status.flowStatus);
    const operationStatus = byteArray[byteArray.length - 1] ?? 0;
    const coreStatus = byteArray[byteArray.length - 2] ?? 0;

    for (const eventIndex of eventList) {
      const isBeforeSeedGeneration =
        !operationSeedGenerationEventName ||
        eventIndex < (operationEnums as any)[operationSeedGenerationEventName];
      const isSeedGeneration =
        operationSeedGenerationEventName &&
        eventIndex -
          (operationEnums as any)[operationSeedGenerationEventName] >=
          0 &&
        eventIndex - (operationEnums as any)[operationSeedGenerationEventName] <
          seedGenerationEventList.length - 1;

      const isAfterSeedGeneration =
        operationSeedGenerationEventName &&
        eventIndex -
          (operationEnums as any)[operationSeedGenerationEventName] >=
          seedGenerationEventList.length - 1;

      let isCompleted = isBeforeSeedGeneration && operationStatus >= eventIndex;

      if (isSeedGeneration) {
        isCompleted =
          coreStatus >
          eventIndex -
            (operationEnums as any)[operationSeedGenerationEventName];
      } else if (isAfterSeedGeneration) {
        isCompleted =
          operationStatus >
          eventIndex -
            (operationEnums as any)[operationSeedGenerationEventName] +
            1;
      }

      if (isCompleted && !alreadySent[eventIndex]) {
        alreadySent[eventIndex] = true;
        if (logger) {
          logger.verbose('Event', {
            event: (enums as any)[eventIndex],
            eventIndex,
          });
        }

        if (onEvent) {
          onEvent(eventIndex);
        }
      }
    }
  };

  const forceStatusUpdate = (flowStatus: number) => {
    for (const eventIndex of eventList) {
      if (flowStatus >= eventIndex && !alreadySent[eventIndex]) {
        alreadySent[eventIndex] = true;
        if (logger) {
          logger.verbose('Event', {
            event: (enums as any)[eventIndex],
            eventIndex,
          });
        }

        if (onEvent) {
          onEvent(eventIndex);
        }
      }
    }
  };

  return { onStatus, forceStatusUpdate };
}
