import axios from 'axios';
import { createQueryString, getConfig } from '@cypherock/sdk-utils';
// Import the generated enum. The path might be different based on your project structure.
import { FirmwareVariant } from '../../proto/types';

// Create a map to translate the internal enum number to the external API string.
const firmwareVariantMap: Record<FirmwareVariant, string> = {
  [FirmwareVariant.FIRMWARE_VARIANT_UNSPECIFIED]: 'MULTICOIN', // Defaulting UNSPECIFIED to MULTICOIN
  [FirmwareVariant.FIRMWARE_VARIANT_MULTICOIN]: 'MULTICOIN',
  [FirmwareVariant.FIRMWARE_VARIANT_BTC_ONLY]: 'BTC_ONLY',
};

const getBaseURL = () => `${getConfig().API_CYPHEROCK}/firmware-stm`;

export interface GetLatestFirmwareOptions {
  // This type now correctly points to the generated enum
  variant?: FirmwareVariant;
  prerelease?: boolean;
  doDownload?: boolean;
}

export interface LatestFirmware {
  version: string;
  firmware?: Uint8Array;
}

const downloadFile = async (url: string) => {
  const response = await fetch(url);

  const buffer = await response.arrayBuffer();

  return new Uint8Array(buffer);
};

export async function getLatest(params: GetLatestFirmwareOptions = {}) {
  // Use the enum for the default value
  const variantEnum = params.variant ?? FirmwareVariant.FIRMWARE_VARIANT_MULTICOIN;
  
  // Use the map to get the string for the API call
  const variantString = firmwareVariantMap[variantEnum];

  const response = await axios.get(
    `${getBaseURL()}/latest?${createQueryString({
      // Send the string, not the number
      variant: variantString,
      prerelease: params.prerelease,
    })}`,
  );

  if (!response.data.firmware) {
    throw new Error('No latest firmware found');
  }

  const result: LatestFirmware = {
    version: response.data.firmware.version as string,
  };

  if (params.doDownload) {
    result.firmware = await downloadFile(response.data.firmware.downloadUrl);
  }

  return result;
}