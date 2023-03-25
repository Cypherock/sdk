import { PacketVersionMap } from '../../../utils';

export const rawDataTestCases = {
  validEncodings: [
    {
      rawData: {
        commandType: 1,
        data: '',
        isRawData: true,
        isStatus: false,
      },
      encoded: '00000001',
    },
    {
      rawData: {
        commandType: 53,
        data: '3b986b12c84e96ee4d20e8dd9835b14b1767c09dd3eb24c203c1',
        isRawData: true,
        isStatus: false,
      },
      encoded: '000000353b986b12c84e96ee4d20e8dd9835b14b1767c09dd3eb24c203c1',
    },
    {
      rawData: {
        commandType: 213,
        data: 'd70a9bb4b65fd5b0b838a26092cd3886816c1586a7d8fb6e177b83258a39bb86714775390f5a4ba4d428fecc9ecfb65f5c08cd07ee9a3bc95f1ae7d72526a3c65debf711b9c5ccf380a69e7086bfa77a6c378fed71639888f2610fb44f5ee45ea207862e01578d629ac3cb4efb2a262c78c4d65d1c3578b97514789618d84beef1c2bd34396d7c5b6eb42bb054cee9d78da362cdaf43b5d7a9e799889733e596f2ef',
        isRawData: true,
        isStatus: false,
      },
      encoded:
        '000000d5d70a9bb4b65fd5b0b838a26092cd3886816c1586a7d8fb6e177b83258a39bb86714775390f5a4ba4d428fecc9ecfb65f5c08cd07ee9a3bc95f1ae7d72526a3c65debf711b9c5ccf380a69e7086bfa77a6c378fed71639888f2610fb44f5ee45ea207862e01578d629ac3cb4efb2a262c78c4d65d1c3578b97514789618d84beef1c2bd34396d7c5b6eb42bb054cee9d78da362cdaf43b5d7a9e799889733e596f2ef',
    },
  ],
};

export const encodeRawDataTestCases = {
  invalid: [
    {
      rawData: {
        commandType: 1,
        data: '',
      },
      version: PacketVersionMap.v1,
    },
    {
      rawData: {
        commandType: 1,
        data: '',
      },
      version: PacketVersionMap.v2,
    },
    {
      rawData: {
        commandType: 1,
        data: '',
      },
      version: 'invalid',
    },
    {
      rawData: null,
      version: PacketVersionMap.v3,
    },
    {
      rawData: {
        commandType: 1,
        data: '',
      },
      version: null,
    },
    {
      rawData: undefined,
      version: PacketVersionMap.v3,
    },
    {
      rawData: {
        commandType: 1,
        data: '',
      },
      version: undefined,
    },
    {
      rawData: {
        commandType: null,
        data: '',
      },
      version: PacketVersionMap.v3,
    },
    {
      rawData: {
        commandType: 1,
        data: null,
      },
      version: PacketVersionMap.v3,
    },
    {
      rawData: {
        commandType: undefined,
        data: '',
      },
      version: PacketVersionMap.v3,
    },
    {
      rawData: {
        commandType: 1,
        data: undefined,
      },
      version: PacketVersionMap.v3,
    },
    {
      rawData: {
        commandType: -1,
        data: '',
      },
      version: PacketVersionMap.v3,
    },
    {
      rawData: {
        commandType: 9999999999,
        data: '',
      },
      version: PacketVersionMap.v3,
    },
  ],
};

export const decodeRawDataTestCases = {
  invalid: [
    {
      payload: '',
      version: PacketVersionMap.v1,
    },
    {
      payload: '',
      version: PacketVersionMap.v2,
    },
    {
      payload: '',
      version: 'invalid',
    },
    {
      payload: null,
      version: PacketVersionMap.v3,
    },
    {
      payload: '',
      version: null,
    },
    {
      payload: undefined,
      version: PacketVersionMap.v3,
    },
    {
      payload: '',
      version: undefined,
    },
    {
      payload: '5818f605bc3531741s',
      version: PacketVersionMap.v3,
    },
    {
      payload: '0x12s',
      version: PacketVersionMap.v3,
    },
  ],
};

export const decodeStatusTestCases = {
  validEncodings: [
    {
      encoded: '',
      status: {
        deviceState: '0',
        deviceIdleState: 0,
        deviceWaitingOn: 0,
        abortDisabled: false,
        currentCmdSeq: 0,
        cmdState: 0,
        flowStatus: 0,
        isStatus: true,
      },
    },
    {
      encoded: '01010002010004',
      status: {
        deviceState: '1',
        deviceIdleState: 1,
        deviceWaitingOn: 0,
        abortDisabled: true,
        currentCmdSeq: 2,
        cmdState: 1,
        flowStatus: 4,
        isStatus: true,
      },
    },
    {
      encoded: '03000f020100a4',
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
    {
      encoded: '23000032070084',
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
  ],
  invalid: [
    {
      payload: '',
      version: PacketVersionMap.v1,
    },
    {
      payload: '',
      version: PacketVersionMap.v2,
    },
    {
      payload: '',
      version: 'invalid',
    },
    {
      payload: null,
      version: PacketVersionMap.v3,
    },
    {
      payload: '',
      version: null,
    },
    {
      payload: undefined,
      version: PacketVersionMap.v3,
    },
    {
      payload: '',
      version: undefined,
    },
    {
      payload: '5818f605bc3531741s',
      version: PacketVersionMap.v3,
    },
    {
      payload: '0x12s',
      version: PacketVersionMap.v3,
    },
  ],
};
