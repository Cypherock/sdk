import { EvmApp } from "@cypherock/sdk-app-evm";
import { IWalletItem } from "@cypherock/sdk-app-manager";
import DeviceConnection from "@cypherock/sdk-hw-webusb";
import { useEffect, useState } from "react";
import { populateWalletSelection } from "./wallet";
import { ethers } from 'ethers';
import { setEthersLib, IGetPublicKeysResult } from '@cypherock/sdk-app-evm';

type NetworkDetails = {
  name: string;
  chainId: number;
};

type AccountType = {
  name: string;
  derivationPath: number[];
  varIdx: number;
};

type ServiceDetails = {
  name: string | undefined;
  chainId: number | undefined;
  accounts: IGetPublicKeysResult | undefined;
  wallet: IWalletItem | undefined;
  accountNumber: number | undefined;
  accountType: AccountType | undefined;
  derivationPath: number[] | undefined;
};

const networks: NetworkDetails[] = [
  {
    name: "Ethereum",
    chainId: 1,
  },
  {
    name: "Polygon",
    chainId: 137,
  },
  {
    name: "BNB Smart Chain",
    chainId: 56,
  },
  {
    name: "Fantom Opera",
    chainId: 250,
  },
];

const accountTypes: AccountType[] = [
  {
    name: "Legacy",
    derivationPath: [0x8000002C, 0x8000003C, 0x80000000, 0],
    varIdx: 3,
  },
  {
    name: "Ledger",
    derivationPath: [0x8000002C, 0x8000003C, 0x80000000, 0, 0],
    varIdx: 2,
  },
  {
    name: "Metamask",
    derivationPath: [0x8000002C, 0x8000003C, 0x80000000, 0, 0],
    varIdx: 4,
  },
];

const replacer = (key: any, value: any) => {
  if( typeof value === 'number'){
    return '0x' + value.toString(16)
  }
  return value
};

export const EthereumService: React.FC<{ devConnection: DeviceConnection, wallets: IWalletItem[] }> = ({ devConnection, wallets }) => {
  const [connection] = useState(devConnection);
  const [instance, setInstance] = useState<EvmApp | undefined>(undefined);
  const [action, setAction] = useState<string | undefined>(undefined);
  const [appError, setAppError] = useState<string | undefined>(undefined);
  const [appResult, setAppResult] = useState<string | undefined>(undefined);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({name: undefined, chainId: undefined, accounts: undefined, wallet: undefined, accountNumber: 0, accountType: undefined, derivationPath: undefined});
  const [accountReady, setAccountReady] = useState<boolean>(false);

  const init = async (connection: DeviceConnection) => {
    const app = await EvmApp.create(connection);
    setInstance(app);
  }

  const populateActions = () => {
    const actionList = Object.getOwnPropertyNames(EvmApp.prototype);
    return (
    <select className="browser-default custom-select" id="typeInput" onChange={(evt) => setAction(evt.target.value)}>
      <option value="">Select an action</option>
      {
        actionList.map( (x,y) => {
          if (x === 'constructor' || x === 'destroy') return;
          return <option value={y} key={y}>{x}</option>;
        })
      }
    </select>);
  }

  const getActionComponents = () => {
    switch (action) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "7":
      case "12":
        return (<></>);

      case "6":
      case "8":
      case "9":
      case "10":
        return (
        <>
        <label>Input:</label>
        <textarea className="alert alert-secondary" style={{width: '100%'}}>

        </textarea>
        </>);

      default:
        return <span>Invalid action or not implemented</span>;
    }
  };

  const doAction = async (actionVal: string) => {
    try {
      setAppError(undefined);
      setAppResult(undefined);
      if (instance === undefined || serviceDetails.accountType === undefined || serviceDetails.accountNumber === undefined || serviceDetails.wallet === undefined)
        return "Select all options";

      switch (actionVal) {
        case "1":
          const path = [...serviceDetails.accountType?.derivationPath];
          path[serviceDetails.accountType.varIdx] += serviceDetails.accountNumber;
          const accounts = await instance?.getPublicKeys({chainId: 1, walletId: serviceDetails.wallet.id, derivationPaths: [{path}]});
          setServiceDetails({...serviceDetails, accounts})
          return accounts;
  
        default:
          return "Invalid action or not implemented";
      }
    } catch (error) {
      setAppError((error as any).message);
    }
  };

  const prepareNetworks = () => {
    return (
      <select className="browser-default custom-select" id="typeInput" onChange={(evt) => handleNetworkSelection(evt.target.value)}>
        <option value="">Select a network</option>
        {
          networks.map( (x,y) => {
            return <option value={y} key={y}>{x.name}</option>;
          })
        }
      </select>);
  }

  const prepareAccTypes = () => {
    return (
      <select className="browser-default custom-select" id="typeInput" onChange={(evt) => handleAccTypeSelection(evt.target.value)}>
        <option value="">Select account type</option>
        {
          accountTypes.map( (x,y) => {
            return <option value={y} key={y}>{x.name}</option>;
          })
        }
      </select>);
  }

  const handleWalletSelection = (indexValue: string) => {
    const idx = Number(indexValue);
    setServiceDetails({...serviceDetails, wallet: (idx < wallets.length ? wallets[idx] : undefined)})
  };

  const handleNetworkSelection = (indexValue: string) => {
    const idx = Number(indexValue);
    setServiceDetails({...serviceDetails, chainId: (typeof idx === 'number' && idx < networks.length ? networks[idx].chainId : undefined)})
  };

  const handleAccTypeSelection = (indexValue: string) => {
    const idx = Number(indexValue);
    const accountType = (typeof idx === 'number' && idx < networks.length ? accountTypes[idx] : undefined);
    const derivationPath = accountType ? [...accountType.derivationPath] : undefined;
    if (derivationPath && accountType)
      derivationPath[accountType.varIdx] += serviceDetails.accountNumber ? serviceDetails.accountNumber : 0;
    setServiceDetails({...serviceDetails, derivationPath, accountType});
  };

  const handleNumberSelection = (indexValue: string) => {
    const idx = Number(indexValue);
    const derivationPath = serviceDetails.accountType ? [...serviceDetails.accountType.derivationPath] : undefined;
    if (derivationPath && serviceDetails.accountType)
      derivationPath[serviceDetails.accountType.varIdx] += idx;
    setServiceDetails({...serviceDetails, accountNumber: (typeof idx === 'number' && idx >= 0 && idx < 0x80000000 ? idx : undefined), derivationPath})
  };

  const submitFormButton = async () => {
    let params;
    if (type.value === '0x0') {
      params =
        {
          from: serviceDetails.accounts?.addresses[0],
          to: toDiv.value,
          value: amount.value,
          gasPrice: gasPrice.value,
          type: type.value,
          data: src_data.value,
        };
    } else {
      params =
        {
          from: serviceDetails.accounts?.addresses[0],
          to: toDiv.value,
          value: amount.value,
          maxFeePerGas: maxFee.value,
          maxPriorityFeePerGas: maxPriority.value,
          type: type.value,
          data: src_data.value,
        };
    }
    console.log({params});
    const result = await ethers.Transaction.from(params);
    console.log({result});
  };

  /**
   * eth_sign
   */
  const ethSign = async () => {
    try {
      // const msg = 'Sample message to hash for signature'
      // const msgHash = keccak256(msg)
      const msg =
        '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
      const ethResult = await src_provider.request({
        method: 'eth_sign',
        params: [serviceDetails.accounts?.addresses[0], msg],
      });
      ethSignResult.innerHTML = JSON.stringify(ethResult);
    } catch (err) {
      console.error(err);
      setAppError(`Error: ${(err as any).message}`);
    }
  };

  /**
   * Personal Sign
   */
  const personalSign = async () => {
    const exampleMessage = 'Example `personal_sign` message';
    try {
      const from = serviceDetails.accounts?.addresses[0];
      const msg = `0x${src_Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await src_provider.request({
        method: 'personal_sign',
        params: [msg, from, 'Example password'],
      });
      personalSignResult.innerHTML = sign;
      personalSignVerify.disabled = false;
    } catch (err) {
      console.error(err);
      setAppError(`Error: ${(err as any).message}`);
    }
  };

  /**
   * Sign In With Ethereum helper
   */
  const siweSign = async (siweMessage) => {
    try {
      const from = serviceDetails.accounts?.addresses[0];
      const msg = `0x${src_Buffer.from(siweMessage, 'utf8').toString('hex')}`;
      const sign = await src_provider.request({
        method: 'personal_sign',
        params: [msg, from, 'Example password'],
      });
      siweResult.innerHTML = sign;
    } catch (err) {
      console.error(err);
      setAppError(`Error: ${(err as any).message}`);
    }
  };

  /**
   * Sign In With Ethereum
   */
  const siwe = async () => {
    const domain = window.location.host;
    const from = serviceDetails.accounts?.addresses[0];
    const siweMessage = `${domain} wants you to sign in with your Ethereum account:\
    ${from}\
    \
    I accept the MetaMask Terms of Service: https://community.metamask.io/tos\
    \
    URI: https://${domain}\
    Version: 1\
    Chain ID: 1\
    Nonce: 32891757\
    Issued At: 2021-09-30T16:25:24.000Z`;
    siweSign(siweMessage);
  };

  /**
   * Sign In With Ethereum (with Resources)
   */
  const siweResources = async () => {
    const domain = window.location.host;
    const from = serviceDetails.accounts?.addresses[0];
    const siweMessageResources = `${domain} wants you to sign in with your Ethereum account:\
    ${from}\
    \
    I accept the MetaMask Terms of Service: https://community.metamask.io/tos\
    \
    URI: https://${domain}\
    Version: 1\
    Chain ID: 1\
    Nonce: 32891757\
    Issued At: 2021-09-30T16:25:24.000Z\
    Not Before: 2022-03-17T12:45:13.610Z\
    Request ID: some_id\
    Resources:\
    - ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu\
    - https://example.com/my-web2-claim.json`;
    siweSign(siweMessageResources);
  };

  /**
   * Sign In With Ethereum (Bad Domain)
   */
  const siweBadDomain = async () => {
    const domain = 'metamask.badactor.io';
    const from = serviceDetails.accounts?.addresses[0];
    const siweMessageBadDomain = `${domain} wants you to sign in with your Ethereum account:\
    ${from}\
    \
    I accept the MetaMask Terms of Service: https://community.metamask.io/tos\
    \
    URI: https://${domain}\
    Version: 1\
    Chain ID: 1\
    Nonce: 32891757\
    Issued At: 2021-09-30T16:25:24.000Z\
    Resources:\
    - ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu\
    - https://example.com/my-web2-claim.json`;
    siweSign(siweMessageBadDomain);
  };

  /**
   * Sign In With Ethereum (Bad Account)
   */
  const siweBadAccount = async () => {
    const domain = window.location.host;
    const from = '0x0000000000000000000000000000000000000000';
    const siweMessageBadAccount = `${domain} wants you to sign in with your Ethereum account:\
    ${from}\
    \
    I accept the MetaMask Terms of Service: https://community.metamask.io/tos\
    \
    URI: https://${domain}\
    Version: 1\
    Chain ID: 1\
    Nonce: 32891757\
    Issued At: 2021-09-30T16:25:24.000Z\
    Resources:\
    - ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu\
    - https://example.com/my-web2-claim.json`;
    siweSign(siweMessageBadAccount);
  };

  /**
   * Sign In With Ethereum (Malformed)
   */
  const siweMalformed = async () => {
    const domain = window.location.host;
    const from = serviceDetails.accounts?.addresses[0];
    const siweMessageMissing = `${domain} wants you to sign in with your Ethereum account:\
    ${from}\
    \
    I accept the MetaMask Terms of Service: https://community.metamask.io/tos\
    \
    Version: 1\
    Nonce: 32891757\
    Issued At: 2021-09-30T16:25:24Z`;
    siweSign(siweMessageMissing);
  };

  /**
   * Personal Sign Verify
   */
  const personalSignVerify = async () => {
    const exampleMessage = 'Example `personal_sign` message';
    try {
      const from = serviceDetails.accounts?.addresses[0];
      const msg = `0x${src_Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = personalSignResult.innerHTML;
      const recoveredAddr = (0,eth_sig_util.recoverPersonalSignature)({
        data: msg,
        sig: sign,
      });
      if (recoveredAddr === from) {
        console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`);
        personalSignVerifySigUtilResult.innerHTML = recoveredAddr;
      } else {
        console.log(
          `SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
        );
        console.log(`Failed comparing ${recoveredAddr} to ${from}`);
      }
      const ecRecoverAddr = await src_provider.request({
        method: 'personal_ecRecover',
        params: [msg, sign],
      });
      if (ecRecoverAddr === from) {
        console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`);
        personalSignVerifyECRecoverResult.innerHTML = ecRecoverAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`,
        );
      }
    } catch (err) {
      console.error(err);
      setAppError(`Error: ${(err as any).message}`);
      setAppError(`Error: ${(err as any).message}`);
    }
  }

  useEffect(() => {
    init(connection);
    setEthersLib(ethers);
  }, []);

  useEffect(() => {
    if (serviceDetails.accountType === undefined || serviceDetails.accountNumber === undefined || serviceDetails.wallet === undefined || serviceDetails.chainId === undefined)
      setAccountReady(false);
    else
      setAccountReady(true);
  }, [serviceDetails.wallet, serviceDetails.chainId, serviceDetails.accountNumber, serviceDetails.accountType]);

  return (
    <div className="card">
      {appError && (
        <div id="deviceWarning" className="row justify-content-center" hidden={false}>
          <div className="warning-message justify-content-center col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
            <img src="warning.svg" alt="" className="warning-message-icon" />
            <div className="warning-message-text"> {appError} </div>
          </div>
        </div>
      )}

      <div className="card-body">
        <h4 className="card-title"> Ethereum </h4>
        {instance ? (
          <>
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
              <div className="form-group">
                <label>Wallet</label><br/>
                {populateWalletSelection(wallets, handleWalletSelection)}
              </div>
              <div className="form-group">
                <label>Network</label><br/>
                {prepareNetworks()}
              </div>
              <div className="form-group">
                <label>Account type</label><br/>
                {prepareAccTypes()}
              </div>
              <div className="form-group">
                <label>Account Number</label><br/>
                <input disabled={serviceDetails.accountType === undefined} className="form-control" min={0} max={0x7fffffff} type="number" placeholder="0" defaultValue={0} onChange={(evt) => handleNumberSelection(evt.target.value)} />
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
              <p className="info-text alert alert-primary">
                Wallet: <span id="network">{serviceDetails.wallet?.isValid ? "OK" : "Not Operational"}</span>
              </p>
              <p className="info-text alert alert-primary">
                Chain Id: <span id="network">{serviceDetails.chainId}</span>
              </p>
              <p className="info-text alert alert-primary">
                Base Derivation Path: <span id="network">{JSON.stringify(serviceDetails.accountType?.derivationPath, replacer)}</span>
              </p>
              <p className="info-text alert alert-primary">
                Account Derivation Path: <span id="network">{JSON.stringify(serviceDetails.derivationPath, replacer)}</span>
              </p>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
              <div className="form-group">
                <label>Account Address</label>
                <input className="form-control" id="accountAddress" value={`${serviceDetails.accounts?.addresses[0]}`} disabled={true} />
              </div>
              <div className="form-group">
                <label>Public key</label>
                <input className="form-control" id="publicKey" value={`${serviceDetails.accounts?.publicKeys[0]}`} disabled={true} />
              </div>
              <button disabled={!accountReady} onClick={async () => setAppResult(JSON.stringify(await doAction('1'), null, 2))} className="btn btn-primary btn-lg btn-block mb-3">GET ADDRESS</button>
            </div>
          </div>
          <hr/>

          <section>
            <div className="row d-flex justify-content-center">
              <div className="col-xl-8 col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">
                      Send form
                    </h4>
                    <div className="form-group">
                      <label>From</label>
                      <input disabled className="form-control" type="text" id="fromInput" value={`${serviceDetails.accounts?.addresses[0]}`}/>
                    </div>
                    <div className="form-group">
                      <label>To</label>
                      <input className="form-control" type="text" id="toInput" />
                    </div>
                    <div className="form-group">
                      <label>Amount</label>
                      <input className="form-control" type="text" id="amountInput" />
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <select className="browser-default custom-select" id="typeInput">
                        <option value="0x0">0x0</option>
                        <option value="0x2">0x2</option>
                      </select>
                    </div>
                    <div className="form-group" id="gasPriceDiv" style={{display: "block"}}>
                      <label>Gas Price</label>
                      <input className="form-control" type="text" id="gasInput" />
                    </div>
                    <div className="form-group" id="maxFeeDiv" style={{display: "none"}}>
                      <label>Max Fee</label>
                      <input className="form-control" type="text" id="maxFeeInput" />
                    </div>
                    <div className="form-group" id="maxPriorityDiv" style={{display: "none"}}>
                      <label>Max Priority Fee</label>
                      <input className="form-control" type="text" id="maxPriorityFeeInput" />
                    </div>
                    <div className="form-group">
                      <label>Data</label>
                      <input className="form-control" type="text" id="dataInput" />
                    </div>
                    <button disabled={!accountReady} className="btn btn-primary btn-lg btn-block mb-3" id="submitForm">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <hr/>

          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="form-group">
                <label>Actions</label><br/>
                {populateActions()}
              </div>
            </div>
          </div>
          <hr/>

          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
              { action && (
                <>
                {getActionComponents()}
                </>
              )}

              <button className="btn btn-primary btn-lg btn-block mb-3" onClick={async () => setAppResult(JSON.stringify(await doAction(action ?? ''), null, 2))}>INVOKE</button>

            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
              {appResult && (
              <>
                <label>Result:</label>
                <pre className="alert alert-secondary" style={{maxHeight: '50vh'}}>
                  {appResult}
                </pre>
              </>
              )}
            </div>
          </div>
          <hr/>
          </>
          ) : (
          <span> Waiting for initialization of app instance </span>
        )}
      </div>
    </div>
  );
}