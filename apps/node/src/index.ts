process.env.LOG_LEVEL="error"

import DeviceConnection from '@cypherock/sdk-hw-hid';
import DeviceConnectionSerialport from '@cypherock/sdk-hw-serialport';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as bitcoinJsLib from 'bitcoinjs-lib';
import * as nearApiJs from 'near-api-js';
import { setBitcoinJSLib, BtcApp } from '@cypherock/sdk-app-btc';
import { MPCApp, IEntityInfo, IGroupInfo, IParticipantDeviceInfo } from '@cypherock/sdk-app-mpc';
import { setEthersLib } from '@cypherock/sdk-app-evm';
import { setNearApiJs } from '@cypherock/sdk-app-near';
import { ethers } from 'ethers';

import { webcrypto } from 'crypto';
const { subtle } = webcrypto;

import { input, select } from '@inquirer/prompts';
import axios from 'axios';
import { GroupInfo, ShareData } from '@cypherock/sdk-app-mpc/dist/proto/generated/mpc_poc/common';
import { SignedShareData } from '@cypherock/sdk-app-mpc/dist/proto/generated/mpc_poc/common';
import { SignedPublicKey } from '@cypherock/sdk-app-mpc/dist/proto/generated/mpc_poc/group_setup';

const SERVER_URL = "http://127.0.0.1:5000";
const DEVICE_ID_SIZE = 32;
const PUBLIC_KEY_SIZE = 33;
const WALLET_ID_SIZE = 32;
const USER_CHOICE_CREATE_GROUP = "create";
const USER_CHOICE_CHECK_GROUPS = "check";

async function computeSHA256(arrayBuffer: Uint8Array): Promise<Uint8Array> {
    const hashBuffer = await subtle.digest("SHA-256", arrayBuffer);
    return new Uint8Array(hashBuffer);
}

async function fetchShareData(groupID: Uint8Array, pubKey: Uint8Array): Promise<SignedShareData> {
    try {
        const response = await axios.get(`${SERVER_URL}/shareData`, {
            params: { groupID: Buffer.from(groupID).toString('hex'),
                      pubKey: Buffer.from(pubKey).toString('hex') }
        });

        if (response.status === 200) {
            return SignedShareData.decode(new Uint8Array(Buffer.from(response.data['shareData'], 'hex'))); // Return the string from the response
        }
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.log(`Polling for everyone's share data...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            return fetchShareData(groupID, pubKey); // Retry
        } else {
            console.error(`Error fetching data for ${pubKey}: `, error);
        }
    }

    return SignedShareData.create({});
}

async function fetchIndividualPublicKey(groupID: Uint8Array, pubKey: Uint8Array): Promise<SignedPublicKey> {
  try {
      const response = await axios.get(`${SERVER_URL}/individualPublicKey`, {
          params: { groupID: Buffer.from(groupID).toString('hex'),
                    pubKey: Buffer.from(pubKey).toString('hex') }
      });

      if (response.status === 200) {
          return SignedPublicKey.decode(new Uint8Array(Buffer.from(response.data['individualPublicKey'], 'hex'))); // Return the string from the response
      }
  } catch (error: any) {
      if (error.response && error.response.status === 404) {
          console.log(`Polling for everyone's individual public key...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          return fetchIndividualPublicKey(groupID, pubKey); // Retry
      } else {
          console.error(`Error fetching data for ${pubKey}: `, error);
      }
  }

  return SignedPublicKey.create({});
}

async function getGroupInfo(entityInfoList: IEntityInfo[], fingerprints: string[],
  threshold: number, totalParticipants: number): Promise<IGroupInfo> {

  let indexes = [];

  let participants: IParticipantDeviceInfo[] = [];

  for (let i = 0; i < totalParticipants; i++) {
    indexes.push(i);
  }

  // sort the indexes array based on the fingerprints array
  indexes.sort((a, b) => fingerprints[a].localeCompare(fingerprints[b]));

  for (let i = 0; i < indexes.length; i++) {
    participants.push({
      deviceId: entityInfoList[indexes[i]].deviceInfo?.deviceId ?? new Uint8Array(),
      pubKey: entityInfoList[indexes[i]].deviceInfo?.pubKey ?? new Uint8Array(),
      walletId: entityInfoList[indexes[i]].deviceInfo?.walletId ?? new Uint8Array(),
    });
  }

  return {
    participants: participants,
    threshold: threshold,
    totalParticipants: totalParticipants,
  };
}

const run = async () => {
  setBitcoinJSLib(bitcoinJsLib);
  setEthersLib(ethers);
  setNearApiJs(nearApiJs);

  let connection: IDeviceConnection;
  
  console.log("Fetching all connected devices...");
  const devices = await DeviceConnection.getAvailableConnection();
  console.log("Devices fetched.\n");

  if (devices.length == 0) {
    console.log("No connected devices found.");
    return; 
  }

  // ask user to choose the device
  const deviceChoices = devices.map((device, index) => ({
      name: `${index + 1}. ${device.productId}: ${device.path}`,
      value: device,
  }));

  const chosenDevice = await select({
    message: 'Which device do you want to use?',
    choices: deviceChoices,
  });

  connection = await DeviceConnection.connect(chosenDevice);

  const mpcApp = await MPCApp.create(connection);
  const managerApp = await ManagerApp.create(connection);

  // await mpcApp.exitApplication();
  console.log("MPC TSS Application started");  
  
  console.log("Fetching all the wallets present in the device...");
  // Get all wallets from the manager app
  const wallets = await managerApp.getWallets();

  const walletChoices = wallets.walletList.map((wallet, index) => ({
      name: `${index + 1}. ${wallet.name}`,
      value: wallet.id,
  }));

  // Ask the user to choose a wallet
  const chosenWalletId = await select({
    message: 'Which wallet do you want to use?',
    choices: walletChoices,
  });

  let result = await mpcApp.getPublicKey({walletId: chosenWalletId});
  let pubKey = result.pubKey;

  const userChoices = [
    {
      name: 'Create a group',
      value: USER_CHOICE_CREATE_GROUP,
    },
    {
      name: 'Check existing groups',
      value: USER_CHOICE_CHECK_GROUPS,
    }
  ]

  const userChoice = await select({
    message: 'Choose an option:',
    choices: userChoices,
  });

  if (userChoice === USER_CHOICE_CREATE_GROUP) {
    const total_participants = parseInt(await input({ message: 'Enter the total number of participants:' }));
    const threshold = parseInt(await input({ message: 'Enter the threshold: ' }));
    let entityInfoList: IEntityInfo[] = [];
    let fingerprints: string[] = [];

    let participantsPublicKeys: Uint8Array[] = [];

    const onEntityInfo = async (entityInfo: IEntityInfo) => {
      // console.log(entityInfo);
      // compute fingerprint of the entity info
      const entityInfoRaw = MPCApp.encodeEntityInfo(entityInfo);
      const fingerprint = await computeSHA256(entityInfoRaw);

      // upload entity info to the server
      const response = await axios.post(
        `${SERVER_URL}/entityInfo`,
        { entityInfo: Buffer.from(entityInfoRaw).toString('hex'), fingerprint: Buffer.from(fingerprint).toString('hex') },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status != 200) {
        console.log('Error:', response.data);
        return [{fingerprint: new Uint8Array(), entityInfo: MPCApp.createEntityInfo(0, new Uint8Array(), 0, 0, new Uint8Array(), new Uint8Array(), new Uint8Array())}];
      }

      console.log(`\nShare the below fingerprint with the group members via an alternate channel:`);
      console.log(Buffer.from(fingerprint).toString('hex'));
      console.log('\n');

      console.log(`Enter the fingerpints of the other ${total_participants - 1} participants:`);

      for (let i = 0; i < total_participants - fingerprints.length; i++) {
        // take user input
        fingerprints.push(await input({ message: `>` }));
      }

      console.log("\nWaiting for other participants to join the group...");

      // for each fingerprint, make a get request to /entityInfo endpoint
      for (let i = 0; i < fingerprints.length; i++) {
        let response = await axios.get(`${SERVER_URL}/entityInfo`, {
          params: { fingerprint: fingerprints[i] }
        });

        if (response.status != 200) {
          console.log('Error:', response.data);
          return [{fingerprint: new Uint8Array(), entityInfo: MPCApp.createEntityInfo(0, new Uint8Array(), 0, 0, new Uint8Array(), new Uint8Array(), new Uint8Array())}];
        }

        entityInfoList.push(MPCApp.decodeEntityInfo(new Uint8Array(Buffer.from(response.data, 'hex'))));
      }

      let participants = [];

      for (let i = 0; i < entityInfoList.length; i++) {
        participants.push({
          fingerprint: new Uint8Array(Buffer.from(fingerprints[i], 'hex')),
          entityInfo: entityInfoList[i]
        });
      }

      for (let i = 0; i < entityInfoList.length; i++) {
        participantsPublicKeys.push(entityInfoList[i].deviceInfo?.pubKey ?? new Uint8Array());
      }

      fingerprints.push(Buffer.from(fingerprint).toString('hex'));
      entityInfoList.push(entityInfo);

      return participants;
    }

    let globalGroupID: Uint8Array;
    let groupInfoSignature: Uint8Array;

    const onGroupID = async (groupID: Uint8Array, signature: Uint8Array) => {
      console.log("Group setup completed.");
      console.log("Group ID: ", Buffer.from(groupID).toString('hex'));
      console.log("Signature: ", Buffer.from(signature).toString('hex'));

      let groupInfo: IGroupInfo = await getGroupInfo(entityInfoList, fingerprints, threshold, total_participants);
      let groupInfoRaw = GroupInfo.encode(groupInfo).finish();

      console.log("\nUploading group info to the server...")

      const response = await axios.post(
        `${SERVER_URL}/groupInfo`,
        { groupInfo: Buffer.from(groupInfoRaw).toString('hex'),
          groupID: Buffer.from(groupID).toString('hex'),
          signature: Buffer.from(signature).toString('hex'),
          pubKey: Buffer.from(pubKey).toString('hex') 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status != 200) {
        console.log('Error:', response.data);
        return;
      }

      console.log("Group info uploaded successfully.");

      globalGroupID = groupID;
      groupInfoSignature = signature;
    }

    const onShareData = async (shareData: SignedShareData) => {
      const shareDataRaw = SignedShareData.encode(shareData).finish();

      console.log("\nUploading share data to the server...")
      const response = await axios.post(
        `${SERVER_URL}/shareData`,
        { 
          groupID: Buffer.from(globalGroupID).toString('hex'),
          shareData: Buffer.from(shareDataRaw).toString('hex'),
          pubKey: Buffer.from(pubKey).toString('hex'), 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status != 200) {
        console.log('Error:', response.data);
        return [];
      }

      console.log("Share data uploaded successfully.");

      console.log("Waiting for other participants to upload their share data...");

      const shareDataList = await Promise.all(participantsPublicKeys.map(pubKey => fetchShareData(globalGroupID, pubKey)));

      return shareDataList;
    }

    const onIndividualPublicKey = async (individualPublicKey: SignedPublicKey) => {
      console.log("My individual public key: ", individualPublicKey);
      const individualPublicKeyRaw = SignedPublicKey.encode(individualPublicKey).finish();

      console.log("\nUploading individual public key to the server...")
      const response = await axios.post(
        `${SERVER_URL}/individualPublicKey`,
        { 
          groupID: Buffer.from(globalGroupID).toString('hex'),
          individualPublicKey: Buffer.from(individualPublicKeyRaw).toString('hex'),
          pubKey: Buffer.from(pubKey).toString('hex'), 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status != 200) {
        console.log('Error:', response.data);
        return [];
      }

      console.log("Individual public key uploaded successfully.");
      console.log("Waiting for other participants to upload their individual public keys...");

      let individualPublicKeyList = await Promise.all(participantsPublicKeys.map(pubKey => fetchIndividualPublicKey(globalGroupID, pubKey)));
      console.log(individualPublicKeyList);

      return individualPublicKeyList;
    }

    const result = await mpcApp.groupSetup({
      walletId: chosenWalletId,
      threshold: threshold,
      totalParticipants: total_participants,
      onEntityInfo: onEntityInfo,
      onGroupID: onGroupID,
      onShareData: onShareData,
      onIndividualPublicKey: onIndividualPublicKey,
    });

    console.log(result);

  } else if (userChoice === USER_CHOICE_CHECK_GROUPS) {
    // send a get request to /groupID endpoint and pass pubKey, result will be a list of groupIDs
    const response = await axios.get(`${SERVER_URL}/groupID`, {
      params: { pubKey: Buffer.from(pubKey).toString('hex') }
    });

    if (response.status != 200) {
      console.log('Error:', response.data);
      return;
    }

    // check type of response.data to be an array of strings
    if (!Array.isArray(response.data)) {
      console.log("Error: Invalid response from the server.");
      return;
    }

    const groupIDs: string[] = response.data;

    if (groupIDs.length == 0) {
      console.log("No groups found.");
      return;
    }

    // ask the user to choose a groupID
    const groupIDChoices = groupIDs.map((groupID, index) => ({
      name: `${index + 1}. ${groupID}`,
      value: groupID,
    }));

    const chosenGroupID = await select({
      message: 'Select one of your groups?',
      choices: groupIDChoices,
    }); 

    await mpcApp.dummy({});
  }
};

run();
