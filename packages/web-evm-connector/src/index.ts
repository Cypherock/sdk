import * as ethers from 'ethers';
import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';
import { DeviceConnection } from '@cypherock/sdk-hw-webusb';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { hexToUint8Array, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { EvmApp, setEthersLib } from '@cypherock/sdk-app-evm';
import {
  derivationPathSchemes,
  EvmDerivationSchemeName,
  mapDerivationPathForSdk,
} from './derivationScheme';

setEthersLib(ethers);

export const connectDevice = async () => {
  const connection = await DeviceConnection.create();
  const evmApp = await EvmApp.create(connection);
  const managerApp = await ManagerApp.create(connection);

  return { evmApp, managerApp, connection, device: connection.getDevice() };
};

export const checkDevice = async () => {
  const list = await DeviceConnection.list();

  if (list.length <= 0) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  const connection = await DeviceConnection.connect(list[0]);
  const evmApp = await EvmApp.create(connection);
  const managerApp = await ManagerApp.create(connection);

  return { evmApp, managerApp, connection, device: connection.getDevice() };
};

export const getAddresses = async (
  evmApp: EvmApp,
  params: {
    type: EvmDerivationSchemeName;
    from: number;
    count: number;
    walletId: string;
    chainId?: number;
  },
) => {
  const derivationScheme = derivationPathSchemes[params.type];
  const derivationPaths = derivationScheme.generator(params.from, params.count);

  const { addresses } = await evmApp.getPublicKeys({
    chainId: params.chainId ?? 1,
    walletId: hexToUint8Array(params.walletId),
    derivationPaths: derivationPaths.map(d => ({
      path: mapDerivationPathForSdk(d.derivationPath),
    })),
  });

  const result: { address: string; derivationPath: string }[] = [];

  for (let i = 0; i < addresses.length; i++) {
    result.push({
      address: addresses[i],
      derivationPath: derivationPaths[i].derivationPath,
    });
  }

  return result;
};

export const getWallets = async (managerApp: ManagerApp) => {
  const wallets = await managerApp.getWallets();

  return wallets.walletList.map(w => ({
    ...w,
    id: uint8ArrayToHex(w.id),
  }));
};

export const interpretError = (error: any) => {
  return error?.message ?? 'Undefined error';
};

export const signTransaction = async (
  derivationPath: string,
  transaction: any,
) => {
  return '';
};
