import { ISDK } from '@cypherock/sdk-core';
import { AuthDeviceStatus } from '../proto/generated/types';

import {
  assertOrThrowInvalidResult,
  createStatusListener,
  decodeResult,
  encodeQuery,
} from '../utils';

export type AuthDeviceEventHandler = (event: AuthDeviceStatus) => void;

export const authDevice = async (
  sdk: ISDK,
  onEvent?: AuthDeviceEventHandler,
): Promise<boolean> => {
  const { onStatus, forceStatusUpdate } = createStatusListener(
    AuthDeviceStatus,
    onEvent,
  );

  await sdk.sendQuery(encodeQuery({ authDevice: { initiate: {} } }));
  let result = decodeResult(await sdk.waitForResult({ onStatus }));
  assertOrThrowInvalidResult(result.authDevice?.serialSignature);

  forceStatusUpdate(AuthDeviceStatus.AUTH_DEVICE_STATUS_USER_CONFIRMED);

  const challenge = new Uint8Array([12]);
  await sdk.sendQuery(
    encodeQuery({ authDevice: { challenge: { challenge } } }),
  );
  result = decodeResult(await sdk.waitForResult({ onStatus }));
  assertOrThrowInvalidResult(result.authDevice?.challengeSignature);

  await sdk.sendQuery(
    encodeQuery({ authDevice: { result: { verified: true } } }),
  );

  return true;
};
