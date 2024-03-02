import Head from "next/head";
import { useState } from "react";
import DeviceConnection from "@cypherock/sdk-hw-webusb";
import { EthereumService, ManagerService } from "@/services";
import { Device, DeviceDetails, WalletItemParsed } from "../utils/types";
import { ManagerApp } from "@cypherock/sdk-app-manager";
import { uint8ArrayToHex } from "../../../../packages/util/dist";

export default function Home() {
  const [connection, setConnection] = useState<DeviceConnection | undefined>(undefined);
  const [deviceList, setDeviceList] = useState<Device[] | undefined>(undefined);
  const [deviceError, setDeviceError] = useState<string | undefined>(undefined);
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails | undefined>(undefined);
  const [service, setService] = useState<string | undefined>(undefined);
  const deviceAction = async () => {
    try {
      const conn = await DeviceConnection.create();
      setConnection(conn);
      setDeviceError(undefined);
      const app = await ManagerApp.create(conn);
      const isSupported = (await app.isSupported()) ?? false;
      const deviceInfo = await app.getDeviceInfo();
      const wallets = await app.getWallets();
  
      const walletList: WalletItemParsed[] | undefined = wallets?.walletList.map((x, y) => {
        return {...x, id: uint8ArrayToHex(x.id)}
      });
      const deviceInfoParsed = deviceInfo ? {
        ...deviceInfo,
        deviceSerial: uint8ArrayToHex(deviceInfo.deviceSerial),
      } : undefined;
  
      setDeviceDetails({ isSupported, wallets, deviceInfo, deviceInfoParsed, walletsParsed: {walletList: walletList ?? []}});
    } catch (error) {
      setDeviceError((error as any).message);
    }
  };

  const serviceComponentMap: Record<string, JSX.Element> = {
    "manager": <ManagerService devConnection={connection!} />,
    "evm": <EthereumService devConnection={connection!} wallets={deviceDetails?.wallets?.walletList!} />,
  };

  const prepareDeviceDetails = () => {
    return (
      <div className="card">
        <div className="card-body" style={{minHeight: '28vh'}}>
          <h4 className="card-title"> Device details </h4>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12">
              <label>Is supported:</label>
              <pre className={`alert alert-secondary ${deviceDetails?.isSupported ? "alert-success" : ""}`}>
                {JSON.stringify(deviceDetails?.isSupported, null, 2)}
              </pre>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
              <label>Wallets:</label>
              <pre className="alert alert-secondary" style={{maxHeight: '33vh'}}>
                {JSON.stringify(deviceDetails?.walletsParsed, null, 2)}
              </pre>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
              <label>Device Info:</label>
              <pre className={`alert alert-secondary ${deviceDetails?.deviceInfoParsed?.isAuthenticated ? "alert-success" : "alert-warning"}`} style={{maxHeight: '33vh'}}>
                {JSON.stringify(deviceDetails?.deviceInfoParsed, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const prepareService = () => {
    if (!service) return <></>;

    return serviceComponentMap[service];
  };

  const listDevices = async () => {
    try {
      const devices = (await navigator.usb.getDevices()).map((x, y) => { return {name: x.productName, company: x.manufacturerName, serial: x.serialNumber, pid: x.productId}; });
      setDeviceList(devices);
      setDeviceError(undefined);
    } catch (error) {
      setDeviceError((error as any).message);
    }
  }

  return (
    <>
      <Head>
        <title>Cypherock Test App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.14.1/css/mdb.min.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/index.css" type="text/css" />
      </Head>
      <main className="container-fluid">
        <header>
          <div id="logo-container">
            <h1 id="logo-text" className="text-center">
              Cypherock Test App
            </h1>

            <img id="mm-logo" src="/favicon.svg" height={349} />
          </div>
        </header>

        <section>
          {deviceError && (
            <div id="deviceWarning" className="row justify-content-center" hidden={false}>
              <div className="warning-message justify-content-center col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                <img src="warning.svg" alt="" className="warning-message-icon" />
                <div className="warning-message-text"> {deviceError} </div>
              </div>
            </div>
          )}

          <div className="row d-flex justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12">
              {prepareDeviceDetails()}
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">
                    Connect Device
                  </h4>

                  <button className="btn btn-primary btn-lg btn-block mb-3" onClick={listDevices}>
                  List Devices
                  </button>

                  <pre className="info-text alert alert-secondary">
                    List Devices result: &nbsp;

                    {JSON.stringify(deviceList, null, 2)}
                  </pre>
                  <hr/>

                  <button className="btn btn-primary btn-lg btn-block mb-3" onClick={deviceAction}>Connect</button>

                  <hr/>
                  <div className="form-group">
                    <label>Services</label>
                    <select disabled={connection === undefined} className="browser-default custom-select" onChange={(evt) => setService(evt.target.value)}>
                      <option value={""} key={""}>Select service</option>
                      <option value={"manager"} key={"manager"}>Device Manager</option>
                      <option value={"evm"} key={"evm"}>Ethereum</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12">
              {/* Give option of app services */}
              { connection && service && (
                prepareService()
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
