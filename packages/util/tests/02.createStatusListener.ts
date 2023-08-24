import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { createStatusListener } from '../src';
import fixtures from './__fixtures__/createStatusListener';

describe('createStatusListener', () => {
  const onEvent = jest.fn();

  afterEach(() => {
    onEvent.mockReset();
  });

  describe('should be able to trigger events', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, () => {
        const { onStatus, forceStatusUpdate } = createStatusListener({
          enums: testCase.enum,
          operationEnums: testCase.operationEnum,
          seedGenerationEnums: testCase.seedGenerationEnum,
          onEvent,
        });

        expect(onStatus).toBeDefined();
        expect(forceStatusUpdate).toBeDefined();

        for (const statusCall of testCase.statusCalls) {
          onStatus(statusCall);
        }

        for (const statusCall of testCase.forceStatusUpdateCalls) {
          forceStatusUpdate(statusCall);
        }

        expect(onEvent.mock.calls).toEqual(testCase.eventCalls);
      });
    });
  });
});
