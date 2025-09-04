import {
  FirmwareVariant,
  IGetDeviceInfoResultResponse,
} from '../../proto/types';

export interface FirmwareVariantInfo {
  variantId: FirmwareVariant;
  variantStr: string;
}

export interface IGetDeviceInfoResponse extends IGetDeviceInfoResultResponse {
  firmwareVariantInfo: FirmwareVariantInfo;
}
