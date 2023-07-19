import { assert } from '@cypherock/sdk-utils';
import { Network, networks } from 'bitcoinjs-lib';

const { bitcoin, testnet } = networks;

const litecoin = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
  bech32: 'ltc',
};

const dash = {
  messagePrefix: '\x19Dashcoin Signed Message:\n',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x4c,
  scriptHash: 0x10,
  wif: 0xcc,
  bech32: '',
};

const dogecoin = {
  messagePrefix: '\x19Dogecoin Signed Message:\n',
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398,
  },
  pubKeyHash: 0x1e,
  scriptHash: 0x16,
  wif: 0x9e,
  bech32: '',
};

const coinIndexToNetworkMap: Record<number, Network> = {
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
