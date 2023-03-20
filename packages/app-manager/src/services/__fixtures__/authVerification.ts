const fixtures = {
  verifySerialSignature: {
    valid: [
      {
        name: 'With no postfix',
        params: {
          serial: new Uint8Array([
            201, 204, 104, 29, 172, 25, 226, 247, 219, 132, 181, 20, 46, 198,
            249, 127, 127, 48, 54, 247, 255, 209, 15, 151, 85, 89, 101, 33, 198,
            26, 197, 225, 208, 155, 103, 246,
          ]),
          signature: new Uint8Array([
            118, 16, 146, 51, 147, 63, 27, 150, 185, 198, 112, 185, 77, 132, 41,
            201, 126, 231, 149, 111, 10, 241, 114, 111, 5, 219, 129, 103, 232,
            105, 226, 25, 1, 155, 171, 203,
          ]),
        },
        result: new Uint8Array([
          229, 110, 241, 198, 94, 38, 9, 115, 23, 87, 147, 84, 31, 0, 124, 70,
          242, 232, 20, 111, 134, 139, 53, 53,
        ]),
        httpPostMocks: {
          calls: [
            [
              '/verification/verify',
              {
                serial:
                  'c9cc681dac19e2f7db84b5142ec6f97f7f3036f7ffd10f9755596521c61ac5e1d09b67f6',
                signature:
                  '76109233933f1b96b9c670b94d8429c97ee7956f0af1726f05db8167e869e219019babcb',
                postfix1: undefined,
                postfix2: undefined,
              },
            ],
          ],
          results: [
            {
              data: {
                challenge: 'e56ef1c65e260973175793541f007c46f2e8146f868b3535',
                verified: true,
              },
            },
          ],
        },
      },
      {
        name: 'With postfix',
        params: {
          serial: new Uint8Array([
            201, 204, 104, 29, 172, 25, 226, 247, 219, 132, 181, 20, 46, 198,
            249, 127, 127, 48, 54, 247, 255, 209, 15, 151, 85, 89, 101, 33, 198,
            26, 197, 225, 208, 155, 103, 246,
          ]),
          signature: new Uint8Array([
            118, 16, 146, 51, 147, 63, 27, 150, 185, 198, 112, 185, 77, 132, 41,
            201, 126, 231, 149, 111, 10, 241, 114, 111, 5, 219, 129, 103, 232,
            105, 226, 25, 1, 155, 171, 203,
          ]),
          postfix1: new Uint8Array([
            128, 222, 9, 130, 179, 162, 26, 226, 18, 140, 116, 145,
          ]),
          postfix2: new Uint8Array([12, 28, 106, 169, 138, 41]),
        },
        result: new Uint8Array([
          153, 217, 96, 146, 231, 239, 127, 131, 100, 106, 110, 99, 29, 168, 50,
          117, 19, 209, 63, 85, 118, 84, 197, 65, 74, 227, 5, 189, 72, 75, 177,
          182,
        ]),
        httpPostMocks: {
          calls: [
            [
              '/verification/verify',
              {
                serial:
                  'c9cc681dac19e2f7db84b5142ec6f97f7f3036f7ffd10f9755596521c61ac5e1d09b67f6',
                signature:
                  '76109233933f1b96b9c670b94d8429c97ee7956f0af1726f05db8167e869e219019babcb',
                postfix1: '80de0982b3a21ae2128c7491',
                postfix2: '0c1c6aa98a29',
              },
            ],
          ],
          results: [
            {
              data: {
                challenge:
                  '99d96092e7ef7f83646a6e631da8327513d13f557654c5414ae305bd484bb1b6',
                verified: true,
              },
            },
          ],
        },
      },
      {
        name: 'When not verified',
        params: {
          serial: new Uint8Array([
            201, 204, 104, 29, 172, 25, 226, 247, 219, 132, 181, 20, 46, 198,
            249, 127, 127, 48, 54, 247, 255, 209, 15, 151, 85, 89, 101, 33, 198,
            26, 197, 225, 208, 155, 103, 246,
          ]),
          signature: new Uint8Array([
            118, 16, 146, 51, 147, 63, 27, 150, 185, 198, 112, 185, 77, 132, 41,
            201, 126, 231, 149, 111, 10, 241, 114, 111, 5, 219, 129, 103, 232,
            105, 226, 25, 1, 155, 171, 203,
          ]),
          postfix1: new Uint8Array([
            128, 222, 9, 130, 179, 162, 26, 226, 18, 140, 116, 145,
          ]),
          postfix2: new Uint8Array([12, 28, 106, 169, 138, 41]),
        },
        result: undefined,
        httpPostMocks: {
          calls: [
            [
              '/verification/verify',
              {
                serial:
                  'c9cc681dac19e2f7db84b5142ec6f97f7f3036f7ffd10f9755596521c61ac5e1d09b67f6',
                signature:
                  '76109233933f1b96b9c670b94d8429c97ee7956f0af1726f05db8167e869e219019babcb',
                postfix1: '80de0982b3a21ae2128c7491',
                postfix2: '0c1c6aa98a29',
              },
            ],
          ],
          results: [
            {
              data: {
                verified: false,
              },
            },
          ],
        },
      },
    ],
  },
  verifyChallengeSignature: {
    valid: [
      {
        name: 'With no postfix',
        params: {
          serial: new Uint8Array([
            201, 204, 104, 29, 172, 25, 226, 247, 219, 132, 181, 20, 46, 198,
            249, 127, 127, 48, 54, 247, 255, 209, 15, 151, 85, 89, 101, 33, 198,
            26, 197, 225, 208, 155, 103, 246,
          ]),
          signature: new Uint8Array([
            118, 16, 146, 51, 147, 63, 27, 150, 185, 198, 112, 185, 77, 132, 41,
            201, 126, 231, 149, 111, 10, 241, 114, 111, 5, 219, 129, 103, 232,
            105, 226, 25, 1, 155, 171, 203,
          ]),
          challenge: new Uint8Array([
            235, 15, 195, 2, 79, 150, 40, 187, 209, 52, 142, 171, 54, 161, 16,
            151, 114, 241, 236, 231, 201, 150, 28, 204,
          ]),
          firmwareVersion: '1.0.0',
          isTestApp: false,
        },
        result: true,
        httpPostMocks: {
          calls: [
            [
              '/verification/challenge',
              {
                serial:
                  'c9cc681dac19e2f7db84b5142ec6f97f7f3036f7ffd10f9755596521c61ac5e1d09b67f6',
                signature:
                  '76109233933f1b96b9c670b94d8429c97ee7956f0af1726f05db8167e869e219019babcb',
                challenge: 'eb0fc3024f9628bbd1348eab36a1109772f1ece7c9961ccc',
                postfix1: undefined,
                postfix2: undefined,
                firmwareVersion: '1.0.0',
                isTestApp: false,
              },
            ],
          ],
          results: [
            {
              data: {
                verified: true,
              },
            },
          ],
        },
      },
      {
        name: 'With postfix',
        params: {
          serial: new Uint8Array([
            201, 204, 104, 29, 172, 25, 226, 247, 219, 132, 181, 20, 46, 198,
            249, 127, 127, 48, 54, 247, 255, 209, 15, 151, 85, 89, 101, 33, 198,
            26, 197, 225, 208, 155, 103, 246,
          ]),
          signature: new Uint8Array([
            118, 16, 146, 51, 147, 63, 27, 150, 185, 198, 112, 185, 77, 132, 41,
            201, 126, 231, 149, 111, 10, 241, 114, 111, 5, 219, 129, 103, 232,
            105, 226, 25, 1, 155, 171, 203,
          ]),
          challenge: new Uint8Array([
            37, 238, 123, 210, 146, 112, 60, 195, 86, 197, 235, 123, 195, 57,
            76, 19, 249, 234, 53, 31, 124, 254, 168, 239,
          ]),
          postfix1: new Uint8Array([
            128, 222, 9, 130, 179, 162, 26, 226, 18, 140, 116, 145,
          ]),
          postfix2: new Uint8Array([12, 28, 106, 169, 138, 41]),
          firmwareVersion: '2.4.0',
          isTestApp: true,
        },
        result: true,
        httpPostMocks: {
          calls: [
            [
              '/verification/challenge',
              {
                serial:
                  'c9cc681dac19e2f7db84b5142ec6f97f7f3036f7ffd10f9755596521c61ac5e1d09b67f6',
                signature:
                  '76109233933f1b96b9c670b94d8429c97ee7956f0af1726f05db8167e869e219019babcb',
                challenge: '25ee7bd292703cc356c5eb7bc3394c13f9ea351f7cfea8ef',
                postfix1: '80de0982b3a21ae2128c7491',
                postfix2: '0c1c6aa98a29',
                firmwareVersion: '2.4.0',
                isTestApp: true,
              },
            ],
          ],
          results: [
            {
              data: {
                verified: true,
              },
            },
          ],
        },
      },
      {
        name: 'When not verified',
        params: {
          serial: new Uint8Array([
            201, 204, 104, 29, 172, 25, 226, 247, 219, 132, 181, 20, 46, 198,
            249, 127, 127, 48, 54, 247, 255, 209, 15, 151, 85, 89, 101, 33, 198,
            26, 197, 225, 208, 155, 103, 246,
          ]),
          signature: new Uint8Array([
            118, 16, 146, 51, 147, 63, 27, 150, 185, 198, 112, 185, 77, 132, 41,
            201, 126, 231, 149, 111, 10, 241, 114, 111, 5, 219, 129, 103, 232,
            105, 226, 25, 1, 155, 171, 203,
          ]),
          challenge: new Uint8Array([
            124, 203, 44, 92, 253, 52, 225, 197, 120, 178, 121, 190, 249, 190,
            186, 162, 157, 50, 44, 93, 20, 154, 70, 43,
          ]),
          postfix1: new Uint8Array([
            128, 222, 9, 130, 179, 162, 26, 226, 18, 140, 116, 145,
          ]),
          postfix2: new Uint8Array([12, 28, 106, 169, 138, 41]),
          firmwareVersion: '1.0.0',
          isTestApp: false,
        },
        result: false,
        httpPostMocks: {
          calls: [
            [
              '/verification/challenge',
              {
                serial:
                  'c9cc681dac19e2f7db84b5142ec6f97f7f3036f7ffd10f9755596521c61ac5e1d09b67f6',
                signature:
                  '76109233933f1b96b9c670b94d8429c97ee7956f0af1726f05db8167e869e219019babcb',
                challenge: '7ccb2c5cfd34e1c578b279bef9bebaa29d322c5d149a462b',
                postfix1: '80de0982b3a21ae2128c7491',
                postfix2: '0c1c6aa98a29',
                firmwareVersion: '1.0.0',
                isTestApp: false,
              },
            ],
          ],
          results: [
            {
              data: {
                verified: false,
              },
            },
          ],
        },
      },
    ],
  },
};

export default fixtures;
