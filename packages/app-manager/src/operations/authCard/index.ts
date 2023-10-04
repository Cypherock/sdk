import { ISDK } from '@cypherock/sdk-core';
import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import {
  assert,
  createLoggerWithPrefix,
  createStatusListener,
  ForceStatusUpdate,
  OnStatus,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { AuthCardStatus } from '../../proto/generated/types';
import { cardAuthService } from '../../services';

import {
  assertOrThrowInvalidResult,
  logger as rootLogger,
  OperationHelper,
} from '../../utils';
import { IAuthCardParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'AuthCard');

const cardNotVerifiedError = new Error('Card not verified');

const verifySerialSignature = async (params: {
  helper: OperationHelper<'authCard', 'authCard'>;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
  cardNumber?: number;
  isPairRequired?: boolean;
}) => {
  const { helper, onStatus, forceStatusUpdate, cardNumber, isPairRequired } =
    params;

  await helper.sendQuery({
    initiate: { cardIndex: cardNumber, isPairRequired },
  });

  const result = await helper.waitForResult(onStatus);
  logger.verbose('AuthCardResponse', { result });
  assertOrThrowInvalidResult(result.serialSignature);

  forceStatusUpdate(AuthCardStatus.AUTH_CARD_STATUS_SERIAL_SIGNED);

  const challenge = await cardAuthService.verifyCardSerialSignature({
    ...result.serialSignature,
  });
  const { serial } = result.serialSignature;

  if (!challenge) {
    throw cardNotVerifiedError;
  }

  return { serial, challenge };
};

const verifyChallengeSignature = async (params: {
  helper: OperationHelper<'authCard', 'authCard'>;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
  challenge: Uint8Array;
  serial: Uint8Array;
  email?: string;
  cysyncVersion?: string;
  onlyFailure?: boolean;
  sessionId?: string;
}) => {
  const {
    helper,
    onStatus,
    challenge,
    serial,
    forceStatusUpdate,
    cysyncVersion,
    onlyFailure,
    sessionId,
    email,
  } = params;

  await helper.sendQuery({ challenge: { challenge } });

  const result = await helper.waitForResult(onStatus);
  logger.verbose('AuthCardResponse', { result });
  assertOrThrowInvalidResult(result.challengeSignature);
  forceStatusUpdate(AuthCardStatus.AUTH_CARD_STATUS_CHALLENGE_SIGNED);

  const { isVerified, sessionId: newSessionId } =
    await cardAuthService.verifyCardChallengeSignature({
      ...result.challengeSignature,
      challenge,
      serial,
      cysyncVersion,
      onlyFailure,
      sessionId,
      email,
    });

  if (!isVerified) {
    throw cardNotVerifiedError;
  }

  return newSessionId;
};

export const authCard = async (sdk: ISDK, params?: IAuthCardParams) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (params?.cardNumber !== undefined && params.cardNumber !== null) {
    assert(
      params.cardNumber >= 1 && params.cardNumber <= 4,
      'Card number should be one of 1,2,3,4',
    );
  }

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper(sdk, 'authCard', 'authCard');

  try {
    logger.info('Started', { ...params, onEvent: undefined });
    const { onStatus, forceStatusUpdate } = createStatusListener({
      enums: AuthCardStatus,
      onEvent: params?.onEvent,
      logger,
    });

    const { serial, challenge } = await verifySerialSignature({
      helper,
      onStatus,
      forceStatusUpdate,
      cardNumber: params?.cardNumber,
      isPairRequired: params?.isPairRequired,
    });

    const newSessionId = await verifyChallengeSignature({
      helper,
      onStatus,
      forceStatusUpdate,
      serial,
      challenge,
      email: params?.email,
      cysyncVersion: params?.cysyncVersion,
      onlyFailure: params?.onlyFailure,
      sessionId: params?.sessionId,
    });

    await helper.sendQuery({ result: { verified: true } });
    const result = await helper.waitForResult();
    assertOrThrowInvalidResult(result.flowComplete);
    forceStatusUpdate(AuthCardStatus.AUTH_CARD_STATUS_PAIRING_DONE);

    logger.info('Completed', { verified: true });
    return { sessionId: newSessionId };
  } catch (error) {
    if (error === cardNotVerifiedError) {
      await helper.sendQuery({ result: { verified: false } });
      const result = await helper.waitForResult();
      logger.verbose('AuthCardResponse', { result });
      assertOrThrowInvalidResult(result.flowComplete);

      logger.info('Completed', { verified: false });

      throw new DeviceAppError(DeviceAppErrorType.CARD_AUTH_FAILED);
    }

    logger.info('Failed');

    try {
      await sdk.sendAbort();
      // eslint-disable-next-line no-empty
    } catch (e) {}

    throw error;
  }
};
