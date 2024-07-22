import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix, hexToUint8Array } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  IEncryptedDataPacket,
  IWalletAuthResultResponse,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'SetupRequest');

export const getSetup = async (sdk: ISDK): Promise<IEncryptedDataPacket> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'setup',
    resultKey: 'setup',
  });
  // TODO: add vars to parameters
  await helper.sendQuery({
    plainData: [
      {
        message: hexToUint8Array('Shortest'),
      },
      {
        message: hexToUint8Array(
          'This is a slightly longer message to test the 50 characters length requirement.',
        ),
      },
      {
        message: hexToUint8Array(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        ),
      },
      {
        message: hexToUint8Array(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        ),
      },
      {
        message: hexToUint8Array(
          "Embarking on a journey to write a 900-character piece necessitates precision and clarity, ensuring each word contributes to the overall message. Begin by defining the central theme or purpose, whether it's to inform, persuade, or entertain. Structure is crucial: start with an engaging introduction to hook the reader, followed by the main content divided into concise paragraphs, and conclude with a memorable closing statement. Use active voice and vary sentence lengths to maintain reader interest. Edit ruthlessly to eliminate redundant words and ensure each sentence flows seamlessly into the next. Pay attention to grammar and punctuation, as these details enhance readability and professionalism. Finally, read the piece aloud to catch any awkward phrasing or overlooked errors, ensuring the final draft is polished and impactful. This approach not only adheres to the character limit of msgs.",
        ),
      },
    ],
  });

  const result = await helper.waitForResult();
  logger.verbose('SetupResponse', result);
  console.log(JSON.stringify(result));
  assertOrThrowInvalidResult(result.encryptedDataPacket?.packet);

  logger.info('Completed');
  return result.encryptedDataPacket;
};
