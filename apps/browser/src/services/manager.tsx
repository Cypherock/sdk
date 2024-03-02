import { DeviceDetails } from "@/utils/types";
import { ManagerApp } from "@cypherock/sdk-app-manager";
import DeviceConnection from "@cypherock/sdk-hw-webusb";
import assert from "assert";
import { unescape } from "lodash";
import { useEffect, useState } from "react";

export const ManagerService: React.FC<{ devConnection: DeviceConnection }> = ({ devConnection }) => {
  const [connection] = useState(devConnection);
  const [instance, setInstance] = useState<ManagerApp | undefined>(undefined);
  const [action, setAction] = useState<string | undefined>(undefined);
  const [appError, setAppError] = useState<string | undefined>(undefined);
  const [appResult, setAppResult] = useState<string | undefined>(undefined);

  const init = async (connection: DeviceConnection) => {
    const app = await ManagerApp.create(connection);
    setInstance(app);
  }

  const populateActions = () => {
    const actionList = Object.getOwnPropertyNames(ManagerApp.prototype);
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

  const doAction = async () => {
    try {
      setAppError(undefined);
      setAppResult(undefined);
      assert(instance, new Error("App instance not initialized"));

      switch (action) {
        case "1":
          return await instance?.getSDKVersion();
        case "2":
          return await instance?.isSupported();
        case "3":
          return await instance?.getDeviceInfo();
        case "4":
          return await instance?.getWallets();
        case "5":
          return await instance?.authDevice();
        case "7":
          const res = (unescape(await instance?.getLogs())).split(/\n|\r/g);
          console.log({res});
          return res;
        case "12":
          return await instance?.abort();
        case "6":
          return await instance?.authCard();
        case "8":
          return await instance?.trainJoystick();
        case "9":
          // return await instance?.updateFirmware({});
          return undefined;
        case "10":
          return await instance?.trainCard({ onWallets: async (wallets) => { console.log({wallets}); return true } });
  
        default:
          return <span>Invalid action or not implemented</span>;
      }
    } catch (error) {
      setAppError((error as any).message);
    }
  };

  useEffect(() => {
    init(connection);
  }, []);

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
        <h4 className="card-title"> Device manager </h4>
        {instance ? (
          <>
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group">
                  <label>Actions</label><br/>
                  {populateActions()}
                  <hr/>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                { action && (
                  <>
                  {getActionComponents()}
                  </>
                )}

                <button className="btn btn-primary btn-lg btn-block mb-3" onClick={async () => setAppResult(JSON.stringify(await doAction(), null, 2))}>INVOKE</button>

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