import {
  FirmwareVariant,
  IGetDeviceInfoResultResponse,
} from '../../proto/types';

export interface FirmwareVariantInfo {
  variantId: FirmwareVariant;
  variantStr: string;
}

export interface GetDeviceInfoResult extends IGetDeviceInfoResultResponse {
  firmwareVariantInfo: FirmwareVariantInfo;
}
