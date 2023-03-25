import { formatHex, assert, isHex } from '@cypherock/sdk-utils';
import { compareVersions, validate } from 'compare-versions';

import { PacketVersion, PacketVersionMap } from './packetVersions';

// We need to maintain older sdk versions so that we can update them
// from is inclusive and to is exclusive
const SdkToPacketVersionMap: {
  from: string;
  to?: string;
  packetVersion: PacketVersion;
}[] = [
  { from: '0.0.1', to: '1.0.0', packetVersion: PacketVersionMap.v1 },
  { from: '1.0.0', to: '2.0.0', packetVersion: PacketVersionMap.v2 },
  { from: '2.0.0', to: '3.0.0', packetVersion: PacketVersionMap.v3 },
  { from: '3.0.0', to: '4.0.0', packetVersion: PacketVersionMap.v3 },
];

export const getPacketVersionFromSDK = (
  sdkVersion: string,
): PacketVersion | undefined => {
  assert(sdkVersion, 'Invalid sdkVersion');
  assert(validate(sdkVersion), 'Invalid sdkVersion');

  for (const elem of SdkToPacketVersionMap) {
    let enabled = compareVersions(elem.from, sdkVersion) < 1;
    if (elem.to) enabled = enabled && compareVersions(elem.to, sdkVersion) > 0;
    if (enabled) return elem.packetVersion;
  }

  return undefined;
};

export const formatSDKVersion = (version: string) => {
  assert(version, 'Invalid version');

  assert(isHex(version), 'Invalid hex in version');
  assert(version.length >= 12, 'SDK version should be atleast 6 bytes.');

  const hexVersion = formatHex(version);

  const major = parseInt(hexVersion.slice(0, 4), 16);
  const minor = parseInt(hexVersion.slice(4, 8), 16);
  const patch = parseInt(hexVersion.slice(8, 12), 16);

  return `${major}.${minor}.${patch}`;
};
