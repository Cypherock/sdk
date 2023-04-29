import {
  verifySerialSignature,
  verifyChallengeSignature,
} from './authVerification';

export const verifyCardSerialSignature = async (params: {
  serial: Uint8Array;
  signature: Uint8Array;
}): Promise<Uint8Array | undefined> => verifySerialSignature(params);

export const verifyCardChallengeSignature = async (params: {
  serial: Uint8Array;
  signature: Uint8Array;

  challenge: Uint8Array;
  email?: string;
  cysyncVersion?: string;
}): Promise<string | undefined> => verifyChallengeSignature(params);
