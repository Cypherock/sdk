import {
  DeviceAppError,
  DeviceAppErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { Msg } from '../encoders/proto/generated/core';
import { IAppVersionResultResponse } from '../encoders/proto/generated/types';
import { AppVersionResponse } from '../encoders/proto/generated/version';
import { Status } from '../encoders/types';
import { sendCommand } from '../operations/helpers';
import { waitForResult } from '../operations/proto';
import {
  assertOrThrowInvalidResult,
  PacketVersionMap,
  parseCommonError,
} from '../utils';

export interface IGetAppVersionsParams {
  connection: IDeviceConnection;
  sequenceNumber: number;
  onStatus?: (status: Status) => void;
  options?: { interval?: number; timeout?: number; maxTries?: number };
}

export const getAppVersions = async ({
  connection,
  sequenceNumber,
  onStatus,
  options,
}: IGetAppVersionsParams): Promise<IAppVersionResultResponse> => {
  assert(connection, 'Invalid connection');
  assert(sequenceNumber, 'Invalid sequenceNumber');

  const { maxTries, timeout } = options ?? {};
  const version = PacketVersionMap.v3;

  const msgData = uint8ArrayToHex(
    Msg.encode(
      Msg.create({ appVersion: { request: { initiate: {} } } }),
    ).finish(),
  );

  await sendCommand({
    connection,
    protoData: msgData,
    rawData: '',
    version,
    maxTries,
    sequenceNumber,
    timeout,
  });

  const result = await waitForResult({
    connection,
    appletId: 0,
    sequenceNumber,
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

  const response: AppVersionResponse | undefined = msg.appVersion?.response;

  assertOrThrowInvalidResult(response);

  if (response.commonError) {
    parseCommonError(response.commonError);
  }

  assertOrThrowInvalidResult(response.result);

  return response.result;
};
