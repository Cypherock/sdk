export const createFlowStatus = (
  operationStatus: number,
  coreStatus: number,
) => {
  const CORE_STATUS_MASK = 0xff;
  const CORE_STATUS_SHIFT = 8;
  const APP_STATUS_MASK = 0xff;
  const APP_STATUS_SHIFT = 0;

  let flowStatus = 0;

  flowStatus |= (coreStatus & CORE_STATUS_MASK) << CORE_STATUS_SHIFT;
  flowStatus |= (operationStatus & APP_STATUS_MASK) << APP_STATUS_SHIFT;

  return flowStatus;
};
