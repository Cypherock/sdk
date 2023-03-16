import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import {
  describe,
  test,
  expect,
  afterEach,
  jest,
  beforeEach,
} from '@jest/globals';
import { SDK } from '../../src';
import { config } from '../__fixtures__/config';
import fixtures from './__fixtures__/waitForResult';

describe('sdk.waitForResult', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  const appletId = 0;

  const RealDate = Date.now;

  beforeEach(async () => {
    global.Date.now = jest.fn(() => fixtures.constantDate.getTime());

    connection = await MockDeviceConnection.create();

    const onData = async () => {
      // SDK Version: 3.0.1, Packet Version: v3
      await connection.mockDeviceSend(
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 3, 0,
          0, 0, 1, 173, 177,
        ]),
      );
    };
    connection.configureListeners(onData);

    sdk = await SDK.create(connection, appletId);
    await sdk.beforeOperation();

    connection.removeListeners();
  });

  afterEach(async () => {
    global.Date.now = RealDate;
    await connection.destroy();
  });

  describe('should be able to wait for result', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(
          1 + 2 * testCase.packets.length + testCase.statusList.length * 3,
        );

        let statusIndex = 0;

        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);
          if (
            packetIndex === 0 &&
            statusIndex < testCase.statusPackets.length
          ) {
            for (const ackPacket of testCase.statusPackets[statusIndex]) {
              await connection.mockDeviceSend(ackPacket);
            }

            statusIndex += 1;
          } else {
            for (const ackPacket of testCase.outputPackets[packetIndex]) {
              await connection.mockDeviceSend(ackPacket);
            }
          }
        };

        const onStatus = async (status: any) => {
          expect(status).toEqual(testCase.statusList[statusIndex - 1]);
        };

        connection.configureListeners(onData);
        sdk.configureAppletId(testCase.appletId);

        const output = await sdk.waitForResult({
          sequenceNumber: testCase.sequenceNumber,
          onStatus,
          options: {
            interval: 20,
            timeout: config.defaultTimeout,
            maxTries: 1,
          },
        });

        expect(output).toEqual(testCase.output);
      });
    });
  });

  describe('should be able to handle multiple retries', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        let statusIndex = 0;

        const maxTimeoutTriggers = 3;
        let totalTimeoutTriggers = 0;

        const maxTries = 3;
        const retries: Record<number, number | undefined> = {};

        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);

          if (
            packetIndex === 0 &&
            statusIndex < testCase.statusPackets.length
          ) {
            for (const ackPacket of testCase.statusPackets[statusIndex]) {
              await connection.mockDeviceSend(ackPacket);
            }

            statusIndex += 1;
          } else {
            const currentRetry = (retries[packetIndex] ?? 0) + 1;
            const doTriggerError =
              Math.random() < 0.5 &&
              currentRetry < maxTries &&
              totalTimeoutTriggers < maxTimeoutTriggers;

            if (!doTriggerError) {
              for (const ackPacket of testCase.outputPackets[packetIndex]) {
                await connection.mockDeviceSend(ackPacket);
              }
            } else {
              totalTimeoutTriggers += 1;
              retries[packetIndex] = currentRetry;
            }
          }
        };

        const onStatus = async (status: any) => {
          expect(status).toEqual(testCase.statusList[statusIndex - 1]);
        };

        connection.configureListeners(onData);
        sdk.configureAppletId(testCase.appletId);

        const output = await sdk.waitForResult({
          sequenceNumber: testCase.sequenceNumber,
          onStatus,
          options: {
            interval: 20,
            timeout: config.defaultTimeout,
            maxTries,
          },
        });

        expect(output).toEqual(testCase.output);
      });
    });
  });

  describe('should throw error when device is disconnected', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(3);
        const onData = jest.fn();
        const onStatus = jest.fn();

        connection.configureListeners(onData);
        sdk.configureAppletId(testCase.appletId);

        await connection.destroy();

        await expect(
          sdk.waitForResult({
            sequenceNumber: testCase.sequenceNumber,
            onStatus,
            options: {
              interval: 20,
              timeout: config.defaultTimeout,
              maxTries: 1,
            },
          }),
        ).rejects.toThrow(DeviceConnectionError);
        expect(onData.mock.calls).toHaveLength(0);
        expect(onStatus.mock.calls).toHaveLength(0);
      });
    });
  });

  describe('should throw error when device is disconnected in between', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        let statusIndex = 0;

        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);
          if (
            packetIndex === 0 &&
            statusIndex < testCase.statusPackets.length
          ) {
            for (const ackPacket of testCase.statusPackets[statusIndex]) {
              await connection.mockDeviceSend(ackPacket);
            }

            statusIndex += 1;
          } else {
            let i = 0;
            for (const ackPacket of testCase.outputPackets[packetIndex]) {
              if (i >= testCase.outputPackets[packetIndex].length - 1) {
                await connection.destroy();
              } else {
                await connection.mockDeviceSend(ackPacket);
              }
              i += 1;
            }
          }
        };

        connection.configureListeners(onData);
        sdk.configureAppletId(testCase.appletId);

        await expect(
          sdk.waitForResult({
            sequenceNumber: testCase.sequenceNumber,
            options: {
              interval: 20,
              timeout: config.defaultTimeout,
              maxTries: 1,
            },
          }),
        ).rejects.toThrow(DeviceConnectionError);
      });
    });
  });

  describe('should throw error when device sends invalid data', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        let statusIndex = 0;
        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);
          if (
            packetIndex === 0 &&
            statusIndex < testCase.statusPackets.length
          ) {
            for (const ackPacket of testCase.statusPackets[
              statusIndex
            ] as any[]) {
              await connection.mockDeviceSend(ackPacket);
            }

            statusIndex += 1;
          } else {
            for (const ackPacket of testCase.outputPackets[packetIndex]) {
              await connection.mockDeviceSend(ackPacket);
            }
          }
        };

        const onStatus = (status: any) => {
          expect(status).toEqual(testCase.statusList[statusIndex - 1]);
        };

        connection.configureListeners(onData);
        sdk.configureAppletId(testCase.appletId);

        await expect(
          sdk.waitForResult({
            sequenceNumber: testCase.sequenceNumber as any,
            onStatus,
            options: {
              interval: 20,
              maxTries: 1,
              timeout: config.defaultTimeout,
            },
          }),
        ).rejects.toBeInstanceOf(testCase.errorInstance);
      });
    });
  });

  describe('should throw error with invalid arguments', () => {
    fixtures.invalidArgs.forEach(testCase => {
      test(
        JSON.stringify(testCase),
        async () => {
          await expect(
            sdk.waitForResult({
              sequenceNumber: testCase.sequenceNumber as any,
              options: {
                interval: 20,
                timeout: config.defaultTimeout,
                maxTries: 1,
              },
            }),
          ).rejects.toBeInstanceOf(Error);
        },
        200,
      );
    });
  });
});
