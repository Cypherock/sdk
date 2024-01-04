process.env.LOG_LEVEL="error"

import { promises as fs } from 'fs';


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
import { GroupInfo, GroupKeyInfo, ShareData } from '@cypherock/sdk-app-mpc/dist/proto/generated/mpc_poc/common';
import { SignedShareData, SignedPublicKey } from '@cypherock/sdk-app-mpc/dist/proto/generated/mpc_poc/common';
import { IGroupKeyInfo } from '@cypherock/sdk-app-mpc';
import { MtaData } from '@cypherock/sdk-app-mpc/dist/operations';
import { SigCalcData } from '@cypherock/sdk-app-mpc/dist/operations';

const SERVER_URL = "http://127.0.0.1:5000";
const DEVICE_ID_SIZE = 32;
const PUBLIC_KEY_SIZE = 33;
const WALLET_ID_SIZE = 32;
const USER_CHOICE_CREATE_GROUP = "create";
const USER_CHOICE_CHECK_GROUPS = "check";

const USER_ACTION_GENERATE_RECEIVE_ADDRESS = "generateReceiveAddress";
const USER_ACTION_VIEW_GROUP_PUBLIC_KEY = "viewGroupPublicKey";
const USER_ACTION_SIGN_MESSAGE = "signMessage";

const SIGN_ACTION_SIGN_EXISTING_MESSAGE = "signExistingMessage";
const SIGN_ACTION_CREATE_NEW_MESSAGE = "createNewMessage";
const SIGN_ACTION_GO_BACK = "goBack";

async function computeSHA256(arrayBuffer: Uint8Array): Promise<Uint8Array> {
    const hashBuffer = await subtle.digest("SHA-256", arrayBuffer);
    return new Uint8Array(hashBuffer);
}

function convertBip44PathToNumbers(path: string): number[] {
  const HARDENED_OFFSET = 2 ** 31;

  const components = path.split('/').slice(1);

  return components.map(component => {
    const isHardened = component.endsWith("'");

    const number = parseInt(component.replace("'", ""), 10);

    return isHardened ? number + HARDENED_OFFSET : number;
  });
}

async function getDerivationPath() {
    // Prompt the user for a comma-separated list of numbers
    const response = await input({
        message: "Enter the derivation path (e.g: m/44'/0'/0'/0/0):"
    });

    const validNumbers = convertBip44PathToNumbers(response);
    console.log('Derivation path:', validNumbers);
    return validNumbers;
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
            console.log(`...`);
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
          console.log(`...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          return fetchIndividualPublicKey(groupID, pubKey); // Retry
      } else {
          console.error(`Error fetching data for ${pubKey}: `, error);
      }
  }

  return SignedPublicKey.create({});
}

async function fetchParties(groupID: Uint8Array, msgHash: string, threshold: number): Promise<string[]> {
  try {
      const response = await axios.get(`${SERVER_URL}/sign/parties`, {
          params: { groupID: Buffer.from(groupID).toString('hex'),
                    msgHash: msgHash }
      });

      if (response.status === 200 && Array.isArray(response.data) && response.data.length == threshold) {
          return response.data;
      }
      else {
        throw new Error("Invalid response from the server.");
      }
  } catch (error: any) {
      if ((error.response && error.response.status === 404) || error.message === "Invalid response from the server.") {
          console.log(`...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          return fetchParties(groupID, msgHash, threshold); // Retry
      } else {
          console.error(`Error fetching data for ${msgHash}: `, error);
      }
  }

  return [];
}

// function to fetch shareDataList given groupID, pubKey and msgHash
async function fetchShareDataList(groupID: Uint8Array, pubKey: Uint8Array, msgHash: string): Promise<SignedShareData[]> {
  try {
      const response = await axios.get(`${SERVER_URL}/sign/shareDataList`, {
          params: { groupID: Buffer.from(groupID).toString('hex'),
                    pubKey: Buffer.from(pubKey).toString('hex'),
                    msgHash: msgHash }
      });

      if (response.status === 200) {
          return response.data.map((item: string) => SignedShareData.decode(new Uint8Array(Buffer.from(item, 'hex'))));
      }
  } catch (error: any) {
      if (error.response && error.response.status === 404) {
          console.log(`...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          return fetchShareDataList(groupID, pubKey, msgHash); // Retry
      } else {
          console.error(`Error fetching data for ${msgHash}: `, error);
      }
  }

  return [];
}

// function to fetch QIList given groupID, pubKey and msgHash
async function fetchQIList(groupID: Uint8Array, pubKey: Uint8Array, msgHash: string): Promise<SignedPublicKey[]> {
  try {
      const response = await axios.get(`${SERVER_URL}/sign/QIList`, {
          params: { groupID: Buffer.from(groupID).toString('hex'),
                    pubKey: Buffer.from(pubKey).toString('hex'),
                    msgHash: msgHash }
      });

      if (response.status === 200) {
          return response.data.map((item: string) => SignedPublicKey.decode(new Uint8Array(Buffer.from(item, 'hex'))));
      }
  } catch (error: any) {
      if (error.response && error.response.status === 404) {
          console.log(`...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          return fetchQIList(groupID, pubKey, msgHash); // Retry
      } else {
          console.error(`Error fetching data for ${msgHash}: `, error);
      }
  }

  return [];
}

// function to fetch mtaData given groupID, msgHash, mtaDataType, to and length
async function fetchMtaData(groupID: Uint8Array, msgHash: string, mtaDataType: string, to: number, length: number): Promise<MtaData[]> {
  try {
      const response = await axios.get(`${SERVER_URL}/sign/mtaData`, {
          params: { groupID: Buffer.from(groupID).toString('hex'),
                    msgHash: msgHash,
                    mtaDataType: mtaDataType,
                    to: to,
                    length: length }
      });

      if (response.status === 200) {
          return response.data;
      }
  } catch (error: any) {
      if (error.response && error.response.status === 404) {
          // console.log(`...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          return fetchMtaData(groupID, msgHash, mtaDataType, to, length); // Retry
      } else {
          console.error(`Error fetching data for ${msgHash}: `, error);
      }
  }

  return [];
}

// function to fetch sigData give groupID, msgHash, sigDataType, and length
async function fetchSigData(groupID: Uint8Array, msgHash: string, sigDataType: string, length: number): Promise<SigCalcData[]> {
  try {
      const response = await axios.get(`${SERVER_URL}/sign/sigData`, {
          params: { groupID: Buffer.from(groupID).toString('hex'),
                    msgHash: msgHash,
                    sigDataType: sigDataType,
                    length: length }
      });

      if (response.status === 200) {
          return response.data;
      }
  } catch (error: any) {
      if (error.response && error.response.status === 404) {
          // console.log(`...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          return fetchSigData(groupID, msgHash, sigDataType, length); // Retry
      } else {
          console.error(`Error fetching data for ${msgHash}: `, error);
      }
  }

  return [];
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

function pubKeyToIndex(groupInfo: IGroupInfo, pubKey: string): number {
  for (let i = 0; i < groupInfo.participants.length; i++) {
    if (Buffer.from(groupInfo.participants[i].pubKey).toString('hex') === pubKey) {
      return i+1;
    }
  }

  return -1;
}

async function invertMatrix(matrix: any[][]): Promise<any[][]> {
  let newMatrix = [];

  for (let i = 0; i < matrix.length; ++i) {
    let temp = [];
    for (let j = 0; j < matrix[i].length; ++j) {
      temp.push(matrix[j][i]);
    }
    newMatrix.push(temp);
  }

  return newMatrix;
}

async function getMtaUploadHandler(groupID: Uint8Array, msgHash: string, mtaDataType: string) {
  const handler = async (
    mtaData: MtaData[],
  ) => {
    const response = await axios.post(
      `${SERVER_URL}/sign/mtaData`,
      { 
        groupID: Buffer.from(groupID).toString('hex'), 
        msgHash: msgHash, 
        mtaDataList: mtaData,
        mtaDataType: mtaDataType
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
  };

  return handler;
}

async function getSigUploadHandler(groupID: Uint8Array, msgHash: string, sigDataType: string) {
  const handler = async (
    sigData: SigCalcData,
  ) => {
    const response = await axios.post(
      `${SERVER_URL}/sign/sigData`,
      { 
        groupID: Buffer.from(groupID).toString('hex'), 
        msgHash: msgHash, 
        sigData: sigData,
        sigDataType: sigDataType,
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
  };

  return handler;
}

async function signMessage(message: string, 
                           msgHash: string, 
                           mpcApp: MPCApp, 
                           walletId: Uint8Array, 
                           groupID: Uint8Array, 
                           pubKey: Uint8Array,
                           groupInfo: IGroupInfo,
                           groupInfoSignature: Uint8Array,
                           groupKeyInfo: IGroupKeyInfo,
                           groupKeyInfoSignature: Uint8Array) {

  console.log("\nCheck device's screen.");
  let parties: string[];

  const onMessageApproval = async () => {
    // make a post request to /approveMessage endpoint with the groupID and msgHash and pubKey
    const response = await axios.post(
      `${SERVER_URL}/approveMessage`,
      { groupID: Buffer.from(groupID).toString('hex'), msgHash: msgHash, pubKey: Buffer.from(pubKey).toString('hex') },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const getGroupInfo = async () => {
    // print both signatures in hex
    // console.log("Group info signature: ", Buffer.from(groupInfoSignature).toString('hex'));
    // console.log("Group key info signature: ", Buffer.from(groupKeyInfoSignature).toString('hex'));

    return {
      groupInfo: groupInfo,
      groupInfoSignature: groupInfoSignature,
      groupKeyInfo: groupKeyInfo,
      groupKeyInfoSignature: groupKeyInfoSignature,
    };
  }

  const getSequenceIndices = async () => {
    parties = await fetchParties(groupID, msgHash, groupInfo.threshold);
    let indexes = parties.map(pubKey => pubKeyToIndex(groupInfo, pubKey));

    if (indexes.some(index => index === -1)) {
        throw new Error("Invalid public key found in the sequence.");
    }

    // console.log(indexes);
    return indexes;
  }

  const onShareDataList = async (shareDataList: SignedShareData[]) => {
    let shareDataListRaw: string[] = shareDataList.map(item => Buffer.from(SignedShareData.encode(item).finish()).toString('hex'));

    const response = await axios.post(
      `${SERVER_URL}/sign/shareDataList`,
      { groupID: Buffer.from(groupID).toString('hex'), msgHash: msgHash, pubKey: Buffer.from(pubKey).toString('hex'), shareDataList: shareDataListRaw },
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


    let filteredParties = parties.filter(x => x !== Buffer.from(pubKey).toString('hex'));

    let shareDataLists: SignedShareData[][] = await Promise.all(filteredParties.map(pubKey => fetchShareDataList(groupID, new Uint8Array(Buffer.from(pubKey, 'hex')), msgHash)));
    let transposedMatrix: SignedShareData[][] = [];

    // Determine the number of columns in the original matrix
    let numColumns = shareDataLists.length > 0 ? shareDataLists[0].length : 0;

    // Iterate over each column in the original matrix
    for (let col = 0; col < numColumns; col++) {
        let newRow: SignedShareData[] = [];
        
        // Iterate over each row in the original matrix
        for (let row = 0; row < shareDataLists.length; row++) {
            newRow.push(shareDataLists[row][col]);
        }

        transposedMatrix.push(newRow);
    }
    
    // console.log("Share data lists: ");
    // console.log(transposedMatrix);

    return transposedMatrix;
  }

  const onSignedPubKeyList = async (signedPublicKeyList: SignedPublicKey[]) => {
    let signedPublicKeyListRaw: string[] = signedPublicKeyList.map(item => Buffer.from(SignedPublicKey.encode(item).finish()).toString('hex'));

    const response = await axios.post(
      `${SERVER_URL}/sign/QIList`,
      { groupID: Buffer.from(groupID).toString('hex'), msgHash: msgHash, pubKey: Buffer.from(pubKey).toString('hex'), QIList: signedPublicKeyListRaw },
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

    let filteredParties = parties.filter(x => x !== Buffer.from(pubKey).toString('hex'));
    let QILists: SignedPublicKey[][] = await Promise.all(filteredParties.map(pubKey => fetchQIList(groupID, new Uint8Array(Buffer.from(pubKey, 'hex')), msgHash)));

    let transposedMatrix: SignedPublicKey[][] = [];

    // Determine the number of columns in the original matrix
    let numColumns = QILists.length > 0 ? QILists[0].length : 0;

    // Iterate over each column in the original matrix
    for (let col = 0; col < numColumns; col++) {
        let newRow: SignedPublicKey[] = [];
        
        // Iterate over each row in the original matrix
        for (let row = 0; row < QILists.length; row++) {
            newRow.push(QILists[row][col]);
        }

        transposedMatrix.push(newRow);
    }

    // console.log("QI lists: ");
    // console.log(transposedMatrix);

    return transposedMatrix;
  }

  const onGroupKeyList = async (signedGroupKeyInfoList: {groupKeyInfo: IGroupKeyInfo, signature: Uint8Array}[]) => {
    let signedGroupKeyInfoListRaw: string[] = signedGroupKeyInfoList.map(item => Buffer.from(GroupKeyInfo.encode(item.groupKeyInfo).finish()).toString('hex'));
    let signatures: string[] = signedGroupKeyInfoList.map(item => Buffer.from(item.signature).toString('hex'));

    const response = await axios.post(
      `${SERVER_URL}/sign/keyInfoList`,
      { groupID: Buffer.from(groupID).toString('hex'), msgHash: msgHash, pubKey: Buffer.from(pubKey).toString('hex'), keyInfoList: signedGroupKeyInfoListRaw, signatureList: signatures },
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
  }


  let result = await mpcApp.signMessage({
    walletId: walletId, 
    groupID: groupID, 
    msg: new Uint8Array(Buffer.from(message, 'hex')),
    onMessageApproval: onMessageApproval,
    getGroupInfo: getGroupInfo,
    getSequenceIndices: getSequenceIndices,
    onShareDataList: onShareDataList,
    onSignedPubKeyList: onSignedPubKeyList,
    onGroupKeyList: onGroupKeyList,
    onRcvPkInfoList: await getMtaUploadHandler(groupID, msgHash, 'rcvPkInfoListStore'),
    getRcvPkInfoList: async (myIndex: number, length: number) => {
      return await fetchMtaData(groupID, msgHash, 'rcvPkInfoListStore', myIndex, length);
    },
    onSndPkInfoList: await getMtaUploadHandler(groupID, msgHash, 'sndPkInfoListStore'),
    getSndPkInfoList: async (myIndex: number, length: number) => {
      return await fetchMtaData(groupID, msgHash, 'sndPkInfoListStore', myIndex, length);
    },
    onRcvEncMsgList: await getMtaUploadHandler(groupID, msgHash, 'rcvEncMsgListStore'),
    getRcvEncMsgList: async (myIndex: number, length: number) => {
      return await fetchMtaData(groupID, msgHash, 'rcvEncMsgListStore', myIndex, length);
    },
    onSndMascotList: await getMtaUploadHandler(groupID, msgHash, 'sndMascotListStore'),
    getSndMascotList: async (myIndex: number, length: number) => {
      return await fetchMtaData(groupID, msgHash, 'sndMascotListStore', myIndex, length);
    },
    onSignedAuthenticatorData: await getSigUploadHandler(groupID, msgHash, 'authenticatorDataStore'),
    getSignedAuthenticatorDataList: async () => {
      return await fetchSigData(groupID, msgHash, 'authenticatorDataStore', groupInfo.threshold);
    },
    onSignedKaShare: await getSigUploadHandler(groupID, msgHash, 'kaShareStore'),
    getSignedKaShareList: async () => {
      return await fetchSigData(groupID, msgHash, 'kaShareStore', groupInfo.threshold);
    },
    onSignedSigShare: await getSigUploadHandler(groupID, msgHash, 'sigShareStore'),
    getSignedSigShareList: async () => {
      return await fetchSigData(groupID, msgHash, 'sigShareStore', groupInfo.threshold);
    },
  });

  console.log("Signature: ", Buffer.from(result.signature).toString('hex'));
}

async function common(groupID: Uint8Array, pubKey: Uint8Array, mpcApp: MPCApp, walletId: Uint8Array) {
  // get group info from the server
  let response = await axios.get(`${SERVER_URL}/groupInfo`, {
    params: { groupID: Buffer.from(groupID).toString('hex'),
              pubKey: Buffer.from(pubKey).toString('hex') }
  });

  if (response.status != 200) {
    console.log('Error:', response.data);
    return;
  }

  const groupInfo: IGroupInfo = GroupInfo.decode(new Uint8Array(Buffer.from(response.data['groupInfo'], 'hex')));
  const groupInfoSignature = new Uint8Array(Buffer.from(response.data['signature'], 'hex'));

  // get my share of the group secret polynomial from the server
  response = await axios.get(`${SERVER_URL}/groupKeyInfo`, {
    params: { groupID: Buffer.from(groupID).toString('hex'),
              pubKey: Buffer.from(pubKey).toString('hex') }
  });

  if (response.status != 200) {
    console.log('Error:', response.data);
    return;
  }

  const groupKeyInfo = GroupKeyInfo.decode(new Uint8Array(Buffer.from(response.data['groupKeyInfo'], 'hex')));
  const groupKeyInfoSignature = new Uint8Array(Buffer.from(response.data['signature'], 'hex'));

  const userChoices = [
    {
      name: 'Generate receive address',
      value: USER_ACTION_GENERATE_RECEIVE_ADDRESS,
    },
    {
      name: 'View group public key',
      value: USER_ACTION_VIEW_GROUP_PUBLIC_KEY,
    },
    {
      name: "Sign a message",
      value: USER_ACTION_SIGN_MESSAGE,  
    }
  ]

  while (true)
  {
    console.log("\n");
    const userChoice = await select({
      message: 'Choose an option:',
      choices: userChoices,
    });

    if (userChoice === USER_ACTION_GENERATE_RECEIVE_ADDRESS) {
      // ask user to enter the derivation path
      const derivationPath = await getDerivationPath();
    
      try {
        const result = await mpcApp.getChildKey({walletId: walletId, groupKeyInfo: groupKeyInfo, signature: groupKeyInfoSignature, path: derivationPath});

        console.log("Receive address: ", Buffer.from(result.pubKey).toString('hex'));
      }
      catch (error: any) {
        console.log("Some error occured.");
      }
    }
    else if (userChoice === USER_ACTION_VIEW_GROUP_PUBLIC_KEY) {
      console.log("Group public key: ", Buffer.from(groupKeyInfo.groupPubKey).toString('hex'));
    }
    else if (userChoice === USER_ACTION_SIGN_MESSAGE) {
      const signingChoices = [
        {
          name: 'Sign an existing message',
          value: SIGN_ACTION_SIGN_EXISTING_MESSAGE,
        },
        {
          name: "Create a new message to sign",
          value: SIGN_ACTION_CREATE_NEW_MESSAGE,  
        },
        {
          name: "Go back",
          value: SIGN_ACTION_GO_BACK,
        }
      ];

      while (true) {
        console.log('\n');
        const signingChoice = await select({
          message: 'Choose an option:',
          choices: signingChoices,
        });

        if (signingChoice === SIGN_ACTION_SIGN_EXISTING_MESSAGE) {
          const response = await axios.get(`${SERVER_URL}/message`, {
            params: { groupID: Buffer.from(groupID).toString('hex') }
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

          const messageHashes: {'msgHash': string, 'parties': number}[] = response.data;

          if (messageHashes.length == 0) {
            console.log("No messages found.");
            continue;
          }

          // ask the user to choose a groupID
          const msgHashChoices = messageHashes.map((item, index) => ({
            name: `${index + 1}. ${item['msgHash']} - Users online: (${item['parties']}/${groupInfo.threshold})`,
            value: item['msgHash'],
          }));
          msgHashChoices.push({name: `${messageHashes.length + 1}. Go back.`, value: 'GO_BACK'})

          const chosenMsg = await select({
            message: 'Select the message to sign?',
            choices: msgHashChoices,
          }); 

          if (chosenMsg == "GO_BACK") {
            continue;
          }

          // get message from message hash
          const response2 = await axios.get(`${SERVER_URL}/messageHash`, {
            params: { msgHash: chosenMsg }
          });

          if (response2.status != 200 || response2.data === '') {
            console.log('Error: Invalid response from the server.');
            return;
          }

          console.log("\nMessage to be signed: ", response2.data);
          console.log("\n");
          const message = await input({
              message: "Continue with the above message (y/n):"
          });

          if (message != 'y' && message != 'Y') {
            continue;
          }

          await signMessage(response2.data, chosenMsg, mpcApp, walletId, groupID, pubKey, groupInfo, groupInfoSignature, groupKeyInfo, groupKeyInfoSignature);
          break;          
        }
        else if (signingChoice === SIGN_ACTION_CREATE_NEW_MESSAGE) {
          // ask user to enter the message in hex
          const message = await input({
              message: "Enter the message in hex:"
          });

          // upload the message on the server
          const response = await axios.post(
            `${SERVER_URL}/message`,
            { groupID: Buffer.from(groupID).toString('hex'), pubKey: Buffer.from(pubKey).toString('hex'), msg: message },
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

          const msgHash = response.data['msgHash'];

          await signMessage(message, msgHash, mpcApp, walletId, groupID, pubKey, groupInfo, groupInfoSignature, groupKeyInfo, groupKeyInfoSignature);
          break;
        }
        else if (signingChoice === SIGN_ACTION_GO_BACK) {
          break;
        }
      }
    }
  }
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

  try {
    const logs = await managerApp.getLogs();

    // Convert the logs object to a string
    const logsString = JSON.stringify(logs, null, 2);
   // Generate a random integer, for example between 0 and 9999
     const randomNumber = Math.floor(Math.random() * 10000);

     // Append the random number to the file name
     const fileName = `logs_${randomNumber}.txt`;

     // Write to a file
     await fs.writeFile(fileName, logsString);

     console.log(`Logs saved to ${fileName}`);
   } catch (error) {
     console.error('Error saving logs:', error);
   }

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

  while (true) {
    const userChoice = await select({
      message: 'Choose an option:',
      choices: userChoices,
    });

    if (userChoice === USER_CHOICE_CREATE_GROUP) {
      const total_participants = parseInt(await input({ message: 'Enter the total number of participants:' }));
      const threshold = parseInt(await input({ message: 'Enter the threshold: ' }));

      console.log("Check device's screen.");

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

        console.log("\nMatch the fingerprints you entered on the device's screen\n");

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

      let globalGroupID: Uint8Array = new Uint8Array();
      let groupInfoSignature: Uint8Array = new Uint8Array();

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

        console.log("\nDKG process started...")

        console.log('\nUploading your encrypted ShareData to the server...')
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

        console.log("Broadcast successful.");

        console.log("Waiting for the other participants to upload their ShareData...");

        const shareDataList = await Promise.all(participantsPublicKeys.map(pubKey => fetchShareData(globalGroupID, pubKey)));

        return shareDataList;
      }

      const onIndividualPublicKey = async (individualPublicKey: SignedPublicKey) => {
        const individualPublicKeyRaw = SignedPublicKey.encode(individualPublicKey).finish();

        console.log("\nUploading your Qi to the server...")

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

        console.log("Qi uploaded successfully.");
        console.log("Waiting for the other participants to upload their Qi...");

        let individualPublicKeyList = await Promise.all(participantsPublicKeys.map(pubKey => fetchIndividualPublicKey(globalGroupID, pubKey)));

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

      if (!result.completed) {
        console.log("Error setting up the group.");
        return;
      } 

      console.log("\nDKG process completed successfully.");
      console.log("\nUploading your encrypted share of the group secret polynomial to the server...")

      const response = await axios.post(
        `${SERVER_URL}/groupKeyInfo`,
        { 
          groupID: Buffer.from(globalGroupID).toString('hex'),
          groupKeyInfo: Buffer.from(GroupKeyInfo.encode(result.groupKeyInfo).finish()).toString('hex'),
          pubKey: Buffer.from(pubKey).toString('hex'), 
          signature: Buffer.from(result.signature).toString('hex'),
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

      console.log("Share uploaded successfully.");

      await common(globalGroupID, pubKey, mpcApp, chosenWalletId);
      return;

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
        continue;
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

      await common(new Uint8Array(Buffer.from(chosenGroupID, 'hex')), pubKey, mpcApp, chosenWalletId);
      return;
    }
  }
};

run();
