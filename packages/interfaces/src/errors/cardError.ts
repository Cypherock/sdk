// TODO: take keys from proto
export const cardErrorTypeDetails: Record<number, { message: string }> = {
  0: {
    message: 'Unknown application error',
  },
  1: {
    message: 'Card is not paired',
  },
  3: {
    message: 'Incompatible applet version',
  },
  4: {
    message: 'Null pointer exception',
  },
  5: {
    message: 'Operation failed on card (Tx Exp)',
  },
  6: {
    message: 'Tapped card family id mismatch',
  },
  7: {
    message: 'Security conditions not satisfied, i.e. pairing session invalid',
  },
  8: {
    message: 'Wrong card sequence',
  },
  9: {
    message: 'Invalid APDU length',
  },
  10: {
    message: 'Corrupted card',
  },
  11: {
    message: 'Wallet does not exist on device',
  },
  12: {
    message: 'Card is full',
  },
  13: {
    message: 'Incorrect pin entered',
  },
  14: {
    message: 'Applet unknown error',
  },
  15: {
    message: 'Card pairing to device missing',
  },
  16: {
    message: 'Operation failed on card (Crypto Exp)',
  },
  17: {
    message: 'Locked wallet status word, POW meaning proof of word',
  },
  18: {
    message: 'Card health critical, migration required',
  },
  19: {
    message: 'Operation failed on card (Out of boundary)',
  },
};
