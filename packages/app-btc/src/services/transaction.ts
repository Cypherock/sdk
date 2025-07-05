import axios from 'axios';
import { getConfig } from '@cypherock/sdk-utils';

const getBaseURL = () => `${getConfig().API_CYPHEROCK}/v2/transaction`;

export const getRawTxnHash = async (params: {
  coinType: string;
  hash: string;
}): Promise<string> => {
  const res = await axios.post(`${getBaseURL()}/hex`, params);
  return res.data.data;
};
