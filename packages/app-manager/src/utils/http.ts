import axios from 'axios';
import { config } from '@cypherock/sdk-utils';

export const http = axios.create({ baseURL: config.API_CYPHEROCK });

export const downloadFile = async (url: string) => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  return Uint8Array.from(response.data);
};
