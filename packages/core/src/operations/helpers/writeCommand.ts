import {
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { logger, PacketVersion, PacketVersionMap } from '../../utils';
import { DecodedPacketData } from '../../encoders/packet';

import { waitForPacket } from './waitForPacket';

export const writeCommand = async ({
  connection,
  packet,
  version,
  sequenceNumber,
  ackPacketTypes: packetTypes,
}: {
  connection: IDeviceConnection;
  packet: Uint8Array;
  version: PacketVersion;
  sequenceNumber: number;
  ackPacketTypes: number[];
}): Promise<DecodedPacketData> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  if (!connection.isConnected()) {
    throw new DeviceConnectionError(
      DeviceConnectionErrorType.CONNECTION_CLOSED,
    );
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<DecodedPacketData>(async (resolve, reject) => {
    const ackPromise = waitForPacket({
      connection,
      version,
      packetTypes,
      sequenceNumber,
    });

    connection.send(packet).catch(error => {
      logger.error(error);
      if (!connection.isConnected()) {
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
      ackPromise.cancel();
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
