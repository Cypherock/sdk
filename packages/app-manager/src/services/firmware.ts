import { createQueryString } from '@cypherock/sdk-utils';
import { http, downloadFile } from '../utils';

const baseURL = '/firmware-stm';

export interface GetLatestFirmwareOptions {
  prerelease?: boolean;
  doDownload?: boolean;
}

export interface LatestFirmware {
  version: string;
  firmware?: Uint8Array;
}

export async function getLatest(params: GetLatestFirmwareOptions = {}) {
  const response = await http.get(
    `${baseURL}/latest?${createQueryString({
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
