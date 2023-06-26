import querystring from 'querystring';
import { http, downloadFile } from '../utils';

const baseURL = '/firmware-stm';

export async function getLatest(params: { prerelease?: boolean } = {}) {
  const response = await http.get(
    `${baseURL}/latest?${querystring.stringify(params)}`,
  );

  if (!response.data.firmware) {
    throw new Error('No latest firmware found');
  }

  const firmware = await downloadFile(response.data.firmware.downloadUrl);

  return {
    firmware,
    version: response.data.firmware.version as string,
  };
}
