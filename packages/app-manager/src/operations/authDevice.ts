import { ISDK } from '@cypherock/sdk-core';
import { DeviceState } from '@cypherock/sdk-interfaces';
import { AuthDeviceStatus } from '../proto/generated/types';
import { deviceAuthService } from '../services';

import {
  assertOrThrowInvalidResult,
  createStatusListener,
  ForceStatusUpdate,
  OnStatus,
  sendQuery,
  waitForResult,
} from '../utils';
import { getDeviceInfo } from './getDeviceInfo';

export type AuthDeviceEventHandler = (event: AuthDeviceStatus) => void;

const deviceNotVerifiedError = new Error('Device not verified');

const verifySerialSignature = async (params: {
  sdk: ISDK;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
}) => {
  const { sdk, onStatus, forceStatusUpdate } = params;

  await sendQuery(sdk, { authDevice: { initiate: {} } });

  const result = await waitForResult(sdk, onStatus);
  assertOrThrowInvalidResult(result.authDevice?.serialSignature);

  forceStatusUpdate(AuthDeviceStatus.AUTH_DEVICE_STATUS_USER_CONFIRMED);

  const challenge = await deviceAuthService.verifySerialSignature({
    ...result.authDevice.serialSignature,
  });
  const { serial } = result.authDevice.serialSignature;

  if (!challenge) {
    throw deviceNotVerifiedError;
  }

  return { serial, challenge };
};

const verifyChallengeSignature = async (params: {
  sdk: ISDK;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
  challenge: Uint8Array;
  serial: Uint8Array;
  firmwareVersion: string;
}) => {
  const { sdk, onStatus, challenge, serial, firmwareVersion } = params;

  await sendQuery(sdk, { authDevice: { challenge: { challenge } } });

  const result = await waitForResult(sdk, onStatus);
  assertOrThrowInvalidResult(result.authDevice?.challengeSignature);

  const isVerified = await deviceAuthService.verifyChallengeSignature({
    ...result.authDevice.challengeSignature,
    challenge,
    serial,
    isTestApp: sdk.getDeviceState() === DeviceState.INITIAL,
    firmwareVersion,
  });

  if (!isVerified) {
    throw deviceNotVerifiedError;
  }
};

export const authDevice = async (
  sdk: ISDK,
  onEvent?: AuthDeviceEventHandler,
): Promise<boolean> => {
  try {
    const info = await getDeviceInfo(sdk);
    assertOrThrowInvalidResult(info.firmwareVersion);

    const firmwareVersion = `${info.firmwareVersion.major}.${info.firmwareVersion.minor}.${info.firmwareVersion.patch}`;

    const { onStatus, forceStatusUpdate } = createStatusListener(
      AuthDeviceStatus,
      onEvent,
    );

    const { serial, challenge } = await verifySerialSignature({
      sdk,
      onStatus,
      forceStatusUpdate,
    });

    await verifyChallengeSignature({
      sdk,
      onStatus,
      forceStatusUpdate,
      serial,
      challenge,
      firmwareVersion,
    });

    await sendQuery(sdk, { authDevice: { result: { verified: true } } });

    return true;
  } catch (error) {
    if (error === deviceNotVerifiedError) {
      await sendQuery(sdk, { authDevice: { result: { verified: false } } });
      return false;
    }

    throw error;
  }
};
