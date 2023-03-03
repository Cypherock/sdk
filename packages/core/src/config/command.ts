export const v1 = {
  ACK_PACKET: 1,
  NACK_PACKET: 7,
  USB_CONNECTION_STATE_PACKET: 8,
};

export const v3 = {
  PACKET_TYPE: {
    STATUS_REQ: 1,
    CMD: 2,
    CMD_OUTPUT_REQ: 3,
    STATUS: 4,
    CMD_ACK: 5,
    CMD_OUTPUT: 6,
    ERROR: 7,
    ABORT: 8,
  },
};

export default v1;
