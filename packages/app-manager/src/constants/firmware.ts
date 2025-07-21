export const FirmwareChannel = {
  MULTICOIN: 'MULTICOIN',
  BTC_ONLY: 'BTC_ONLY',
} as const;

export type FirmwareChannel = (typeof FirmwareChannel)[keyof typeof FirmwareChannel];