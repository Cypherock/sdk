const updateCRC16 = (crcParam: any, byte: any) => {
  let input = byte | 0x100;
  let crc = crcParam;
  do {
    crc <<= 1;
    input <<= 1;
    if (input & 0x100) crc += 1;
    if (crc & 0x10000) crc ^= 0x1021;
  } while (!(input & 0x10000));
  return crc & 0xffff;
};

const crc16 = (dataBuff: Buffer) => {
  let crc = 0;
  dataBuff.at(0);
  // eslint-disable-next-line
  for (let index = 0; index < dataBuff.length; index += 1) {
    const i = dataBuff.at(index);
    crc = updateCRC16(crc, i);
  }
  crc = updateCRC16(crc, 0);
  crc = updateCRC16(crc, 0);
  return crc & 0xffff;
};

export { updateCRC16, crc16 };
