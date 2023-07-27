import { assert } from '@cypherock/sdk-utils';

export const HARDENED_BASE = 0x80000000;

export const LEGACY_PURPOSE = HARDENED_BASE + 44;
export const SEGWIT_PURPOSE = HARDENED_BASE + 84;

export const BITCOIN_COIN_INDEX = HARDENED_BASE + 0;
export const TESTNET_COIN_INDEX = HARDENED_BASE + 1;
export const LITECOIN_COIN_INDEX = HARDENED_BASE + 2;
export const DOGECOIN_COIN_INDEX = HARDENED_BASE + 3;
export const DASH_COIN_INDEX = HARDENED_BASE + 5;

const bitcoin = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: { public: 76067358, private: 76066276 },
  pubKeyHash: 0,
  scriptHash: 5,
  wif: 128,
};

const testnet = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: { public: 70617039, private: 70615956 },
  pubKeyHash: 111,
  scriptHash: 196,
  wif: 239,
};

const litecoin = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bip32: { public: 0x0488b21e, private: 0x0488ade4 },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
  bech32: 'ltc',
};

const dash = {
  messagePrefix: '\x19Dashcoin Signed Message:\n',
  bip32: { public: 0x0488b21e, private: 0x0488ade4 },
  pubKeyHash: 0x4c,
  scriptHash: 0x10,
  wif: 0xcc,
  bech32: '',
};

const dogecoin = {
  messagePrefix: '\x19Dogecoin Signed Message:\n',
  bip32: { public: 0x02facafd, private: 0x02fac398 },
  pubKeyHash: 0x1e,
  scriptHash: 0x16,
  wif: 0x9e,
  bech32: '',
};

const coinIndexToNetworkMap: Record<number, typeof bitcoin> = {
  [BITCOIN_COIN_INDEX]: bitcoin,
  [TESTNET_COIN_INDEX]: testnet,
  [LITECOIN_COIN_INDEX]: litecoin,
  [DOGECOIN_COIN_INDEX]: dogecoin,
  [DASH_COIN_INDEX]: dash,
};

export type purposeType = 'segwit' | 'legacy';

const purposeMap: Record<number, purposeType> = {
  [SEGWIT_PURPOSE]: 'segwit',
  [LEGACY_PURPOSE]: 'legacy',
};

export const getNetworkFromPath = (path: number[]) => {
  const coinIndex = path[1];
  const network = coinIndexToNetworkMap[coinIndex];

  assert(network, 'Coin index not supported');
  return network;
};

export const getPurposeType = (path: number[]) => {
  const purpose = path[0];
  const purposeType = purposeMap[purpose];

  assert(purposeType, 'Purpose index not supported');
  return purposeType;
};
