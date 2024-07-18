import {
  DeviceAppError,
  DeviceAppErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { DeepPartial, Msg } from '../encoders/proto/generated/core';
import { SessionCloseResponse } from '../encoders/proto/generated/session';
import { ISessionCloseResponse } from '../encoders/proto/generated/types';
import { Status } from '../encoders/types';
import { sendCommand } from '../operations/helpers';
import { waitForResult } from '../operations/proto';
import {
  assertOrThrowInvalidResult,
  PacketVersionMap,
  parseCommonError,
} from '../utils';

export interface ICloseSessionParams {
  connection: IDeviceConnection;
  onStatus?: (status: Status) => void;
  options?: { interval?: number; timeout?: number; maxTries?: number };
  getSequenceNumber: () => Promise<number>;
  getNewSequenceNumber: () => Promise<number>;
}

const sendSessionCommand = async (
  params: ICloseSessionParams,
  data: DeepPartial<Msg['sessionClose']>,
) => {
  const { maxTries, timeout } = params.options ?? {};

  const msgData = uint8ArrayToHex(
    Msg.encode(Msg.create({ sessionClose: data })).finish(),
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
  params: ICloseSessionParams,
): Promise<ISessionCloseResponse> => {
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

  const response: SessionCloseResponse | undefined = msg.sessionClose?.response;

  assertOrThrowInvalidResult(response);

  if (response.commonError) {
    parseCommonError(response.commonError);
  }

  return response;
};

export const closeSession = async (
  params: ICloseSessionParams,
): Promise<void> => {
  assert(params.connection, 'Invalid connection');
  assert(params.getNewSequenceNumber, 'Invalid getNewSequenceNumber');

  await sendSessionCommand(params, {
    request: {
      clear: {},
    },
  });

  const { clear } = await waitForSessionResult(params);
  assertOrThrowInvalidResult(clear);
};
