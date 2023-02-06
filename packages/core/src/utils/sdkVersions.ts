import { compare, compareVersions } from 'compare-versions';

import { PacketVersion, PacketVersionMap } from './versions';

// from is inclusive and to is exclusive
const supportedVersionRange = { from: '2.5.0', to: '2.6.0' };

export const isSDKSupported = (version: string) => {
  const isNewer = compare(version, supportedVersionRange.to, '>=');
  const isOlder = compare(version, supportedVersionRange.from, '<');

  const isSupported = !isNewer && !isOlder;

  return { isSupported, isNewer };
};

// We need to maintain older sdk versions so that we can update them
// from is inclusive and to is exclusive
const SdkToPacketVersionMap: Array<{
  from: string;
  to?: string;
  packetVersion: PacketVersion;
}> = [
  { from: '1.0.0', to: '2.0.0', packetVersion: PacketVersionMap.v2 },
  { from: '2.0.0', to: '3.0.0', packetVersion: PacketVersionMap.v3 }
];

export const getPacketVersionFromSDK = (
  sdkVersion: string
): PacketVersion | undefined => {
  for (const elem of SdkToPacketVersionMap) {
    let enabled = compareVersions(elem.from, sdkVersion) < 1;
    if (elem.to) enabled = enabled && compareVersions(elem.to, sdkVersion) > 0;
    if (enabled) return elem.packetVersion;
  }

  return undefined;
};
