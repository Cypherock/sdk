import { jest } from '@jest/globals';
import {
  IInitiateServerSessionParams,
  IInitiateServerSessionResult,
} from '../services/types';

type InitiateServerSessionType = (
  params: IInitiateServerSessionParams,
) => Promise<IInitiateServerSessionResult>;
type StartServerSessionType = (params: { sessionId: string }) => Promise<void>;

export const initiateServerSession: jest.Mock<InitiateServerSessionType> =
  jest.fn<InitiateServerSessionType>();
export const startServerSession: jest.Mock<StartServerSessionType> =
  jest.fn<StartServerSessionType>();

jest.mock('../services', () => {
  const originalModule: any = jest.requireActual('../services');

  return {
    __esModule: true,
    ...originalModule,
    initiateServerSession,
    startServerSession,
  };
});
