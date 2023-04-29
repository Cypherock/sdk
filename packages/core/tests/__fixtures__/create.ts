const sdkCreateTestCases = {
  valid: [
    {
      output: { sdkVersion: '0.1.16', packetVersion: 'v1' },
      isLegacyOperationSupported: true,
      isRawOperationSupported: false,
      isProtoOperationSupported: false,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([170, 1, 7, 0, 1, 0, 1, 0, 69, 133]),
        new Uint8Array([170, 88, 12, 0, 1, 0, 1, 0, 0, 0, 1, 0, 16, 118, 67]),
      ],
    },
    {
      output: { sdkVersion: '0.1.16', packetVersion: 'v1' },
      isLegacyOperationSupported: true,
      isRawOperationSupported: false,
      isProtoOperationSupported: false,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 0, 0,
          1, 0, 16, 118, 67,
        ]),
      ],
    },
    {
      output: { sdkVersion: '1.17.6', packetVersion: 'v2' },
      isLegacyOperationSupported: true,
      isRawOperationSupported: false,
      isProtoOperationSupported: false,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([170, 1, 7, 0, 1, 0, 1, 0, 69, 133]),
        new Uint8Array([170, 88, 12, 0, 1, 0, 1, 0, 1, 0, 17, 0, 6, 237, 134]),
      ],
    },
    {
      output: { sdkVersion: '1.17.6', packetVersion: 'v2' },
      isLegacyOperationSupported: true,
      isRawOperationSupported: false,
      isProtoOperationSupported: false,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 1, 0,
          17, 0, 6, 237, 134,
        ]),
      ],
    },
    {
      output: { sdkVersion: '2.7.1', packetVersion: 'v3' },
      isLegacyOperationSupported: false,
      isRawOperationSupported: true,
      isProtoOperationSupported: false,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([170, 1, 7, 0, 1, 0, 1, 0, 69, 133]),
        new Uint8Array([170, 88, 12, 0, 1, 0, 1, 0, 2, 0, 7, 0, 1, 130, 112]),
      ],
    },
    {
      output: { sdkVersion: '3.0.1', packetVersion: 'v3' },
      isLegacyOperationSupported: false,
      isRawOperationSupported: false,
      isProtoOperationSupported: true,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([170, 1, 7, 0, 1, 0, 1, 0, 69, 133]),
        new Uint8Array([170, 88, 12, 0, 1, 0, 1, 0, 3, 0, 0, 0, 1, 173, 177]),
      ],
    },
    {
      output: { sdkVersion: '3.2.49', packetVersion: 'v3' },
      isLegacyOperationSupported: false,
      isRawOperationSupported: false,
      isProtoOperationSupported: true,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([170, 1, 7, 0, 1, 0, 1, 0, 69, 133]),
        new Uint8Array([170, 88, 12, 0, 1, 0, 1, 0, 3, 0, 2, 0, 49, 245, 130]),
      ],
    },
    {
      output: { sdkVersion: '3.2.49', packetVersion: 'v3' },
      isLegacyOperationSupported: false,
      isRawOperationSupported: false,
      isProtoOperationSupported: true,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 3, 0,
          2, 0, 49, 245, 130,
        ]),
      ],
    },
    {
      output: { sdkVersion: '21.49.530', packetVersion: undefined },
      isLegacyOperationSupported: false,
      isRawOperationSupported: false,
      isProtoOperationSupported: false,
      isInBootloader: false,
      packet: new Uint8Array([170, 88, 7, 0, 1, 0, 1, 0, 69, 133]),
      ackPackets: [
        new Uint8Array([170, 1, 7, 0, 1, 0, 1, 0, 69, 133]),
        new Uint8Array([
          170, 88, 12, 0, 1, 0, 1, 0, 21, 0, 49, 2, 18, 210, 203,
        ]),
      ],
    },
  ],
};

export default sdkCreateTestCases;
