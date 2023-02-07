import {
  DeviceError,
  DeviceErrorType,
  IDeviceConnection
} from '@cypherock/sdk-interfaces';
import {
  intToUintByte,
  logger,
  PacketVersion,
  PacketVersionMap
} from '../utils';
import * as config from '../config';
import {
  DecodedPacketData,
  decodePayloadData,
  decodeRawData,
  decodeStatus,
  encodePacket,
  RawData,
  StatusData
} from '../xmodem';

import { waitForPacket } from './waitForPacket';

const writeCommand = async ({
  connection,
  packet,
  version,
  sequenceNumber
}: {
  connection: IDeviceConnection;
  packet: Uint8Array;
  version: PacketVersion;
  sequenceNumber: number;
}): Promise<DecodedPacketData> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  if (!connection.isConnected()) {
    throw new DeviceError(DeviceErrorType.CONNECTION_CLOSED);
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<DecodedPacketData>(async (resolve, reject) => {
    const ackPromise = waitForPacket({
      connection,
      version,
      packetTypes: [
        usableConfig.commands.PACKET_TYPE.CMD_OUTPUT,
        usableConfig.commands.PACKET_TYPE.STATUS
      ],
      sequenceNumber
    });

    connection.send(packet).catch(error => {
      logger.error(error);
      if (!connection.isConnected()) {
        reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
      } else {
        reject(new DeviceError(DeviceErrorType.WRITE_ERROR));
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

export const getCommandOutput = async ({
  connection,
  version,
  maxTries = 5,
  sequenceNumber
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
}): Promise<StatusData | RawData> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  let firstError: Error | undefined;
  const dataList: string[] = [];

  let totalPackets = 1;
  let currentPacket = 1;
  let isStatusResponse = false;

  while (currentPacket <= totalPackets) {
    let tries = 1;
    const _maxTries = maxTries;
    firstError = undefined;
    let isSuccess = false;

    const packetsList = encodePacket({
      data: intToUintByte(currentPacket, 16),
      version,
      sequenceNumber,
      packetType: usableConfig.commands.PACKET_TYPE.CMD_OUTPUT_REQ
    });

    if (packetsList.length > 1) {
      throw new Error('Get Command Output exceeded 1 packet limit');
    }

    const packet = packetsList[0];

    while (tries <= _maxTries && !isSuccess) {
      try {
        const receivedPacket = await writeCommand({
          connection,
          packet,
          version,
          sequenceNumber
        });
        dataList[receivedPacket.currentPacketNumber - 1] =
          receivedPacket.payloadData;
        totalPackets = receivedPacket.totalPacketNumber;
        currentPacket += 1;
        isSuccess = true;
        isStatusResponse =
          receivedPacket.packetType ===
          usableConfig.commands.PACKET_TYPE.STATUS;
      } catch (e) {
        // Don't retry if connection closed
        if (e instanceof DeviceError) {
          if (
            [
              DeviceErrorType.CONNECTION_CLOSED,
              DeviceErrorType.CONNECTION_NOT_OPEN,
              DeviceErrorType.NOT_CONNECTED,
              DeviceErrorType.WRITE_REJECTED,
              DeviceErrorType.DEVICE_ABORT,
              DeviceErrorType.PROCESS_ABORTED_BY_USER
            ].includes(e.errorType)
          ) {
            tries = _maxTries;
          }
        }

        if (!firstError) {
          firstError = e as Error;
        }

        logger.warn('Error in sending data', e);
      }
      tries += 1;
    }

    if (firstError) {
      throw firstError;
    }
  }

  const finalData = dataList.join('');

  const { rawData } = decodePayloadData(finalData, version);

  let output: StatusData | RawData;
  if (isStatusResponse) {
    output = decodeStatus(rawData, version);
  } else {
    output = decodeRawData(rawData, version);

    if (output.commandType === 42 && output.data.startsWith('04')) {
      throw new DeviceError(DeviceErrorType.DEVICE_ABORT);
    }
  }

  return output;
};
