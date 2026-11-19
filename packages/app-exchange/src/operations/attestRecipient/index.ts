import { ISDK } from '@cypherock/sdk-core';
import { assert, createLoggerWithPrefix } from '@cypherock/sdk-utils';
import {
  ATTEST_ADDRESS_MAX_LENGTH,
  ATTEST_CHAIN_MAX_LENGTH,
} from '../../constants';
import { APP_VERSION } from '../../constants/appId';
import { OperationHelper, logger as rootLogger } from '../../utils';
import { IAttestRecipientParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'AttestRecipient');

export const attestRecipient = async (
  sdk: ISDK,
  params: IAttestRecipientParams,
): Promise<void> => {
  assert(params, 'Params should be defined');
  assert(params.chain, 'chain should be defined');
  assert(params.address, 'address should be defined');
  assert(
    params.chain.length <= ATTEST_CHAIN_MAX_LENGTH &&
      !params.chain.includes(':'),
    `chain should be at most ${ATTEST_CHAIN_MAX_LENGTH} characters and must not contain ':'`,
  );
  assert(
    params.address.length <= ATTEST_ADDRESS_MAX_LENGTH,
    `address should be at most ${ATTEST_ADDRESS_MAX_LENGTH} characters`,
  );
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'attestRecipient',
    resultKey: 'attestRecipient',
  });

  await helper.sendQuery({
    initiate: { chain: params.chain, address: params.address },
  });

  await helper.waitForResult();

  logger.info('Completed');
};
