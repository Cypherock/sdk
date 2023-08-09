import { hexToUint8Array } from '@cypherock/sdk-utils';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

const withOneInput: ISignTxnTestCase = {
  name: 'With 1 input',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
    txn: {
      inputs: [
        {
          prevIndex: 0,
          prevTxnId:
            'e1483376a1cd64027f386c2e28650536a13c813e955469f1f486dafb4f4b861d',
          prevTxn:
            '0200000002e5937831604534dfe013f9a6a983ae6d6bd853f42f235ce70ca5a7fe81643738000000006b483045022100ced63a4d44463475dacc752dc0a6f67b892eb4894ec99117c9fb04ac03b05bae022036c9985920b9d838858082223eaa480172d00a78bc556a0a8550f6f64cb613c60121020e7f64d7dad196fd8fe07d667b50aa2be77c79dd841136d0f0659be3aa8e5ba6ffffffff1ef0dba72077858b5388513263a62678a0bff7bc45dc04164dcafac673d9fdbd000000006b483045022100bb32a2ac921737e958da4e44ba0dcd60e85b5583dab6cbbeb2efc81ca0bf3b410220464415e8a18ee2612fccb034a977c80bc9575adb358aa982b25e3eaed42927bb012102c8a84d4370f37d079896b2f296947ecb9d3812ba074cd38d79f2dc1ef137781affffffff01601800000000000016001429f267742a8cea09dce9853d7c4c4653909f345a00000000',
          value: '6240',
          address: 'bc1q98exwap23n4qnh8fs57hcnzx2wgf7dz6up764t',
          changeIndex: 0, // dummy value
          addressIndex: 10, // dummy value
          sequence: 0xffffffff,
        },
      ],
      outputs: [
        {
          value: '3168',
          address: 'bc1qe5pjgzk9ml6r6xsze8zqz73taehms4e59ttpdf',
          isChange: false,
        },
      ],
    },
  },
  queries: [
    {
      name: 'Initate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103,
              233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128,
              26, 3, 187, 121, 64,
            ]),
            derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
          },
        },
      }),
    },
    {
      name: 'Send meta',
      data: queryToUint8Array({
        signTxn: {
          meta: {
            version: 2,
            locktime: 0,
            inputCount: 1,
            outputCount: 1,
            sighash: 1,
          },
        },
      }),
    },
    {
      name: 'Input 1',
      data: queryToUint8Array({
        signTxn: {
          input: {
            prevTxn: hexToUint8Array(
              '0200000002e5937831604534dfe013f9a6a983ae6d6bd853f42f235ce70ca5a7fe81643738000000006b483045022100ced63a4d44463475dacc752dc0a6f67b892eb4894ec99117c9fb04ac03b05bae022036c9985920b9d838858082223eaa480172d00a78bc556a0a8550f6f64cb613c60121020e7f64d7dad196fd8fe07d667b50aa2be77c79dd841136d0f0659be3aa8e5ba6ffffffff1ef0dba72077858b5388513263a62678a0bff7bc45dc04164dcafac673d9fdbd000000006b483045022100bb32a2ac921737e958da4e44ba0dcd60e85b5583dab6cbbeb2efc81ca0bf3b410220464415e8a18ee2612fccb034a977c80bc9575adb358aa982b25e3eaed42927bb012102c8a84d4370f37d079896b2f296947ecb9d3812ba074cd38d79f2dc1ef137781affffffff01601800000000000016001429f267742a8cea09dce9853d7c4c4653909f345a00000000',
            ),
            prevTxnHash: hexToUint8Array(
              '1d864b4ffbda86f4f16954953e813ca1360565282e6c387f0264cda1763348e1',
            ),
            prevOutputIndex: 0,
            scriptPubKey: hexToUint8Array(
              '001429f267742a8cea09dce9853d7c4c4653909f345a',
            ),
            value: '6240',
            sequence: 0xffffffff,
            changeIndex: 0, // dummy value
            addressIndex: 10, // dummy value
          },
        },
      }),
    },
    {
      name: 'Output 1',
      data: queryToUint8Array({
        signTxn: {
          output: {
            scriptPubKey: hexToUint8Array(
              '0014cd03240ac5dff43d1a02c9c4017a2bee6fb85734',
            ),
            value: '3168',
            isChange: false,
          },
        },
      }),
    },
    {
      name: 'Signature request 1',
      data: queryToUint8Array({
        signTxn: {
          signature: { index: 0 },
        },
      }),
    },
  ],
  results: [
    {
      name: 'Confirmation',
      data: new Uint8Array([26, 2, 10, 0]),
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
      ],
    },
    {
      name: 'Meta Accepted',
      data: resultToUint8Array({
        signTxn: {
          metaAccepted: {},
        },
      }),
    },
    {
      name: 'Input accepted: 1',
      data: resultToUint8Array({
        signTxn: {
          inputAccepted: {},
        },
      }),
    },
    {
      name: 'Output accepted: 1',
      data: resultToUint8Array({
        signTxn: {
          outputAccepted: {},
        },
      }),
    },
    {
      name: 'Signature: 1',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            signature: hexToUint8Array(
              '483045022100d946ce57571ae63f5b1f16aeb759f84736bdb9b364955e8756cc9e25c8f4745b02206ae916c173aaf32c642369c9f196c5fd9cf8b63350cd0c4d5c4b7dbba73b7b740121035f4cf9b856e62a02f5c895094305d7a5370f3fa3f1e625b6c535d4be1fa1d19e',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4], [5]] },
  output: {
    signatures: [
      '483045022100d946ce57571ae63f5b1f16aeb759f84736bdb9b364955e8756cc9e25c8f4745b02206ae916c173aaf32c642369c9f196c5fd9cf8b63350cd0c4d5c4b7dbba73b7b740121035f4cf9b856e62a02f5c895094305d7a5370f3fa3f1e625b6c535d4be1fa1d19e',
    ],
    signedTransaction:
      '020000000001011d864b4ffbda86f4f16954953e813ca1360565282e6c387f0264cda1763348e10000000000ffffffff01600c000000000000160014cd03240ac5dff43d1a02c9c4017a2bee6fb8573402483045022100d946ce57571ae63f5b1f16aeb759f84736bdb9b364955e8756cc9e25c8f4745b02206ae916c173aaf32c642369c9f196c5fd9cf8b63350cd0c4d5c4b7dbba73b7b740121035f4cf9b856e62a02f5c895094305d7a5370f3fa3f1e625b6c535d4be1fa1d19e00000000',
  },
};

const withMultipleInputs: ISignTxnTestCase = {
  name: 'With multiple inputs and outputs',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
    txn: {
      locktime: 0,
      hashType: 1,
      inputs: [
        {
          prevIndex: 1,
          prevTxnId:
            'c011cfab883d8729adafc324536b4e94992c410893dbc1ea5fe384d02f3b6340',
          prevTxn:
            '01000000000101fee6b227e3e24bf2e5a4ea1ca6eba722c5eab233832c9c84b4893339ad9294413200000000ffffffff02dcb93400000000001976a9141499db6b8f427c624a644bf9442b9e3ec37f211d88aca9790100000000001600143026421e3930e0243b626d1445fb2d028510c68a024830450221008e2f802e44bdff18531a05ddc5b3788e84ca96b813677296dae224687d25df320220518d296d04cb9b40c338bf83afd07e73e810b90213c875137740dbebcba7af3b0121024aece25573da4ed274ee891341490fe26bd021b63e54e8581fc3ca10085a8fa000000000',
          value: '96681',
          address: 'bc1qxqnyy83exrszgwmzd52yt7edq2z3p352l5jm04',

          changeIndex: 0, // dummy value
          addressIndex: 15, // dummy value
        },
        {
          prevIndex: 4,
          prevTxnId:
            '43294378fe980869bae0d9d27cd10adcdca1d155e4035b4f8d08b1512f5252a4',
          prevTxn:
            '0100000000010364843da25e45a69c95135f5cde3cc7eeccf11814401e197d55e9f3fe5e90d7661100000000ffffffff1f65d1a5680c910c965dfd888c84909dff69dc32b846b81bf5b3aa96ca4a8cca0800000000ffffffff1f65d1a5680c910c965dfd888c84909dff69dc32b846b81bf5b3aa96ca4a8cca0900000000ffffffff36b1b101000000000017a914c02e772dc3fcf4b9e8fe439f4e0a018cdd01dd0b87e313020000000000160014c70030540cd9bd563e58f7f7cabc5df4e19d6654012f0300000000001600146db90e679c18ac9c204d2e6b6ee18e9d025e49f82c66030000000000160014870c47ca1848e4ca2c503c93546cacedc9379cbdec4b040000000000160014cf9c2b2c20a7b32bb97e657cea24ad9eb9cd6ddad8b904000000000017a9148c6d4c1a63b0b7b5724270107e4dfe81bf4f1309875d2c050000000000160014edd81fc7342399f0cfde1e330d70d76d29c3aaa75d2c0500000000001976a9141cfce579f116afc066675878fdc73aea4e0b0a2788acaf2d0500000000001600142b10e0e9f65079ac2694941a8f2352474eeeb31b060d0600000000001976a914605348ec8c1b6f01fdbce5e40b30ee837a07e5c588acaa0d06000000000017a9146fcfdd1044559e159f0c6fab8b8a03c42637b1478716d20700000000001976a9143a8a4a5ca13ffaf17f89b07541e5460f2dcdac6688ac4cb40800000000001976a914147e7200216aa3a5b3df1863e420de36d493c51988ac4cb40800000000001976a914a0067478ae6eea5c18e340c96acd463f0e7db7e788acbdb5080000000000160014f8803023a8f0ffe9de2d67642fc58d9b1fb10057f5b508000000000017a914384b052d88e97eeb56152b044c73402a8c1291f5875aeb0a0000000000160014662addfc46e50ee3eca967750e200094bbf8e8acb61b0d00000000001976a914f83394a4be74357310e80949511bdd090f7fb0e388ac411c0d0000000000160014833dfc8a4c69b4713210c19d1d4c2b0cc2c790f2ac210d000000000017a91499e0013002c60f1d0e4e51cf63951578ca0c4ac8873cd60d0000000000160014452aa71598fafa7c88606c22dd0b60f0c47f2801086f0e000000000017a91454c7c9d7cd18d5038d78ccf29f6fa99409a6c9e787548a11000000000016001445759799d422da97081891489d02f5491962dde3fd9011000000000017a914a38c1cee3ca65eace62369447472f03e4d9e90bf87fdf61100000000001976a9147fe96039668c62d509b7f067969df42b965df5c888acf33014000000000017a914a17148fc7ccc29a1bec403da131dc8f0e639bf628757f7150000000000160014ed3936661227d281e9b01be82a7a0f1e03c69e0fb4fd15000000000017a914f985d1916a77dfe388e57300ee5170584ce373c58736641600000000001600144d045d84fc458c38aea978436be5d7c0a82cc31235bd1700000000001976a91460f0cc1314af7edd5aa54d833cae650fec31531b88ac6b6a1a00000000001976a9148c62ecbd76295f6bca4a72c4ad0ed8101d2c876188ac4cf01b00000000001976a914a82f6fd719921adf81be38e14a18053963dcf08f88ace4d81e000000000016001451709f628198045034dc256ab1944a2ffb97ca562fb22700000000001976a914c3d573009afbb2725a5c963825b4390cf92bb46a88acadbc2700000000001600148a37c7d7e14e4f53261df720b319679b6402179da9012c0000000000160014c9bb1a14f53c1123809928dece81244c7ca6f2ad8a142c000000000017a9143e2c470cff783730b856d53536304fd9ad82caeb8773f73f0000000000160014214ff17077aec7fb60ff9b68c131715a4ed756cb10514200000000001976a9145c1bf5d502d14903c2d9c6c0624a5b3d1846391f88ac46e74a0000000000160014e4fec9c405b91570103b5a86d93b52520203fe497a265800000000001976a914550aff142c9baa27dc961dd4000bced5216b915a88ac2c4c580000000000160014c36ae32737c99bd9201201d69ff74423be18157e4cdb7f000000000017a914d1ef08ba737f60a46997592efc7d02547f4deb8d873dfe7f000000000016001430b28634d347a8edb41c04a36bd67beecae3f844bc10800000000000160014cb02fdcf67edca38c74dac41c57c234adc429eb978158000000000001976a914d9cfb1287761f9be692760526d81f0a60be5014a88ac991b820000000000160014522d45778ab31b779b1a5503967e65ff029ed14a916683000000000016001445306f60bea8ec6e36ad21966d9152293fa18c8c4056a80000000000220020176a2f19c61bd017fc98135b2142e4ccdd8e8f302d394d5d478755ccc5b37efc42c38d01000000001600141083f23d3fa9a53d98b3b38bd53fa9aa810eba9499d5b9010000000017a9141d8c1864a502f9bdba03ddf8c06c41aa8cf7b4bd872be0e3010000000016001486626e44f8483a59a5815e365a7c10ebe508554934fc950200000000160014dfd6b30ee49b22f1a0f81bb614cad44be30ae9ec5f15c202000000001976a91467dd0a4d6580fda597f369b90653be02d02f503488ac04004830450221008c2ed1314e81fc461972aa40ddb7241247a7609b287ef0a726f51233bc2693740220198993f0eabe1535e6ccd5edd6faa42734d44f05f112b46f82cc2c1342e6f07201473044022075b16b266843d9b109bdf547127523a0c2a3908ec5bd9c038fa07fbb64bf925002205ad0bd80e53af9a45fb4ba0f854d37043c3c5934d90c07aa6867ec714a9d00720169522103aa9037fff6c420e8bb99bcec4390524e88ad0270919736c0ba976f4ccf258a2d21035f551eb21bf1f356057284185fcc26d14d314821a16c4782c2ff64d4d88250542102c2f3ff568afbf1bd12125e2d2b4aacc9a925ec79f247d3c520b98b93115a5cea53ae0400483045022100c0bd09959b84def0a525df02d960ccf332d858f900b48f6595695db8abd17a09022060a9bbf733dc2792f9d98b730388c5785adf32865e6b419423753668e1762b8a014730440220508e12d1c2dcba16180a05f2e589520306bb3b83b94d851d552cf0da5f30d9a102204b05047c1b547e3479411d1bc38aa4b281b6308a15d5011d1be6c875f0518e6e0169522102af9e110a047975dda9c8fd7f6a2b56e5bcae0f72e29fce2bd637de925329859921021785f05c393fc2fbb3832685054dc0141731bf4ce12af8c570ffc32a8172ba1821021a4560723742b26634f7cff80b6c1b32e22951ef38331cc30e663830385a1e6653ae0400483045022100b4df1b0b740614692f2f4e51799cede259bccb4ad939b12a4d14cdccc605ed6a0220470eb035fcd9fa358a1ac5e0cb484849bcfa0aa487c14b9e81d60ba58869fb1a01473044022066a0ae89947c8a752598bc75cf0765f66cdad396cd111af4cf788614d05f4ebe022079e14ab7a5abd226993f5689fecabc5afca47550ec6d9383acbb165961f3eacc01695221032f5d297d251d2d17ee970f911ed5e99c2dbe1300fcbe5e59c2b2fdb8fbf6351b21028e0774d826aba58a5a9f3fdfb27e97f8b5ce10f23176ffa9583fa9866f61c86621026035c31064d2175de5da39c69c07c58d3d695f39a2023bb393f1bfc8f14dd63953aeca3d0c00',
          value: '281580',
          address: 'bc1qe7wzktpq57ejhwt7v47w5f9dn6uu6mw6nlhkyr',

          changeIndex: 0, // dummy value
          addressIndex: 54, // dummy value
        },
      ],
      outputs: [
        {
          value: '339259',
          address: '12svq1vtvn2KQJL25rM3FnEnCW4wed6dAo',
          isChange: false,
        },
        {
          value: '33950',
          address: 'bc1qvev2mq3nf4xtfur2d2mdn3q8cw6mwqa2994v38',
          isChange: false,
        },
      ],
    },
  },
  queries: [
    {
      name: 'Initate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103,
              233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128,
              26, 3, 187, 121, 64,
            ]),
            derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
          },
        },
      }),
    },
    {
      name: 'Send meta',
      data: queryToUint8Array({
        signTxn: {
          meta: {
            version: 2,
            locktime: 0,
            inputCount: 2,
            outputCount: 2,
            sighash: 1,
          },
        },
      }),
    },
    {
      name: 'Input 1',
      data: queryToUint8Array({
        signTxn: {
          input: {
            prevTxn: hexToUint8Array(
              '01000000000101fee6b227e3e24bf2e5a4ea1ca6eba722c5eab233832c9c84b4893339ad9294413200000000ffffffff02dcb93400000000001976a9141499db6b8f427c624a644bf9442b9e3ec37f211d88aca9790100000000001600143026421e3930e0243b626d1445fb2d028510c68a024830450221008e2f802e44bdff18531a05ddc5b3788e84ca96b813677296dae224687d25df320220518d296d04cb9b40c338bf83afd07e73e810b90213c875137740dbebcba7af3b0121024aece25573da4ed274ee891341490fe26bd021b63e54e8581fc3ca10085a8fa000000000',
            ),
            prevTxnHash: hexToUint8Array(
              '40633b2fd084e35feac1db9308412c99944e6b5324c3afad29873d88abcf11c0',
            ),
            prevOutputIndex: 1,
            scriptPubKey: hexToUint8Array(
              '00143026421e3930e0243b626d1445fb2d028510c68a',
            ),
            value: '96681',
            sequence: 0xffffffff,
            changeIndex: 0, // dummy value
            addressIndex: 15, // dummy value
          },
        },
      }),
    },
    {
      name: 'Input 2',
      data: queryToUint8Array({
        signTxn: {
          input: {
            prevTxn: hexToUint8Array(
              '0100000000010364843da25e45a69c95135f5cde3cc7eeccf11814401e197d55e9f3fe5e90d7661100000000ffffffff1f65d1a5680c910c965dfd888c84909dff69dc32b846b81bf5b3aa96ca4a8cca0800000000ffffffff1f65d1a5680c910c965dfd888c84909dff69dc32b846b81bf5b3aa96ca4a8cca0900000000ffffffff36b1b101000000000017a914c02e772dc3fcf4b9e8fe439f4e0a018cdd01dd0b87e313020000000000160014c70030540cd9bd563e58f7f7cabc5df4e19d6654012f0300000000001600146db90e679c18ac9c204d2e6b6ee18e9d025e49f82c66030000000000160014870c47ca1848e4ca2c503c93546cacedc9379cbdec4b040000000000160014cf9c2b2c20a7b32bb97e657cea24ad9eb9cd6ddad8b904000000000017a9148c6d4c1a63b0b7b5724270107e4dfe81bf4f1309875d2c050000000000160014edd81fc7342399f0cfde1e330d70d76d29c3aaa75d2c0500000000001976a9141cfce579f116afc066675878fdc73aea4e0b0a2788acaf2d0500000000001600142b10e0e9f65079ac2694941a8f2352474eeeb31b060d0600000000001976a914605348ec8c1b6f01fdbce5e40b30ee837a07e5c588acaa0d06000000000017a9146fcfdd1044559e159f0c6fab8b8a03c42637b1478716d20700000000001976a9143a8a4a5ca13ffaf17f89b07541e5460f2dcdac6688ac4cb40800000000001976a914147e7200216aa3a5b3df1863e420de36d493c51988ac4cb40800000000001976a914a0067478ae6eea5c18e340c96acd463f0e7db7e788acbdb5080000000000160014f8803023a8f0ffe9de2d67642fc58d9b1fb10057f5b508000000000017a914384b052d88e97eeb56152b044c73402a8c1291f5875aeb0a0000000000160014662addfc46e50ee3eca967750e200094bbf8e8acb61b0d00000000001976a914f83394a4be74357310e80949511bdd090f7fb0e388ac411c0d0000000000160014833dfc8a4c69b4713210c19d1d4c2b0cc2c790f2ac210d000000000017a91499e0013002c60f1d0e4e51cf63951578ca0c4ac8873cd60d0000000000160014452aa71598fafa7c88606c22dd0b60f0c47f2801086f0e000000000017a91454c7c9d7cd18d5038d78ccf29f6fa99409a6c9e787548a11000000000016001445759799d422da97081891489d02f5491962dde3fd9011000000000017a914a38c1cee3ca65eace62369447472f03e4d9e90bf87fdf61100000000001976a9147fe96039668c62d509b7f067969df42b965df5c888acf33014000000000017a914a17148fc7ccc29a1bec403da131dc8f0e639bf628757f7150000000000160014ed3936661227d281e9b01be82a7a0f1e03c69e0fb4fd15000000000017a914f985d1916a77dfe388e57300ee5170584ce373c58736641600000000001600144d045d84fc458c38aea978436be5d7c0a82cc31235bd1700000000001976a91460f0cc1314af7edd5aa54d833cae650fec31531b88ac6b6a1a00000000001976a9148c62ecbd76295f6bca4a72c4ad0ed8101d2c876188ac4cf01b00000000001976a914a82f6fd719921adf81be38e14a18053963dcf08f88ace4d81e000000000016001451709f628198045034dc256ab1944a2ffb97ca562fb22700000000001976a914c3d573009afbb2725a5c963825b4390cf92bb46a88acadbc2700000000001600148a37c7d7e14e4f53261df720b319679b6402179da9012c0000000000160014c9bb1a14f53c1123809928dece81244c7ca6f2ad8a142c000000000017a9143e2c470cff783730b856d53536304fd9ad82caeb8773f73f0000000000160014214ff17077aec7fb60ff9b68c131715a4ed756cb10514200000000001976a9145c1bf5d502d14903c2d9c6c0624a5b3d1846391f88ac46e74a0000000000160014e4fec9c405b91570103b5a86d93b52520203fe497a265800000000001976a914550aff142c9baa27dc961dd4000bced5216b915a88ac2c4c580000000000160014c36ae32737c99bd9201201d69ff74423be18157e4cdb7f000000000017a914d1ef08ba737f60a46997592efc7d02547f4deb8d873dfe7f000000000016001430b28634d347a8edb41c04a36bd67beecae3f844bc10800000000000160014cb02fdcf67edca38c74dac41c57c234adc429eb978158000000000001976a914d9cfb1287761f9be692760526d81f0a60be5014a88ac991b820000000000160014522d45778ab31b779b1a5503967e65ff029ed14a916683000000000016001445306f60bea8ec6e36ad21966d9152293fa18c8c4056a80000000000220020176a2f19c61bd017fc98135b2142e4ccdd8e8f302d394d5d478755ccc5b37efc42c38d01000000001600141083f23d3fa9a53d98b3b38bd53fa9aa810eba9499d5b9010000000017a9141d8c1864a502f9bdba03ddf8c06c41aa8cf7b4bd872be0e3010000000016001486626e44f8483a59a5815e365a7c10ebe508554934fc950200000000160014dfd6b30ee49b22f1a0f81bb614cad44be30ae9ec5f15c202000000001976a91467dd0a4d6580fda597f369b90653be02d02f503488ac04004830450221008c2ed1314e81fc461972aa40ddb7241247a7609b287ef0a726f51233bc2693740220198993f0eabe1535e6ccd5edd6faa42734d44f05f112b46f82cc2c1342e6f07201473044022075b16b266843d9b109bdf547127523a0c2a3908ec5bd9c038fa07fbb64bf925002205ad0bd80e53af9a45fb4ba0f854d37043c3c5934d90c07aa6867ec714a9d00720169522103aa9037fff6c420e8bb99bcec4390524e88ad0270919736c0ba976f4ccf258a2d21035f551eb21bf1f356057284185fcc26d14d314821a16c4782c2ff64d4d88250542102c2f3ff568afbf1bd12125e2d2b4aacc9a925ec79f247d3c520b98b93115a5cea53ae0400483045022100c0bd09959b84def0a525df02d960ccf332d858f900b48f6595695db8abd17a09022060a9bbf733dc2792f9d98b730388c5785adf32865e6b419423753668e1762b8a014730440220508e12d1c2dcba16180a05f2e589520306bb3b83b94d851d552cf0da5f30d9a102204b05047c1b547e3479411d1bc38aa4b281b6308a15d5011d1be6c875f0518e6e0169522102af9e110a047975dda9c8fd7f6a2b56e5bcae0f72e29fce2bd637de925329859921021785f05c393fc2fbb3832685054dc0141731bf4ce12af8c570ffc32a8172ba1821021a4560723742b26634f7cff80b6c1b32e22951ef38331cc30e663830385a1e6653ae0400483045022100b4df1b0b740614692f2f4e51799cede259bccb4ad939b12a4d14cdccc605ed6a0220470eb035fcd9fa358a1ac5e0cb484849bcfa0aa487c14b9e81d60ba58869fb1a01473044022066a0ae89947c8a752598bc75cf0765f66cdad396cd111af4cf788614d05f4ebe022079e14ab7a5abd226993f5689fecabc5afca47550ec6d9383acbb165961f3eacc01695221032f5d297d251d2d17ee970f911ed5e99c2dbe1300fcbe5e59c2b2fdb8fbf6351b21028e0774d826aba58a5a9f3fdfb27e97f8b5ce10f23176ffa9583fa9866f61c86621026035c31064d2175de5da39c69c07c58d3d695f39a2023bb393f1bfc8f14dd63953aeca3d0c00',
            ),
            prevTxnHash: hexToUint8Array(
              'a452522f51b1088d4f5b03e455d1a1dcdc0ad17cd2d9e0ba690898fe78432943',
            ),
            prevOutputIndex: 4,
            scriptPubKey: hexToUint8Array(
              '0014cf9c2b2c20a7b32bb97e657cea24ad9eb9cd6dda',
            ),
            value: '281580',
            sequence: 0xffffffff,
            changeIndex: 0, // dummy value
            addressIndex: 54, // dummy value
          },
        },
      }),
    },
    {
      name: 'Output 1',
      data: queryToUint8Array({
        signTxn: {
          output: {
            scriptPubKey: hexToUint8Array(
              '76a9141499db6b8f427c624a644bf9442b9e3ec37f211d88ac',
            ),
            value: '339259',
            isChange: false,
          },
        },
      }),
    },
    {
      name: 'Output 2',
      data: queryToUint8Array({
        signTxn: {
          output: {
            scriptPubKey: hexToUint8Array(
              '00146658ad82334d4cb4f06a6ab6d9c407c3b5b703aa',
            ),
            value: '33950',
            isChange: false,
          },
        },
      }),
    },
    {
      name: 'Signature request 1',
      data: queryToUint8Array({
        signTxn: {
          signature: { index: 0 },
        },
      }),
    },
    {
      name: 'Signature request 2',
      data: queryToUint8Array({
        signTxn: {
          signature: { index: 1 },
        },
      }),
    },
  ],
  results: [
    {
      name: 'Confirmation',
      data: new Uint8Array([26, 2, 10, 0]),
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
      ],
    },
    {
      name: 'Meta Accepted',
      data: resultToUint8Array({
        signTxn: {
          metaAccepted: {},
        },
      }),
    },
    {
      name: 'Input request: 1',
      data: resultToUint8Array({
        signTxn: {
          inputAccepted: {},
        },
      }),
    },
    {
      name: 'Input request: 2',
      data: resultToUint8Array({
        signTxn: {
          inputAccepted: {},
        },
      }),
    },
    {
      name: 'Output request: 1',
      data: resultToUint8Array({
        signTxn: {
          outputAccepted: {},
        },
      }),
    },
    {
      name: 'Output request: 2',
      data: resultToUint8Array({
        signTxn: {
          outputAccepted: {},
        },
      }),
    },
    {
      name: 'Signature: 1',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            signature: hexToUint8Array(
              '483045022100e8c05ea1602c7b8e086cf17429415ccfea73952bd2614ded3a8196e42090ccdb02207ea39d215d5f1fa0d2bfc17b912d29ef2116af2c61a7bb53755fb6dbfe6836ed012103828943e8e6bbbbe6848f547c2e3a51236d4fa524fcd67837164ce7c1f0311dd7',
            ),
          },
        },
      }),
    },
    {
      name: 'Signature: 2',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            signature: hexToUint8Array(
              '47304402202069a87c5082e689140721b58ca4c0b81496f6e18095a992c3abcc96b6745a0602202af96658219ce427853923011d9ea67e2a74b78a6cdc58ce64da35bba49becea0121024aece25573da4ed274ee891341490fe26bd021b63e54e8581fc3ca10085a8fa0',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4], [5]] },
  output: {
    signatures: [
      '483045022100e8c05ea1602c7b8e086cf17429415ccfea73952bd2614ded3a8196e42090ccdb02207ea39d215d5f1fa0d2bfc17b912d29ef2116af2c61a7bb53755fb6dbfe6836ed012103828943e8e6bbbbe6848f547c2e3a51236d4fa524fcd67837164ce7c1f0311dd7',
      '47304402202069a87c5082e689140721b58ca4c0b81496f6e18095a992c3abcc96b6745a0602202af96658219ce427853923011d9ea67e2a74b78a6cdc58ce64da35bba49becea0121024aece25573da4ed274ee891341490fe26bd021b63e54e8581fc3ca10085a8fa0',
    ],
    // modified version from 1 to 2 for passing the test
    signedTransaction:
      '0200000000010240633b2fd084e35feac1db9308412c99944e6b5324c3afad29873d88abcf11c00100000000ffffffffa452522f51b1088d4f5b03e455d1a1dcdc0ad17cd2d9e0ba690898fe784329430400000000ffffffff023b2d0500000000001976a9141499db6b8f427c624a644bf9442b9e3ec37f211d88ac9e840000000000001600146658ad82334d4cb4f06a6ab6d9c407c3b5b703aa02483045022100e8c05ea1602c7b8e086cf17429415ccfea73952bd2614ded3a8196e42090ccdb02207ea39d215d5f1fa0d2bfc17b912d29ef2116af2c61a7bb53755fb6dbfe6836ed012103828943e8e6bbbbe6848f547c2e3a51236d4fa524fcd67837164ce7c1f0311dd70247304402202069a87c5082e689140721b58ca4c0b81496f6e18095a992c3abcc96b6745a0602202af96658219ce427853923011d9ea67e2a74b78a6cdc58ce64da35bba49becea0121024aece25573da4ed274ee891341490fe26bd021b63e54e8581fc3ca10085a8fa000000000',
  },
};

const valid: ISignTxnTestCase[] = [withOneInput, withMultipleInputs];

export default valid;
