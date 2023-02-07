import {
  DeviceError,
  DeviceErrorType,
  IDeviceConnection
} from '@cypherock/sdk-interfaces';
import * as config from '../config';
import { logger, PacketVersion, PacketVersionMap } from '../utils';
import {
  DecodedPacketData,
  decodePacket,
  decodePayloadData,
  ErrorPacketRejectReason,
  RejectReasonToMsgMap
} from '../xmodem';

export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
  isCancelled: () => boolean;
}

export const waitForPacket = ({
  connection,
  version,
  packetTypes,
  sequenceNumber
}: {
  connection: IDeviceConnection;
  sequenceNumber: number;
  packetTypes: number[];
  version: PacketVersion;
}): CancellablePromise<DecodedPacketData> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  if (!connection.isConnected()) {
    throw new DeviceError(DeviceErrorType.CONNECTION_CLOSED);
  }

  let isCancelled = false;
  // eslint-disable-next-line
  let onCancel = () => {};

  /**
   * Be sure to remove all listeners and timeout.
   */
  const promiseFunc = (
    resolve: (val: DecodedPacketData) => void,
    reject: (reason?: any) => void
  ) => {
    let timeout: NodeJS.Timeout;
    let recheckTimeout: NodeJS.Timeout;

    function cleanUp() {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (recheckTimeout) {
        clearTimeout(recheckTimeout);
      }
    }

    async function recheckPacket() {
      try {
        if (!connection.isConnected()) {
          reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
          return;
        }

        const rawPacket = await connection.receive();
        if (!rawPacket) {
          recheckTimeout = setTimeout(
            recheckPacket,
            usableConfig.constants.RECHECK_TIME
          );
          return;
        }

        const packetList = decodePacket(rawPacket, version);

        let isSuccess = false;
        let receivedPacket: DecodedPacketData | undefined;
        let error: Error | undefined;

        for (const packet of packetList) {
          if (packet.errorList.length === 0) {
            if (packet.packetType === usableConfig.commands.PACKET_TYPE.ERROR) {
              logger.warn('Error packet', packet);
              error = new DeviceError(DeviceErrorType.WRITE_REJECTED);

              const { rawData } = decodePayloadData(
                packet.payloadData,
                version
              );

              const rejectStatus = parseInt(`0x${rawData}`, 16);
              const latestSeqNumber = connection.getSequenceNumber();
              if (
                rejectStatus === ErrorPacketRejectReason.INVALID_SEQUENCE_NO &&
                latestSeqNumber !== sequenceNumber
              ) {
                error = new DeviceError(
                  DeviceErrorType.PROCESS_ABORTED_BY_USER
                );
                break;
              }

              let rejectReason: string;

              const innerRejectReason =
                RejectReasonToMsgMap[rejectStatus as ErrorPacketRejectReason];

              if (innerRejectReason) {
                rejectReason = innerRejectReason;
              } else {
                rejectReason = `Unknown reject reason: ${rawData}`;
              }

              error.message = `The write packet operation was rejected by the device because: ${rejectReason}`;
            } else if (packetTypes.includes(packet.packetType)) {
              if (
                sequenceNumber === packet.sequenceNumber ||
                packet.packetType === usableConfig.commands.PACKET_TYPE.STATUS
              ) {
                isSuccess = true;
                receivedPacket = packet;
              }
            }

            if (error || isSuccess) break;
          }
        }

        if (error || isSuccess) {
          cleanUp();

          if (error) {
            reject(error);
            return;
          }

          if (!receivedPacket) {
            reject(new Error('Did not find receivedPacket'));
            return;
          }

          resolve(receivedPacket);
        } else {
          recheckTimeout = setTimeout(
            recheckPacket,
            usableConfig.constants.RECHECK_TIME
          );
        }
      } catch (error) {
        logger.error('Error while processing data from device');
        logger.error(error);
        recheckTimeout = setTimeout(
          recheckPacket,
          usableConfig.constants.RECHECK_TIME
        );
      }
    }

    if (!connection.isConnected()) {
      throw new DeviceError(DeviceErrorType.CONNECTION_CLOSED);
    }

    timeout = setTimeout(() => {
      cleanUp();

      if (!connection.isConnected()) {
        reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
      } else {
        reject(new DeviceError(DeviceErrorType.READ_TIMEOUT));
      }
    }, usableConfig.constants.ACK_TIME);

    recheckTimeout = setTimeout(
      recheckPacket,
      usableConfig.constants.RECHECK_TIME
    );

    onCancel = () => {
      isCancelled = true;
      cleanUp();
      reject(new Error('Cancelled'));
    };
  };

  const promise = new Promise<DecodedPacketData>(promiseFunc);
  const cancelablePromise = Object.assign(promise, {
    cancel: onCancel,
    isCancelled: () => isCancelled
  });

  return cancelablePromise;
};
