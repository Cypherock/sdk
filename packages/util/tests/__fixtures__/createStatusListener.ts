enum TestCase1Enum {
  INIT = 0,
  VERIFY = 1,
  END = 2,
}

enum TestCase2Enum {
  INIT = 0,
  VERIFY = 1,
  VERIFY_ADDRESS = 2,
  CARD_TAP = 3,
  END = 4,
}

const fixtures = {
  valid: [
    {
      name: 'with onStatus update',
      enum: TestCase1Enum,
      statusCalls: [{ flowStatus: TestCase1Enum.VERIFY }],
      forceStatusUpdateCalls: [],
      eventCalls: [[TestCase1Enum.INIT], [TestCase1Enum.VERIFY]],
    },
    {
      name: 'with forceStatusUpdate',
      enum: TestCase2Enum,
      statusCalls: [],
      forceStatusUpdateCalls: [TestCase2Enum.CARD_TAP],
      eventCalls: [
        [TestCase2Enum.INIT],
        [TestCase2Enum.VERIFY],
        [TestCase2Enum.VERIFY_ADDRESS],
        [TestCase2Enum.CARD_TAP],
      ],
    },
  ],
};

export default fixtures;
