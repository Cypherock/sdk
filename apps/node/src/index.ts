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
import { GroupInfo } from '@cypherock/sdk-app-mpc/dist/proto/generated/mpc_poc/entity_info';

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

// async function getFingerpintIndices(list: any[], fingerprints: string[]): Promise<number[]> {
//   let hashes = [];

//   for (let i = 0; i < list.length; i++) {
//     hashes.push(Buffer.from(await computeSHA256(new Uint8Array(Buffer.from(list[i].info, 'hex')))).toString('hex'));
//   }

//   // find the indices of the fingerprints in the hashes array
//   let indices = [];
//   for (let i = 0; i < fingerprints.length; i++) {
//     let index = hashes.indexOf(fingerprints[i]);

//     if (index != -1) {
//       indices.push(index);
//     }
//   }

//   return indices;
// }

// async function sortIndices(indices: number[], hashes: string[]): Promise<number[]> {
//     const combined = indices.map((index, i) => ({ index, hash: hashes[i] }));

//     combined.sort((a, b) => a.hash.localeCompare(b.hash));

//     const updatedIndices = combined.map(item => item.index);

//     return updatedIndices;
// }


// // Function to evaluate the list and the number n
// const shouldStopPolling = async (list: any[], fingerprints: string[]): Promise<boolean> => {
//     if (list.length < fingerprints.length) {
//         return false;
//     }

//     return (await getFingerpintIndices(list, fingerprints)).length == fingerprints.length;
// };

// // Function to poll the /status endpoint, now takes ifp and n as arguments
// const pollStatus = async (ifp: string, fingerprints: string[]) => {
//     try {
//         const response = await axios.get(`${SERVER_URL}/status`, {
//             params: { IFP: ifp }
//         });

//         const list = response.data;

//         if (await shouldStopPolling(list, fingerprints)) {
//         } else {
//             setTimeout(() => pollStatus(ifp, fingerprints), 2000); // Delay of 2 seconds
//         }
//     } catch (error) {
//         console.error('Error polling the /status endpoint:', error);
//         // Optionally retry or handle the error as needed
//     }
// };

// async function verifyIFP(threshold: number, total_participants: number, mpcApp: MPCApp): Promise<string> {
//   let IFP = await input({ message: 'Enter the IFP: ' });

//   console.log("\nFetching initiator's details from the server...");
//   await pollStatus(IFP, [IFP]);

//   let response = await axios.get(`${SERVER_URL}/status`, {
//       params: { IFP: IFP }
//   });

//   const list = response.data;
//   console.log("Details fetched.");

//   let indices = await getFingerpintIndices(list, [IFP]);

//   // verify Initiator's entity info
//   console.log("\nVerifying initiator's entity info...");

//   let initiatorEntityInfo = MPCApp.decodeEntityInfo(new Uint8Array(Buffer.from(list[indices[0]].info, 'hex')));

//   if (initiatorEntityInfo.threshold != threshold || initiatorEntityInfo.totalParticipants != total_participants) {
//     console.log("Verification failed.");
//     // await mpcApp.exitApplication();
//     return "";
//   }

//   let result = await mpcApp.verifyEntityInfo({
//     fingerprint: new Uint8Array(Buffer.from(IFP, 'hex')),
//     entityInfo: initiatorEntityInfo, 
//     signature: new Uint8Array(Buffer.from(list[indices[0]].sig, 'hex'))
//   });

//   if (!result.verified) {
//     console.log("Verification failed.");
//     // await mpcApp.exitApplication();
//     return "";
//   }

//   return IFP;
// }

// async function uploadEntityInfoToServer(userType: string, entityInfoRaw: Uint8Array, 
//   SIG: Uint8Array, IFP: string, mpcApp: MPCApp): Promise<boolean> {

//   console.log("\nUploading your entity info and signature to the server...");
//   let response;

//   if (userType == USER_TYPE_INITIATOR) {
//     response = await axios.post(
//       `${SERVER_URL}/initiate`,
//       { EntityInfo: Buffer.from(entityInfoRaw).toString('hex'), SIG: Buffer.from(SIG).toString('hex') },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (response.status != 200) {
//       console.log('Error:', response.data);
//       // await mpcApp.exitApplication();
//       return false;
//     }
//   } else {
//     response = await axios.post(
//       `${SERVER_URL}/join`,
//       { EntityInfo: Buffer.from(entityInfoRaw).toString('hex'), SIG: Buffer.from(SIG).toString('hex'), IFP: IFP },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (response.status != 200) {
//       console.log('Error:', response.data);
//       // await mpcApp.exitApplication();
//       return false;
//     }
//   }

//   console.log("Data uploaded successfully.");
//   return true;
// }

// async function common(mpcApp: MPCApp, managerApp: ManagerApp, 
//   chosenWalletId: Uint8Array, pubKey: Uint8Array, userType: string): Promise<boolean> {
    
//   console.log("Fetching details from the device...");

//   const deviceInfo = await managerApp.getDeviceInfo();
//   let device_id = deviceInfo.deviceSerial;

//   const timestamp = Date.now();
//   let random_nonce = await mpcApp.getRandomNonce();

//   console.log("Details fetched.\n")

//   const total_participants = parseInt(await input({ message: 'Enter the total number of participants:' }));
//   const threshold = parseInt(await input({ message: 'Enter the threshold: ' }));

//   let IFP = '';

//   if (userType == USER_TYPE_PARTICIPANT) {
//     IFP = await verifyIFP(threshold, total_participants, mpcApp);

//     if (IFP == "") {
//       return false;
//     }
//   }

//   let entity_info: IEntityInfo = MPCApp.createEntityInfo(timestamp, random_nonce.nonce, 
//       threshold, total_participants, device_id, pubKey, chosenWalletId);

//   let entity_info_raw = MPCApp.encodeEntityInfo(entity_info);
//   let FP = await computeSHA256(entity_info_raw);

//   console.log(`\nShare the below ${userType == USER_TYPE_INITIATOR ? 'IFP' : 'fingerprint'} with the group members via an alternate channel:`);
//   console.log(Buffer.from(FP).toString('hex'));
//   console.log('\n');

//   console.log("\nSigning your entity info...");

//   let signature = await mpcApp.signEntityInfo({fingerprint: FP, entityInfo: entity_info});
//   let SIG = signature.signature;
    
//   console.log("Signature generated:");

//   if (await uploadEntityInfoToServer(userType, entity_info_raw, SIG, IFP, mpcApp) == false) {
//     return false;
//   }

//   let fingerprints;

//   if (userType == USER_TYPE_INITIATOR) {
//     fingerprints = [Buffer.from(FP).toString('hex')];
//   } else {
//     fingerprints = [Buffer.from(FP).toString('hex'), IFP];
//   }

//   console.log(`Enter the fingerpints of the other ${total_participants - fingerprints.length} participants:`);

//   for (let i = 0; i < total_participants - fingerprints.length; i++) {
//     // take user input
//     fingerprints.push(await input({ message: `>` }));
//   }

//   console.log("\nWaiting for other participants to join the group...");

//   await pollStatus(
//     (userType == USER_TYPE_INITIATOR ? Buffer.from(FP).toString('hex') : IFP), 
//     fingerprints
//   );

//   console.log("Polling has stopped.");

//   let response = await axios.get(`${SERVER_URL}/status`, {
//       params: { IFP: (userType == USER_TYPE_INITIATOR ? Buffer.from(FP).toString('hex') : IFP) },
//   });

//   let list = response.data;
//   let indices = await getFingerpintIndices(list, fingerprints);

//   if (indices.length != fingerprints.length) {
//     console.log("Some error occured.");
//     await mpcApp.exitApplication();
//     return false;
//   }

//   const participantEntityInfoList = [];
//   const participantSequenceHashList = [];

//   for (let i = 0; i < indices.length; ++i) {
//     let entityInfo: IEntityInfo = MPCApp.decodeEntityInfo(new Uint8Array(Buffer.from(list[indices[i]].info, 'hex')));
//     let sequenceDetails = new Uint8Array(DEVICE_ID_SIZE + PUBLIC_KEY_SIZE + WALLET_ID_SIZE);

//     sequenceDetails.set(entityInfo.deviceId, 0);
//     sequenceDetails.set(entityInfo.pubKey, DEVICE_ID_SIZE);
//     sequenceDetails.set(entityInfo.walletId, DEVICE_ID_SIZE + PUBLIC_KEY_SIZE);

//     participantSequenceHashList.push(Buffer.from(await computeSHA256(sequenceDetails)).toString('hex'));
//   }

//   let sortedIndices = await sortIndices(indices, participantSequenceHashList);

//   let participant_index = 0;

//   for (let i = 0; i < sortedIndices.length; ++i) {
//     // TODO: Change the verifying logic to be on CLI instead of the device.

//     // Compute fingerprint of the entity info
//     let entityInfo: IEntityInfo = MPCApp.decodeEntityInfo(new Uint8Array(Buffer.from(list[sortedIndices[i]].info, 'hex')));
//     let entityInfoRaw = MPCApp.encodeEntityInfo(entityInfo);
//     let fingerprint = await computeSHA256(entityInfoRaw);

//     if (Buffer.from(fingerprint).toString('hex') == Buffer.from(FP).toString('hex') ||
//       (userType == USER_TYPE_PARTICIPANT && Buffer.from(fingerprint).toString('hex') == IFP)) {

//     } else {
//       // verify entity info
//       console.log("\nVerifying entity info of participant: ", participant_index + 1);

//       if (entityInfo.threshold != threshold || entityInfo.totalParticipants != total_participants) {
//         console.log("Verification failed.");
//         await mpcApp.exitApplication();
//         return false;
//       }

//       let result = await mpcApp.verifyEntityInfo({
//         fingerprint: fingerprint, 
//         entityInfo: entityInfo, 
//         signature: new Uint8Array(Buffer.from(list[sortedIndices[i]].sig, 'hex'))
//       });

//       if (!result.verified) {
//         console.log("Verification failed.");
//         await mpcApp.exitApplication();
//         return false;
//       }

//       participant_index += 1;
//     }

//     participantEntityInfoList.push(entityInfo);
//   }

//   console.log(participantEntityInfoList);
//   return true;
// }

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

      fingerprints.push(Buffer.from(fingerprint).toString('hex'));
      entityInfoList.push(entityInfo);

      return participants;
    }

    const result = await mpcApp.groupSetup({
      walletId: chosenWalletId,
      threshold: threshold,
      totalParticipants: total_participants,
      onEntityInfo: onEntityInfo,
    });

    console.log("Group setup completed.");
    console.log("Group ID: ", Buffer.from(result.groupId).toString('hex'));
    console.log("Signature: ", Buffer.from(result.signature).toString('hex'));

    let groupInfo: IGroupInfo = await getGroupInfo(entityInfoList, fingerprints, threshold, total_participants);
    let groupInfoRaw = GroupInfo.encode(groupInfo).finish();

    console.log("\nUploading group info to the server...")

    const response = await axios.post(
      `${SERVER_URL}/groupInfo`,
      { groupInfo: Buffer.from(groupInfoRaw).toString('hex'),
        groupID: Buffer.from(result.groupId).toString('hex'),
        signature: Buffer.from(result.signature).toString('hex'),
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
