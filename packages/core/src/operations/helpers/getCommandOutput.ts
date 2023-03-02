import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import {
  intToUintByte,
  logger,
  PacketVersion,
  PacketVersionMap
} from '../../utils';
import * as config from '../../config';
import { decodePayloadData, encodePacket } from '../../encoders/packet';

import { writeCommand } from './writeCommand';
import canRetry from './canRetry';

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
}) => {
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
    const innerMaxTries = maxTries;
    firstError = undefined;
    let isSuccess = false;

    const packetsList = encodePacket({
      data: intToUintByte(currentPacket, 16),
      version,
      sequenceNumber,
      packetType: usableConfig.commands.PACKET_TYPE.CMD_OUTPUT_REQ,
      isProto: false
    });

    if (packetsList.length > 1) {
      throw new Error('Get Command Output exceeded 1 packet limit');
    }

    const packet = packetsList[0];

    while (tries <= innerMaxTries && !isSuccess) {
      try {
        const receivedPacket = await writeCommand({
          connection,
          packet,
          version,
          sequenceNumber,
          ackPacketTypes: [
            usableConfig.commands.PACKET_TYPE.CMD_OUTPUT,
            usableConfig.commands.PACKET_TYPE.STATUS
          ]
        });
        dataList[receivedPacket.currentPacketNumber - 1] =
          receivedPacket.payloadData;
        totalPackets = receivedPacket.totalPacketNumber;
        currentPacket += 1;
        isSuccess = true;
        isStatusResponse =
          receivedPacket.packetType ===
          usableConfig.commands.PACKET_TYPE.STATUS;
      } catch (e: any) {
        if (!canRetry(e)) {
          tries = innerMaxTries;
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

  return {
    ...decodePayloadData(finalData, version),
    isStatus: isStatusResponse
  };
};
