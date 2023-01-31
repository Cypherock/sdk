import { compare } from 'compare-versions';

import { PacketVersion, PacketVersionMap } from './versions';

// Supported version from order older to newer
export const ALL_SUPPORTED_SDK_VERSIONS = ['2.5.0'];

export const LATEST_SUPPORTED_SDK_VERSION =
  ALL_SUPPORTED_SDK_VERSIONS[ALL_SUPPORTED_SDK_VERSIONS.length - 1];

export const OLDEST_SUPPORTED_SDK_VERSION = ALL_SUPPORTED_SDK_VERSIONS[0];

export const isSDKSupported = (version: string) => {
  const isSupported =
    ALL_SUPPORTED_SDK_VERSIONS.findIndex(ver => compare(ver, version, '=')) !==
    -1;

  const isNewer = compare(version, LATEST_SUPPORTED_SDK_VERSION, '>');

  return { isSupported, isNewer };
};

export const SDK_TO_PACKET_VERSION: Record<string, PacketVersion | undefined> =
  {
    '1.0.0': PacketVersionMap.v2,
    '2.0.0': PacketVersionMap.v3,
    '2.1.0': PacketVersionMap.v3,
    '2.2.0': PacketVersionMap.v3,
    '2.3.0': PacketVersionMap.v3,
    '2.4.0': PacketVersionMap.v3,
    '2.5.0': PacketVersionMap.v3
  };
