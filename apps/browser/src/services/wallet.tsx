import { IWalletItem } from "@cypherock/sdk-app-manager";

export function populateWalletSelection(walletList: IWalletItem[], callback: (value: string) => void) {
  if (!walletList) return <></>;
  return (
    <select className="browser-default custom-select" id="typeInput" onChange={(evt) => callback(evt.target.value)}>
      <option value="">Select wallet</option>
      {
        walletList.map( (x,y) => {
          return <option value={y} key={y}>{x.name}</option>;
        })
      }
    </select>);
}