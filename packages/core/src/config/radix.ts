export const v1 = {
  currentPacketNumber: 16,
  totalPacket: 16,
  dataSize: 8,
  commandType: 8,
  walletIndex: 8,
  coinType: 8,
  futureUse: 8,
  inputOutputCount: 8,
  addressIndex: 32,
  accountIndex: 8,
  crc: 16,
  outputLength: 8,
  addCoins: {
    wallet: 128,
    noOfCoins: 8,
    coinType: 32,
  },
  receiveAddress: {
    coinType: 32,
    accountIndex: 32,
  },
};

export const v2 = {
  currentPacketNumber: 16,
  totalPacket: 16,
  dataSize: 8,
  commandType: 8 * 4,
  walletIndex: 8,
  coinType: 8,
  futureUse: 8,
  inputOutputCount: 8,
  addressIndex: 32,
  accountIndex: 8,
  crc: 16,
  outputLength: 8,
  addCoins: {
    wallet: 128,
    noOfCoins: 8,
    coinType: 32,
  },
  receiveAddress: {
    coinType: 32,
    accountIndex: 32,
  },
};

export const v3 = {
  currentPacketNumber: 16,
  totalPacket: 16,
  sequenceNumber: 16,
  packetType: 8,
  commandType: 32,
  payloadLength: 8,
  timestampLength: 32,
  dataSize: 16,
  crc: 16,
  status: {
    deviceState: 8,
    abortDisabled: 8,
    currentCmdSeq: 16,
    cmdState: 8,
    flowStatus: 16,
  },
};

export default v1;
