import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  uint8ArrayToHex,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import { ethers } from 'ethers';
import { SignMsgStatus } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { ISignMsgParams, ISignMsgResult } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'SignTxn');

export const signMsg = async (
  sdk: ISDK,
  params: ISignMsgParams,
): Promise<ISignMsgResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.message, 'message should be defined');
  assert(params.messageType, 'messageType should be defined');
  assert(params.derivationPath, 'derivationPaths should be defined');
  assert(
    params.derivationPath.length > 3,
    'derivationPath should be greater than 3',
  );

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: SignMsgStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'signMsg',
    resultKey: 'signMsg',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
      messageType: params.messageType,
    },
  });

  await helper.sendInChunks(params.message, 'msgData', 'msgData');
  forceStatusUpdate(SignMsgStatus.SIGN_MSG_STATUS_CONFIRM);

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignMsgStatus.SIGN_MSG_STATUS_CARD);

  const signature = {
    r: `0x${uint8ArrayToHex(result.signature.r)}`,
    s: `0x${uint8ArrayToHex(result.signature.s)}`,
    v: `0x${uint8ArrayToHex(result.signature.v)}`,
  };

  const serializedSignature = ethers.Signature.from({
    ...signature,
    v: BigInt(signature.v),
  }).serialized;

  return {
    signature,
    serializedSignature,
  };
};
