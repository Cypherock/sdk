import axios from 'axios';
import { createQueryString, getConfig } from '@cypherock/sdk-utils';

const getBaseURL = () => `${getConfig().API_CYPHEROCK}/firmware-stm`;

export interface GetLatestFirmwareOptions {
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
  const response = await axios.get(
    `${getBaseURL()}/latest?${createQueryString({
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
