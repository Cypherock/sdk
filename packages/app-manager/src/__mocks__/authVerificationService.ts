import { jest } from '@jest/globals';

export const verifySerialSignature = jest.fn();
export const verifyChallengeSignature = jest.fn();

jest.mock('../services/authVerification', () => ({
  __esModule: true,
  verifySerialSignature,
  verifyChallengeSignature,
}));
