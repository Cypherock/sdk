import { PacketVersionMap } from '../../../utils';

export const createAckPacketTestCases = {
  validV1: [
    {
      params: {
        commandType: 5,
        packetNumber: '1',
      },
      result: 'aa050a0001000000000000b861',
    },
    {
      params: {
        commandType: 16,
        packetNumber: '2',
      },
      result: 'aa100a000200000000000060e3',
    },
    {
      params: {
        commandType: 102,
        packetNumber: '78',
      },
      result: 'aa660a004e000000000000ef64',
    },
  ],
  validV2: [
    {
      params: {
        commandType: 10,
        packetNumber: '1',
      },
      result: '5a5a0000000a0a0001000000000000b861',
    },
    {
      params: {
        commandType: 16,
        packetNumber: '2',
      },
      result: '5a5a000000100a000200000000000060e3',
    },
    {
      params: {
        commandType: 102,
        packetNumber: '78',
      },
      result: '5a5a000000660a004e000000000000ef64',
    },
  ],
  invalid: [
    {
      commandType: null,
      packetNumber: '1',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      packetNumber: null,
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      packetNumber: '1',
      version: null,
    },
    {
      commandType: undefined,
      packetNumber: '1',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      packetNumber: undefined,
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      packetNumber: '1',
      version: undefined,
    },
    {
      commandType: -10,
      packetNumber: '1',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      packetNumber: 's',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      packetNumber: '81726312',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 9999999,
      packetNumber: '2',
      version: PacketVersionMap.v1,
    },
    {
      commandType: -12,
      packetNumber: '2',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 12,
      packetNumber: '2',
      version: PacketVersionMap.v3,
    },
  ],
};

export const xmodemEncodeTestCases = {
  validV1: [
    {
      params: {
        commandType: 6,
        data: 'd22af07f965ab9f4d37fcb59708d74ebbfac8f4303a46397f0b62a70cae5e87660f25f0b59b84551d1f4965f14e97b1dc3520e',
      },
      packets: [
        new Uint8Array([
          170, 6, 38, 0, 1, 0, 2, 210, 42, 240, 127, 150, 90, 185, 244, 211,
          127, 203, 89, 112, 141, 116, 235, 191, 172, 143, 67, 3, 164, 99, 151,
          240, 182, 42, 112, 202, 229, 232, 118, 162, 248,
        ]),
        new Uint8Array([
          170, 6, 25, 0, 2, 0, 2, 96, 242, 95, 11, 89, 184, 69, 81, 209, 244,
          150, 95, 20, 233, 123, 29, 195, 82, 14, 11, 134,
        ]),
      ],
    },
    {
      params: {
        commandType: 10,
        data: '28936489172381',
      },
      packets: [
        new Uint8Array([
          170, 10, 13, 0, 1, 0, 1, 40, 147, 100, 137, 23, 35, 129, 127, 243,
        ]),
      ],
    },
    {
      params: {
        commandType: 152,
        data: '03a4d50d19735dad5a043a714825a412be1a3e341834af713f42fa142b538dc9874b39a323d1ae22c9421f6ed77708f04577cb7ad3b3ccf53f1def2ab922111076e27e569c5e8a186da29f57c7c974c99cdf8da3a26769e440ca361199628edbc45d9500e8b6e695dc3006121266eb07d1c2f471909b5cde67aa8c4416489988ac83bb256e9a6b3446f9efff2e197aad0c9955288e36728fcee48598686044681f310f33e08cbc67cbf583245fbcc0caeff214909e5fabc6a0e09911d12cd37dd88bbce50ccbb936c7c8ed8bda3f477c82e3f239f8fb8a328a50154edfea26a9b5c5fd606c5bfc60257c4b4e564545ebd8455c1ce2f49a83eeb41accb579838c4b6101a9de8df49bfd8ca0db737a44657a147df341feb8e230c170261f8ca967fb235bf38e65b8820ee81d98063a3729f1773e504ea3d5499e93f9ba8c5101d139057ab70f47c24c2bea761fc0cccb996dc5a10f6d6c557b8239f171d819dfbc8f697d7467db',
      },
      packets: [
        new Uint8Array([
          170, 152, 38, 0, 1, 0, 12, 3, 164, 213, 13, 25, 115, 93, 173, 90, 4,
          58, 113, 72, 37, 164, 18, 190, 26, 62, 52, 24, 52, 175, 113, 63, 66,
          250, 20, 43, 83, 141, 201, 160, 151,
        ]),
        new Uint8Array([
          170, 152, 39, 0, 2, 0, 12, 135, 75, 57, 163, 51, 35, 209, 174, 34,
          201, 66, 31, 110, 215, 119, 8, 240, 69, 119, 203, 122, 211, 179, 204,
          245, 63, 29, 239, 42, 185, 34, 17, 16, 126, 208,
        ]),
        new Uint8Array([
          170, 152, 39, 0, 3, 0, 12, 118, 226, 126, 86, 156, 94, 138, 24, 109,
          162, 159, 87, 199, 201, 116, 201, 156, 223, 141, 163, 51, 162, 103,
          105, 228, 64, 202, 54, 17, 153, 98, 142, 219, 8, 117,
        ]),
        new Uint8Array([
          170, 152, 39, 0, 4, 0, 12, 196, 93, 149, 0, 232, 182, 230, 149, 220,
          48, 6, 18, 18, 102, 235, 7, 209, 194, 244, 113, 144, 155, 92, 222,
          103, 163, 58, 140, 68, 22, 72, 153, 136, 191, 34,
        ]),
        new Uint8Array([
          170, 152, 38, 0, 5, 0, 12, 172, 131, 187, 37, 110, 154, 107, 52, 70,
          249, 239, 255, 46, 25, 122, 173, 12, 153, 85, 40, 142, 54, 114, 143,
          206, 228, 133, 152, 104, 96, 68, 104, 246, 33,
        ]),
        new Uint8Array([
          170, 152, 38, 0, 6, 0, 12, 31, 49, 15, 51, 224, 140, 188, 103, 203,
          245, 131, 36, 95, 188, 192, 202, 239, 242, 20, 144, 158, 95, 171, 198,
          160, 224, 153, 17, 209, 44, 211, 125, 84, 241,
        ]),
        new Uint8Array([
          170, 152, 38, 0, 7, 0, 12, 216, 139, 188, 229, 12, 203, 185, 54, 199,
          200, 237, 139, 218, 63, 71, 124, 130, 227, 242, 57, 248, 251, 138, 50,
          138, 80, 21, 78, 223, 234, 38, 169, 205, 208,
        ]),
        new Uint8Array([
          170, 152, 38, 0, 8, 0, 12, 181, 197, 253, 96, 108, 91, 252, 96, 37,
          124, 75, 78, 86, 69, 69, 235, 216, 69, 92, 28, 226, 244, 154, 131,
          238, 180, 26, 204, 181, 121, 131, 140, 152, 85,
        ]),
        new Uint8Array([
          170, 152, 38, 0, 9, 0, 12, 75, 97, 1, 169, 222, 141, 244, 155, 253,
          140, 160, 219, 115, 122, 68, 101, 122, 20, 125, 243, 65, 254, 184,
          226, 48, 193, 112, 38, 31, 140, 169, 103, 35, 182,
        ]),
        new Uint8Array([
          170, 152, 39, 0, 10, 0, 12, 251, 35, 91, 243, 142, 101, 184, 130, 14,
          232, 29, 152, 6, 58, 55, 41, 241, 119, 62, 80, 78, 163, 51, 213, 73,
          158, 147, 249, 186, 140, 81, 1, 209, 76, 247,
        ]),
        new Uint8Array([
          170, 152, 38, 0, 11, 0, 12, 57, 5, 122, 183, 15, 71, 194, 76, 43, 234,
          118, 31, 192, 204, 203, 153, 109, 197, 161, 15, 109, 108, 85, 123,
          130, 57, 241, 113, 216, 25, 223, 188, 116, 194,
        ]),
        new Uint8Array([
          170, 152, 12, 0, 12, 0, 12, 143, 105, 125, 116, 103, 219, 208, 104,
        ]),
      ],
    },
  ],
  validV2: [
    {
      params: {
        commandType: 6,
        data: 'd22af07f965ab9f4d37fcb59708d74ebbfac8f4303a46397f0b62a70cae5e87660f25f0b59b84551d1f4965f14e97b1dc3520e',
      },
      packets: [
        new Uint8Array([
          90, 90, 0, 0, 0, 6, 39, 0, 1, 0, 2, 210, 42, 240, 127, 150, 163, 58,
          185, 244, 211, 127, 203, 89, 112, 141, 116, 235, 191, 172, 143, 67, 3,
          164, 99, 151, 240, 182, 42, 112, 202, 229, 232, 118, 162, 248,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 6, 25, 0, 2, 0, 2, 96, 242, 95, 11, 89, 184, 69, 81,
          209, 244, 150, 95, 20, 233, 123, 29, 195, 82, 14, 11, 134,
        ]),
      ],
    },
    {
      params: {
        commandType: 10,
        data: '28936489172381',
      },
      packets: [
        new Uint8Array([
          90, 90, 0, 0, 0, 10, 13, 0, 1, 0, 1, 40, 147, 100, 137, 23, 35, 129,
          127, 243,
        ]),
      ],
    },
    {
      params: {
        commandType: 152,
        data: '03a4d50d19735dad5a043a714825a412be1a3e341834af713f42fa142b538dc9874b39a323d1ae22c9421f6ed77708f04577cb7ad3b3ccf53f1def2ab922111076e27e569c5e8a186da29f57c7c974c99cdf8da3a26769e440ca361199628edbc45d9500e8b6e695dc3006121266eb07d1c2f471909b5cde67aa8c4416489988ac83bb256e9a6b3446f9efff2e197aad0c9955288e36728fcee48598686044681f310f33e08cbc67cbf583245fbcc0caeff214909e5fabc6a0e09911d12cd37dd88bbce50ccbb936c7c8ed8bda3f477c82e3f239f8fb8a328a50154edfea26a9b5c5fd606c5bfc60257c4b4e564545ebd8455c1ce2f49a83eeb41accb579838c4b6101a9de8df49bfd8ca0db737a44657a147df341feb8e230c170261f8ca967fb235bf38e65b8820ee81d98063a3729f1773e504ea3d5499e93f9ba8c5101d139057ab70f47c24c2bea761fc0cccb996dc5a10f6d6c557b8239f171d819dfbc8f697d7467db',
      },
      packets: [
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 39, 0, 1, 0, 12, 3, 164, 213, 13, 25, 115, 93,
          173, 163, 58, 4, 58, 113, 72, 37, 164, 18, 190, 26, 62, 52, 24, 52,
          175, 113, 63, 66, 250, 20, 43, 83, 141, 201, 160, 151,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 39, 0, 2, 0, 12, 135, 75, 57, 163, 51, 35, 209,
          174, 34, 201, 66, 31, 110, 215, 119, 8, 240, 69, 119, 203, 122, 211,
          179, 204, 245, 63, 29, 239, 42, 185, 34, 17, 16, 126, 208,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 39, 0, 3, 0, 12, 118, 226, 126, 86, 156, 94,
          138, 24, 109, 162, 159, 87, 199, 201, 116, 201, 156, 223, 141, 163,
          51, 162, 103, 105, 228, 64, 202, 54, 17, 153, 98, 142, 219, 8, 117,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 38, 0, 4, 0, 12, 196, 93, 149, 0, 232, 182, 230,
          149, 220, 48, 6, 18, 18, 102, 235, 7, 209, 194, 244, 113, 144, 155,
          92, 222, 103, 170, 140, 68, 22, 72, 153, 136, 191, 34,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 38, 0, 5, 0, 12, 172, 131, 187, 37, 110, 154,
          107, 52, 70, 249, 239, 255, 46, 25, 122, 173, 12, 153, 85, 40, 142,
          54, 114, 143, 206, 228, 133, 152, 104, 96, 68, 104, 246, 33,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 38, 0, 6, 0, 12, 31, 49, 15, 51, 224, 140, 188,
          103, 203, 245, 131, 36, 95, 188, 192, 202, 239, 242, 20, 144, 158, 95,
          171, 198, 160, 224, 153, 17, 209, 44, 211, 125, 84, 241,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 38, 0, 7, 0, 12, 216, 139, 188, 229, 12, 203,
          185, 54, 199, 200, 237, 139, 218, 63, 71, 124, 130, 227, 242, 57, 248,
          251, 138, 50, 138, 80, 21, 78, 223, 234, 38, 169, 205, 208,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 38, 0, 8, 0, 12, 181, 197, 253, 96, 108, 91,
          252, 96, 37, 124, 75, 78, 86, 69, 69, 235, 216, 69, 92, 28, 226, 244,
          154, 131, 238, 180, 26, 204, 181, 121, 131, 140, 152, 85,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 38, 0, 9, 0, 12, 75, 97, 1, 169, 222, 141, 244,
          155, 253, 140, 160, 219, 115, 122, 68, 101, 122, 20, 125, 243, 65,
          254, 184, 226, 48, 193, 112, 38, 31, 140, 169, 103, 35, 182,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 39, 0, 10, 0, 12, 251, 35, 91, 243, 142, 101,
          184, 130, 14, 232, 29, 152, 6, 58, 55, 41, 241, 119, 62, 80, 78, 163,
          51, 213, 73, 158, 147, 249, 186, 140, 81, 1, 209, 76, 247,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 38, 0, 11, 0, 12, 57, 5, 122, 183, 15, 71, 194,
          76, 43, 234, 118, 31, 192, 204, 203, 153, 109, 197, 161, 15, 109, 108,
          85, 123, 130, 57, 241, 113, 216, 25, 223, 188, 116, 194,
        ]),
        new Uint8Array([
          90, 90, 0, 0, 0, 152, 12, 0, 12, 0, 12, 143, 105, 125, 116, 103, 219,
          208, 104,
        ]),
      ],
    },
  ],
  invalid: [
    {
      commandType: 20,
      data: '',
      version: PacketVersionMap.v1,
    },
    {
      commandType: null,
      data: '01',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      data: null,
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      data: '01',
      version: null,
    },
    {
      commandType: undefined,
      data: '01',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      data: undefined,
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      data: '01',
      version: undefined,
    },
    {
      commandType: -10,
      data: '01',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      data: 's',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      data: '0x1233',
      version: PacketVersionMap.v1,
    },
    {
      commandType: 10,
      data: '01',
      version: PacketVersionMap.v3,
    },
  ],
};

export const xmodemDecodeTestCases = {
  validV1: [
    {
      data: '28936489172381',
      rawPackets: new Uint8Array([
        170, 10, 13, 0, 1, 0, 1, 40, 147, 100, 137, 23, 35, 129, 127, 243,
      ]),
      packetList: [
        {
          startOfFrame: 'AA',
          commandType: 10,
          currentPacketNumber: 1,
          totalPacket: 1,
          dataSize: 13,
          dataChunk: '28936489172381',
          crc: '7ff3',
          errorList: [],
        },
      ],
    },
    {
      data: 'd22af07f965ab9f4d37fcb59708d74ebbfac8f4303a46397f0b62a70cae5e87660f25f0b59b84551d1f4965f14e97b1dc3520e',
      rawPackets: new Uint8Array([
        170, 6, 38, 0, 1, 0, 2, 210, 42, 240, 127, 150, 90, 185, 244, 211, 127,
        203, 89, 112, 141, 116, 235, 191, 172, 143, 67, 3, 164, 99, 151, 240,
        182, 42, 112, 202, 229, 232, 118, 162, 248, 170, 6, 25, 0, 2, 0, 2, 96,
        242, 95, 11, 89, 184, 69, 81, 209, 244, 150, 95, 20, 233, 123, 29, 195,
        82, 14, 11, 134,
      ]),
      packetList: [
        {
          startOfFrame: 'AA',
          commandType: 6,
          currentPacketNumber: 1,
          totalPacket: 2,
          dataSize: 38,
          dataChunk:
            'd22af07f965ab9f4d37fcb59708d74ebbfac8f4303a46397f0b62a70cae5e876',
          crc: 'a2f8',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 6,
          currentPacketNumber: 2,
          totalPacket: 2,
          dataSize: 25,
          dataChunk: '60f25f0b59b84551d1f4965f14e97b1dc3520e',
          crc: '0b86',
          errorList: [],
        },
      ],
    },
    {
      data: '03a4d50d19735dad5a043a714825a412be1a3e341834af713f42fa142b538dc9874b39a323d1ae22c9421f6ed77708f04577cb7ad3b3ccf53f1def2ab922111076e27e569c5e8a186da29f57c7c974c99cdf8da3a26769e440ca361199628edbc45d9500e8b6e695dc3006121266eb07d1c2f471909b5cde67aa8c4416489988ac83bb256e9a6b3446f9efff2e197aad0c9955288e36728fcee48598686044681f310f33e08cbc67cbf583245fbcc0caeff214909e5fabc6a0e09911d12cd37dd88bbce50ccbb936c7c8ed8bda3f477c82e3f239f8fb8a328a50154edfea26a9b5c5fd606c5bfc60257c4b4e564545ebd8455c1ce2f49a83eeb41accb579838c4b6101a9de8df49bfd8ca0db737a44657a147df341feb8e230c170261f8ca967fb235bf38e65b8820ee81d98063a3729f1773e504ea3d5499e93f9ba8c5101d139057ab70f47c24c2bea761fc0cccb996dc5a10f6d6c557b8239f171d819dfbc8f697d7467db',
      rawPackets: new Uint8Array([
        170, 152, 38, 0, 1, 0, 12, 3, 164, 213, 13, 25, 115, 93, 173, 90, 4, 58,
        113, 72, 37, 164, 18, 190, 26, 62, 52, 24, 52, 175, 113, 63, 66, 250,
        20, 43, 83, 141, 201, 160, 151, 170, 152, 39, 0, 2, 0, 12, 135, 75, 57,
        163, 51, 35, 209, 174, 34, 201, 66, 31, 110, 215, 119, 8, 240, 69, 119,
        203, 122, 211, 179, 204, 245, 63, 29, 239, 42, 185, 34, 17, 16, 126,
        208, 170, 152, 39, 0, 3, 0, 12, 118, 226, 126, 86, 156, 94, 138, 24,
        109, 162, 159, 87, 199, 201, 116, 201, 156, 223, 141, 163, 51, 162, 103,
        105, 228, 64, 202, 54, 17, 153, 98, 142, 219, 8, 117, 170, 152, 39, 0,
        4, 0, 12, 196, 93, 149, 0, 232, 182, 230, 149, 220, 48, 6, 18, 18, 102,
        235, 7, 209, 194, 244, 113, 144, 155, 92, 222, 103, 163, 58, 140, 68,
        22, 72, 153, 136, 191, 34, 170, 152, 38, 0, 5, 0, 12, 172, 131, 187, 37,
        110, 154, 107, 52, 70, 249, 239, 255, 46, 25, 122, 173, 12, 153, 85, 40,
        142, 54, 114, 143, 206, 228, 133, 152, 104, 96, 68, 104, 246, 33, 170,
        152, 38, 0, 6, 0, 12, 31, 49, 15, 51, 224, 140, 188, 103, 203, 245, 131,
        36, 95, 188, 192, 202, 239, 242, 20, 144, 158, 95, 171, 198, 160, 224,
        153, 17, 209, 44, 211, 125, 84, 241, 170, 152, 38, 0, 7, 0, 12, 216,
        139, 188, 229, 12, 203, 185, 54, 199, 200, 237, 139, 218, 63, 71, 124,
        130, 227, 242, 57, 248, 251, 138, 50, 138, 80, 21, 78, 223, 234, 38,
        169, 205, 208, 170, 152, 38, 0, 8, 0, 12, 181, 197, 253, 96, 108, 91,
        252, 96, 37, 124, 75, 78, 86, 69, 69, 235, 216, 69, 92, 28, 226, 244,
        154, 131, 238, 180, 26, 204, 181, 121, 131, 140, 152, 85, 170, 152, 38,
        0, 9, 0, 12, 75, 97, 1, 169, 222, 141, 244, 155, 253, 140, 160, 219,
        115, 122, 68, 101, 122, 20, 125, 243, 65, 254, 184, 226, 48, 193, 112,
        38, 31, 140, 169, 103, 35, 182, 170, 152, 39, 0, 10, 0, 12, 251, 35, 91,
        243, 142, 101, 184, 130, 14, 232, 29, 152, 6, 58, 55, 41, 241, 119, 62,
        80, 78, 163, 51, 213, 73, 158, 147, 249, 186, 140, 81, 1, 209, 76, 247,
        170, 152, 38, 0, 11, 0, 12, 57, 5, 122, 183, 15, 71, 194, 76, 43, 234,
        118, 31, 192, 204, 203, 153, 109, 197, 161, 15, 109, 108, 85, 123, 130,
        57, 241, 113, 216, 25, 223, 188, 116, 194, 170, 152, 12, 0, 12, 0, 12,
        143, 105, 125, 116, 103, 219, 208, 104,
      ]),
      packetList: [
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 1,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            '03a4d50d19735dad5a043a714825a412be1a3e341834af713f42fa142b538dc9',
          crc: 'a097',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 2,
          totalPacket: 12,
          dataSize: 39,
          dataChunk:
            '874b39a323d1ae22c9421f6ed77708f04577cb7ad3b3ccf53f1def2ab9221110',
          crc: '7ed0',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 3,
          totalPacket: 12,
          dataSize: 39,
          dataChunk:
            '76e27e569c5e8a186da29f57c7c974c99cdf8da3a26769e440ca361199628edb',
          crc: '0875',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 4,
          totalPacket: 12,
          dataSize: 39,
          dataChunk:
            'c45d9500e8b6e695dc3006121266eb07d1c2f471909b5cde67aa8c4416489988',
          crc: 'bf22',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 5,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            'ac83bb256e9a6b3446f9efff2e197aad0c9955288e36728fcee4859868604468',
          crc: 'f621',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 6,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            '1f310f33e08cbc67cbf583245fbcc0caeff214909e5fabc6a0e09911d12cd37d',
          crc: '54f1',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 7,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            'd88bbce50ccbb936c7c8ed8bda3f477c82e3f239f8fb8a328a50154edfea26a9',
          crc: 'cdd0',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 8,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            'b5c5fd606c5bfc60257c4b4e564545ebd8455c1ce2f49a83eeb41accb579838c',
          crc: '9855',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 9,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            '4b6101a9de8df49bfd8ca0db737a44657a147df341feb8e230c170261f8ca967',
          crc: '23b6',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 10,
          totalPacket: 12,
          dataSize: 39,
          dataChunk:
            'fb235bf38e65b8820ee81d98063a3729f1773e504ea3d5499e93f9ba8c5101d1',
          crc: '4cf7',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 11,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            '39057ab70f47c24c2bea761fc0cccb996dc5a10f6d6c557b8239f171d819dfbc',
          crc: '74c2',
          errorList: [],
        },
        {
          startOfFrame: 'AA',
          commandType: 152,
          currentPacketNumber: 12,
          totalPacket: 12,
          dataSize: 12,
          dataChunk: '8f697d7467db',
          crc: 'd068',
          errorList: [],
        },
      ],
    },
  ],
  validV2: [
    {
      data: 'd22af07f965ab9f4d37fcb59708d74ebbfac8f4303a46397f0b62a70cae5e87660f25f0b59b84551d1f4965f14e97b1dc3520e',
      rawPackets: new Uint8Array([
        90, 90, 0, 0, 0, 6, 39, 0, 1, 0, 2, 210, 42, 240, 127, 150, 163, 58,
        185, 244, 211, 127, 203, 89, 112, 141, 116, 235, 191, 172, 143, 67, 3,
        164, 99, 151, 240, 182, 42, 112, 202, 229, 232, 118, 162, 248, 90, 90,
        0, 0, 0, 6, 25, 0, 2, 0, 2, 96, 242, 95, 11, 89, 184, 69, 81, 209, 244,
        150, 95, 20, 233, 123, 29, 195, 82, 14, 11, 134,
      ]),
      packetList: [
        {
          startOfFrame: '5A5A',
          commandType: 6,
          currentPacketNumber: 1,
          totalPacket: 2,
          dataSize: 39,
          dataChunk:
            'd22af07f965ab9f4d37fcb59708d74ebbfac8f4303a46397f0b62a70cae5e876',
          crc: 'a2f8',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 6,
          currentPacketNumber: 2,
          totalPacket: 2,
          dataSize: 25,
          dataChunk: '60f25f0b59b84551d1f4965f14e97b1dc3520e',
          crc: '0b86',
          errorList: [],
        },
      ],
    },
    {
      data: '28936489172381',
      rawPackets: new Uint8Array([
        90, 90, 0, 0, 0, 10, 13, 0, 1, 0, 1, 40, 147, 100, 137, 23, 35, 129,
        127, 243,
      ]),
      packetList: [
        {
          startOfFrame: '5A5A',
          commandType: 10,
          currentPacketNumber: 1,
          totalPacket: 1,
          dataSize: 13,
          dataChunk: '28936489172381',
          crc: '7ff3',
          errorList: [],
        },
      ],
    },
    {
      data: '03a4d50d19735dad5a043a714825a412be1a3e341834af713f42fa142b538dc9874b39a323d1ae22c9421f6ed77708f04577cb7ad3b3ccf53f1def2ab922111076e27e569c5e8a186da29f57c7c974c99cdf8da3a26769e440ca361199628edbc45d9500e8b6e695dc3006121266eb07d1c2f471909b5cde67aa8c4416489988ac83bb256e9a6b3446f9efff2e197aad0c9955288e36728fcee48598686044681f310f33e08cbc67cbf583245fbcc0caeff214909e5fabc6a0e09911d12cd37dd88bbce50ccbb936c7c8ed8bda3f477c82e3f239f8fb8a328a50154edfea26a9b5c5fd606c5bfc60257c4b4e564545ebd8455c1ce2f49a83eeb41accb579838c4b6101a9de8df49bfd8ca0db737a44657a147df341feb8e230c170261f8ca967fb235bf38e65b8820ee81d98063a3729f1773e504ea3d5499e93f9ba8c5101d139057ab70f47c24c2bea761fc0cccb996dc5a10f6d6c557b8239f171d819dfbc8f697d7467db',
      rawPackets: new Uint8Array([
        90, 90, 0, 0, 0, 152, 39, 0, 1, 0, 12, 3, 164, 213, 13, 25, 115, 93,
        173, 163, 58, 4, 58, 113, 72, 37, 164, 18, 190, 26, 62, 52, 24, 52, 175,
        113, 63, 66, 250, 20, 43, 83, 141, 201, 160, 151, 90, 90, 0, 0, 0, 152,
        39, 0, 2, 0, 12, 135, 75, 57, 163, 51, 35, 209, 174, 34, 201, 66, 31,
        110, 215, 119, 8, 240, 69, 119, 203, 122, 211, 179, 204, 245, 63, 29,
        239, 42, 185, 34, 17, 16, 126, 208, 90, 90, 0, 0, 0, 152, 39, 0, 3, 0,
        12, 118, 226, 126, 86, 156, 94, 138, 24, 109, 162, 159, 87, 199, 201,
        116, 201, 156, 223, 141, 163, 51, 162, 103, 105, 228, 64, 202, 54, 17,
        153, 98, 142, 219, 8, 117, 90, 90, 0, 0, 0, 152, 38, 0, 4, 0, 12, 196,
        93, 149, 0, 232, 182, 230, 149, 220, 48, 6, 18, 18, 102, 235, 7, 209,
        194, 244, 113, 144, 155, 92, 222, 103, 170, 140, 68, 22, 72, 153, 136,
        191, 34, 90, 90, 0, 0, 0, 152, 38, 0, 5, 0, 12, 172, 131, 187, 37, 110,
        154, 107, 52, 70, 249, 239, 255, 46, 25, 122, 173, 12, 153, 85, 40, 142,
        54, 114, 143, 206, 228, 133, 152, 104, 96, 68, 104, 246, 33, 90, 90, 0,
        0, 0, 152, 38, 0, 6, 0, 12, 31, 49, 15, 51, 224, 140, 188, 103, 203,
        245, 131, 36, 95, 188, 192, 202, 239, 242, 20, 144, 158, 95, 171, 198,
        160, 224, 153, 17, 209, 44, 211, 125, 84, 241, 90, 90, 0, 0, 0, 152, 38,
        0, 7, 0, 12, 216, 139, 188, 229, 12, 203, 185, 54, 199, 200, 237, 139,
        218, 63, 71, 124, 130, 227, 242, 57, 248, 251, 138, 50, 138, 80, 21, 78,
        223, 234, 38, 169, 205, 208, 90, 90, 0, 0, 0, 152, 38, 0, 8, 0, 12, 181,
        197, 253, 96, 108, 91, 252, 96, 37, 124, 75, 78, 86, 69, 69, 235, 216,
        69, 92, 28, 226, 244, 154, 131, 238, 180, 26, 204, 181, 121, 131, 140,
        152, 85, 90, 90, 0, 0, 0, 152, 38, 0, 9, 0, 12, 75, 97, 1, 169, 222,
        141, 244, 155, 253, 140, 160, 219, 115, 122, 68, 101, 122, 20, 125, 243,
        65, 254, 184, 226, 48, 193, 112, 38, 31, 140, 169, 103, 35, 182, 90, 90,
        0, 0, 0, 152, 39, 0, 10, 0, 12, 251, 35, 91, 243, 142, 101, 184, 130,
        14, 232, 29, 152, 6, 58, 55, 41, 241, 119, 62, 80, 78, 163, 51, 213, 73,
        158, 147, 249, 186, 140, 81, 1, 209, 76, 247, 90, 90, 0, 0, 0, 152, 38,
        0, 11, 0, 12, 57, 5, 122, 183, 15, 71, 194, 76, 43, 234, 118, 31, 192,
        204, 203, 153, 109, 197, 161, 15, 109, 108, 85, 123, 130, 57, 241, 113,
        216, 25, 223, 188, 116, 194, 90, 90, 0, 0, 0, 152, 12, 0, 12, 0, 12,
        143, 105, 125, 116, 103, 219, 208, 104,
      ]),
      packetList: [
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 1,
          totalPacket: 12,
          dataSize: 39,
          dataChunk:
            '03a4d50d19735dad5a043a714825a412be1a3e341834af713f42fa142b538dc9',
          crc: 'a097',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 2,
          totalPacket: 12,
          dataSize: 39,
          dataChunk:
            '874b39a323d1ae22c9421f6ed77708f04577cb7ad3b3ccf53f1def2ab9221110',
          crc: '7ed0',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 3,
          totalPacket: 12,
          dataSize: 39,
          dataChunk:
            '76e27e569c5e8a186da29f57c7c974c99cdf8da3a26769e440ca361199628edb',
          crc: '0875',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 4,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            'c45d9500e8b6e695dc3006121266eb07d1c2f471909b5cde67aa8c4416489988',
          crc: 'bf22',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 5,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            'ac83bb256e9a6b3446f9efff2e197aad0c9955288e36728fcee4859868604468',
          crc: 'f621',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 6,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            '1f310f33e08cbc67cbf583245fbcc0caeff214909e5fabc6a0e09911d12cd37d',
          crc: '54f1',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 7,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            'd88bbce50ccbb936c7c8ed8bda3f477c82e3f239f8fb8a328a50154edfea26a9',
          crc: 'cdd0',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 8,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            'b5c5fd606c5bfc60257c4b4e564545ebd8455c1ce2f49a83eeb41accb579838c',
          crc: '9855',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 9,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            '4b6101a9de8df49bfd8ca0db737a44657a147df341feb8e230c170261f8ca967',
          crc: '23b6',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 10,
          totalPacket: 12,
          dataSize: 39,
          dataChunk:
            'fb235bf38e65b8820ee81d98063a3729f1773e504ea3d5499e93f9ba8c5101d1',
          crc: '4cf7',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 11,
          totalPacket: 12,
          dataSize: 38,
          dataChunk:
            '39057ab70f47c24c2bea761fc0cccb996dc5a10f6d6c557b8239f171d819dfbc',
          crc: '74c2',
          errorList: [],
        },
        {
          startOfFrame: '5A5A',
          commandType: 152,
          currentPacketNumber: 12,
          totalPacket: 12,
          dataSize: 12,
          dataChunk: '8f697d7467db',
          crc: 'd068',
          errorList: [],
        },
      ],
    },
  ],
  invalid: [
    {
      packets: null,
      version: PacketVersionMap.v1,
    },
    {
      packets: new Uint8Array([10]),
      version: null,
    },
    {
      packets: undefined,
      version: PacketVersionMap.v1,
    },
    {
      packets: new Uint8Array([10]),
      version: undefined,
    },
  ],
  errorPackets: [
    {
      rawPackets: new Uint8Array([
        90, 90, 0, 0, 0, 6, 39, 0, 1, 0, 2, 210, 42, 240, 127, 150, 163, 58,
        185, 245, 211, 127, 203, 89, 112, 141, 116, 235, 191, 172, 143, 67, 3,
        164, 99, 151, 240, 182, 42, 112, 202, 229, 232, 118, 162, 248, 90, 90,
        0, 0, 0, 6, 25, 0, 2, 0, 2, 96, 242, 95, 11, 89, 184, 69, 81, 209, 244,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
        150, 150, 95, 20, 233, 123, 29, 195, 82, 14, 11, 134,
      ]),
      version: PacketVersionMap.v2,
    },
    {
      rawPackets: new Uint8Array([
        90, 90, 0, 0, 0, 10, 13, 0, 1, 0, 1, 40, 147, 100, 137, 23, 35, 129,
        127, 247,
      ]),
      version: PacketVersionMap.v2,
    },
    {
      rawPackets: new Uint8Array([
        170, 10, 13, 0, 2, 0, 1, 40, 147, 100, 137, 23, 35, 129, 206, 60,
      ]),
      version: PacketVersionMap.v1,
    },
    {
      rawPackets: new Uint8Array([
        170, 10, 78, 0, 1, 0, 1, 40, 147, 100, 137, 23, 35, 129, 127, 243,
      ]),
      version: PacketVersionMap.v1,
    },
  ],
};
