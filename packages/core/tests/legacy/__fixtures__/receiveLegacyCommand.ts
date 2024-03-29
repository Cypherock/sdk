const legacyReceiveCommandTestCases = {
  invalidArgs: [
    {
      allAcceptableCommands: null,
    },
    {
      allAcceptableCommands: undefined,
    },
    {
      allAcceptableCommands: [],
    },
  ],
  valid: [
    {
      name: 'command 8',
      params: {
        allAcceptableCommands: [8],
      },
      output: {
        data: '0facf44ca20398549e52cdbcca0cbf8359ae3c103b6cb46be7a604a6d977f916',
        commandType: 8,
      },
      packetsFromDevice: [
        new Uint8Array([
          170, 8, 38, 0, 1, 0, 1, 15, 172, 244, 76, 162, 3, 152, 84, 158, 82,
          205, 188, 202, 12, 191, 131, 89, 174, 60, 16, 59, 108, 180, 107, 231,
          166, 4, 166, 217, 119, 249, 22, 204, 219,
        ]),
      ],
    },
    {
      name: 'command 67',
      params: {
        allAcceptableCommands: [32, 67, 3],
      },
      output: {
        data: '09811bcc86169125682bbcdc4c94f9052bd347b505e98355a2366bfaa6dcbc48a21188d6dbc68bb584b880d04fb6bfcba11a12814d2ffefce996a88ecce9c70bded515671c890b57d4375eaa8ab35d5bfe072c866c9694682f87db9d07a4a5ee266f8f42365a7121914a6f761340878cfd4564a0f972c64f21',
        commandType: 67,
      },
      packetsFromDevice: [
        new Uint8Array([
          170, 67, 38, 0, 1, 0, 4, 9, 129, 27, 204, 134, 22, 145, 37, 104, 43,
          188, 220, 76, 148, 249, 5, 43, 211, 71, 181, 5, 233, 131, 85, 162, 54,
          107, 250, 166, 220, 188, 72, 81, 29,
        ]),
        new Uint8Array([
          170, 67, 38, 0, 2, 0, 4, 162, 17, 136, 214, 219, 198, 139, 181, 132,
          184, 128, 208, 79, 182, 191, 203, 161, 26, 18, 129, 77, 47, 254, 252,
          233, 150, 168, 142, 204, 233, 199, 11, 121, 148,
        ]),
        new Uint8Array([
          170, 67, 39, 0, 3, 0, 4, 222, 213, 21, 103, 28, 137, 11, 87, 212, 55,
          94, 163, 58, 138, 179, 93, 91, 254, 7, 44, 134, 108, 150, 148, 104,
          47, 135, 219, 157, 7, 164, 165, 238, 36, 68,
        ]),
        new Uint8Array([
          170, 67, 31, 0, 4, 0, 4, 38, 111, 143, 66, 54, 90, 113, 33, 145, 74,
          111, 118, 19, 64, 135, 140, 253, 69, 100, 160, 249, 114, 198, 79, 33,
          75, 178,
        ]),
      ],
    },
    {
      name: 'command 212',
      params: {
        allAcceptableCommands: [65, 212, 2],
      },
      output: {
        data: '3155a0b3c304880adff5b79a4041b415249cd54876d745bc84babc8c376155b23a976adc1db6689a5ac1a1f21869d027992e62cc776246143fb86691972981f0d08caac7ad9556c8d002a2527d65dcb906ca2e37e66b7935daa7f405d69bf835642f3e5fe582245fe8e25a1aae5cd814d7ab501b52b9261b9975ac87fb50ec12dd34db72e7c416f596e9f46d6b9020d9af30603e49ca83366998e795e9f724fdcd6e31a64b45eed814af36b73e506a5c92c33b7fb58cfc7fb93cd1b91d6e89babb1b8cbfe4018a8193d685c5c0cd12bc1e280421181dfaa45156408139598d7a0a27e8076b35e9a17f6fe1e447e14caf0409daa3d32cbb507789d1e256e381e3a3186a2d0554035c71a0ec7ee6f4a8f051e88c7dec5dad27c3773623e9557e41d3194dd8e6a5e3c599de07d7a304e3843ee178d933deb6e1dd91412bd5e76b310b',
        commandType: 212,
      },
      packetsFromDevice: [
        new Uint8Array([
          170, 212, 38, 0, 1, 0, 11, 49, 85, 160, 179, 195, 4, 136, 10, 223,
          245, 183, 154, 64, 65, 180, 21, 36, 156, 213, 72, 118, 215, 69, 188,
          132, 186, 188, 140, 55, 97, 85, 178, 8, 92,
        ]),
        new Uint8Array([
          170, 212, 38, 0, 2, 0, 11, 58, 151, 106, 220, 29, 182, 104, 154, 90,
          193, 161, 242, 24, 105, 208, 39, 153, 46, 98, 204, 119, 98, 70, 20,
          63, 184, 102, 145, 151, 41, 129, 240, 84, 122,
        ]),
        new Uint8Array([
          170, 212, 39, 0, 3, 0, 11, 208, 140, 163, 58, 199, 173, 149, 86, 200,
          208, 2, 162, 82, 125, 101, 220, 185, 6, 202, 46, 55, 230, 107, 121,
          53, 218, 167, 244, 5, 214, 155, 248, 53, 108, 243,
        ]),
        new Uint8Array([
          170, 212, 38, 0, 4, 0, 11, 100, 47, 62, 95, 229, 130, 36, 95, 232,
          226, 90, 26, 174, 92, 216, 20, 215, 171, 80, 27, 82, 185, 38, 27, 153,
          117, 172, 135, 251, 80, 236, 18, 65, 206,
        ]),
        new Uint8Array([
          170, 212, 38, 0, 5, 0, 11, 221, 52, 219, 114, 231, 196, 22, 245, 150,
          233, 244, 109, 107, 144, 32, 217, 175, 48, 96, 62, 73, 202, 131, 54,
          105, 152, 231, 149, 233, 247, 36, 253, 67, 225,
        ]),
        new Uint8Array([
          170, 212, 38, 0, 6, 0, 11, 205, 110, 49, 166, 75, 69, 238, 216, 20,
          175, 54, 183, 62, 80, 106, 92, 146, 195, 59, 127, 181, 140, 252, 127,
          185, 60, 209, 185, 29, 110, 137, 186, 125, 217,
        ]),
        new Uint8Array([
          170, 212, 38, 0, 7, 0, 11, 187, 27, 140, 191, 228, 1, 138, 129, 147,
          214, 133, 197, 192, 205, 18, 188, 30, 40, 4, 33, 24, 29, 250, 164, 81,
          86, 64, 129, 57, 89, 141, 122, 76, 106,
        ]),
        new Uint8Array([
          170, 212, 39, 0, 8, 0, 11, 10, 39, 232, 7, 107, 53, 233, 161, 127,
          111, 225, 228, 71, 225, 76, 175, 4, 9, 218, 163, 51, 211, 44, 187, 80,
          119, 137, 209, 226, 86, 227, 129, 227, 108, 233,
        ]),
        new Uint8Array([
          170, 212, 39, 0, 9, 0, 11, 163, 51, 24, 106, 45, 5, 84, 3, 92, 113,
          160, 236, 126, 230, 244, 168, 240, 81, 232, 140, 125, 236, 93, 173,
          39, 195, 119, 54, 35, 233, 85, 126, 65, 43, 110,
        ]),
        new Uint8Array([
          170, 212, 39, 0, 10, 0, 11, 211, 25, 77, 216, 230, 165, 227, 197, 153,
          222, 7, 215, 163, 51, 4, 227, 132, 62, 225, 120, 217, 51, 222, 182,
          225, 221, 145, 65, 43, 213, 231, 107, 49, 236, 198,
        ]),
        new Uint8Array([170, 212, 7, 0, 11, 0, 11, 11, 115, 142]),
      ],
    },
  ],
};

export default legacyReceiveCommandTestCases;
