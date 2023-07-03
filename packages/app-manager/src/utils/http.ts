import axios from 'axios';
import { config } from '@cypherock/sdk-utils';

export const http = axios.create({ baseURL: config.API_CYPHEROCK });

export const downloadFile = async (url: string) => {
  const response = await fetch(url);

  const buffer = await response.arrayBuffer();

  return new Uint8Array(buffer);
};
