import { ISDK } from '@cypherock/sdk-core';
import {
  DeviceAppError,
  DeviceAppErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import { IVersion } from '../../../proto/types';

const createVersionHex = (version: IVersion) => {
  let hex = version.major.toString(16).padStart(2, '0');

  hex += version.minor.toString(16).padStart(2, '0');

  hex += version.patch.toString(16).padStart(4, '0');

  return hex;
};

export const handleLegacyDevice = async (sdk: ISDK, version: IVersion) => {
  let isConfirmed = false;
  const firmwareVersionHex = createVersionHex(version);

  if (await sdk.deprecated.isRawOperationSupported()) {
    const sequenceNumber = await sdk.getNewSequenceNumber();

    await sdk.deprecated.sendCommand({
      commandType: 77,
      data: firmwareVersionHex,
      sequenceNumber,
    });

    const updateConfirmed = await sdk.deprecated.waitForCommandOutput({
      sequenceNumber,
      expectedCommandTypes: [78],
    });

    isConfirmed = updateConfirmed.data.startsWith('01');
  } else {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
    );
  }

  if (!isConfirmed) {
    throw new DeviceAppError(DeviceAppErrorType.USER_REJECTION);
  }
};
