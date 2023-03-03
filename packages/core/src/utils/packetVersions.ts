export type PacketVersion = 'v1' | 'v2' | 'v3';

export const PacketVersionMap = {
  v1: 'v1' as PacketVersion,
  v2: 'v2' as PacketVersion,
  v3: 'v3' as PacketVersion,
};

// Order is from older to newer
export const PacketVersionList: PacketVersion[] = [
  PacketVersionMap.v1,
  PacketVersionMap.v2,
  PacketVersionMap.v3,
];
