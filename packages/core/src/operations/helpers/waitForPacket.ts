import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  IDeviceConnection,
  DeviceAppError,
  DeviceAppErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';

import * as config from '../../config';
import { logger, PacketVersion, PacketVersionMap } from '../../utils';
import {
  DecodedPacketData,
  decodePacket,
  decodePayloadData,
  ErrorPacketRejectReason,
  RejectReasonToMsgMap,
} from '../../encoders/packet';

export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
  isCancelled: () => boolean;
}

export const waitForPacket = ({
  connection,
  version,
  packetTypes,
  sequenceNumber,
  ackTimeout,
}: {
  connection: IDeviceConnection;
  sequenceNumber: number;
  packetTypes: number[];
  version: PacketVersion;
  ackTimeout?: number;
}): CancellablePromise<DecodedPacketData> => {
  assert(connection, 'Invalid connection');
  assert(version, 'Invalid version');
  assert(packetTypes, 'Invalid packetTypes');
  assert(sequenceNumber, 'Invalid sequenceNumber');

  assert(
    packetTypes.length > 0,
    'packetTypes should contain atleast 1 element',
  );

  if (version !== PacketVersionMap.v3) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  const usableConfig = config.v3;

  let isCancelled = false;
  let isCompleted = false;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let onCancel = () => {};

  /**
   * Be sure to remove all listeners and timeout.
   */
  const promiseFunc = async (
    resolve: (val: DecodedPacketData) => void,
    reject: (reason?: Error) => void,
  ) => {
    try {
      if (!(await connection.isConnected())) {
        throw new DeviceConnectionError(
          DeviceConnectionErrorType.CONNECTION_CLOSED,
        );
      }

      let timeout: NodeJS.Timeout | undefined;
      let recheckTimeout: NodeJS.Timeout | undefined;

      // eslint-disable-next-line no-inner-declarations
      function cleanUp() {
        isCompleted = true;
        if (timeout) {
          clearTimeout(timeout);
        }
        if (recheckTimeout) {
          clearTimeout(recheckTimeout);
        }
      }

      const setRecheckTimeout = () => {
        if (isCompleted) return;

        if (recheckTimeout) {
          clearTimeout(recheckTimeout);
        }

        recheckTimeout = setTimeout(
          // eslint-disable-next-line no-use-before-define
          recheckPacket,
          usableConfig.constants.RECHECK_TIME,
        );
      };

      // eslint-disable-next-line no-inner-declarations
      async function recheckPacket() {
        try {
          if (!(await connection.isConnected())) {
            cleanUp();
            reject(
              new DeviceConnectionError(
                DeviceConnectionErrorType.CONNECTION_CLOSED,
              ),
            );
            return;
          }

          if (isCompleted) return;

          const rawPacket = await connection.receive();
          if (!rawPacket) {
            setRecheckTimeout();
            return;
          }

          const packetList = decodePacket(rawPacket, version);

          let isSuccess = false;
          let receivedPacket: DecodedPacketData | undefined;
          let error: Error | undefined;

          for (const packet of packetList) {
            if (packet.errorList.length === 0) {
              if (
                packet.packetType === usableConfig.commands.PACKET_TYPE.ERROR
              ) {
                error = new DeviceCommunicationError(
                  DeviceCommunicationErrorType.WRITE_REJECTED,
                );

                const { rawData } = decodePayloadData(
                  packet.payloadData,
                  version,
                );

                const rejectStatus = parseInt(`0x${rawData}`, 16);
                const latestSeqNumber = await connection.getSequenceNumber();
                if (
                  rejectStatus ===
                    ErrorPacketRejectReason.INVALID_SEQUENCE_NO &&
                  latestSeqNumber !== sequenceNumber
                ) {
                  error = new DeviceAppError(
                    DeviceAppErrorType.PROCESS_ABORTED,
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
            setRecheckTimeout();
          }
        } catch (error: any) {
          if (Object.values(DeviceConnectionErrorType).includes(error?.code)) {
            cleanUp();
            reject(error);
            return;
          }

          logger.error('Error while rechecking packet on `waitForPacket`');
          logger.error(error);
          setRecheckTimeout();
        }
      }

      timeout = setTimeout(async () => {
        cleanUp();

        if (!(await connection.isConnected())) {
          reject(
            new DeviceConnectionError(
              DeviceConnectionErrorType.CONNECTION_CLOSED,
            ),
          );
        } else {
          reject(
            new DeviceCommunicationError(
              DeviceCommunicationErrorType.READ_TIMEOUT,
            ),
          );
        }
      }, ackTimeout ?? usableConfig.constants.ACK_TIME);

      setRecheckTimeout();

      onCancel = () => {
        isCancelled = true;
        cleanUp();
        reject(new Error('Cancelled'));
      };
    } catch (error) {
      reject(error as any);
    }
  };

  const promise = new Promise<DecodedPacketData>(promiseFunc);
  const cancelablePromise = Object.assign(promise, {
    cancel: onCancel,
    isCancelled: () => isCancelled,
  });

  return cancelablePromise;
};
