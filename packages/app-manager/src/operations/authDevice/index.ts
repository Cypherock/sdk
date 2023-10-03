import { ISDK } from '@cypherock/sdk-core';
import {
  DeviceAppError,
  DeviceAppErrorType,
  DeviceState,
} from '@cypherock/sdk-interfaces';
import {
  createLoggerWithPrefix,
  createStatusListener,
  ForceStatusUpdate,
  OnStatus,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { AuthDeviceStatus } from '../../proto/generated/types';
import { deviceAuthService } from '../../services';

import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { getDeviceInfo } from '../getDeviceInfo';
import { IAuthDeviceParams } from './types';

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
  email?: string;
  cysyncVersion?: string;
}) => {
  const {
    helper,
    onStatus,
    challenge,
    serial,
    firmwareVersion,
    email,
    cysyncVersion,
  } = params;

  await helper.sendQuery({ challenge: { challenge } });

  const result = await helper.waitForResult(onStatus);
  logger.verbose('AuthDeviceResponse', { result });
  assertOrThrowInvalidResult(result.challengeSignature);

  const { isVerified } = await deviceAuthService.verifyDeviceChallengeSignature(
    {
      ...result.challengeSignature,
      challenge,
      serial,
      isTestApp: (await helper.sdk.getDeviceState()) === DeviceState.INITIAL,
      firmwareVersion,
      email,
      cysyncVersion,
    },
  );

  if (!isVerified) {
    throw deviceNotVerifiedError;
  }
};

export const authDevice = async (
  sdk: ISDK,
  params?: IAuthDeviceParams,
): Promise<void> => {
  const { onEvent, email, cysyncVersion } = params ?? {};

  const helper = new OperationHelper(sdk, 'authDevice', 'authDevice');

  try {
    logger.info('Started');

    await sdk.checkAppCompatibility(APP_VERSION);

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
      email,
      cysyncVersion,
    });

    await helper.sendQuery({ result: { verified: true } });
    const result = await helper.waitForResult();
    logger.verbose('AuthDeviceResponse', { result });
    assertOrThrowInvalidResult(result.flowComplete);

    logger.info('Completed', { verified: true });
  } catch (error) {
    if (error === deviceNotVerifiedError) {
      await helper.sendQuery({ result: { verified: false } });
      const result = await helper.waitForResult();
      logger.verbose('AuthDeviceResponse', { result });
      assertOrThrowInvalidResult(result.flowComplete);

      logger.info('Completed', { verified: false });

      throw new DeviceAppError(DeviceAppErrorType.DEVICE_AUTH_FAILED);
    }

    logger.info('Failed');
    throw error;
  }
};
