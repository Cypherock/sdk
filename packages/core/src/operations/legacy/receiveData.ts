import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  IDeviceConnection,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import { PacketVersion, PacketVersionMap } from '../../utils';
import {
  xmodemDecode,
  LegacyDecodedPacketData,
} from '../../encoders/packet/legacy';
import * as config from '../../config';
import assert from '../../utils/assert';

const DEFAULT_RECEIVE_TIMEOUT = 15000;

/**
 * waits for the hardware to send a message with one of the specified command numbers and returns the data in hex
 */
export const receiveData = (
  connection: IDeviceConnection,
  allAcceptableCommands: number[],
  version: PacketVersion,
  timeout: number = DEFAULT_RECEIVE_TIMEOUT,
) =>
  new Promise<{ commandType: number; data: string }>((resolve, reject) => {
    try {
      assert(connection, 'Invalid connection');
      assert(allAcceptableCommands, 'Invalid allAcceptableCommands');
      assert(version, 'Invalid version');

      if (![PacketVersionMap.v1, PacketVersionMap.v2].includes(version)) {
        throw new DeviceCompatibilityError(
          DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
        );
      }

      assert(
        allAcceptableCommands.length > 0,
        'allAcceptableCommands should not be empty',
      );

      const resData: string[] = [];

      if (!connection.isConnected()) {
        throw new DeviceConnectionError(
          DeviceConnectionErrorType.CONNECTION_CLOSED,
        );
      }

      if (!connection.isConnected()) {
        reject(
          new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED),
        );
        return;
      }

      let timeoutIdentifier: NodeJS.Timeout | null = null;
      let recheckTimeout: NodeJS.Timeout | null = null;

      // eslint-disable-next-line
      function cleanUp() {
        if (timeoutIdentifier) {
          clearTimeout(timeoutIdentifier);
        }
        if (recheckTimeout) {
          clearTimeout(recheckTimeout);
        }
      }

      if (timeout) {
        timeoutIdentifier = setTimeout(() => {
          cleanUp();
          reject(
            new DeviceCommunicationError(
              DeviceCommunicationErrorType.READ_TIMEOUT,
            ),
          );
        }, timeout);
      }

      // eslint-disable-next-line
      function processPacket(packet: LegacyDecodedPacketData) {
        const { commandType, currentPacketNumber, totalPacket, dataChunk } =
          packet;
        if (allAcceptableCommands.includes(commandType)) {
          resData[currentPacketNumber - 1] = dataChunk;
          if (currentPacketNumber === totalPacket) {
            cleanUp();
            resolve({ commandType, data: resData.join('') });
            return true;
          }
        }

        return false;
      }

      // eslint-disable-next-line
      async function recheckPacket() {
        try {
          if (!connection.isConnected()) {
            reject(
              new DeviceConnectionError(
                DeviceConnectionErrorType.CONNECTION_CLOSED,
              ),
            );
            return;
          }

          const data = await connection.receive();
          if (!data) {
            recheckTimeout = setTimeout(
              recheckPacket,
              config.v1.constants.RECHECK_TIME,
            );
            return;
          }

          const packetList = xmodemDecode(data, version);
          let isDone = false;

          for (const packet of packetList) {
            isDone = processPacket(packet);
            if (isDone) break;
          }

          if (!isDone) {
            recheckTimeout = setTimeout(
              recheckPacket,
              config.v1.constants.RECHECK_TIME,
            );
          }
        } catch (error) {
          cleanUp();
          reject(
            new DeviceCommunicationError(
              DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR,
            ),
          );
        }
      }

      recheckTimeout = setTimeout(
        recheckPacket,
        config.v1.constants.RECHECK_TIME,
      );
    } catch (error) {
      reject(error);
    }
  });
