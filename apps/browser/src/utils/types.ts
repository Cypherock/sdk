import { IGetDeviceInfoResultResponse, IGetWalletsResultResponse, IVersion, OnboardingStep } from "@cypherock/sdk-app-manager";

export type Device = {
    name?: string,
    serial?: string,
    company?: string,
    pid: number
};

export type DeviceInfoParsed = {
    deviceSerial: Uint8Array | string;
    firmwareVersion: IVersion | undefined;
    isAuthenticated: boolean;
    isInitial: boolean;
    onboardingStep: OnboardingStep;
};

export type WalletItemParsed = {
    id?: Uint8Array | string;
    name?: string;
    hasPin?: boolean;
    hasPassphrase?: boolean;
    isValid?: boolean;
};

export type DeviceDetails = {
    deviceInfo: IGetDeviceInfoResultResponse | undefined,
    isSupported: boolean,
    wallets: IGetWalletsResultResponse | undefined,
    walletsParsed: undefined | {
        walletList: WalletItemParsed[]
    },
    deviceInfoParsed: DeviceInfoParsed | undefined,
}
