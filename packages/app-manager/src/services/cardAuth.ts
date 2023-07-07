import { sha256 } from '@cypherock/sdk-utils';
import {
  verifySerialSignature,
  verifyChallengeSignature,
} from './authVerification';

export const verifyCardSerialSignature = async (params: {
  serial: Uint8Array;
  signature: Uint8Array;
}): Promise<Uint8Array | undefined> =>
  verifySerialSignature({
    ...params,
    message: await sha256(params.serial),
  });

export const verifyCardChallengeSignature = async (params: {
  serial: Uint8Array;
  signature: Uint8Array;

  challenge: Uint8Array;
  email?: string;
  cysyncVersion?: string;
  onlyFailure?: boolean;
  sessionId?: string;
}) => verifyChallengeSignature({ ...params, firmwareVersion: '0.0.0' });
