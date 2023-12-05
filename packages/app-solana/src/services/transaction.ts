import { assert } from '@cypherock/sdk-utils';
import { http } from '../utils/http';

const baseURL = '/solana/transaction';

export const getLatestBlockHash = async (
  network = 'mainnet',
): Promise<string> => {
  const res = await http.post(`${baseURL}/blockhash`, { network });
  assert(
    res.data.hash,
    new Error('Server: Invalid solana blockhash from server'),
  );
  return res.data.hash;
};
