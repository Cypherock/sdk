import {
  assert,
  convertBits,
  blake2b,
  bech32Encode,
} from '@cypherock/sdk-utils';

const NETWORK_ID = 0x01;
const STAKE_BECH32_PREFIX = 'stake';
const PAYMENT_BECH32_PREFIX = 'addr';

/**
 * @brief Derive payment address for cardano network
 *
 * @param paymentPublicKey  Payment derivation public key
 * @param stakePublicKey    Stake derivation public key
 *
 * @returns Payment address
 */
export const derivePaymentAddress = (
  paymentPublicKey: Uint8Array,
  stakePublicKey: Uint8Array,
): string => {
  const rawPaymentAddr = new Uint8Array(1 + 28 + 28);
  rawPaymentAddr.set(Uint8Array.from([0x01]), 0);

  const blake2bPaymentPubKey = blake2b(paymentPublicKey, undefined, 28);
  rawPaymentAddr.set(blake2bPaymentPubKey, 1);

  const blake2bStakePubKey = blake2b(stakePublicKey, undefined, 28);
  rawPaymentAddr.set(blake2bStakePubKey, 1 + 28);

  const rawPaymentAddr5bit = convertBits(5, 8, rawPaymentAddr, true);
  assert(rawPaymentAddr5bit, 'rawPaymentAddr5bit is null');

  return bech32Encode(PAYMENT_BECH32_PREFIX, rawPaymentAddr5bit, 180);
};

/**
 * @brief Derive stake address for cardano network
 *
 * @param stakePublicKey    Stake derivation public key
 *
 * @returns Stake address
 */
export const deriveStakeAddress = (stakePublicKey: Uint8Array): string => {
  const rawStakeAddr = new Uint8Array(1 + 28);
  rawStakeAddr.set(Uint8Array.from([0xe0 | NETWORK_ID]), 0); // eslint-disable-line no-bitwise

  const blake2bHashedPubKey = blake2b(stakePublicKey, undefined, 28);
  rawStakeAddr.set(blake2bHashedPubKey, 1);

  const rawStakeAddr5bit = convertBits(5, 8, rawStakeAddr, true);
  assert(rawStakeAddr5bit, 'rawStakeAddr5bit is null');

  return bech32Encode(STAKE_BECH32_PREFIX, rawStakeAddr5bit, 180);
};
