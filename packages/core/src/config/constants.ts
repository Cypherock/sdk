export const v1 = {
  START_OF_FRAME: 'AA',
  STUFFING_BYTE: 0xaa,
  ACK_BYTE: '06',
  CHUNK_SIZE: 32 * 2,
  ACK_TIME: 2000,
  RECHECK_TIME: 50,
};

export const v2 = {
  START_OF_FRAME: '5A5A',
  STUFFING_BYTE: 0x5a,
  ACK_BYTE: '06',
  CHUNK_SIZE: 32 * 2,
  ACK_TIME: 2000,
  RECHECK_TIME: 50,
};

export const v3 = {
  START_OF_FRAME: '5555',
  STUFFING_BYTE: 0x5a,
  ACK_BYTE: '06',
  CHUNK_SIZE: 48 * 2,
  ACK_TIME: 2000,
  CMD_RESPONSE_TIME: 2000,
  RECHECK_TIME: 50,
};

export default v1;
