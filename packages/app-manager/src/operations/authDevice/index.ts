import { ISDK } from '@cypherock/sdk-core';
import { DeviceState } from '@cypherock/sdk-interfaces';
import {
  createLoggerWithPrefix,
  createStatusListener,
  ForceStatusUpdate,
  OnStatus,
} from '@cypherock/sdk-utils';
import { AuthDeviceStatus } from '../../proto/generated/types';
import { deviceAuthService } from '../../services';

import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { getDeviceInfo } from '../getDeviceInfo';
import { AuthDeviceEventHandler } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'AuthDevice');

const deviceNotVerifiedError = new Error('Device not verified');

const verifySerialSignature = async (params: {
  helper: OperationHelper<'authDevice', 'authDevice'>;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
}) => {
  const { helper, onStatus, forceStatusUpdate } = params;

  await helper.sendQuery({ initiate: {} });

  const result = await helper.waitForResult(onStatus);
  logger.verbose('AuthDeviceResponse', { result });
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
  logger.verbose('AuthDeviceResponse', { result });
  assertOrThrowInvalidResult(result.challengeSignature);

  const isVerified = await deviceAuthService.verifyDeviceChallengeSignature({
    ...result.challengeSignature,
    challenge,
    serial,
    isTestApp: (await helper.sdk.getDeviceState()) === DeviceState.INITIAL,
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
    logger.info('Started');
    const info = await getDeviceInfo(sdk);
    assertOrThrowInvalidResult(info.firmwareVersion);

    const firmwareVersion = `${info.firmwareVersion.major}.${info.firmwareVersion.minor}.${info.firmwareVersion.patch}`;

    const { onStatus, forceStatusUpdate } = createStatusListener({
      enums: AuthDeviceStatus,
      onEvent,
      logger,
    });

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
    const result = await helper.waitForResult();
    logger.verbose('AuthDeviceResponse', { result });
    assertOrThrowInvalidResult(result.flowComplete);

    logger.info('Completed', { verified: true });
    return true;
  } catch (error) {
    if (error === deviceNotVerifiedError) {
      await helper.sendQuery({ result: { verified: false } });
      const result = await helper.waitForResult();
      logger.verbose('AuthDeviceResponse', { result });
      assertOrThrowInvalidResult(result.flowComplete);

      logger.info('Completed', { verified: false });
      return false;
    }

    logger.info('Failed');
    throw error;
  }
};
