import { eip712JsonToStruct, EIP712TypedData } from '../../src/utils';

describe('eip712JsonToStruct', () => {
  it('should convert EIP712TypedData to SignTypedDataStruct', () => {
    const sampleTypedData: EIP712TypedData = {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        Person: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'wallet',
            type: 'address',
          },
        ],
        Mail: [
          {
            name: 'from',
            type: 'Person',
          },
          {
            name: 'to',
            type: 'Person[]',
          },
          {
            name: 'contents',
            type: 'string',
          },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0x1e0Ae8205e9726E6F296ab8869160A6423E2337E',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xc0004B62C5A39a728e4Af5bee0c6B4a4E54b15ad',
        },
        to: [
          {
            name: 'Bob',
            wallet: '0x54B0Fa66A065748C40dCA2C7Fe125A2028CF9982',
          },
          {
            name: 'Dave',
            wallet: '0x73d0385F4d8E00C5e6504C6030F47BF6212736A8',
          },
        ],
        contents: 'Hello, guys!',
      },
    };

    const result = eip712JsonToStruct(sampleTypedData);

    expect(result).toEqual({
      domain: {
        name: 'domain',
        type: 7,
        size: 4,
        structName: 'EIP712Domain',
        children: [
          {
            name: 'name',
            type: 3,
            size: 10,
            structName: 'string',
            children: [],
            data: Buffer.from([69, 116, 104, 101, 114, 32, 77, 97, 105, 108]),
          },
          {
            name: 'version',
            type: 3,
            size: 1,
            structName: 'string',
            children: [],
            data: Buffer.from([49]),
          },
          {
            name: 'chainId',
            type: 0,
            size: 32,
            structName: 'uint256',
            children: [],
            data: Buffer.from([
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            ]),
          },
          {
            name: 'verifyingContract',
            type: 5,
            size: 20,
            structName: 'address',
            children: [],
            data: Buffer.from([
              30, 10, 232, 32, 94, 151, 38, 230, 242, 150, 171, 136, 105, 22,
              10, 100, 35, 226, 51, 126,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          139, 115, 195, 198, 155, 184, 254, 61, 81, 46, 204, 76, 247, 89, 204,
          121, 35, 159, 123, 23, 155, 15, 250, 202, 169, 167, 93, 82, 43, 57,
          64, 15,
        ]),
      },
      message: {
        name: 'message',
        type: 7,
        size: 3,
        structName: 'Mail',
        children: [
          {
            name: 'from',
            type: 7,
            size: 2,
            structName: 'Person',
            children: [
              {
                name: 'name',
                type: 3,
                size: 3,
                structName: 'string',
                children: [],
                data: Buffer.from([67, 111, 119]),
              },
              {
                name: 'wallet',
                type: 5,
                size: 20,
                structName: 'address',
                children: [],
                data: Buffer.from([
                  192, 0, 75, 98, 197, 163, 154, 114, 142, 74, 245, 190, 224,
                  198, 180, 164, 229, 75, 21, 173,
                ]),
              },
            ],
            typeHash: Uint8Array.from([
              185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
              187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33, 99,
              249, 148, 199, 149, 0,
            ]),
          },
          {
            name: 'to',
            type: 6,
            size: 2,
            structName: 'Person[]',
            children: [
              {
                name: '0',
                type: 7,
                size: 2,
                structName: 'Person',
                children: [
                  {
                    name: 'name',
                    type: 3,
                    size: 3,
                    structName: 'string',
                    children: [],
                    data: Buffer.from([66, 111, 98]),
                  },
                  {
                    name: 'wallet',
                    type: 5,
                    size: 20,
                    structName: 'address',
                    children: [],
                    data: Buffer.from([
                      84, 176, 250, 102, 160, 101, 116, 140, 64, 220, 162, 199,
                      254, 18, 90, 32, 40, 207, 153, 130,
                    ]),
                  },
                ],
                typeHash: Uint8Array.from([
                  185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
                  187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33,
                  99, 249, 148, 199, 149, 0,
                ]),
              },
              {
                name: '1',
                type: 7,
                size: 2,
                structName: 'Person',
                children: [
                  {
                    name: 'name',
                    type: 3,
                    size: 4,
                    structName: 'string',
                    children: [],
                    data: Buffer.from([68, 97, 118, 101]),
                  },
                  {
                    name: 'wallet',
                    type: 5,
                    size: 20,
                    structName: 'address',
                    children: [],
                    data: Buffer.from([
                      115, 208, 56, 95, 77, 142, 0, 197, 230, 80, 76, 96, 48,
                      244, 123, 246, 33, 39, 54, 168,
                    ]),
                  },
                ],
                typeHash: Uint8Array.from([
                  185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
                  187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33,
                  99, 249, 148, 199, 149, 0,
                ]),
              },
            ],
          },
          {
            name: 'contents',
            type: 3,
            size: 12,
            structName: 'string',
            children: [],
            data: Buffer.from([
              72, 101, 108, 108, 111, 44, 32, 103, 117, 121, 115, 33,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          221, 87, 217, 89, 106, 245, 43, 67, 12, 237, 61, 91, 82, 212, 227,
          213, 220, 207, 223, 62, 5, 114, 219, 29, 207, 82, 107, 170, 211, 17,
          251, 209,
        ]),
      },
    });
  });
});
