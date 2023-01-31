import { DeviceError, DeviceErrorType } from '@cypherock/sdk-interfaces';
import { logger } from '../utils';
import { DeviceConnectionInterface, PacketData } from '../types';

const DEFAULT_RECEIVE_TIMEOUT = 15000;

/**
 * waits for the hardware to send a message with one of the specified command numbers and returns the data in hex
 */
// eslint-disable-next-line
export const receiveCommand = (
  connection: DeviceConnectionInterface,
  allAcceptableCommands: number[],
  timeout: number = DEFAULT_RECEIVE_TIMEOUT
) => {
  const resData: any = [];
  return new Promise<{ commandType: number; data: string }>(
    (resolve, reject) => {
      if (!connection.isConnected()) {
        reject(new DeviceError(DeviceErrorType.NOT_CONNECTED));
        return;
      }

      let timeoutIdentifier: NodeJS.Timeout | null = null;

      if (timeout) {
        timeoutIdentifier = setTimeout(() => {
          // eslint-disable-next-line
          connection.removeListener('data', eListener);
          // eslint-disable-next-line
          connection.removeListener('close', onClose);
          reject(new DeviceError(DeviceErrorType.READ_TIMEOUT));
        }, timeout);
      }

      function eListener(packet: PacketData) {
        const { commandType, currentPacketNumber, totalPacket, dataChunk } =
          packet;
        if (allAcceptableCommands.includes(commandType)) {
          connection.onPacketUse(packet.id);

          resData[currentPacketNumber - 1] = dataChunk;
          if (currentPacketNumber === totalPacket) {
            if (commandType === 49) {
              logger.info(`Received command (${commandType})`);
              logger.debug(
                `Received command (${commandType}) : ${resData.join('')}`
              );
            } else {
              logger.info(
                `Received command (${commandType}) : ${resData.join('')}`
              );
            }
            resolve({ commandType, data: resData.join('') });
            if (timeoutIdentifier) {
              clearTimeout(timeoutIdentifier);
            }
            connection.removeListener('data', eListener);
            // eslint-disable-next-line
            connection.removeListener('close', onClose);
          }
        }
      }

      function onClose(err: any) {
        if (timeoutIdentifier) {
          clearTimeout(timeoutIdentifier);
        }

        connection.removeListener('data', eListener);
        connection.removeListener('close', onClose);

        if (err) {
          logger.error(err);
        }

        reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
      }

      connection.addListener('close', onClose);
      connection.addListener('data', eListener);
      connection.getPacketsFromPool(allAcceptableCommands).forEach(eListener);
    }
  );
};
