export type ForceStatusUpdate = (flowStatus: number) => void;
export type OnStatus = (status: { flowStatus: number }) => void;

export function createStatusListener(
  enums: object,
  onEvent?: (event: number) => void,
) {
  const alreadySent: Record<number, boolean> = {};

  // Gets the flow status list as numbers from enums
  const statusList = Object.keys(enums)
    .filter(e => !Number.isNaN(Number(e)))
    .map(e => parseInt(e, 10))
    .filter(e => e >= 0)
    .sort();

  const onStatus: OnStatus = (status: { flowStatus: number }) => {
    for (const eventIndex of statusList) {
      if (status.flowStatus >= eventIndex && !alreadySent[eventIndex]) {
        alreadySent[eventIndex] = true;
        if (onEvent) {
          onEvent(eventIndex);
        }
      }
    }
  };

  const forceStatusUpdate: ForceStatusUpdate = (flowStatus: number) => {
    onStatus({ flowStatus });
  };

  return { onStatus, forceStatusUpdate };
}
