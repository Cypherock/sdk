import {
  DeviceAppError,
  DeviceAppErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert, hexToUint8Array, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { DeepPartial, Msg } from '../encoders/proto/generated/core';
import { SessionStartResponse } from '../encoders/proto/generated/session';
import { ISessionStartResponse } from '../encoders/proto/generated/types';
import { Status } from '../encoders/types';
import { sendCommand } from '../operations/helpers';
import { waitForResult } from '../operations/proto';
import { initiateServerSession } from '../services';
import {
  assertOrThrowInvalidResult,
  PacketVersionMap,
  parseCommonError,
} from '../utils';

export interface IStartSessionParams {
  connection: IDeviceConnection;
  onStatus?: (status: Status) => void;
  options?: { interval?: number; timeout?: number; maxTries?: number };
  getSequenceNumber: () => Promise<number>;
  getNewSequenceNumber: () => Promise<number>;
}

const sendSessionCommand = async (
  params: IStartSessionParams,
  data: DeepPartial<Msg['sessionStart']>,
) => {
  const { maxTries, timeout } = params.options ?? {};

  const msgData = uint8ArrayToHex(
    Msg.encode(Msg.create({ sessionStart: data })).finish(),
  );

  await sendCommand({
    connection: params.connection,
    protoData: msgData,
    rawData: '',
    version: PacketVersionMap.v3,
    maxTries,
    sequenceNumber: await params.getNewSequenceNumber(),
    timeout,
  });
};

const waitForSessionResult = async (
  params: IStartSessionParams,
): Promise<ISessionStartResponse> => {
  const { connection, onStatus, options } = params;

  const version = PacketVersionMap.v3;

  const result = await waitForResult({
    connection,
    appletId: 0,
    sequenceNumber: await params.getSequenceNumber(),
    version,
    allowCoreData: true,
    onStatus,
    options,
  });

  let msg: Msg;
  try {
    msg = Msg.decode(result);
  } catch (error) {
    throw new DeviceAppError(DeviceAppErrorType.INVALID_MSG_FROM_DEVICE);
  }

  const response: SessionStartResponse | undefined = msg.sessionStart?.response;

  assertOrThrowInvalidResult(response);

  if (response.commonError) {
    parseCommonError(response.commonError);
  }

  return response;
};

export const startSession = async (
  params: IStartSessionParams,
): Promise<string> => {
  assert(params.connection, 'Invalid connection');
  assert(params.getNewSequenceNumber, 'Invalid getNewSequenceNumber');

  await sendSessionCommand(params, {
    request: {
      initiate: {},
    },
  });

  const { confirmationInitiate } = await waitForSessionResult(params);
  assertOrThrowInvalidResult(confirmationInitiate);

  const serverInitiateResponse =
    await initiateServerSession(confirmationInitiate);

  await sendSessionCommand(params, {
    request: {
      start: {
        sessionAge: serverInitiateResponse.sessionAge,
        sessionRandomPublic: hexToUint8Array(
          serverInitiateResponse.publicKey ?? '',
        ),
        signature: hexToUint8Array(serverInitiateResponse.signature ?? ''),
        deviceId: confirmationInitiate.deviceId,
      },
    },
  });

  const { confirmationStart } = await waitForSessionResult(params);
  assertOrThrowInvalidResult(confirmationStart);

  return '';
};
