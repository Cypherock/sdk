import {
  verifySerialSignature,
  verifyChallengeSignature,
} from './authVerification';

export const verifyDeviceSerialSignature = async (params: {
  serial: Uint8Array;
  signature: Uint8Array;
  postfix1: Uint8Array;
  postfix2: Uint8Array;
}): Promise<Uint8Array | undefined> => verifySerialSignature(params);

export const verifyDeviceChallengeSignature = async (params: {
  serial: Uint8Array;
  signature: Uint8Array;
  postfix1?: Uint8Array;
  postfix2?: Uint8Array;

  challenge: Uint8Array;
  firmwareVersion: string;
  isTestApp: boolean;
  email?: string;
  cysyncVersion?: string;
}) => verifyChallengeSignature(params);
