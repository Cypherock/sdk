export const FirmwareVariant = {
  MULTICOIN: 'MULTICOIN',
  BTC_ONLY: 'BTC_ONLY',
} as const;

export type FirmwareVariant = (typeof FirmwareVariant)[keyof typeof FirmwareVariant];