import { IGetDeviceInfoTestCase } from './types';

const withOneApplet: IGetDeviceInfoTestCase = {
  name: 'Info with 1 applet',
  query: new Uint8Array([10, 2, 10, 0]),
  result: new Uint8Array([
    10, 32, 10, 30, 10, 12, 123, 43, 26, 231, 42, 86, 91, 130, 41, 55, 186, 203,
    18, 2, 8, 1, 24, 1, 34, 8, 8, 12, 18, 4, 8, 1, 24, 26,
  ]),
  output: {
    deviceSerial: new Uint8Array([
      123, 43, 26, 231, 42, 86, 91, 130, 41, 55, 186, 203,
    ]),
    firmwareVersion: {
      major: 1,
      minor: 0,
      patch: 0,
    },
    isAuthenticated: true,
    appletList: [
      {
        id: 12,
        version: {
          major: 1,
          minor: 0,
          patch: 26,
        },
      },
    ],
    initialStates: undefined,
    isInitial: false,
  },
};

const withTwoApplet: IGetDeviceInfoTestCase = {
  name: 'Info with 2 applets',
  query: new Uint8Array([10, 2, 10, 0]),
  result: new Uint8Array([
    10, 36, 10, 34, 10, 3, 90, 221, 135, 18, 2, 8, 1, 24, 1, 34, 11, 8, 2, 18,
    7, 8, 93, 16, 214, 1, 24, 26, 34, 8, 8, 12, 18, 4, 8, 1, 24, 26,
  ]),
  output: {
    deviceSerial: new Uint8Array([90, 221, 135]),
    firmwareVersion: {
      major: 1,
      minor: 0,
      patch: 0,
    },
    isAuthenticated: true,
    appletList: [
      {
        id: 2,
        version: {
          major: 93,
          minor: 214,
          patch: 26,
        },
      },
      {
        id: 12,
        version: {
          major: 1,
          minor: 0,
          patch: 26,
        },
      },
    ],
    initialStates: undefined,
    isInitial: false,
  },
};

const withOnlyDeviceSerial: IGetDeviceInfoTestCase = {
  name: 'Only device serial',
  query: new Uint8Array([10, 2, 10, 0]),
  result: new Uint8Array([10, 6, 10, 4, 10, 2, 12, 124]),
  output: {
    deviceSerial: new Uint8Array([12, 124]),
    firmwareVersion: undefined,
    isAuthenticated: false,
    appletList: [],
    initialStates: undefined,
    isInitial: false,
  },
};

const withPartialData: IGetDeviceInfoTestCase = {
  name: 'Partial data',
  query: new Uint8Array([10, 2, 10, 0]),
  result: new Uint8Array([10, 11, 10, 9, 10, 5, 234, 21, 53, 31, 64, 24, 1]),
  output: {
    deviceSerial: new Uint8Array([234, 21, 53, 31, 64]),
    firmwareVersion: undefined,
    isAuthenticated: true,
    appletList: [],
    initialStates: undefined,
    isInitial: false,
  },
};

const withInitialStates: IGetDeviceInfoTestCase = {
  name: 'With initial states',
  query: new Uint8Array([10, 2, 10, 0]),
  result: new Uint8Array([
    10, 48, 10, 46, 10, 12, 123, 43, 26, 231, 42, 86, 91, 130, 41, 55, 186, 203,
    18, 2, 8, 1, 24, 1, 34, 8, 8, 12, 18, 4, 8, 1, 24, 26, 40, 1, 50, 12, 10, 2,
    8, 1, 18, 2, 8, 1, 26, 2, 16, 2,
  ]),
  output: {
    deviceSerial: new Uint8Array([
      123, 43, 26, 231, 42, 86, 91, 130, 41, 55, 186, 203,
    ]),
    firmwareVersion: {
      major: 1,
      minor: 0,
      patch: 0,
    },
    isAuthenticated: true,
    appletList: [
      {
        id: 12,
        version: {
          major: 1,
          minor: 0,
          patch: 26,
        },
      },
    ],
    initialStates: {
      authDevice: {
        isCompleted: true,
        state: undefined,
      },
      userTraining: {
        isCompleted: true,
        state: undefined,
      },
      authCards: {
        isCompleted: false,
        state: 2,
      },
    },
    isInitial: true,
  },
};

const valid: IGetDeviceInfoTestCase[] = [
  withOneApplet,
  withTwoApplet,
  withOnlyDeviceSerial,
  withPartialData,
  withInitialStates,
];

export default valid;
