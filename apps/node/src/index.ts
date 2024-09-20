import DeviceConnection, {
    updateLogger as updateLoggerHid,
} from '@cypherock/sdk-hw-hid';
import DeviceConnectionSerialport from '@cypherock/sdk-hw-serialport';
import { ManagerApp, updateLogger } from '@cypherock/sdk-app-manager';
import { SDK, updateLogger as updateLoggerCore } from '@cypherock/sdk-core';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as bitcoinJsLib from 'bitcoinjs-lib';
import * as nearApiJs from 'near-api-js';
import * as solanaWeb3 from '@solana/web3.js';
import { setBitcoinJSLib } from '@cypherock/sdk-app-btc';
import { setEthersLib } from '@cypherock/sdk-app-evm';
import { setNearApiJs } from '@cypherock/sdk-app-near';
import { setSolanaWeb3 } from '@cypherock/sdk-app-solana';
import { ethers } from 'ethers';
import { createServiceLogger } from './logger';
import { InheritanceApp } from '@cypherock/sdk-app-inheritance';

const run = async () => {
    updateLogger(createServiceLogger);
    updateLoggerCore(createServiceLogger);
    updateLoggerHid(createServiceLogger);

    setBitcoinJSLib(bitcoinJsLib);
    setEthersLib(ethers);
    setNearApiJs(nearApiJs);
    setSolanaWeb3(solanaWeb3);

    let connection: IDeviceConnection;

    try {
        connection = await DeviceConnection.create();
    } catch (error) {
        connection = await DeviceConnectionSerialport.create();
    }

    console.log('started');

    const managerApp = await ManagerApp.create(connection);

    const { walletList } = await managerApp.getWallets();

    const inheritanceApp = await InheritanceApp.create(connection);

    setTimeout(async () => {
        //console.log('aborting');
        //await inheritanceApp.abort();
        //console.log('aborted');
    }, 3000);

    //console.log(walletList[1].id.join(','));
    const walletId = walletList[1].id;

    //await inheritanceApp.authWallet({
    //  challenge: walletId,
    //  walletId: walletId,
    //  withPublicKey: true,
    //  type: 'wallet-based',
    //});

    await inheritanceApp.testSessionStart();

    const thing = await inheritanceApp.encryptMessagesWithPin({
        walletId: walletId,
        messages: {
            2: {
                value: 'test value',
                verifyOnDevice: true,
            },
        },
    });

    const output = await inheritanceApp.decryptMessagesWithPin({
        walletId: walletId,
        encryptedData: thing.encryptedPacket,
    });

    await inheritanceApp.testSessionStop();

    console.log(JSON.stringify(output));
};

run();
