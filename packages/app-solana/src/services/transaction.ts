import axios from 'axios';
import { assert, getConfig } from '@cypherock/sdk-utils';

const getBaseURL = () => `${getConfig().API_CYPHEROCK}/solana/transaction`;

export const getLatestBlockHash = async (
  network = 'mainnet',
): Promise<string> => {
  const res = await axios.post(`${getBaseURL()}/blockhash`, { network });
  assert(
    res.data.hash,
    new Error('Server: Invalid solana blockhash from server'),
  );
  return res.data.hash;
};
