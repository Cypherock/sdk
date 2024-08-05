import { expect } from '@jest/globals';

import * as commandMocks from '../../../src/__mocks__/commands';
import * as serviceMocks from '../../../src/__mocks__/services';
import { ISendCommandParams } from '../../../src/operations/helpers';
import {
  IInitiateServerSessionParams,
  IInitiateServerSessionResult,
} from '../../../src/services';

export interface ITestCase {
  sendCommands: {
    name: string;
    data: Pick<
      ISendCommandParams,
      'protoData' | 'rawData' | 'sequenceNumber' | 'version'
    >;
  }[];
  results: {
    name: string;
    data: Uint8Array;
  }[];
  mocks?: {
    initiateServerSession?: {
      params: IInitiateServerSessionParams;
      result: IInitiateServerSessionResult;
    };
    startServerSession?: {
      params: { sessionId: string };
    };
  };
}

export function setupMocks(testCase: ITestCase) {
  testCase.sendCommands.forEach(() => {
    commandMocks.sendCommand.mockReturnValueOnce(Promise.resolve(undefined));
  });

  testCase.results.forEach(result => {
    commandMocks.waitForResult.mockResolvedValueOnce(result.data);
  });

  if (testCase.mocks?.initiateServerSession) {
    serviceMocks.initiateServerSession.mockResolvedValueOnce(
      testCase.mocks.initiateServerSession.result,
    );
  }

  if (testCase.mocks?.startServerSession) {
    serviceMocks.startServerSession.mockResolvedValueOnce(undefined);
  }
}

export function clearMocks() {
  commandMocks.sendCommand.mockClear();
  commandMocks.waitForResult.mockClear();
  serviceMocks.initiateServerSession.mockClear();
  serviceMocks.startServerSession.mockClear();
}

export function expectMockCalls(testCase: ITestCase) {
  expect(
    commandMocks.sendCommand.mock.calls.map(elem => ({
      rawData: elem[0].rawData,
      protoData: elem[0].protoData,
      sequenceNumber: elem[0].sequenceNumber,
      version: elem[0].version,
    })),
  ).toEqual(testCase.sendCommands.map(elem => elem.data));

  if (testCase.mocks?.initiateServerSession) {
    expect(
      serviceMocks.initiateServerSession.mock.calls.map(e => e[0]),
    ).toEqual([testCase.mocks.initiateServerSession.params]);
  }

  if (testCase.mocks?.startServerSession) {
    expect(serviceMocks.startServerSession.mock.calls.map(e => e[0])).toEqual([
      testCase.mocks.startServerSession.params,
    ]);
  }
}
