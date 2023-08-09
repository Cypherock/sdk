import { http } from '../utils/http';

const baseURL = '/v2/transaction';

export const getRawTxnHash = async (params: {
  coinType: string;
  hash: string;
}): Promise<string> => {
  const res = await http.post(`${baseURL}/hex`, params);
  return res.data.data;
};
