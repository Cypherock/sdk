import { ISDK } from '@cypherock/sdk-core';
import {
  assert,
  createStatusListener,
  ForceStatusUpdate,
  OnStatus,
} from '@cypherock/sdk-utils';
import { AuthCardStatus } from '../../proto/generated/types';
import { cardAuthService } from '../../services';

import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { IAuthCardParams } from './types';

export * from './types';

const cardNotVerifiedError = new Error('Card not verified');

const verifySerialSignature = async (params: {
  helper: OperationHelper<'authCard', 'authCard'>;
  onStatus: OnStatus;
  forceStatusUpdate: ForceStatusUpdate;
  cardIndex?: number;
}) => {
  const { helper, onStatus, forceStatusUpdate, cardIndex } = params;

  await helper.sendQuery({ initiate: { cardIndex } });

  const result = await helper.waitForResult(onStatus);
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
}) => {
  const { helper, onStatus, challenge, serial, forceStatusUpdate } = params;

  await helper.sendQuery({ challenge: { challenge } });

  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.challengeSignature);
  forceStatusUpdate(AuthCardStatus.AUTH_CARD_STATUS_CHALLENGE_SIGNED);

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
  params?: IAuthCardParams,
): Promise<boolean> => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (params?.cardIndex !== undefined && params.cardIndex !== null) {
    assert(
      params.cardIndex >= 1 && params.cardIndex <= 4,
      'Card index should be 1,2,3,4',
    );
  }

  const helper = new OperationHelper(sdk, 'authCard', 'authCard');

  try {
    const { onStatus, forceStatusUpdate } = createStatusListener(
      AuthCardStatus,
      params?.onEvent,
    );

    const { serial, challenge } = await verifySerialSignature({
      helper,
      onStatus,
      forceStatusUpdate,
      cardIndex: params?.cardIndex,
    });

    await verifyChallengeSignature({
      helper,
      onStatus,
      forceStatusUpdate,
      serial,
      challenge,
    });

    await helper.sendQuery({ result: { verified: true } });
    const result = await helper.waitForResult();
    assertOrThrowInvalidResult(result.flowComplete);
    forceStatusUpdate(AuthCardStatus.AUTH_CARD_STATUS_PAIRING_DONE);

    return true;
  } catch (error) {
    if (error === cardNotVerifiedError) {
      await helper.sendQuery({ result: { verified: false } });
      const result = await helper.waitForResult();
      assertOrThrowInvalidResult(result.flowComplete);
      return false;
    }

    try {
      await sdk.sendAbort();
      // eslint-disable-next-line no-empty
    } catch (e) {}

    throw error;
  }
};
