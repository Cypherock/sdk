import { ISDK } from '@cypherock/sdk-core';
import { AuthCardStatus } from '../proto/generated/types';
import { cardAuthService } from '../services';

import {
  assertOrThrowInvalidResult,
  createStatusListener,
  ForceStatusUpdate,
  OnStatus,
  OperationHelper,
} from '../utils';

export type AuthCardEventHandler = (event: AuthCardStatus) => void;

const cardNotVerifiedError = new Error('Card not verified');

const verifySerialSignature = async (params: {
  helper: OperationHelper<'authCard', 'authCard'>;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
}) => {
  const { helper, onStatus, forceStatusUpdate } = params;

  await helper.sendQuery({ initiate: {} });

  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.serialSignature);

  forceStatusUpdate(AuthCardStatus.AUTH_CARD_STATUS_USER_CONFIRMED);

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
}) => {
  const { helper, onStatus, challenge, serial } = params;

  await helper.sendQuery({ challenge: { challenge } });

  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.challengeSignature);

  const isVerified = await cardAuthService.verifyCardChallengeSignature({
    ...result.challengeSignature,
    challenge,
    serial,
  });

  if (!isVerified) {
    throw cardNotVerifiedError;
  }
};

export const authCard = async (
  sdk: ISDK,
  onEvent?: AuthCardEventHandler,
): Promise<boolean> => {
  const helper = new OperationHelper(sdk, 'authCard', 'authCard');

  try {
    const { onStatus, forceStatusUpdate } = createStatusListener(
      AuthCardStatus,
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
    });

    await helper.sendQuery({ result: { verified: true } });

    return true;
  } catch (error) {
    if (error === cardNotVerifiedError) {
      await helper.sendQuery({ result: { verified: false } });
      return false;
    }

    throw error;
  }
};
