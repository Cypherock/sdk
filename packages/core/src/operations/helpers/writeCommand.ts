import {
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';

import { PacketVersion, PacketVersionMap } from '../../utils';
import { DecodedPacketData } from '../../encoders/packet';

import { waitForPacket } from './waitForPacket';

export const writeCommand = async ({
  connection,
  packet,
  version,
  sequenceNumber,
  ackPacketTypes,
  timeout,
}: {
  connection: IDeviceConnection;
  packet: Uint8Array;
  version: PacketVersion;
  sequenceNumber: number;
  ackPacketTypes: number[];
  timeout?: number;
}): Promise<DecodedPacketData> => {
  assert(connection, 'Invalid connection');
  assert(packet, 'Invalid packet');
  assert(version, 'Invalid version');
  assert(ackPacketTypes, 'Invalid ackPacketTypes');
  assert(sequenceNumber, 'Invalid sequenceNumber');

  assert(
    ackPacketTypes.length > 0,
    'ackPacketTypes should contain atleast 1 element',
  );
  assert(packet.length > 0, 'packet cannot be empty');

  if (version !== PacketVersionMap.v3) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  if (!(await connection.isConnected())) {
    throw new DeviceConnectionError(
      DeviceConnectionErrorType.CONNECTION_CLOSED,
    );
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<DecodedPacketData>(async (resolve, reject) => {
    const ackPromise = waitForPacket({
      connection,
      version,
      packetTypes: ackPacketTypes,
      sequenceNumber,
      ackTimeout: timeout,
    });

    connection.send(packet).catch(async () => {
      ackPromise.cancel();
      if (!(await connection.isConnected())) {
        reject(
          new DeviceConnectionError(
            DeviceConnectionErrorType.CONNECTION_CLOSED,
          ),
        );
      } else {
        reject(
          new DeviceCommunicationError(
            DeviceCommunicationErrorType.WRITE_ERROR,
          ),
        );
      }
    });

    ackPromise
      .then(res => {
        if (ackPromise.isCancelled()) {
          return;
        }

        resolve(res);
      })
      .catch(error => {
        if (ackPromise.isCancelled()) {
          return;
        }

        reject(error);
      });
  });
};
