import { CardError } from '../proto/generated/types';
import { SubErrorToMap } from './subError';

export const cardErrorTypeDetails: SubErrorToMap<CardError> = {
  [CardError.CARD_ERROR_UNKNOWN]: {
    errorCode: 'APP_0400_001',
    message: 'Unknown application error',
  },
  [CardError.CARD_ERROR_NOT_PAIRED]: {
    errorCode: 'APP_0400_002',
    message: 'Card is not paired',
  },
  [CardError.CARD_ERROR_SW_INCOMPATIBLE_APPLET]: {
    errorCode: 'APP_0400_003',
    message: 'Incompatible applet version',
  },
  [CardError.CARD_ERROR_SW_NULL_POINTER_EXCEPTION]: {
    errorCode: 'APP_0400_004',
    message: 'Null pointer exception',
  },
  [CardError.CARD_ERROR_SW_TRANSACTION_EXCEPTION]: {
    errorCode: 'APP_0400_005',
    message: 'Operation failed on card (Tx Exp)',
  },
  [CardError.CARD_ERROR_SW_FILE_INVALID]: {
    errorCode: 'APP_0400_006',
    message: 'Tapped card family id mismatch',
  },
  [CardError.CARD_ERROR_SW_SECURITY_CONDITIONS_NOT_SATISFIED]: {
    errorCode: 'APP_0400_007',
    message: 'Security conditions not satisfied, i.e. pairing session invalid',
  },
  [CardError.CARD_ERROR_SW_CONDITIONS_NOT_SATISFIED]: {
    errorCode: 'APP_0400_008',
    message: 'Wrong card sequence',
  },
  [CardError.CARD_ERROR_SW_WRONG_DATA]: {
    errorCode: 'APP_0400_009',
    message: 'Invalid APDU length',
  },
  [CardError.CARD_ERROR_SW_FILE_NOT_FOUND]: {
    errorCode: 'APP_0400_010',
    message: 'Corrupted card',
  },
  [CardError.CARD_ERROR_SW_RECORD_NOT_FOUND]: {
    errorCode: 'APP_0400_011',
    message: 'Wallet does not exist on device',
  },
  [CardError.CARD_ERROR_SW_FILE_FULL]: {
    errorCode: 'APP_0400_012',
    message: 'Card is full',
  },
  [CardError.CARD_ERROR_SW_CORRECT_LENGTH_00]: {
    errorCode: 'APP_0400_013',
    message: 'Incorrect pin entered',
  },
  [CardError.CARD_ERROR_SW_INVALID_INS]: {
    errorCode: 'APP_0400_014',
    message: 'Applet unknown error',
  },
  [CardError.CARD_ERROR_SW_NOT_PAIRED]: {
    errorCode: 'APP_0400_015',
    message: 'Card pairing to device missing',
  },
  [CardError.CARD_ERROR_SW_CRYPTO_EXCEPTION]: {
    errorCode: 'APP_0400_016',
    message: 'Operation failed on card (Crypto Exp)',
  },
  [CardError.CARD_ERROR_POW_SW_WALLET_LOCKED]: {
    errorCode: 'APP_0400_017',
    message: 'Locked wallet status word, POW meaning proof of word',
  },
  [CardError.CARD_ERROR_SW_INS_BLOCKED]: {
    errorCode: 'APP_0400_018',
    message: 'Card health critical, migration required',
  },
  [CardError.CARD_ERROR_SW_OUT_OF_BOUNDARY]: {
    errorCode: 'APP_0400_019',
    message: 'Operation failed on card (Out of boundary)',
  },
  [CardError.UNRECOGNIZED]: {
    errorCode: 'APP_0400_000',
    message: 'Card operation failed with unrecognized error',
  },
};
