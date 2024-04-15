import { assert } from '@cypherock/sdk-utils';
import { http } from '../utils/http';

const baseURL = '/bittensor/transaction';

export const getLatestBlockHash = async (
  network = 'mainnet',
): Promise<string> => {
  const res = await http.post(`${baseURL}/blockhash`, { network });
  assert(
    res.data.hash,
    new Error('Server: Invalid bittensor blockhash from server'),
  );
  return res.data.hash;
};
