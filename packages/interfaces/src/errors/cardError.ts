import { CardError } from '../proto/generated/types';
import { SubErrorToMap } from './subError';

export enum CardAppErrorType {
  CARD_ERROR_UNKNOWN = 'APP_0400_001',
  CARD_ERROR_NOT_PAIRED = 'APP_0400_002',
  CARD_ERROR_SW_INCOMPATIBLE_APPLET = 'APP_0400_003',
  CARD_ERROR_SW_NULL_POINTER_EXCEPTION = 'APP_0400_004',
  CARD_ERROR_SW_TRANSACTION_EXCEPTION = 'APP_0400_005',
  CARD_ERROR_SW_FILE_INVALID = 'APP_0400_006',
  CARD_ERROR_SW_SECURITY_CONDITIONS_NOT_SATISFIED = 'APP_0400_007',
  CARD_ERROR_SW_CONDITIONS_NOT_SATISFIED = 'APP_0400_008',
  CARD_ERROR_SW_WRONG_DATA = 'APP_0400_009',
  CARD_ERROR_SW_FILE_NOT_FOUND = 'APP_0400_010',
  CARD_ERROR_SW_RECORD_NOT_FOUND = 'APP_0400_011',
  CARD_ERROR_SW_FILE_FULL = 'APP_0400_012',
  CARD_ERROR_SW_CORRECT_LENGTH_00 = 'APP_0400_013',
  CARD_ERROR_SW_INVALID_INS = 'APP_0400_014',
  CARD_ERROR_SW_NOT_PAIRED = 'APP_0400_015',
  CARD_ERROR_SW_CRYPTO_EXCEPTION = 'APP_0400_016',
  CARD_ERROR_POW_SW_WALLET_LOCKED = 'APP_0400_017',
  CARD_ERROR_SW_INS_BLOCKED = 'APP_0400_018',
  CARD_ERROR_SW_OUT_OF_BOUNDARY = 'APP_0400_019',
  UNRECOGNIZED = 'APP_0400_000',
}

export const cardErrorTypeDetails: SubErrorToMap<CardError> = {
  [CardError.CARD_ERROR_UNKNOWN]: {
    errorCode: CardAppErrorType.CARD_ERROR_UNKNOWN,
    message: 'Unknown application error',
  },
  [CardError.CARD_ERROR_NOT_PAIRED]: {
    errorCode: CardAppErrorType.CARD_ERROR_NOT_PAIRED,
    message: 'Card is not paired',
  },
  [CardError.CARD_ERROR_SW_INCOMPATIBLE_APPLET]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_INCOMPATIBLE_APPLET,
    message: 'Incompatible applet version',
  },
  [CardError.CARD_ERROR_SW_NULL_POINTER_EXCEPTION]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_NULL_POINTER_EXCEPTION,
    message: 'Null pointer exception',
  },
  [CardError.CARD_ERROR_SW_TRANSACTION_EXCEPTION]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_TRANSACTION_EXCEPTION,
    message: 'Operation failed on card (Tx Exp)',
  },
  [CardError.CARD_ERROR_SW_FILE_INVALID]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_FILE_INVALID,
    message: 'Tapped card family id mismatch',
  },
  [CardError.CARD_ERROR_SW_SECURITY_CONDITIONS_NOT_SATISFIED]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_SECURITY_CONDITIONS_NOT_SATISFIED,
    message: 'Security conditions not satisfied, i.e. pairing session invalid',
  },
  [CardError.CARD_ERROR_SW_CONDITIONS_NOT_SATISFIED]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_CONDITIONS_NOT_SATISFIED,
    message: 'Wrong card sequence',
  },
  [CardError.CARD_ERROR_SW_WRONG_DATA]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_WRONG_DATA,
    message: 'Invalid APDU length',
  },
  [CardError.CARD_ERROR_SW_FILE_NOT_FOUND]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_FILE_NOT_FOUND,
    message: 'Corrupted card',
  },
  [CardError.CARD_ERROR_SW_RECORD_NOT_FOUND]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_RECORD_NOT_FOUND,
    message: 'Wallet does not exist on device',
  },
  [CardError.CARD_ERROR_SW_FILE_FULL]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_FILE_FULL,
    message: 'Card is full',
  },
  [CardError.CARD_ERROR_SW_CORRECT_LENGTH_00]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_CORRECT_LENGTH_00,
    message: 'Incorrect pin entered',
  },
  [CardError.CARD_ERROR_SW_INVALID_INS]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_INVALID_INS,
    message: 'Applet unknown error',
  },
  [CardError.CARD_ERROR_SW_NOT_PAIRED]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_NOT_PAIRED,
    message: 'Card pairing to device missing',
  },
  [CardError.CARD_ERROR_SW_CRYPTO_EXCEPTION]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_CRYPTO_EXCEPTION,
    message: 'Operation failed on card (Crypto Exp)',
  },
  [CardError.CARD_ERROR_POW_SW_WALLET_LOCKED]: {
    errorCode: CardAppErrorType.CARD_ERROR_POW_SW_WALLET_LOCKED,
    message: 'Locked wallet status word, POW meaning proof of word',
  },
  [CardError.CARD_ERROR_SW_INS_BLOCKED]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_INS_BLOCKED,
    message: 'Card health critical, migration required',
  },
  [CardError.CARD_ERROR_SW_OUT_OF_BOUNDARY]: {
    errorCode: CardAppErrorType.CARD_ERROR_SW_OUT_OF_BOUNDARY,
    message: 'Operation failed on card (Out of boundary)',
  },
  [CardError.UNRECOGNIZED]: {
    errorCode: CardAppErrorType.UNRECOGNIZED,
    message: 'Card operation failed with unrecognized error',
  },
};
