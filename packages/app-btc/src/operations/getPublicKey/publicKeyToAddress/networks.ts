import { assert } from '@cypherock/sdk-utils';

const bitcoin = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: { public: 76067358, private: 76066276 },
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
  0x80000000: bitcoin,
  0x80000001: testnet,
  0x80000002: litecoin,
  0x80000003: dogecoin,
  0x80000005: dash,
};

export const getNetworkFromPath = (path: number[]) => {
  const coinIndex = path[1];
  const network = coinIndexToNetworkMap[coinIndex];

  assert(network, 'Coin index not supported');
  return network;
};
