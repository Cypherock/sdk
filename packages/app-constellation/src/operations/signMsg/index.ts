import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  uint8ArrayToHex,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  SeedGenerationStatus,
  SignMsgStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { ISignMsgParams, ISignMsgResult, SignMsgEvent } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'SignMsg');

export const signMsg = async (
  sdk: ISDK,
  params: ISignMsgParams,
): Promise<ISignMsgResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.message, 'message should be defined');
  assert(typeof params.message === 'string', 'message should be a string');
  assert(params.derivationPath, 'derivationPath should be defined');
  assert(
    params.derivationPath.length === 5,
    'derivationPath should be equal to 5',
  );
  assert(params.messageType, 'messageType should be defined');

  await sdk.checkAppCompatibility(APP_VERSION);

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: SignMsgEvent,
    operationEnums: SignMsgStatus,
    seedGenerationEnums: SeedGenerationStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'signMsg',
    resultKey: 'signMsg',
    onStatus,
  });

  const msgBytes = new Uint8Array(Buffer.from(params.message, 'utf8'));

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
      messageSize: msgBytes.length,
      messageType: params.messageType,
    },
  });

  const { confirmation } = await helper.waitForResult();
  assertOrThrowInvalidResult(confirmation);
  forceStatusUpdate(SignMsgEvent.CONFIRM);

  await helper.sendInChunks(msgBytes, 'msgData', 'dataAccepted');

  await helper.sendQuery({
    signature: {},
  });
  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignMsgEvent.PIN_CARD);

  return {
    signature: uint8ArrayToHex(result.signature.signature),
  };
};
