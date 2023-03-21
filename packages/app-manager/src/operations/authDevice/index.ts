import { ISDK } from '@cypherock/sdk-core';
import { DeviceState } from '@cypherock/sdk-interfaces';
import { AuthDeviceStatus } from '../../proto/generated/types';
import { deviceAuthService } from '../../services';

import {
  assertOrThrowInvalidResult,
  createStatusListener,
  ForceStatusUpdate,
  OnStatus,
  OperationHelper,
} from '../../utils';
import { getDeviceInfo } from '../getDeviceInfo';
import { AuthDeviceEventHandler } from './types';

export * from './types';

const deviceNotVerifiedError = new Error('Device not verified');

const verifySerialSignature = async (params: {
  helper: OperationHelper<'authDevice', 'authDevice'>;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
}) => {
  const { helper, onStatus, forceStatusUpdate } = params;

  await helper.sendQuery({ initiate: {} });

  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.serialSignature);

  forceStatusUpdate(AuthDeviceStatus.AUTH_DEVICE_STATUS_USER_CONFIRMED);

  const challenge = await deviceAuthService.verifyDeviceSerialSignature({
    ...result.serialSignature,
  });
  const { serial } = result.serialSignature;

  if (!challenge) {
    throw deviceNotVerifiedError;
  }

  return { serial, challenge };
};

const verifyChallengeSignature = async (params: {
  helper: OperationHelper<'authDevice', 'authDevice'>;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
  challenge: Uint8Array;
  serial: Uint8Array;
  firmwareVersion: string;
}) => {
  const { helper, onStatus, challenge, serial, firmwareVersion } = params;

  await helper.sendQuery({ challenge: { challenge } });

  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.challengeSignature);

  const isVerified = await deviceAuthService.verifyDeviceChallengeSignature({
    ...result.challengeSignature,
    challenge,
    serial,
    isTestApp: helper.sdk.getDeviceState() === DeviceState.INITIAL,
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
  const helper = new OperationHelper(sdk, 'authDevice', 'authDevice');

  try {
    const info = await getDeviceInfo(sdk);
    assertOrThrowInvalidResult(info.firmwareVersion);

    const firmwareVersion = `${info.firmwareVersion.major}.${info.firmwareVersion.minor}.${info.firmwareVersion.patch}`;

    const { onStatus, forceStatusUpdate } = createStatusListener(
      AuthDeviceStatus,
      onEvent,
    );

    const { serial, challenge } = await verifySerialSignature({
      helper,
      onStatus,
      forceStatusUpdate,
    });

    await verifyChallengeSignature({
      helper,
      onStatus,
      forceStatusUpdate,
      serial,
      challenge,
      firmwareVersion,
    });

    await helper.sendQuery({ result: { verified: true } });

    return true;
  } catch (error) {
    if (error === deviceNotVerifiedError) {
      await helper.sendQuery({ result: { verified: false } });
      return false;
    }

    throw error;
  }
};
