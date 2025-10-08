import { sha256 } from '@cypherock/sdk-utils';
import { getCantonLib } from './cantonLib';

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
// fingerprint = 0x1220 + sha256(HASH_PURPOSE + public_key)
export const derivePartyId = async (publicKey: Uint8Array) => {
  const { TopologyController } = getCantonLib();

  const fingerprint = TopologyController.createFingerprintFromPublicKey(
    Buffer.from(publicKey).toString('base64'),
  );

  const partyId = Buffer.from(
    (await sha256(Buffer.from(fingerprint, 'hex'))).slice(0, 5),
  ).toString('hex');

  return `${partyId}::${fingerprint}`;
};
