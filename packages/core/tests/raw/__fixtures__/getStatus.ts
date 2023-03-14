const rawGetStatusTestCases = {
  constantDate: new Date('2023-03-07T09:43:48.755Z'),
  valid: [
    {
      name: 'CmdSeq: 50',
      statusRequest: new Uint8Array([
        85, 85, 169, 56, 0, 1, 0, 1, 255, 255, 1, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          85, 85, 193, 143, 0, 1, 0, 1, 255, 255, 4, 1, 0, 18, 8, 11, 0, 0, 0,
          7, 35, 0, 0, 50, 7, 0, 132,
        ]),
      ],
      status: {
        deviceState: '23',
        deviceIdleState: 3,
        deviceWaitingOn: 2,
        abortDisabled: false,
        currentCmdSeq: 50,
        cmdState: 7,
        flowStatus: 132,
        isStatus: true,
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
          85, 85, 250, 109, 0, 1, 0, 1, 255, 255, 4, 1, 0, 18, 10, 11, 0, 0, 0,
          7, 3, 0, 15, 2, 1, 0, 164,
        ]),
      ],
      status: {
        deviceState: '3',
        deviceIdleState: 3,
        deviceWaitingOn: 0,
        abortDisabled: false,
        currentCmdSeq: 3842,
        cmdState: 1,
        flowStatus: 164,
        isStatus: true,
      },
    },
  ],
};

export default rawGetStatusTestCases;
