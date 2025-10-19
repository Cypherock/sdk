import { hexToUint8Array, sha256, uint8ArrayToHex } from '@cypherock/sdk-utils';

// Ref:
// https://docs.digitalasset.com/integrate/devnet/party-management/index.html#choosing-a-party-hint
// party_id = party_hint_str + :: + fingerprint_str
// party_hint can by anything like "alice", "bob", "my-wallet", etc.
// We are using first 5 bytes of sha256_hash(fingerprint) to keep it
// deterministic
// party_hint = sha256_hash(fingerprint)[:5]
// Ref:
// https://github.com/hyperledger-labs/splice-wallet-kernel/blob/main/core/ledger-client/src/topology-write-service.ts#L143
// Ref:
// https://github.com/hyperledger-labs/splice-wallet-kernel/blob/main/core/ledger-client/src/topology-write-service.ts#L62
// fingerprint = "1220" + sha256(HASH_PURPOSE + public_key)
const FINGERPRINT_HASH_PURPOSE = 12;
const CANTON_HASH_PREFIX = Uint8Array.from([0x12, 0x20]);

export const prefixedInt = (value: number, bytes: Uint8Array) => {
  const buffer = Buffer.alloc(4 + bytes.length);
  buffer.writeUInt32BE(value, 0);
  Buffer.from(bytes).copy(buffer, 4);
  return buffer;
};

export const computeSha256CantonHash = async (
  purpose: number,
  bytes: Uint8Array,
) => {
  const hashInput = prefixedInt(purpose, bytes);
  const hash = await sha256(hashInput);

  return uint8ArrayToHex(Uint8Array.from([...CANTON_HASH_PREFIX, ...hash]));
};

export const deriveFingerprintFromPublicKey = (publicKey: Uint8Array) =>
  computeSha256CantonHash(FINGERPRINT_HASH_PURPOSE, publicKey);

// deterministically derive party hint from fingerprint
// party_hint = sha256_hash(fingerprint)[:5]
export const derivePartyHintFromFingerprint = async (fingerprint: string) =>
  uint8ArrayToHex((await sha256(hexToUint8Array(fingerprint))).slice(0, 5));

export const derivePartyId = async (publicKey: Uint8Array) => {
  const fingerprint = await deriveFingerprintFromPublicKey(publicKey);
  const partyHint = await derivePartyHintFromFingerprint(fingerprint);

  return `${partyHint}::${fingerprint}`;
};
