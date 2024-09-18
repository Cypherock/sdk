import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { http } from '../utils';
import {
  IInitiateServerSessionParams,
  IInitiateServerSessionResult,
} from './types';

const baseURL = '/device-session';

export const initiateServerSession = async (
  params: IInitiateServerSessionParams,
): Promise<IInitiateServerSessionResult> => {
  const body = {
    deviceId: uint8ArrayToHex(params.deviceId),
    deviceRandomPublic: uint8ArrayToHex(params.deviceRandomPublic),
    signature: uint8ArrayToHex(params.signature),
    postfix1: uint8ArrayToHex(params.postfix1),
    postfix2: uint8ArrayToHex(params.postfix2),
    keyIndex: 1,
  };

  const res = await http.post(`${baseURL}/create`, body);

  console.log({ res });
  return res.data;
};
