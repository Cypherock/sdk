import { IGetDeviceInfoTestCase } from './types';

const withOneApplet: IGetDeviceInfoTestCase = {
  name: 'Info with 1 applet',
  query: new Uint8Array([10, 0]),
  result: new Uint8Array([
    10, 30, 10, 12, 123, 43, 26, 231, 42, 86, 91, 130, 41, 55, 186, 203, 18, 2,
    8, 1, 24, 1, 34, 8, 8, 12, 18, 4, 8, 1, 24, 26,
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
  },
};

const withTwoApplet: IGetDeviceInfoTestCase = {
  name: 'Info with 2 applets',
  query: new Uint8Array([10, 0]),
  result: new Uint8Array([
    10, 34, 10, 3, 90, 221, 135, 18, 2, 8, 1, 24, 1, 34, 11, 8, 2, 18, 7, 8, 93,
    16, 214, 1, 24, 26, 34, 8, 8, 12, 18, 4, 8, 1, 24, 26,
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
  },
};

const withOnlyDeviceSerial: IGetDeviceInfoTestCase = {
  name: 'Only device serial',
  query: new Uint8Array([10, 0]),
  result: new Uint8Array([10, 4, 10, 2, 12, 124]),
  output: {
    deviceSerial: new Uint8Array([12, 124]),
    firmwareVersion: undefined,
    isAuthenticated: false,
    appletList: [],
  },
};

const withPartialData: IGetDeviceInfoTestCase = {
  name: 'Partial data',
  query: new Uint8Array([10, 0]),
  result: new Uint8Array([10, 9, 10, 5, 234, 21, 53, 31, 64, 24, 1]),
  output: {
    deviceSerial: new Uint8Array([234, 21, 53, 31, 64]),
    firmwareVersion: undefined,
    isAuthenticated: true,
    appletList: [],
  },
};

const valid: IGetDeviceInfoTestCase[] = [
  withOneApplet,
  withTwoApplet,
  withOnlyDeviceSerial,
  withPartialData,
];

export default valid;
