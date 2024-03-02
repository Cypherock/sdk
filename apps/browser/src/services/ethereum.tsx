import { EvmApp } from "@cypherock/sdk-app-evm";
import { IWalletItem } from "@cypherock/sdk-app-manager";
import DeviceConnection from "@cypherock/sdk-hw-webusb";
import assert from "assert";
import { useEffect, useState } from "react";
import { populateWalletSelection } from "./wallet";
import { ethers } from 'ethers';
import { setEthersLib } from '@cypherock/sdk-app-evm';

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
  address: string | undefined;
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
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({name: undefined, chainId: undefined, address: undefined, wallet: undefined, accountNumber: undefined, accountType: undefined, derivationPath: undefined});
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
          return await instance?.getPublicKeys({chainId: 1, walletId: serviceDetails.wallet.id, derivationPaths: [{path}]});
  
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
    setServiceDetails({...serviceDetails, accountType: (typeof idx === 'number' && idx < networks.length ? accountTypes[idx] : undefined)})
  };

  const handleNumberSelection = (indexValue: string) => {
    const idx = Number(indexValue);
    const derivationPath = serviceDetails.accountType ? [...serviceDetails.accountType.derivationPath] : undefined;
    if (derivationPath && serviceDetails.accountType)
      derivationPath[serviceDetails.accountType.varIdx] += idx;
    setServiceDetails({...serviceDetails, accountNumber: (typeof idx === 'number' && idx >= 0 && idx < 0x80000000 ? idx : undefined), derivationPath})
  };

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
                <input disabled={serviceDetails.accountType === undefined} className="form-control" min={0} max={0x7fffffff} type="number" placeholder="0" onChange={(evt) => handleNumberSelection(evt.target.value)} />
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
                <input className="form-control" id="accountAddress" value={`${""}`} disabled={true} />
              </div>
              <div className="form-group">
                <label>Public key</label>
                <input className="form-control" id="publicKey" value={`${""}`} disabled={true} />
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
                      <input className="form-control" type="text" id="fromInput" />
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