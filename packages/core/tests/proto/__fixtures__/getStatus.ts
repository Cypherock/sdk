const protoGetStatusTestCases = {
  constantDate: new Date('2023-03-07T09:43:48.755Z'),
  valid: [
    {
      name: 'CmdSeq: 50',
      statusRequest: new Uint8Array([
        85, 85, 169, 56, 0, 1, 0, 1, 255, 255, 1, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          85, 85, 41, 170, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11, 0,
          0, 8, 2, 16, 3, 32, 50, 40, 7, 48, 132, 1,
        ]),
      ],
      status: {
        deviceIdleState: 3,
        deviceWaitingOn: 2,
        abortDisabled: false,
        currentCmdSeq: 50,
        cmdState: 7,
        flowStatus: 132,
      },
    },
    {
      name: 'CmdSeq: 3842',
      statusRequest: new Uint8Array([
        85, 85, 169, 56, 0, 1, 0, 1, 255, 255, 1, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          170, 63, 27, 0, 2, 0, 2, 10, 16, 97, 6, 47, 150, 92, 178, 86, 238, 68,
          168, 147, 34, 27, 233, 174, 197, 213, 124, 255, 32, 26,
        ]),
        new Uint8Array([170, 1, 6, 0, 0, 0, 0, 0]),
        new Uint8Array([
          85, 85, 18, 100, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 14, 0, 10, 0,
          0, 16, 3, 32, 130, 30, 40, 1, 48, 164, 1,
        ]),
      ],
      status: {
        deviceIdleState: 3,
        deviceWaitingOn: 0,
        abortDisabled: false,
        currentCmdSeq: 3842,
        cmdState: 1,
        flowStatus: 164,
      },
    },
  ],
};

export default protoGetStatusTestCases;
