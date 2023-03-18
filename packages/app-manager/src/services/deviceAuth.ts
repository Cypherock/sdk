import { hexToUint8Array, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { http } from '../utils';

const baseURL = '/verification';

export const verifySerialSignature = async (params: {
  serial: Uint8Array;
  signature: Uint8Array;
  postfix1?: Uint8Array;
  postfix2?: Uint8Array;
}): Promise<Uint8Array | undefined> => {
  const verifyParams = {
    serial: uint8ArrayToHex(params.serial),
    signature: uint8ArrayToHex(params.signature),
    postfix1: params.postfix1 ? uint8ArrayToHex(params.postfix1) : undefined,
    postfix2: params.postfix2 ? uint8ArrayToHex(params.postfix2) : undefined,
  };

  const res = await http.post(`${baseURL}/verify`, verifyParams);

  if (res.data.verified === true) {
    return hexToUint8Array(res.data.challenge);
  }

  return undefined;
};

export const verifyChallengeSignature = async (params: {
  serial: Uint8Array;
  signature: Uint8Array;
  postfix1?: Uint8Array;
  postfix2?: Uint8Array;

  challenge: Uint8Array;
  firmwareVersion: string;
  isTestApp: boolean;
  email?: string;
  cysyncVersion?: string;
}): Promise<string | undefined> => {
  const verifyParams = {
    serial: uint8ArrayToHex(params.serial),
    signature: uint8ArrayToHex(params.signature),
    postfix1: params.postfix1 ? uint8ArrayToHex(params.postfix1) : undefined,
    postfix2: params.postfix2 ? uint8ArrayToHex(params.postfix2) : undefined,

    challenge: uint8ArrayToHex(params.challenge),
    firmwareVersion: params.firmwareVersion,
    isTestApp: params.isTestApp,
    email: params.email,
    cysyncVersion: params.cysyncVersion,
  };

  const res = await http.post(`${baseURL}/challenge`, verifyParams);

  return res.data.verified || false;
};
